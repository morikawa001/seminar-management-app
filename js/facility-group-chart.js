/* facility_group列を使った参加状況グラフ */
(function(){
  'use strict';
  const state={rows:[],chart:null};
  const $=id=>document.getElementById(id);
  const clean=value=>String(value==null?'':value).trim();
  const valueOf=(row,key)=>clean(row[key]);
  const isAttended=row=>{const value=valueOf(row,'attend_2026')||valueOf(row,'attend')||valueOf(row,'attendance');return value==='1'||value==='○'||value==='〇'||value.toLowerCase()==='yes'||value.toLowerCase()==='true';};
  function parse(data){
    try{
      const workbook=XLSX.read(data,{type:'array',cellDates:true});
      const sheet=workbook.Sheets[workbook.SheetNames[0]];
      state.rows=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false}).filter(isAttended);
      render();
    }catch(error){console.error('facility_groupグラフの読み込みに失敗しました',error);}
  }
  function sortedCounts(){
    const counts={};
    state.rows.forEach(row=>{const group=valueOf(row,'facility_group')||'未入力';counts[group]=(counts[group]||0)+1;});
    const items=Object.entries(counts);
    if($('facilityGroupSort').value==='count')items.sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ja'));
    else items.sort((a,b)=>a[0].localeCompare(b[0],'ja'));
    return items;
  }
  function render(){
    if(!window.Chart||!$('facilityGroupChartStandalone'))return;
    const items=sortedCounts();
    if(state.chart)state.chart.destroy();
    const styles=getComputedStyle(document.documentElement);
    state.chart=new Chart($('facilityGroupChartStandalone').getContext('2d'),{type:'bar',data:{labels:items.map(item=>item[0]),datasets:[{label:'参加件数',data:items.map(item=>item[1]),backgroundColor:'#35e0b2',borderRadius:4}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0,color:styles.getPropertyValue('--muted')},grid:{color:styles.getPropertyValue('--line')}},y:{ticks:{color:styles.getPropertyValue('--text')},grid:{display:false}}}}});
    $('facilityGroupChartStatus').textContent=`${state.rows.length.toLocaleString()}件をfacility_group別に集計`;
  }
  function readFile(file){const reader=new FileReader();reader.onload=event=>parse(event.target.result);reader.readAsArrayBuffer(file);}
  document.addEventListener('DOMContentLoaded',()=>{
    $('facilityGroupSort').addEventListener('change',render);
    $('attendeeFile').addEventListener('change',event=>{if(event.target.files[0])readFile(event.target.files[0]);});
    fetch('00_database_attends.xlsx').then(response=>{if(!response.ok)throw new Error('not found');return response.arrayBuffer();}).then(parse).catch(()=>{$('facilityGroupChartStatus').textContent='Excelファイルを選択してください';});
  });
})();
