(function(){
  'use strict';

  const TASK_OFFSETS={
    '01':-35,'02':-34,'03':-32,'04':-35,'05':-30,'06':-29,
    '07':-28,'08':-28,'09':-27,'10':-26,'11':-21,'12':-14,
    '13':-14,'14':-7,'15':-14,'16':-7,'17':-7,'18':-6,
    '19':-5,'20':-3,'21':-3,'22':-1,'23':-1,'24':-1,
    '25':0,'26':1,'27':2,'28':2,'29':1,'30':3,'31':5,
    '32':7,'33':7,'34':7
  };

  function startOfDay(date){
    return new Date(date.getFullYear(),date.getMonth(),date.getDate());
  }

  function parseDate(value,yearValue){
    const raw=String(value||'').trim();
    if(!raw)return null;
    let match=raw.match(/^(\d{4})[-\/]?(\d{1,2})[-\/]?(\d{1,2})$/);
    if(match)return new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
    match=raw.match(/(\d{1,2})月\s*(\d{1,2})日|^(\d{1,2})\/(\d{1,2})$/);
    const yearMatch=String(yearValue||'').match(/(\d{4})/);
    if(!match||!yearMatch)return null;
    const month=Number(match[1]||match[3]);
    const day=Number(match[2]||match[4]);
    return new Date(Number(yearMatch[1]),month-1,day);
  }

  function addDays(date,days){
    const next=new Date(date);
    next.setDate(next.getDate()+days);
    return next;
  }

  function isHoliday(date){
    const year=date.getFullYear();
    const month=date.getMonth()+1;
    const day=date.getDate();
    const fixed=['1-1','2-11','2-23','4-29','5-3','5-4','5-5','8-11','11-3','11-23'];
    if(fixed.includes(month+'-'+day))return true;
    const nthMonday=(targetMonth,n)=>{
      let count=0;
      for(let i=1;i<=31;i++){
        const candidate=new Date(year,targetMonth-1,i);
        if(candidate.getMonth()!==targetMonth-1)break;
        if(candidate.getDay()===1){
          count++;
          if(count===n)return i;
        }
      }
      return 0;
    };
    if((month===1&&day===nthMonday(1,2))||(month===7&&day===nthMonday(7,3))||(month===9&&day===nthMonday(9,3))||(month===10&&day===nthMonday(10,2)))return true;
    const vernal=Math.floor(20.8431+0.242194*(year-1980))-Math.floor((year-1980)/4);
    const autumn=Math.floor(23.2488+0.242194*(year-1980))-Math.floor((year-1980)/4);
    return (month===3&&day===vernal)||(month===9&&day===autumn);
  }

  function addBusinessDays(date,days){
    let current=new Date(date);
    let remaining=Math.max(0,Number(days)||0);
    while(remaining>0){
      current=addDays(current,1);
      if(current.getDay()!==0&&current.getDay()!==6&&!isHoliday(current))remaining--;
    }
    return current;
  }

  function nextBusinessDay(date){
    let current=new Date(date);
    while(current.getDay()===0||current.getDay()===6||isHoliday(current))current=addDays(current,1);
    return current;
  }

  function toIso(date){
    return date?date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0'):'';
  }

  function daysUntil(value,today){
    const date=value instanceof Date?value:parseDate(value,'');
    if(!date)return null;
    const base=startOfDay(today||new Date());
    return Math.round((startOfDay(date)-base)/86400000);
  }

  function deadlineBand(diff){
    if(diff<0)return 'overdue';
    if(diff===0)return 'today';
    if(diff<=3)return 'within-3';
    if(diff<=7)return 'within-7';
    return 'normal';
  }

  function parseObject(value){
    try{
      const parsed=JSON.parse(String(value||'{}'));
      return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
    }catch(e){return {}}
  }

  function taskMetaFromRow(row,keys){
    return {
      dueDates:parseObject(row?.[keys.taskDueDates]),
      doneAt:parseObject(row?.[keys.taskDoneAt]),
      notes:parseObject(row?.[keys.taskNotes])
    };
  }

  function taskDueDates(row,keys){
    const meta=taskMetaFromRow(row,keys);
    const event=parseDate(row?.[keys.date],row?.[keys.year]);
    const dates={};
    if(event){
      Object.keys(TASK_OFFSETS).forEach(id=>{
        const fallback=id==='26'||id==='27'||id==='28'||id==='29'||id==='30'||id==='31'||id==='32'||id==='33'||id==='34'
          ?addBusinessDays(event,TASK_OFFSETS[id])
          :addDays(event,TASK_OFFSETS[id]);
        dates[id]=toIso(fallback);
      });
    }
    Object.keys(meta.dueDates).forEach(id=>{
      if(String(meta.dueDates[id]||'').trim())dates[id]=String(meta.dueDates[id]).trim();
    });
    return dates;
  }

  function taskSnapshot(row,keys,today){
    const meta=taskMetaFromRow(row,keys);
    const dueDates=taskDueDates(row,keys);
    const base=startOfDay(today||new Date());
    return (typeof TASK_IDS!=='undefined'?TASK_IDS:[]).map(id=>{
      const due=dueDates[id]?parseDate(dueDates[id],''):null;
      const diff=due?Math.round((startOfDay(due)-base)/86400000):null;
      const complete=typeof isCheckedValue==='function'&&isCheckedValue(row?.[keys['task'+id]]);
      return {id,dueDate:dueDates[id]||'',daysUntil:diff,band:diff===null?'normal':deadlineBand(diff),complete,doneAt:String(meta.doneAt[id]||''),note:String(meta.notes[id]||'')};
    });
  }

  function serializeMeta(meta){
    const clean={dueDates:{},doneAt:{},notes:{}};
    ['dueDates','doneAt','notes'].forEach(group=>{
      Object.keys(meta?.[group]||{}).forEach(key=>{
        const value=String(meta[group][key]||'').trim();
        if(value)clean[group][key]=value;
      });
    });
    return clean;
  }

  function applyMetaToRow(row,keys,meta){
    const clean=serializeMeta(meta);
    row[keys.taskDueDates]=JSON.stringify(clean.dueDates);
    row[keys.taskDoneAt]=JSON.stringify(clean.doneAt);
    row[keys.taskNotes]=JSON.stringify(clean.notes);
    return row;
  }

  window.SeminarDomain={
    TASK_OFFSETS,
    parseDate,
    addBusinessDays,
    nextBusinessDay,
    toIso,
    daysUntil,
    deadlineBand,
    taskMetaFromRow,
    taskDueDates,
    taskSnapshot,
    applyMetaToRow,
    serializeMeta
  };
})();
