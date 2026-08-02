(function(){
  function getPriorityLevel(score){
    if(score>=80)return 'CRITICAL';
    if(score>=50)return 'HOT';
    return 'STABLE';
  }

  function countIncompleteTasks(row){
    var done=0,total=TASK_IDS.length,i,k;
    for(i=0;i<TASK_IDS.length;i++){
      k='task'+TASK_IDS[i];
      if(isCheckedValue(row[fullKeys[k]]))done++;
    }
    return total-done;
  }

  function computePriority(record, deadlineSet){
    var no=String(record?.[fullKeys.no]||'').trim();
    var reasons=[];
    var days=calcDaysUntilEvent(record);
    var score=0;
    function add(points,text){
      if(!points)return;
      score+=points;
      reasons.push({points:points,text:text});
    }

    if(days!==null&&days>=0&&days<=7)add(30,'開催まで7日以内（残り'+days+'日）');
    if(days!==null&&days>=0&&days<=3)add(20,'開催まで3日以内（残り'+days+'日）');

    var hasDeadline;
    if(deadlineSet)hasDeadline=deadlineSet.has(no);
    else hasDeadline=collectDeadlineAlerts().some(function(a){return String(a.no)===no});
    if(hasDeadline)add(20,'期限アラート該当');

    var exs=buildExceptions([record]);
    if(exs.length)add(25,'例外'+exs.length+'件: '+exs.slice(0,3).map(function(e){return e.label}).join(' / '));

    if(days===null||days>=-7){
      var remain=countIncompleteTasks(record);
      if(remain>=20)add(15,'未完了タスク'+remain+'件');
      else if(remain>=10)add(10,'未完了タスク'+remain+'件');
      else if(remain>=5)add(5,'未完了タスク'+remain+'件');
    }

    var speaker=String(record[fullKeys.speaker]||'').trim();
    var mailPending=speaker&&['task02','task13','task14'].some(function(k){return !isCheckedValue(record[fullKeys[k]])});
    if(days!==null&&days>=0&&days<=14&&mailPending)add(10,'講師向けメール/資料が未対応');

    if(days!==null&&days<=7&&days>=-7&&!isCheckedValue(record[fullKeys.checkK2]))add(10,'資料締切が近い・超過（起案2未チェック）');

    if(days!==null&&days>=0&&days<=35&&!isCheckedValue(record[fullKeys.checkK1]))add(10,'起案1未チェック（目安: 開催35日前）');
    if(days!==null&&days>=0&&days<=28&&!isCheckedValue(record[fullKeys.checkHp]))add(10,'HP公開チェック未完了（目安: 開催28日前）');

    score=Math.max(0,Math.min(100,score));
    return {no:no,score:score,level:getPriorityLevel(score),reasons:reasons};
  }

  function calculatePriorityScore(record){
    return computePriority(record,null).score;
  }

  function getPriorityLevelOnly(score){
    return getPriorityLevel(score);
  }

  function collectPriorityReasons(record){
    return computePriority(record,null).reasons;
  }

  function getPriority(record){
    return computePriority(record,null);
  }

  function buildPriorityIndex(rows){
    var map=new Map();
    var deadlineSet=new Set(collectDeadlineAlerts().map(function(a){return String(a.no)}));
    (rows||[]).forEach(function(r){
      var p=computePriority(r,deadlineSet);
      if(p.no)map.set(p.no,p);
    });
    return map;
  }

  var masterSortDir=0;
  function getMasterSortDir(){return masterSortDir}
  function toggleMasterPrioritySort(){
    masterSortDir=masterSortDir===0?-1:masterSortDir===-1?1:0;
    if(typeof renderTable==='function')renderTable();
    return masterSortDir;
  }

  function renderPrioritySummary(){
    var lvlEl=document.getElementById('priLevel');
    var nextEl=document.getElementById('priNext');
    var hotEl=document.getElementById('priHot');
    if(!lvlEl&&!nextEl&&!hotEl)return;
    if(typeof currentHeaders==='undefined'||!currentHeaders.length||!dataRows.length){
      if(lvlEl){lvlEl.textContent='-';lvlEl.className='pri-lvl-val';}
      if(nextEl)nextEl.textContent='-';
      if(hotEl)hotEl.textContent='0';
      return;
    }
    var idx=buildPriorityIndex(dataRows);
    var top=null,hotCount=0;
    idx.forEach(function(p){
      if(p.level==='HOT')hotCount++;
      if(p.score>0&&(!top||p.score>top.score))top=p;
    });
    var level=top?top.level:'STABLE';
    if(lvlEl){lvlEl.textContent=level;lvlEl.className='pri-lvl-val '+level.toLowerCase();}
    if(nextEl)nextEl.textContent=top?('No.'+top.no):'-';
    if(hotEl)hotEl.textContent=String(hotCount);
  }

  function decorateMasterTableWithPriority(){
    var th=document.querySelector('#masterTableSection th[data-s="priority"]');
    if(th)th.textContent=masterSortDir===1?'優先度 ▲':masterSortDir===-1?'優先度 ▼':'優先度';
  }

  window.PriorityEngine={
    calculatePriorityScore:calculatePriorityScore,
    getPriorityLevel:getPriorityLevelOnly,
    collectPriorityReasons:collectPriorityReasons,
    getPriority:getPriority,
    buildPriorityIndex:buildPriorityIndex,
    getMasterSortDir:getMasterSortDir,
    toggleMasterPrioritySort:toggleMasterPrioritySort,
    renderPrioritySummary:renderPrioritySummary,
    decorateMasterTableWithPriority:decorateMasterTableWithPriority
  };
  window.toggleMasterPrioritySort=toggleMasterPrioritySort;
})();
