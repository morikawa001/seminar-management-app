/* facility_group列を使った参加状況グラフ */
(function(){
  'use strict';
  const state={rows:[],chart:null};
  const GROUP_ORDER=['scc','other'];
  const $=id=>document.getElementById(id);
  const clean=value=>String(value==null?'':value).trim();
  const normalizeKey=value=>clean(value).replace(/^\uFEFF/,'').toLowerCase().replace(/[\s_]+/g,'');
  const valueOf=(row,key)=>{const actualKey=Object.keys(row).find(name=>normalizeKey(name)===normalizeKey(key));return actualKey?clean(row[actualKey]):'';};
  const isAttended=row=>Number(valueOf(row,'attend'))===1;
  function parse(data){
    try{
      const workbook=XLSX.read(data,{type:'array',cellDates:true});
      const sheet=workbook.Sheets[workbook.SheetNames[0]];
      state.rows=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false}).filter(isAttended);
      render();
    }catch(error){console.error('facility_groupグラフの読み込みに失敗しました',error);}
  }
  function sortedCounts(){
    const counts={scc:0,other:0};
    state.rows.filter(isAttended).forEach(row=>{const group=clean(valueOf(row,'facility_group')).toLowerCase();if(Object.prototype.hasOwnProperty.call(counts,group))counts[group]++;});
    const items=GROUP_ORDER.map(group=>[group,counts[group]]);
    return items;
  }
  function render(){
    if(!window.Chart||!$('facilityGroupChartStandalone'))return;
    const items=sortedCounts();
    if(state.chart)state.chart.destroy();
    const styles=getComputedStyle(document.documentElement);
    state.chart=new Chart($('facilityGroupChartStandalone').getContext('2d'),{type:'bar',data:{labels:items.map(item=>item[0]),datasets:[{label:'参加件数',data:items.map(item=>item[1]),backgroundColor:'#35e0b2',borderRadius:4}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0,color:styles.getPropertyValue('--muted')},grid:{color:styles.getPropertyValue('--line')}},y:{ticks:{color:styles.getPropertyValue('--text')},grid:{display:false}}}}});
    $('facilityGroupChartStatus').textContent=`attend=1の${state.rows.filter(isAttended).length.toLocaleString()}件をfacility_group別に集計`;
  }
  function readFile(file){const reader=new FileReader();reader.onload=event=>parse(event.target.result);reader.readAsArrayBuffer(file);}
  document.addEventListener('DOMContentLoaded',()=>{
    $('attendeeFile').addEventListener('change',event=>{if(event.target.files[0])readFile(event.target.files[0]);});
    fetch('00_database_attends.xlsx').then(response=>{if(!response.ok)throw new Error('not found');return response.arrayBuffer();}).then(parse).catch(()=>{$('facilityGroupChartStatus').textContent='Excelファイルを選択してください';});
  });
})();
