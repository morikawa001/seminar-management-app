function updateTaskProgress(){
  const total=34;
  let done=0;
  const TASK_IDS=['01','02','03','04','04a','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
  for(const id of TASK_IDS){const el=document.getElementById('ck_task'+id);if(el&&el.checked)done++;}
  const remain=total-done;
  const pct=Math.round(done/total*100);
  const doneEl=document.getElementById('taskDoneCount');
  const remEl=document.getElementById('taskRemainCount');
  const pctEl=document.getElementById('taskProgressPct');
  const barEl=document.getElementById('taskProgressBar');
  if(doneEl)doneEl.textContent=String(done);
  if(remEl)remEl.textContent=String(remain);
  if(pctEl)pctEl.textContent=pct+'%';
  if(barEl)barEl.style.width=pct+'%';
  for(const id of TASK_IDS){const tc=document.getElementById('taskcard_task'+id);const cb=document.getElementById('ck_task'+id);if(tc)tc.classList.toggle('done',cb?.checked||false);}
  const no=String(fields.no.value||'').trim();
  if(!no)return;
  const rawIdx=getRawRowIndexByNo(no);
  if(rawIdx<0)return;
  const rawRow=rawRows[rawIdx];
  for(const id of TASK_IDS){const el=document.getElementById('ck_task'+id);rawRow[fullKeys['task'+id]]=boolToCsv(el?.checked||false);}
  if(typeof FirebaseApp!=='undefined'&&FirebaseApp.getCurrentUser()){
    FirebaseApp.saveToFirestore(rawRow,currentHeaders).catch(function(err){console.error('Firestore task save error:',err)});
  }
}
function resetAllTasks(){
  const TASK_IDS=['01','02','03','04','04a','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
  for(const id of TASK_IDS){const el=document.getElementById('ck_task'+id);if(el)el.checked=false;}
  updateTaskProgress();
}
// 初期化時にも進捗を反映
(function(){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',updateTaskProgress);
  }else{
    setTimeout(updateTaskProgress,100);
  }
})();


// グローバル公開（onclickから呼べるように）
window.resetAllTasks = resetAllTasks;
window.updateTaskProgress = updateTaskProgress;



function scrollToSection(id){
  const el = document.getElementById(id);
  if(!el) return;
  const section = el.closest('.section-collapsible') || el;
  if(section.classList) section.classList.add('open');
  el.scrollIntoView({behavior:'smooth',block:'start'});
  const btn = document.querySelector(`.v2-sidebar-btn[data-section="${id}"]`);
  document.querySelectorAll('.v2-sidebar-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}
function toggleSection(el){
  const section = el.closest('.section-collapsible');
  if(!section) return;
  const isOpen = section.classList.toggle('open');
  const btn = section.querySelector('.section-toggle-btn');
  if(btn) btn.setAttribute('aria-label', isOpen ? '折りたたむ' : '展開する');
}
function scrollAndOpen(id){ scrollToSection(id); }
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.section-collapsible').forEach(sec=>{
    const collapsed = sec.getAttribute('data-collapsed') !== 'false';
    if(!collapsed) sec.classList.add('open');
    const head = sec.querySelector('.panel-head');
    if(!head) return;
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'section-toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', collapsed ? '展開する' : '折りたたむ');
    toggleBtn.innerHTML = '<span class="arrow">▼</span>';
    toggleBtn.addEventListener('click',function(e){e.stopPropagation();toggleSection(this)});
    head.appendChild(toggleBtn);
  });
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        document.querySelectorAll('.v2-sidebar-btn').forEach(b=>b.classList.remove('active'));
        const id = entry.target.id;
        const btn = document.querySelector(`.v2-sidebar-btn[data-section="${id}"]`);
        if(btn) btn.classList.add('active');
      }
    });
  },{rootMargin:'-56px 0px -60% 0px'});
  const sectionIds = ['topControlPanel','todayCommandSection','deadlineAlertSection','quickOperationSection','entryConsoleSection','mailTemplateSection','taskChecklistPanel','exceptionQueueSection','masterTableSection','templateInjectionSection'];
  sectionIds.forEach(id=>{
    const el = document.getElementById(id);
    if(el) observer.observe(el);
  });
});

document.getElementById('themeBtn').addEventListener('click',SharedTheme.toggleTheme);

const DEFAULT_HEADERS=[
  '起案行No',
  '年度_YEAR_1',
  '開催日_DATE_1',
  '曜日 _DAY',
  '講義開始_START_TIME',
  '研修会開始_START_1',
  '研修会終了_END_1',
  '質疑応答締切_QA_DADLINE',
  '質疑応答_QA_TIME',
  '事前打合せ開始時間_PRE_MEETING',
  '研修会入室開始時間_TIME_1',
  '時間（分）_TIME_2',
  '〆切院外_DEADLINE_1',
  '〆切時間院内_DEADLINE_2',
  '配布資料DL〆切_DEADLINE_3',
  'テーマ(標題)_TITLE',
  '担当講師_SPEAKER',
  '対象_SUBJECT_1',
  '対象詳細_SUBJECT_2',
  '講演場所_SITE',
  '共催_COHOST_1',
  '共催3(選択）_COHOST_3',
  'オリエンテーションスライドヘッダー_HEAD_1',
  '進行表クロージング（選択）_CLOSING_1',
  '起案1開催DATE_KIAN_1',
  '起案2資料_DATE_KIAN_2',
  '起案3受講証修了証_DATE_KIAN_3',
  'HP案内開始チラシ配布',
  '謝金_COST',
  '目的_PURPOSE',
  'メール用研修会開催日付_DATE_2',
  '名前_NAME',
  'Zoom_ID_WEBINER_ID',
  'zoom_url_zoom_url',
  'HP_URL_url_1',
  'Zoom_パスコード_PASSCODE',
  '進行表導入_INTRO_1',
  '進行表研修会趣旨説明_INTRO_2',
  '進行表講師紹介_INTRO_3',
  '講義資料提供の締切_DATA_deadline',
  '起案1チェック_CHECK_K1',
  'HPチェック_CHECK_HP',
  '起案2チェック_CHECK_K2',
  '起案3チェック_CHECK_K3',
  '差出人_所属_ORG',
  '差出人_担当者_NAME',
  '差出人_署名_SIGNATURE',
  '研修会演題と目的案を作成_CHECK',
  '講師にメールで確認_CHECK',
  'HPブランチ作成依頼_CHECK',
  'WordPress設定予約投稿_CHECK',
  '講師依頼状兼業依頼提出CHECK', // ← task04a を追加
  '起案1_開催_CHECK',
  'HP公開設定依頼_CHECK',
  'HP公開受付開始_CHECK',
  'HP公開開始案内メール_CHECK',
  '電子カルテ掲示板掲載確認_CHECK',
  '院内チラシ1回目配布_CHECK',
  '院内チラシ2回目配布_CHECK',
  '講師リマインドメール_CHECK',
  '講師スライド入手_CHECK',
  '共催企画人材班協力要請_CHECK',
  '事前受付終了Webリスト書出し_CHECK',
  '起案2_資料_CHECK',
  '追加資料有無確認_CHECK',
  '企画人材班配布資料共有_CHECK',
  '防災センター報告_CHECK',
  '講師受講者リマインド1_CHECK',
  '研修会当日準備_CHECK',
  '講師受講者リマインド2_CHECK',
  'PCシステム更新確認_CHECK',
  '研修会本番_CHECK',
  'Zoomレポートダウンロード_CHECK',
  '会場参加者データ企画人材班_CHECK',
  '出席者受講者リスト入力_CHECK',
  '起案3_受講証_CHECK',
  '講師へお礼連絡_CHECK',
  '受講者数内訳報告_CHECK',
  '謝金支払い_CHECK',
  '謝金講師メール_CHECK',
  '受講証修了証メール交付_CHECK'
];

const fullKeys={
  no:'起案行No',
  year:'年度_YEAR_1',
  date:'開催日_DATE_1',
  day:'曜日 _DAY',
  lectureStart:'講義開始_START_TIME',
  start:'研修会開始_START_1',
  end:'研修会終了_END_1',
  qaDeadline:'質疑応答締切_QA_DADLINE',
  qaTime:'質疑応答_QA_TIME',
  preMeeting:'事前打合せ開始時間_PRE_MEETING',
  roomOpen:'研修会入室開始時間_TIME_1',
  duration:'時間（分）_TIME_2',
  deadline1:'〆切院外_DEADLINE_1',
  deadline2:'〆切時間院内_DEADLINE_2',
  deadline3:'配布資料DL〆切_DEADLINE_3',
  title:'テーマ(標題)_TITLE',
  speaker:'担当講師_SPEAKER',
  subject:'対象_SUBJECT_1',
  subject2:'対象詳細_SUBJECT_2',
  site:'講演場所_SITE',
  cohost:'共催_COHOST_1',
  cohost3:'共催3(選択）_COHOST_3',
  head1:'オリエンテーションスライドヘッダー_HEAD_1',
  closing1:'進行表クロージング（選択）_CLOSING_1',
  k1:'起案1開催DATE_KIAN_1',
  k2:'起案2資料_DATE_KIAN_2',
  k3:'起案3受講証修了証_DATE_KIAN_3',
  hp:'HP案内開始チラシ配布',
  cost:'謝金_COST',
  purpose:'目的_PURPOSE',
  date2:'メール用研修会開催日付_DATE_2',
  name:'名前_NAME',
  zoomId:'Zoom_ID_WEBINER_ID',
  zoomUrl:'zoom_url_zoom_url',
  hpUrl:'HP_URL_url_1',
  passcode:'Zoom_パスコード_PASSCODE',
  intro1:'進行表導入_INTRO_1',
  intro2:'進行表研修会趣旨説明_INTRO_2',
  intro3:'進行表講師紹介_INTRO_3',
  dataDeadline:'講義資料提供の締切_DATA_deadline',
  checkK1:'起案1チェック_CHECK_K1',
  checkHp:'HPチェック_CHECK_HP',
  checkK2:'起案2チェック_CHECK_K2',
  checkK3:'起案3チェック_CHECK_K3',
  senderOrg:'差出人_所属_ORG',
  senderName:'差出人_担当者_NAME',
  senderSig:'差出人_署名_SIGNATURE',
  task01:'研修会演題と目的案を作成_CHECK',
  task02:'講師にメールで確認_CHECK',
  task03:'HPブランチ作成依頼_CHECK',
  task04:'WordPress設定予約投稿_CHECK',
  task04a:'講師依頼状兼業依頼提出CHECK',
  task05:'起案1_開催_CHECK',
  task06:'HP公開設定依頼_CHECK',
  task07:'HP公開受付開始_CHECK',
  task08:'HP公開開始案内メール_CHECK',
  task09:'電子カルテ掲示板掲載確認_CHECK',
  task10:'院内チラシ1回目配布_CHECK',
  task11:'院内チラシ2回目配布_CHECK',
  task12:'講師リマインドメール_CHECK',
  task13:'講師スライド入手_CHECK',
  task14:'共催企画人材班協力要請_CHECK',
  task15:'事前受付終了Webリスト書出し_CHECK',
  task16:'起案2_資料_CHECK',
  task17:'追加資料有無確認_CHECK',
  task18:'企画人材班配布資料共有_CHECK',
  task19:'防災センター報告_CHECK',
  task20:'講師受講者リマインド1_CHECK',
  task21:'研修会当日準備_CHECK',
  task22:'講師受講者リマインド2_CHECK',
  task23:'PCシステム更新確認_CHECK',
  task24:'研修会本番_CHECK',
  task25:'Zoomレポートダウンロード_CHECK',
  task26:'会場参加者データ企画人材班_CHECK',
  task27:'出席者受講者リスト入力_CHECK',
  task28:'起案3_受講証_CHECK',
  task29:'講師へお礼連絡_CHECK',
  task30:'受講者数内訳報告_CHECK',
  task31:'謝金支払い_CHECK',
  task32:'謝金講師メール_CHECK',
  task33:'受講証修了証メール交付_CHECK'
};

const els={
  csvFile:document.getElementById('csvFile'),
  csvFileName:document.getElementById('csvFileName'),
  newDbBtn:document.getElementById('newDbBtn'),
  recordSelect:document.getElementById('recordSelect'),
  openConfirmBtn:document.getElementById('openConfirmBtn'),
  appendBtn:document.getElementById('appendBtn'),
  prefillBtn:document.getElementById('prefillBtn'),
  loadSelectedBtn:document.getElementById('loadSelectedBtn'),
  saveAndDownloadBtn:document.getElementById('saveAndDownloadBtn'),
  deleteEntryBtn:document.getElementById('deleteEntryBtn'),
  tableList:document.getElementById('masterTbody'),
  statusBox:document.getElementById('statusBox'),
  miniNext:document.getElementById('miniNext'),
  miniYearCount:document.getElementById('miniYearCount'),
  miniDbState:document.getElementById('miniDbState'),
  miniDbText:document.getElementById('miniDbText'),
  sumAll:document.getElementById('sumAll'),
  sumYear:document.getElementById('sumYear'),
  sumNext:document.getElementById('sumNext'),
  sumSoon:document.getElementById('sumSoon'),
  sumDone:document.getElementById('sumDone'),
  sumDraft:document.getElementById('sumDraft'),
  sumSubject:document.getElementById('sumSubject'),
  roadmapLabel:document.getElementById('roadmapLabel'),
  roadmapBar:document.getElementById('roadmapBar'),
  dK1:document.getElementById('dK1'),
  dK2:document.getElementById('dK2'),
  dHp:document.getElementById('dHp'),
  dK3:document.getElementById('dK3'),
  dRoomOpen:document.getElementById('dRoomOpen'),
  dDuration:document.getElementById('dDuration'),
  dLectureStart:document.getElementById('dLectureStart'),
  dPreMeeting:document.getElementById('dPreMeeting'),
  dQaDeadline:document.getElementById('dQaDeadline'),
  dQaTime:document.getElementById('dQaTime'),
  dDeadline1:document.getElementById('dDeadline1'),
  dDeadline2:document.getElementById('dDeadline2'),
  dDeadline3:document.getElementById('dDeadline3'),
  dDataDeadline:document.getElementById('dDataDeadline'),
  dDate2:document.getElementById('dDate2'),
  dSubject2:document.getElementById('dSubject2'),
  ckK1:document.getElementById('ckK1'),
  ckHp:document.getElementById('ckHp'),
  ckK2:document.getElementById('ckK2'),
  ckK3:document.getElementById('ckK3'),
  checkList:document.getElementById('checkList'),
  confirmCount:document.getElementById('confirmCount'),
  confirmWarn:document.getElementById('confirmWarn'),
  confirmState:document.getElementById('confirmState'),
  folderView:document.getElementById('folderView'),
  resultDone:document.getElementById('resultDone'),
  resultHold:document.getElementById('resultHold'),
  resultZip:document.getElementById('resultZip'),
  alertList:document.getElementById('alertList'),
  templateFiles:document.getElementById('templateFiles'),
  templateFilesName:document.getElementById('templateFilesName'),
  mergeRecordSelect:document.getElementById('mergeRecordSelect'),
  templateState:document.getElementById('templateState'),
  mergeAllBtn:document.getElementById('mergeAllBtn'),
  mergeAllZipBtn:document.getElementById('mergeAllZipBtn'),
  mergeStatusBox:document.getElementById('mergeStatusBox'),
  templateClearBtn:document.getElementById('templateClearBtn'),
  templateList:document.getElementById('templateList'),
  sumAllTop:document.getElementById('sumAllTop'),
  sumYearTop:document.getElementById('sumYearTop'),
  sumNextTop:document.getElementById('sumNextTop'),
  annualGauge:document.getElementById('annualGauge'),
  annualGaugeText:document.getElementById('annualGaugeText'),
  annualGaugeSub:document.getElementById('annualGaugeSub'),
  paramYearCount:document.getElementById('paramYearCount'),
  paramDoneCount:document.getElementById('paramDoneCount'),
  paramSoonCount:document.getElementById('paramSoonCount'),
  paramDraftCount:document.getElementById('paramDraftCount')
};

const fields={
  no:document.getElementById('fNo'),
  year:document.getElementById('fYear'),
  date:document.getElementById('fDate'),
  day:document.getElementById('fDay'),
  date2:document.getElementById('fDate2'),
  name:document.getElementById('fName'),
  title:document.getElementById('fTitle'),
  speaker:document.getElementById('fSpeaker'),
  lectureStart:document.getElementById('fLectureStart'),
  start:document.getElementById('fStart'),
  end:document.getElementById('fEnd'),
  preMeeting:document.getElementById('fPreMeeting'),
  qaDeadline:document.getElementById('fQaDeadline'),
  qaTime:document.getElementById('fQaTime'),
  roomOpen:document.getElementById('fRoomOpen'),
  duration:document.getElementById('fDuration'),
  deadline1:document.getElementById('fDeadline1'),
  deadline2:document.getElementById('fDeadline2'),
  deadline3:document.getElementById('fDeadline3'),
  dataDeadline:document.getElementById('fDataDeadline'),
  cost:document.getElementById('fCost'),
  subject:document.getElementById('fSubject'),
  subject2:document.getElementById('fSubject2'),
  site:document.getElementById('fSite'),
  cohost:document.getElementById('fCohost'),
  cohost3:document.getElementById('fCohost3'),
  zoomId:document.getElementById('fZoomId'),
  passcode:document.getElementById('fPasscode'),
  zoomUrl:document.getElementById('fZoomUrl'),
  hpUrl:document.getElementById('fHpUrl'),
  purpose:document.getElementById('fPurpose'),
  intro1:document.getElementById('fIntro1'),
  intro2:document.getElementById('fIntro2'),
  intro3:document.getElementById('fIntro3')
};

let currentHeaders=[], rawRows=[], dataRows=[], selectedRow=null, stagedRow=null, lastSaveMode='', selectedTemplates=[];
// チェック時に即時 rawRows へ書き込む方式を使用（pendingChecks廃止）

const HEAD_TEXT_DEFAULT='2026年度　臨床研究研修会';
const HEAD_TEXT_COHOST='2026年度　臨床腫瘍学コース・臨床研究研修会（共催）';
const COHOST_OPTION_NONE='なし';
const COHOST_OPTION_TEAM='企画人材班';
const COHOST3_TEXT_TEAM='臨床腫瘍学コースとの共催';

const CLOSING_TEXT_RESEARCHER='司会:（研究者） 本日の研修の受講証を希望する方は、終了後のアンケートよりお申込みください。 なお、受講証につきましては、研修会開始から質疑応答終了までの時間のうち3/4以上を聴講した方で、 希望される方に発行いたします。 また、本研修会の修了証書の発行につきまして、修了証書をご希望の方は、 今回を含め、研究者対象の研修会を3回以上受講した方のみ、お申込みいただけます。 対象の研修会を3回受講された方で、修了証の発行をご希望の方は、アンケートよりお申し込みください。 ＜スライド切り替え＞ 最後になりますが、受講者の皆様には、アンケートへのご回答、ご協力をお願いいたします。 ウェビナー退室後にアンケートが表示されますので、 ご回答後に送信ボタンを押して提出してください。 本日は、2026年度_静岡がんセンター臨床研究研修会にご参加いただき、どうもありがとうございました。 本ウェビナーはまもなく切断いたします。';
const CLOSING_TEXT_SUPPORT='司会:（支援者） 本日の研修の受講証を希望する方は、終了後のアンケートよりお申込みください。 なお、受講証につきましては、研修会開始から質疑応答終了までの時間のうち3/4以上を聴講した方で、 希望される方に発行いたします。 また、本研修会の修了証書の発行につきまして、修了証書をご希望の方は、 今回を含め、研究支援者対象の研修会を3回以上受講した方のみ、お申込みいただけます。 対象の研修会を3回受講された方で、修了証の発行をご希望の方は、アンケートよりお申し込みください。 ＜スライド切り替え＞ 最後になりますが、受講者の皆様には、アンケートへのご回答、ご協力をお願いいたします。 ウェビナー退室後にアンケートが表示されますので、 ご回答後に送信ボタンを押して提出してください。 本日は、2026年度_静岡がんセンター臨床研究研修会にご参加いただき、どうもありがとうございました。 本ウェビナーはまもなく切断いたします。';
const CLOSING_TEXT_COMMITTEE='司会:（委員会） 本日の研修の受講証を希望する方は、終了後のアンケートよりお申込みください。 なお、受講証につきましては、研修会開始から質疑応答終了までの時間のうち3/4以上を聴講した方で、 希望される方に発行いたします。 ＜スライド切り替え＞ 最後になりますが、受講者の皆様には、アンケートへのご回答、ご協力をお願いいたします。 ウェビナー退室後にアンケートが表示されますので、 ご回答後に送信ボタンを押して提出してください。 本日は、2026年度_静岡がんセンター臨床研究研修会にご参加いただき、どうもありがとうございました。 本ウェビナーはまもなく切断いたします。';

els.csvFile.addEventListener('change',loadCsv);
els.templateFiles.addEventListener('change',handleTemplateFiles);
els.mergeRecordSelect.addEventListener('change',()=>setMergeState());
els.mergeAllBtn.addEventListener('click',mergeAllTemplates);
els.mergeAllZipBtn.addEventListener('click',mergeAllTemplatesZip);
els.newDbBtn.addEventListener('click',createNewDatabase);
document.getElementById('dummyDataBtn').addEventListener('click',loadDummyData);
els.recordSelect.addEventListener('change',handleSelectRecord);
els.loadSelectedBtn.addEventListener('click',loadSelectedIntoForm);
els.prefillBtn.addEventListener('click',prefillFromLast);
els.appendBtn.addEventListener('click',()=>{commitDraft();setTimeout(downloadCsv,100)});
els.deleteEntryBtn.addEventListener('click',function(){
  const no=String(fields.no.value||'').trim();
  if(!no){setStatus('削除する No が指定されていません。先に No を選択してください。');return}
  deleteRecord(no);
});
els.openConfirmBtn.addEventListener('click', () => {
  if (!els.recordSelect || !String(els.recordSelect.value || '').trim()) {
    alert('先に No を選択してください。');
    return;
  }

  // Quick Operation で選択中の No を内部選択にも反映
  if (typeof selectRecordByNo === 'function') {
    selectRecordByNo(els.recordSelect.value);
  }

  // Entry Console の「選択Noを反映」と同じ処理を実行
  if (els.loadSelectedBtn) {
    els.loadSelectedBtn.click();
  }

  const el = document.getElementById('entryConsoleSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('quickOpenBtn').addEventListener('click',quickOpenSelected);
document.getElementById('quickRecordSelect').addEventListener('change',function(e){
  if(this.value)quickOpenSelected();
});
function quickOpenSelected(){
  const sel=document.getElementById('quickRecordSelect');
  const no=String(sel.value||'').trim();
  if(!no){alert('表示したい研修会の No を選択してください。');return}
  if(typeof selectRecordByNo==='function')selectRecordByNo(no);
  if(els.loadSelectedBtn)els.loadSelectedBtn.click();
  const sec=document.getElementById('entryConsoleSection');
  if(sec)sec.scrollIntoView({behavior:'smooth',block:'start'});
}
els.saveAndDownloadBtn.addEventListener('click',()=>{commitDraft();setTimeout(downloadCsv,100)});
fields.cohost.addEventListener('change',()=>{syncCohostFields();recalcDraft();});
fields.subject.addEventListener('change',recalcDraft);

[
  fields.no,fields.date,fields.name,fields.start,fields.end,fields.lectureStart,
  fields.preMeeting,fields.qaDeadline,fields.qaTime,
  fields.title,fields.speaker,fields.cost,fields.zoomId,fields.passcode,fields.zoomUrl,fields.hpUrl,
  fields.purpose,fields.intro1,fields.intro2,fields.intro3
].forEach(el=>el.addEventListener('input',recalcDraft));
[fields.site].forEach(el=>el.addEventListener('change',recalcDraft));
[els.ckK1,els.ckHp,els.ckK2,els.ckK3].forEach(el=>el.addEventListener('change',recalcDraft));
fields.title.addEventListener('input',function(){if(selectedRow){selectedRow[fullKeys.title]=this.value;renderRecordOptions()}});
fields.no.addEventListener('input',function(){els.deleteEntryBtn.disabled=!dataRows.length||!String(this.value||'').trim()});

function getHead1ValueByCohost(cohostValue){
  return String(cohostValue||'').trim()===COHOST_OPTION_TEAM ? HEAD_TEXT_COHOST : HEAD_TEXT_DEFAULT;
}
function getClosingTextBySubject(subjectValue){
  const v=String(subjectValue||'').trim();
  if(v==='研究者') return CLOSING_TEXT_RESEARCHER;
  if(v==='研究支援者') return CLOSING_TEXT_SUPPORT;
  if(v==='倫理審査委員会委員') return CLOSING_TEXT_COMMITTEE;
  return '';
}
function syncCohostFields(){
  const isTeam=String(fields.cohost.value||'').trim()===COHOST_OPTION_TEAM;
  fields.cohost3.value=isTeam?COHOST3_TEXT_TEAM:'';
}
function setMergeStatus(msg){els.mergeStatusBox.textContent=msg}
function setMergeState(){const hasTemplates=selectedTemplates.length>0;const hasNo=!!String(els.mergeRecordSelect.value||'').trim();els.templateState.value=`${selectedTemplates.length}件`;const en=hasTemplates&&hasNo;els.mergeAllBtn.disabled=!en;els.mergeAllZipBtn.disabled=!en;}
function renderMergeOptions(){const options=['<option value="">Noを選択して差し込み</option>'].concat(dataRows.map(r=>`<option value="${esc(r[fullKeys.no]||'')}">No.${esc(r[fullKeys.no]||'')} / ${esc(r[fullKeys.date]||'-')} / ${esc(r[fullKeys.title]||'-')}</option>`));const cur=els.mergeRecordSelect.value;els.mergeRecordSelect.innerHTML=options.join('');els.mergeRecordSelect.disabled=!dataRows.length;if(cur&&dataRows.some(r=>String(r[fullKeys.no]||'')===cur))els.mergeRecordSelect.value=cur;setMergeState()}
function renderTemplateList(){if(!selectedTemplates.length){els.templateList.innerHTML='<div class="template-row"><div><strong>テンプレート未選択</strong><p>pptx / xlsx / docx を複数まとめて選択できます。</p></div><div><span class="status s3">待機</span></div><div class="mono">-</div><div class="mono">-</div></div>';return}els.templateList.innerHTML=selectedTemplates.map(file=>`<div class="template-row"><div><strong>${esc(file.name)}</strong><p>${esc(file.type||'application/octet-stream')}</p></div><div><span class="status s2">読込済み</span></div><div class="mono">${esc(templateKind(file.name))}</div><div class="mono">${Math.round((file.size||0)/1024)} KB</div></div>`).join('')}
function handleTemplateFiles(e){
  selectedTemplates=Array.from(e.target.files||[]).filter(f=>/\.(docx|pptx|xlsx)$/i.test(f.name));

  if(!selectedTemplates.length){
    els.templateFilesName.value='ファイル未選択';
  }else if(selectedTemplates.length===1){
    els.templateFilesName.value=selectedTemplates[0].name;
  }else{
    els.templateFilesName.value=`${selectedTemplates.length}件選択: ${selectedTemplates[0].name} ほか`;
  }

  renderTemplateList();
  setMergeState();
  setMergeStatus(selectedTemplates.length?`${selectedTemplates.length}件のテンプレートを登録しました。`:'テンプレートファイルが未選択です。');
}
function getRowByNo(no){return dataRows.find(r=>String(r[fullKeys.no]||'').trim()===String(no||'').trim())||null}

function ensureAdditionalHeaders(headers){
  const extraHeaders = [
    fullKeys.lectureStart,
    fullKeys.qaDeadline,
    fullKeys.qaTime,
    fullKeys.preMeeting,
    fullKeys.deadline3,
    fullKeys.cost,
    fullKeys.dataDeadline,
    fullKeys.date2,
    fullKeys.subject2,
    fullKeys.name,
    fullKeys.cohost3,
    fullKeys.head1,
    fullKeys.closing1,
    fullKeys.checkK1,
    fullKeys.checkHp,
    fullKeys.checkK2,
    fullKeys.checkK3,
    fullKeys.task01,
    fullKeys.task02,
    fullKeys.task03,
    fullKeys.task04,
    fullKeys.task04a,
    fullKeys.task05,
    fullKeys.task06,
    fullKeys.task07,
    fullKeys.task08,
    fullKeys.task09,
    fullKeys.task10,
    fullKeys.task11,
    fullKeys.task12,
    fullKeys.task13,
    fullKeys.task14,
    fullKeys.task15,
    fullKeys.task16,
    fullKeys.task17,
    fullKeys.task18,
    fullKeys.task19,
    fullKeys.task20,
    fullKeys.task21,
    fullKeys.task22,
    fullKeys.task23,
    fullKeys.task24,
    fullKeys.task25,
    fullKeys.task26,
    fullKeys.task27,
    fullKeys.task28,
    fullKeys.task29,
    fullKeys.task30,
    fullKeys.task31,
    fullKeys.task32,
    fullKeys.task33,
    'STATUS_K1',
    'STATUS_HP',
    'STATUS_K2',
    'STATUS_K3',
    'DONEAT_K1',
    'DONEAT_HP',
    'DONEAT_K2',
    'DONEAT_K3',
    'UPDATEDAT_K1',
    'UPDATEDAT_HP',
    'UPDATEDAT_K2',
    'UPDATEDAT_K3',
    'HISTORY_K1',
    'HISTORY_HP',
    'HISTORY_K2',
    'HISTORY_K3'
  ];

  const set = new Set(
    headers.map(h => String(h).trim()).filter(Boolean)
  );
  extraHeaders.forEach(h => set.add(h));
  return Array.from(set);
}
  
function buildTemplateData(row){
  const map={};
  currentHeaders.forEach(h=>map[h]=String(row?.[h]??''));
  const aliasEntries = {
    DATE_1: row?.[fullKeys.date] ?? '',
    DATE_2: row?.[fullKeys.date2] ?? '',
    YEAR_1: row?.[fullKeys.year] ?? '',
    DAY: row?.[fullKeys.day] ?? '',
    START_TIME: row?.[fullKeys.lectureStart] ?? '',
    START_1: row?.[fullKeys.start] ?? '',
    END_1: row?.[fullKeys.end] ?? '',
    QA_DADLINE: row?.[fullKeys.qaDeadline] ?? '',
    QA_TIME: row?.[fullKeys.qaTime] ?? '',
    PRE_MEETING: row?.[fullKeys.preMeeting] ?? '',
    TIME_1: row?.[fullKeys.roomOpen] ?? '',
    TIME_2: row?.[fullKeys.duration] ?? '',
    DEADLINE_1: row?.[fullKeys.deadline1] ?? '',
    DEADLINE_2: row?.[fullKeys.deadline2] ?? '',
    DEADLINE_3: row?.[fullKeys.deadline3] ?? '',
    DATA_deadline: row?.[fullKeys.dataDeadline] ?? '',
    TITLE: row?.[fullKeys.title] ?? '',
    SPEAKER: row?.[fullKeys.speaker] ?? '',
    SUBJECT_1: row?.[fullKeys.subject] ?? '',
    SUBJECT_2: row?.[fullKeys.subject2] ?? '',
    NAME: row?.[fullKeys.name] ?? '',
    COST: row?.[fullKeys.cost] ?? '',
    PURPOSE: row?.[fullKeys.purpose] ?? '',
    SITE: row?.[fullKeys.site] ?? '',
    COHOST_1: row?.[fullKeys.cohost] ?? '',
    COHOST_2: row?.[fullKeys.site] ?? '',
    COHOST_3: row?.[fullKeys.cohost3] ?? '',
    HEAD_1: row?.[fullKeys.head1] ?? '',
    CLOSING_1: row?.[fullKeys.closing1] ?? '',
    NO: row?.[fullKeys.no] ?? '',
    PASSCODE: row?.[fullKeys.passcode] ?? '',
    zoom_url: row?.[fullKeys.zoomUrl] ?? '',
    ZOOM_URL: row?.[fullKeys.zoomUrl] ?? '',
    url_1: row?.[fullKeys.hpUrl] ?? '',
    URL_1: row?.[fullKeys.hpUrl] ?? '',
    HP_URL: row?.[fullKeys.hpUrl] ?? '',
    WEBINER_ID: row?.[fullKeys.zoomId] ?? '',
    webiner_id: row?.[fullKeys.zoomId] ?? '',
    Zoom_ID: row?.[fullKeys.zoomId] ?? '',
    ZOOM_ID: row?.[fullKeys.zoomId] ?? ''
  };
  Object.entries(aliasEntries).forEach(([k,v])=>{map[k]=String(v ?? '')});
  map[fullKeys.zoomId]=String(row?.[fullKeys.zoomId] ?? '');
  map['Zoom_ID_WEBINER_ID']=String(row?.[fullKeys.zoomId] ?? '');
  map['WEBINER_ID']=String(row?.[fullKeys.zoomId] ?? '');
  map['Zoom_ID']=String(row?.[fullKeys.zoomId] ?? '');
  map['ZOOM_ID']=String(row?.[fullKeys.zoomId] ?? '');

  map[fullKeys.hpUrl]=String(row?.[fullKeys.hpUrl] ?? '');
  map['HP_URL_url_1']=String(row?.[fullKeys.hpUrl] ?? '');
  map['url_1']=String(row?.[fullKeys.hpUrl] ?? '');
  map['URL_1']=String(row?.[fullKeys.hpUrl] ?? '');

  map[fullKeys.zoomUrl]=String(row?.[fullKeys.zoomUrl] ?? '');
  map['zoom_url_zoom_url']=String(row?.[fullKeys.zoomUrl] ?? '');
  map['zoom_url']=String(row?.[fullKeys.zoomUrl] ?? '');
  map['ZOOM_URL']=String(row?.[fullKeys.zoomUrl] ?? '');

  map[fullKeys.passcode]=String(row?.[fullKeys.passcode] ?? '');
  map['Zoom_パスコード_PASSCODE']=String(row?.[fullKeys.passcode] ?? '');
  map['PASSCODE']=String(row?.[fullKeys.passcode] ?? '');

  map[fullKeys.head1]=String(row?.[fullKeys.head1] ?? '');
  map['オリエンテーションスライドヘッダー_HEAD_1']=String(row?.[fullKeys.head1] ?? '');

  map[fullKeys.closing1]=String(row?.[fullKeys.closing1] ?? '');
  map['進行表クロージング（選択）_CLOSING_1']=String(row?.[fullKeys.closing1] ?? '');

  map[fullKeys.lectureStart]=String(row?.[fullKeys.lectureStart] ?? '');
  map['講義開始_START_TIME']=String(row?.[fullKeys.lectureStart] ?? '');
  map[fullKeys.qaDeadline]=String(row?.[fullKeys.qaDeadline] ?? '');
  map['質疑応答締切_QA_DADLINE']=String(row?.[fullKeys.qaDeadline] ?? '');
  map[fullKeys.qaTime]=String(row?.[fullKeys.qaTime] ?? '');
  map['質疑応答_QA_TIME']=String(row?.[fullKeys.qaTime] ?? '');
  map[fullKeys.preMeeting]=String(row?.[fullKeys.preMeeting] ?? '');
  map['事前打合せ開始時間_PRE_MEETING']=String(row?.[fullKeys.preMeeting] ?? '');

  return map;
}

function xmlEscape(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function replaceAcrossTextRuns(xml,key,value){
  const escapedValue=xmlEscape(value);
  const chars=String(key).split('').map(ch=>ch.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('(?:<[^>]+>)*');
  const re=new RegExp(chars,'g');
  return xml.replace(re, escapedValue);
}
function replacePlaceholdersInXml(xml,data){
  let out=String(xml||'');
  const entries=Object.entries(data).sort((a,b)=>b[0].length-a[0].length);
  entries.forEach(([key,val])=>{out=out.split(String(key)).join(xmlEscape(val))});
  entries.forEach(([key,val])=>{out=replaceAcrossTextRuns(out,key,val)});
  return out;
}
function templateKind(name){const ext=(String(name).split('.').pop()||'').toLowerCase();return ext.toUpperCase()}
function targetXmlPathsForTemplate(zip,fileName){
  const ext=(String(fileName).split('.').pop()||'').toLowerCase();
  const names=Object.keys(zip.files||{});
  if(ext==='docx') return names.filter(n=>/^word\/.+\.xml$/i.test(n));
  if(ext==='pptx') return names.filter(n=>/^ppt\/(slides|slideMasters|slideLayouts|notesSlides|comments|handoutMasters)\/.+\.xml$/i.test(n));
  if(ext==='xlsx') return names.filter(n=>/^(xl\/worksheets\/.*\.xml|xl\/sharedStrings\.xml|xl\/workbook\.xml|xl\/comments.*\.xml|xl\/drawings\/.*\.xml)$/i.test(n));
  return [];
}
async function mergeSingleTemplate(file,row){
  const arrayBuffer=await file.arrayBuffer();
  const zip=new PizZip(arrayBuffer);
  const data=buildTemplateData(row);
  const targets=targetXmlPathsForTemplate(zip,file.name);
  if(!targets.length) throw new Error('差し込み対象XMLが見つかりません');
  targets.forEach(path=>{
    if(zip.file(path)){
      const xml=zip.file(path).asText();
      zip.file(path,replacePlaceholdersInXml(xml,data));
    }
  });
  const mimeMap={docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
  const ext=(String(file.name).split('.').pop()||'').toLowerCase();
  const out=zip.generate({type:'blob',mimeType:mimeMap[ext]||'application/octet-stream'});
  const a=document.createElement('a');
  const url=URL.createObjectURL(out);
  a.href=url;
  a.download=`No${safeName(row?.[fullKeys.no]||'')}_${safeName(row?.[fullKeys.title]||'template')}_${safeName(file.name)}`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  return {name:file.name,type:templateKind(file.name)};
}
async function mergeAllTemplates(){
  if(!selectedTemplates.length){setMergeStatus('先にテンプレートファイルを選択してください。');return}
  const no=els.mergeRecordSelect.value;
  const row=getRowByNo(no);
  if(!row){setMergeStatus('差し込み対象Noを選択してください。');return}
  try{
    let ok=0;
    const logs=[];
    for(const file of selectedTemplates){
      try{
        const result=await mergeSingleTemplate(file,row);
        ok++;
        logs.push(`${result.type}: ${result.name}`);
      }catch(err){
        console.error(err);
        logs.push(`失敗: ${file.name}`);
      }
    }
    setMergeStatus(`No.${no} のデータで ${ok}/${selectedTemplates.length} 件を出力しました。 ${logs.join(' / ')}`);
  }catch(err){
    console.error(err);
    setMergeStatus(`一括差し込みに失敗しました: ${err?.message||'テンプレート形式を確認してください。'}`);
  }
}

// 一括差し込み出力（ZIP）— 全ファイルをZIPにまとめてダウンロード
async function mergeAllTemplatesZip(){
  if(!selectedTemplates.length){setMergeStatus('先にテンプレートファイルを選択してください。');return}
  const no=els.mergeRecordSelect.value;
  const row=getRowByNo(no);
  if(!row){setMergeStatus('差し込み対象Noを選択してください。');return}
  setMergeStatus('ZIP作成中...');
  const mimeMap={docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
  try{
    const jszip=new JSZip();
    let ok=0;
    const logs=[];
    const data=buildTemplateData(row);
    for(const file of selectedTemplates){
      try{
        const arrayBuffer=await file.arrayBuffer();
        const pzip=new PizZip(arrayBuffer);
        const targets=targetXmlPathsForTemplate(pzip,file.name);
        if(!targets.length) throw new Error('差し込み対象XMLが見つかりません');
        targets.forEach(path=>{
          if(pzip.file(path)){
            const xml=pzip.file(path).asText();
            pzip.file(path,replacePlaceholdersInXml(xml,data));
          }
        });
        const ext=(String(file.name).split('.').pop()||'').toLowerCase();
        const blob=pzip.generate({type:'blob',mimeType:mimeMap[ext]||'application/octet-stream'});
        const outName=`No${safeName(row[fullKeys.no]||'')}_${safeName(row[fullKeys.title]||'template')}_${safeName(file.name)}`;
        jszip.file(outName,blob);
        ok++;
        logs.push(`${templateKind(file.name)}: ${file.name}`);
      }catch(err){
        console.error(err);
        logs.push(`失敗: ${file.name}`);
      }
    }
    if(ok===0){setMergeStatus('出力できたファイルがありませんでした。');return}
    const zipBlob=await jszip.generateAsync({type:'blob'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(zipBlob);
    const dateStr=String(row[fullKeys.date]||'').replace(/[月日年\s]/g,'').slice(0,6)||'output';
    a.download=`No${no}_${dateStr}_merged.zip`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    setMergeStatus(`No.${no} のデータで ${ok}件をZIP出力しました。 ${logs.join(' / ')}`);
  }catch(err){
    console.error(err);
    setMergeStatus(`ZIP出力に失敗しました: ${err?.message||''}`);
  }
}
window.mergeAllTemplatesZip=mergeAllTemplatesZip;

// テンプレート選択をクリア
function clearTemplateFiles(){
  selectedTemplates=[];
  els.templateFiles.value='';
  els.templateFilesName.value='ファイル未選択';
  renderTemplateList();
  setMergeState();
  setMergeStatus('テンプレート選択をクリアしました。');
}
window.clearTemplateFiles=clearTemplateFiles;

// PRE_MEETING 自動入力 — START_1 の 30 分前
function autoFillPreMeeting(){
  const startVal=document.getElementById('fStart').value;
  if(!startVal) return;
  const [h,m]=startVal.split(':').map(Number);
  const total=(h*60+m-30+1440)%1440; // 30分前、マイナス対策
  const hh=String(Math.floor(total/60)).padStart(2,'0');
  const mm=String(total%60).padStart(2,'0');
  document.getElementById('fPreMeeting').value=`${hh}:${mm}`;
}
window.autoFillPreMeeting=autoFillPreMeeting;

function createNewDatabase(){
  currentHeaders=[...DEFAULT_HEADERS];
  rawRows=[];
  dataRows=[];
  selectedRow=null;
  els.recordSelect.value='';
  stagedRow=null;
  lastSaveMode='';
  currentHeaders = ensureAdditionalHeaders(currentHeaders);
  fields.no.value='1';
  fields.cohost.value=COHOST_OPTION_NONE;
  syncCohostFields();
  resetScheduleChecks();
  els.recordSelect.innerHTML='<option value="">Noを選択して表示</option>';
  els.recordSelect.disabled=true;
  els.prefillBtn.disabled=true;
  els.deleteEntryBtn.disabled=true;
  els.loadSelectedBtn.disabled=true;
  els.appendBtn.disabled=false;
  els.openConfirmBtn.disabled=false;
  els.miniDbState.textContent='新規DB作成済み';
  els.miniDbText.textContent='空マスターを初期化しました。1件目から登録できます。';
  renderTable();
  setNextNo();
  renderStats();
  recalcDraft();
  renderAlerts();
  renderTodayCommand();
  renderExceptionQueue();
  renderMergeOptions();
  updateTrainingProgressFromRows(rawRows);  // ★ 追加
  setStatus('空のマスターCSVを新規作成しました。');
}

function loadCsv(e){
  const file=e.target.files?.[0];
  if(!file){
    els.csvFileName.value='ファイル未選択';
    setStatus('CSVが未選択です。');
    return;
  }

  els.csvFileName.value=file.name;

  Papa.parse(file,{
    header:true,
    skipEmptyLines:false,
    encoding:'UTF-8',
    complete:({data,meta})=>{
  currentHeaders = ensureAdditionalHeaders(
    meta?.fields?.length ? meta.fields : [...DEFAULT_HEADERS]
  );
  rawRows = Array.isArray(data) ? compactRawRows(data.map(function(r,i){var nr=normalizeRowShape(r);if(nr._order===undefined)nr._order=(Number(nr[fullKeys.no]||0)||(i+1))*1000;return nr})):[];
      dataRows=buildDisplayRowsFromRaw(rawRows);
      selectedRow = null;
      els.recordSelect.value = '';
      els.appendBtn.disabled=false;
      els.openConfirmBtn.disabled=false;
      els.prefillBtn.disabled=dataRows.length===0;
      els.deleteEntryBtn.disabled=dataRows.length===0;
      els.loadSelectedBtn.disabled=dataRows.length===0;
      els.recordSelect.disabled=dataRows.length===0;
      renderRecordOptions();
      setNextNo();
      if(rawRows.length){
        const first=rawRows[0];
        Object.entries({senderOrg:'senderOrg',senderName:'senderName',senderSig:'senderSignature'}).forEach(([k,id])=>{
          const v=String(first[fullKeys[k]]||'').trim();
          if(v)document.getElementById(id).value=v;
        });
      }
      if(dataRows.length) prefillFromLast();
      else{
        fields.no.value='1';
        fields.cohost.value=COHOST_OPTION_NONE;
        syncCohostFields();
        resetScheduleChecks();
      }
      renderTable();
renderStats();
recalcDraft();
renderAlerts();
      renderTodayCommand();
      renderExceptionQueue();
      updateTrainingProgressFromRows(rawRows); 
      els.miniDbState.textContent='CSV読込済';
      els.miniDbText.textContent=dataRows.length?`${dataRows.length}件のCSVを読込済み`:'CSVに有効データがありません';
      renderMergeOptions();
      setStatus(dataRows.length?`CSVを読み込みました。${dataRows.length}件です。`:'CSVを読み込みましたが有効行はありません。');
      setTimeout(()=>scrollAndOpen('todayCommandSection'),100);
e.target.value='';
    }
  });
}

function ensureHeader(h){if(!currentHeaders.includes(h))currentHeaders.push(h)}
function ensureCheckHeaders(){[fullKeys.checkK1,fullKeys.checkHp,fullKeys.checkK2,fullKeys.checkK3].forEach(ensureHeader)}
function ensureAdditionalHeaders(headers){
  const extraHeaders = [
    fullKeys.lectureStart, fullKeys.qaDeadline, fullKeys.qaTime, fullKeys.preMeeting,
    fullKeys.deadline3, fullKeys.cost, fullKeys.dataDeadline, fullKeys.date2, fullKeys.subject2,
    fullKeys.name, fullKeys.cohost3, fullKeys.head1, fullKeys.closing1,
    fullKeys.checkK1, fullKeys.checkHp, fullKeys.checkK2, fullKeys.checkK3,
    fullKeys.senderOrg, fullKeys.senderName, fullKeys.senderSig,
    fullKeys.task01, fullKeys.task02, fullKeys.task03, fullKeys.task04, fullKeys.task04a,
    fullKeys.task05,fullKeys.task06, fullKeys.task07, fullKeys.task08, fullKeys.task09, 
    fullKeys.task10,fullKeys.task11, fullKeys.task12, fullKeys.task13, fullKeys.task14, 
    fullKeys.task15,fullKeys.task16, fullKeys.task17, fullKeys.task18, fullKeys.task19, 
    fullKeys.task20,fullKeys.task21, fullKeys.task22, fullKeys.task23, fullKeys.task24, 
    fullKeys.task25,fullKeys.task26, fullKeys.task27, fullKeys.task28, fullKeys.task29, 
    fullKeys.task30,fullKeys.task31, fullKeys.task32, fullKeys.task33,
    'STATUS_K1','STATUS_HP','STATUS_K2','STATUS_K3',
    'DONEAT_K1','DONEAT_HP','DONEAT_K2','DONEAT_K3',
    'UPDATEDAT_K1','UPDATEDAT_HP','UPDATEDAT_K2','UPDATEDAT_K3',
    'HISTORY_K1','HISTORY_HP','HISTORY_K2','HISTORY_K3'
  ];

  const set = new Set((headers || []).map(h => String(h || '').trim()).filter(Boolean));
  extraHeaders.forEach(h => set.add(h));
  return Array.from(set);
}

function normalizeRowShape(row){
  const out={};
  const trimmedRow={};
  Object.keys(row||{}).forEach(k=>{trimmedRow[k.trim()]=row[k]});
  currentHeaders.forEach(h=>out[h]=trimmedRow[h]??row?.[h]??'');
  if(row.__docId)out.__docId=row.__docId;
  if(row._order!==undefined)out._order=row._order;
  return out
}
function isMeaningfulRow(row){return currentHeaders.some(h=>String(row?.[h]??'').trim()!=='')}
function compactRawRows(rows){return rows.filter(r=>isMeaningfulRow(r))}
function buildDisplayRowsFromRaw(rows){
  return compactRawRows(rows)
    .filter(r=>/^\d+$/.test(String(r[fullKeys.no]||'').trim()))
    .sort((a,b)=>Number(a._order||Number(a[fullKeys.no]||0)*1000)-Number(b._order||Number(b[fullKeys.no]||0)*1000))
    .filter((r,i,arr)=>arr.findIndex(x=>String(x[fullKeys.no]).trim()===String(r[fullKeys.no]).trim())===i)
}
function setNextNo(){
  const next=dataRows.reduce((m,r)=>Math.max(m,Number(r[fullKeys.no]||0)),0)+1;
  if(!/^\d+$/.test(String(fields.no.value||'').trim())||Number(String(fields.no.value||'').trim())<1)fields.no.value=String(next);
  els.miniNext.textContent=`No.${next}`;
  els.sumNext.textContent=next;
  els.sumNextTop.textContent=next;
  return next;
}
function resetScheduleChecks(){
  els.ckK1.checked=false;
  els.ckHp.checked=false;
  els.ckK2.checked=false;
  els.ckK3.checked=false;
  const TASK_IDS=['01','02','03','04','04a','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
  for(const id of TASK_IDS){const el=document.getElementById('ck_task'+id);if(el)el.checked=false;}
  updateTaskProgress();
}

// 研修会全体の進捗バーを更新（Master Tableの進捗100%のみを終了とカウント）
function updateTrainingProgressFromRows() {
  const total = dataRows.length;
  const done = dataRows.filter(r => {
    const doneCount = [fullKeys.checkK1, fullKeys.checkHp, fullKeys.checkK2, fullKeys.checkK3].filter(k => isCheckedValue(r[k])).length;
    return Math.round(doneCount / 4 * 100) === 100;
  }).length;
  const remain = total - done;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  const totalEl = document.getElementById('trainingTotalCount');
  const doneEl = document.getElementById('trainingDoneCount');
  const remainEl = document.getElementById('trainingRemainCount');
  const pctEl = document.getElementById('trainingProgressPct');
  const barEl = document.getElementById('trainingProgressBar');

  if (totalEl) totalEl.textContent = String(total);
  if (doneEl) doneEl.textContent = String(done);
  if (remainEl) remainEl.textContent = String(remain);
  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';
}
  
function applyScheduleChecksFromRow(row){
  els.ckK1.checked = isCheckedValue(row?.[fullKeys.checkK1]) || String(row?.['STATUS_K1'] || '').trim().toUpperCase() === 'DONE';
  els.ckHp.checked = isCheckedValue(row?.[fullKeys.checkHp]) || String(row?.['STATUS_HP'] || '').trim().toUpperCase() === 'DONE';
  els.ckK2.checked = isCheckedValue(row?.[fullKeys.checkK2]) || String(row?.['STATUS_K2'] || '').trim().toUpperCase() === 'DONE';
  els.ckK3.checked = isCheckedValue(row?.[fullKeys.checkK3]) || String(row?.['STATUS_K3'] || '').trim().toUpperCase() === 'DONE';
  const TASK_IDS=['01','02','03','04','04a','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
  for(const id of TASK_IDS){const el=document.getElementById('ck_task'+id);if(el)el.checked=isCheckedValue(row?.[fullKeys['task'+id]]);}
  updateTaskProgress();
}
function isCheckedValue(v){
  const s=String(v??'').trim().toLowerCase();
  return ['1','true','yes','y','on','checked','済','済み','done'].includes(s);
}
function boolToCsv(v){return v?'1':'0'}

function prefillFromLast(){
  const last=dataRows[dataRows.length-1];
  if(!last)return;
  fields.no.value=String(Number(last[fullKeys.no]||0)+1);
  fields.year.value=(last[fullKeys.year]||'2026年').replace(/\s+/g,'');
  fields.name.value=last[fullKeys.name]||'';
  fields.lectureStart.value=normTime(last[fullKeys.lectureStart])||normTime(last[fullKeys.start])||'17:30';
  fields.start.value=normTime(last[fullKeys.start])||'17:30';
  fields.end.value=normTime(last[fullKeys.end])||'19:00';
  fields.preMeeting.value=normTime(last[fullKeys.preMeeting])||'';
  fields.qaDeadline.value=normTime(last[fullKeys.qaDeadline])||'';
  fields.qaTime.value=last[fullKeys.qaTime]||'';
  fields.subject.value=last[fullKeys.subject]||'研究者';
  fields.site.value=last[fullKeys.site]||'Web会議室';
  const cohostValue=String(last[fullKeys.cohost]||'').trim()===COHOST_OPTION_TEAM?COHOST_OPTION_TEAM:COHOST_OPTION_NONE;
  fields.cohost.value=cohostValue;
  syncCohostFields();
  if(cohostValue!==COHOST_OPTION_TEAM){fields.cohost3.value=''}
  fields.zoomId.value=last[fullKeys.zoomId]||'';
  fields.passcode.value=last[fullKeys.passcode]||'';
  fields.zoomUrl.value=last[fullKeys.zoomUrl]||'https://zoom.us/';
  fields.hpUrl.value=last[fullKeys.hpUrl]||'';
  fields.cost.value=last[fullKeys.cost]||'';
  fields.purpose.value=last[fullKeys.purpose]||'本研修会では、臨床研究に必要な実務の基本をわかりやすく学びます。';
  fields.intro1.value=last[fullKeys.intro1]||'本日は臨床研究研修会にご参加いただきありがとうございます。';
  fields.intro2.value=last[fullKeys.intro2]||'本研修会では、臨床研究を進めるうえで必要となる基本事項と実務上のポイントを共有します。';
  fields.intro3.value=last[fullKeys.intro3]||'本日の講師は、臨床研究支援に関する実務経験を有する専門家です。';
  resetScheduleChecks();
  recalcDraft();
}

function handleSelectRecord(){
  const no=els.recordSelect.value;
  selectedRow=dataRows.find(r=>String(r[fullKeys.no]||'').trim()===String(no||'').trim())||null;
  if(selectedRow)setStatus(`No.${selectedRow[fullKeys.no]} を選択しました。`);
}

function loadSelectedIntoForm(){
  if(!selectedRow){setStatus('先に表示したい No を選択してください。');return}
  fields.no.value=selectedRow[fullKeys.no]||'';
  fields.year.value=selectedRow[fullKeys.year]||'';
  fields.date.value=toIsoDateFromShortDate(selectedRow[fullKeys.date], fields.year.value);
  fields.day.value=selectedRow[fullKeys.day]||'';
  fields.date2.value=selectedRow[fullKeys.date2]||'';
  fields.name.value=selectedRow[fullKeys.name]||'';
  fields.title.value=selectedRow[fullKeys.title]||'';
  fields.speaker.value=selectedRow[fullKeys.speaker]||'';
  fields.lectureStart.value=normTime(selectedRow[fullKeys.lectureStart])||'';
  fields.start.value=normTime(selectedRow[fullKeys.start])||'';
  fields.end.value=normTime(selectedRow[fullKeys.end])||'';
  fields.preMeeting.value=normTime(selectedRow[fullKeys.preMeeting])||'';
  fields.qaDeadline.value=normTime(selectedRow[fullKeys.qaDeadline])||'';
  fields.qaTime.value=selectedRow[fullKeys.qaTime]||'';
  fields.roomOpen.value=normTime(selectedRow[fullKeys.roomOpen])||'';
  fields.duration.value=selectedRow[fullKeys.duration]||'';
  fields.deadline1.value=selectedRow[fullKeys.deadline1]||'';
  fields.deadline2.value=normTime(selectedRow[fullKeys.deadline2])||selectedRow[fullKeys.deadline2]||'';
  fields.deadline3.value=selectedRow[fullKeys.deadline3]||'';
  fields.dataDeadline.value=selectedRow[fullKeys.dataDeadline]||'';
  fields.cost.value=selectedRow[fullKeys.cost]||'';
  fields.subject.value=selectedRow[fullKeys.subject]||'研究者';
  fields.subject2.value=selectedRow[fullKeys.subject2]||'';
  fields.site.value=selectedRow[fullKeys.site]||'Web会議室';
  fields.cohost.value=String(selectedRow[fullKeys.cohost]||'').trim()===COHOST_OPTION_TEAM?COHOST_OPTION_TEAM:COHOST_OPTION_NONE;
  syncCohostFields();
  if(String(selectedRow[fullKeys.cohost]||'').trim()!==COHOST_OPTION_TEAM){fields.cohost3.value=''}
  fields.zoomId.value=selectedRow[fullKeys.zoomId]||'';
  fields.passcode.value=selectedRow[fullKeys.passcode]||'';
  fields.zoomUrl.value=selectedRow[fullKeys.zoomUrl]||'';
  fields.hpUrl.value=selectedRow[fullKeys.hpUrl]||'';
  fields.purpose.value=selectedRow[fullKeys.purpose]||'';
  fields.intro1.value=selectedRow[fullKeys.intro1]||'';
  fields.intro2.value=selectedRow[fullKeys.intro2]||'';
  fields.intro3.value=selectedRow[fullKeys.intro3]||'';
  document.getElementById('senderOrg').value=selectedRow[fullKeys.senderOrg]||'';
  document.getElementById('senderName').value=selectedRow[fullKeys.senderName]||'';
  document.getElementById('senderSignature').value=selectedRow[fullKeys.senderSig]||'';
  applyScheduleChecksFromRow(selectedRow);
  recalcDraft();
  els.deleteEntryBtn.disabled=false;
  setStatus(`No.${selectedRow[fullKeys.no]} を入力欄へ反映しました。保存すると同じNoを上書きします。`);
}

function recalcDraft(){
  fields.day.value=weekdayJa(fields.date.value);
  calcDerivedFields();
  const base=fields.date.value?new Date(fields.date.value+'T00:00:00'):null;
  const auto=calcAutoDates(base);
  els.dK1.textContent=fmtDate(auto.k1);
  els.dK2.textContent=fmtDate(auto.k2);
  els.dHp.textContent=fmtDate(auto.hp);
  els.dK3.textContent=fmtDate(auto.k3);
  renderConfirm(validateDraft());
  renderResult();
  renderStats();
}

function calcDerivedFields(){
  const start=fields.start.value,end=fields.end.value,date=fields.date.value;
  const lectureStart=fields.lectureStart.value||'';
  const preMeeting=fields.preMeeting.value||'';
  const qaDeadline=fields.qaDeadline.value||'';
  const qaTime=fields.qaTime.value||'';
  const roomOpen=start?shiftTime(start,-5):'';
  const duration=(start&&end)?String(diffMin(start,end)):'';
  const deadline2=start?shiftTime(start,-60):'';
  const deadline1=date?formatDeadline1(date):'';
  const deadline3=date?formatMonthDayWeek(nextBusinessDate(addDays(new Date(date+'T00:00:00'),1))):'';
  const dataDeadline=date?formatMonthDayWeek(addDays(new Date(date+'T00:00:00'),-7)):'';
  const date2=date?formatDate2(date):'';
  const subject2=subjectDetail(fields.subject.value);
  syncCohostFields();

  fields.roomOpen.value=roomOpen;
  fields.duration.value=duration&&Number(duration)>=0?duration:'';
  fields.deadline1.value=deadline1;
  fields.deadline2.value=deadline2;
  fields.deadline3.value=deadline3;
  fields.dataDeadline.value=dataDeadline;
  fields.date2.value=date2;
  fields.subject2.value=subject2;

  els.dLectureStart.textContent=lectureStart||'-';
  els.dPreMeeting.textContent=preMeeting||'-';
  els.dQaDeadline.textContent=qaDeadline||'-';
  els.dQaTime.textContent=qaTime||'-';
  els.dRoomOpen.textContent=roomOpen||'-';
  els.dDuration.textContent=duration&&Number(duration)>=0?`${duration}分`:'-';
  els.dDeadline1.textContent=deadline1||'-';
  els.dDeadline2.textContent=deadline2||'-';
  els.dDeadline3.textContent=deadline3||'-';
  els.dDataDeadline.textContent=dataDeadline||'-';
  els.dDate2.textContent=date2||'-';
  els.dSubject2.textContent=subject2||'-';
}

function calcAutoDates(base){return{k1:base?addDays(base,-35):null,hp:base?addDays(base,-28):null,k2:base?addDays(base,-7):null,k3:nextBusinessMondayRule(base)}}
function nextBusinessMondayRule(base){if(!base)return null;const nextDay=addDays(base,1);const day=nextDay.getDay();if(day===6)return addDays(base,3);if(day===0)return addDays(base,2);return nextDay}
function nextBusinessDate(date){let d=new Date(date);while(isHolidayOrWeekend(d))d=addDays(d,1);return d}
function isHolidayOrWeekend(d){const day=d.getDay();return day===0||day===6||isJapaneseHoliday(d)}
function isJapaneseHoliday(date){
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
  const fixed=[`1-1`,`2-11`,`2-23`,`4-29`,`5-3`,`5-4`,`5-5`,`8-11`,`11-3`,`11-23`];
  if(fixed.includes(`${m}-${d}`))return true;
  const nthMonday=(month,n)=>{let count=0;for(let i=1;i<=31;i++){const dt=new Date(y,month-1,i);if(dt.getMonth()!==month-1)break;if(dt.getDay()===1){count++;if(count===n)return i}}return null};
  if((m===1&&d===nthMonday(1,2))||(m===7&&d===nthMonday(7,3))||(m===9&&d===nthMonday(9,3))||(m===10&&d===nthMonday(10,2)))return true;
  const vernal=Math.floor(20.8431+0.242194*(y-1980))-Math.floor((y-1980)/4);
  const autumn=Math.floor(23.2488+0.242194*(y-1980))-Math.floor((y-1980)/4);
  if((m===3&&d===vernal)||(m===9&&d===autumn))return true;
  return false;
}
function formatDate2(iso){const [y,m,d]=iso.split('-');return `${Number(m)}/${Number(d)}`}
function formatDate1Short(iso){const [y,m,d]=iso.split('-');return `${Number(m)}月${Number(d)}日`}
function subjectDetail(v){if(v==='研究者')return '（医師・歯科医師等）';if(v==='研究支援者')return '（薬剤師・看護師等）';return ''}

function validateDraft(){
  const warns=[];
  if(!String(fields.no.value||'').trim())warns.push('Noが未入力です');
  if(!/^\d+$/.test(String(fields.no.value||'').trim()))warns.push('Noは整数で入力してください');
  if(!fields.date.value)warns.push('開催日が未入力です');
  if(!fields.title.value.trim())warns.push('タイトルが未入力です');
  if(!fields.speaker.value.trim())warns.push('講師名が未入力です');
  if(!fields.start.value||!fields.end.value)warns.push('開始/終了時間が未入力です');
  if(fields.start.value&&fields.end.value&&diffMin(fields.start.value,fields.end.value)<=0)warns.push('終了時間は開始時間より後にしてください');
  if(fields.zoomUrl.value&&!/^https?:\/\//.test(fields.zoomUrl.value))warns.push('Zoom URL は http/https で始めてください');
  if(fields.hpUrl.value&&!/^https?:\/\//.test(fields.hpUrl.value))warns.push('HP_URL_url_1 は http/https で始めてください');
  if(fields.cost.value&&isNaN(Number(String(fields.cost.value).replace(/,/g,''))))warns.push('謝金_COST は数値で入力してください');
  return warns;
}

function stageDraft(){
  if(!currentHeaders.length){setStatus('先にCSVを読み込むか、新規データベースを作成してください。');return}
  stagedRow=buildRow();
  lastSaveMode=getRawRowIndexByNo(stagedRow[fullKeys.no])>=0?'update':'insert';
  renderConfirm(validateDraft());
  setStatus(lastSaveMode==='update'?`No.${stagedRow[fullKeys.no]} は既存行を上書き保存します。`:`No.${stagedRow[fullKeys.no]} は新規行として追加保存します。`);
}

function buildRow(){
  const base=fields.date.value?new Date(fields.date.value+'T00:00:00'):null;
  const auto=calcAutoDates(base);
  const row={};
  currentHeaders.forEach(h=>row[h]='');
  row[fullKeys.no]=String(fields.no.value||'').trim();
  row[fullKeys.year]=fields.year.value;
  row[fullKeys.date]=formatDate1Short(fields.date.value);
  row[fullKeys.day]=fields.day.value;
  row[fullKeys.lectureStart]=fields.lectureStart.value;
  row[fullKeys.start]=fields.start.value;
  row[fullKeys.end]=fields.end.value;
  row[fullKeys.qaDeadline]=fields.qaDeadline.value;
  row[fullKeys.qaTime]=fields.qaTime.value;
  row[fullKeys.preMeeting]=fields.preMeeting.value;
  row[fullKeys.roomOpen]=fields.roomOpen.value;
  row[fullKeys.duration]=fields.duration.value;
  row[fullKeys.deadline1]=fields.deadline1.value;
  row[fullKeys.deadline2]=fields.deadline2.value;
  row[fullKeys.deadline3]=fields.deadline3.value;
  row[fullKeys.title]=fields.title.value;
  row[fullKeys.speaker]=fields.speaker.value;
  row[fullKeys.subject]=fields.subject.value;
  row[fullKeys.subject2]=fields.subject2.value;
  row[fullKeys.site]=fields.site.value;
  row[fullKeys.cohost]=fields.cohost.value||COHOST_OPTION_NONE;
  row[fullKeys.cohost3]=String(fields.cohost.value||'').trim()===COHOST_OPTION_TEAM?COHOST3_TEXT_TEAM:'';
  row[fullKeys.head1]=getHead1ValueByCohost(fields.cohost.value);
  row[fullKeys.closing1]=getClosingTextBySubject(fields.subject.value);
  row[fullKeys.k1]=fmtMonthDay(auto.k1);
  row[fullKeys.k2]=fmtMonthDay(auto.k2);
  row[fullKeys.k3]=fmtMonthDay(auto.k3);
  row[fullKeys.hp]=fmtMonthDay(auto.hp);
  row[fullKeys.cost]=String(fields.cost.value||'').trim();
  row[fullKeys.purpose]=fields.purpose.value;
  row[fullKeys.date2]=fields.date2.value;
  row[fullKeys.name]=fields.name.value;
  row[fullKeys.zoomId]=fields.zoomId.value;
  row[fullKeys.zoomUrl]=fields.zoomUrl.value;
  row[fullKeys.hpUrl]=fields.hpUrl.value;
  row[fullKeys.passcode]=fields.passcode.value;
  row[fullKeys.intro1]=fields.intro1.value;
  row[fullKeys.intro2]=fields.intro2.value;
  row[fullKeys.intro3]=fields.intro3.value;
  row[fullKeys.dataDeadline]=fields.dataDeadline.value;
  row[fullKeys.senderOrg]=(document.getElementById('senderOrg')||{value:''}).value;
  row[fullKeys.senderName]=(document.getElementById('senderName')||{value:''}).value;
  row[fullKeys.senderSig]=(document.getElementById('senderSignature')||{value:''}).value;
  row[fullKeys.checkK1]=boolToCsv(els.ckK1.checked);
  row[fullKeys.checkHp]=boolToCsv(els.ckHp.checked);
  row[fullKeys.checkK2]=boolToCsv(els.ckK2.checked);
  row[fullKeys.checkK3]=boolToCsv(els.ckK3.checked);
  row['STATUS_K1'] = els.ckK1.checked ? 'DONE' : '';
  row['STATUS_HP'] = els.ckHp.checked ? 'DONE' : '';
  row['STATUS_K2'] = els.ckK2.checked ? 'DONE' : '';
  row['STATUS_K3'] = els.ckK3.checked ? 'DONE' : '';
  const TASK_IDS=['01','02','03','04','04a','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
  for(const id of TASK_IDS){row[fullKeys['task'+id]]=boolToCsv(document.getElementById('ck_task'+id)?.checked||false);}
  return row;
}

function commitDraft(){
  if(!currentHeaders.length){setStatus('先にCSVを読み込むか、新規データベースを作成してください。');return}
  const warns=validateDraft();
  if(warns.length){renderConfirm(warns);setStatus(`保存前に修正が必要です: ${warns.join(' / ')}`);return}
  stagedRow=buildRow();
  const no=String(stagedRow[fullKeys.no]||'').trim();
  const rawIndex=getRawRowIndexByNo(no);
  if(rawIndex>=0){var nrUp=normalizeRowShape(stagedRow);if(nrUp._order===undefined)nrUp._order=rawRows[rawIndex]._order||0;rawRows[rawIndex]=nrUp;lastSaveMode='update'}
  else{var nrNew=normalizeRowShape(stagedRow);if(nrNew._order===undefined)nrNew._order=(rawRows.reduce(function(m,r){return Math.max(m,Number(r._order||0))},0)||0)+1000;rawRows=compactRawRows(rawRows);rawRows.push(nrNew);lastSaveMode='insert'}
  rawRows=compactRawRows(rawRows);
  dataRows=buildDisplayRowsFromRaw(rawRows);
  selectedRow=dataRows.find(r=>String(r[fullKeys.no]||'').trim()===no)||null;
  renderRecordOptions();
  renderTable();
  setNextNo();
  renderStats();
  renderAlerts();
  renderTodayCommand();
  renderExceptionQueue();
  updateTrainingProgressFromRows(rawRows);
  renderMergeOptions();
  renderConfirm([]);
  renderResult(true);
  els.recordSelect.disabled=!dataRows.length;
  els.loadSelectedBtn.disabled=!dataRows.length;
  els.prefillBtn.disabled=!dataRows.length;
  els.deleteEntryBtn.disabled=!dataRows.length||!fields.no.value;
  if(lastSaveMode==='insert')fields.no.value=String(dataRows.reduce((m,r)=>Math.max(m,Number(r[fullKeys.no]||0)),0)+1);
  setStatus(lastSaveMode==='update'?`No.${no} の元行を上書き保存しました。新しい行は追加していません。`:`No.${no} を新規追加しました。`);
  // Firestoreに保存
  if(typeof FirebaseApp !== 'undefined' && FirebaseApp.getCurrentUser()){
    var rawRow = rawRows[getRawRowIndexByNo(no)];
    if(rawRow){
      FirebaseApp.saveToFirestore(rawRow, currentHeaders).then(function(){
        setStatus(lastSaveMode==='update'
          ? 'No.'+no+' を上書き保存しました（CSV+DB）'
          : 'No.'+no+' を新規追加しました（CSV+DB）');
      }).catch(function(err){
        console.error('Firestore save error:', err);
      });
    }
  }
}

function getRawRowIndexByNo(no){return rawRows.findIndex(r=>String(r?.[fullKeys.no]||'').trim()===String(no||'').trim())}
function renderRecordOptions(){
  const options=['<option value="">Noを選択して表示</option>'].concat(dataRows.map(r=>`<option value="${esc(r[fullKeys.no]||'')}">No.${esc(r[fullKeys.no]||'')} / ${esc(r[fullKeys.date]||'-')} / ${esc(r[fullKeys.title]||'-')}</option>`));
  const cur=els.recordSelect.value;
  els.recordSelect.innerHTML=options.join('');
  if(cur&&dataRows.some(r=>String(r[fullKeys.no]||'')===cur))els.recordSelect.value=cur;
  const qs=document.getElementById('quickRecordSelect');
  if(qs){
    const cur=qs.value;
    qs.innerHTML=options.join('');
    qs.disabled=!dataRows.length;
    if(cur)qs.value=cur;
  }
  renderMergeOptions();
}

function renderTable(){
  const tbody=els.tableList;
  const cnt=document.getElementById('masterCount');
  if(!currentHeaders.length||!dataRows.length){
    tbody.innerHTML='<tr><td colspan="11" style="padding:2rem;text-align:center;color:var(--muted)">CSVを読み込むか、新規データベースを作成してください。</td></tr>';
    if(cnt)cnt.textContent='';
    return;
  }
  if(cnt)cnt.textContent=dataRows.length+'件';
  tbody.innerHTML=dataRows.map(r=>{
    const no=r[fullKeys.no]||'';
    const date=r[fullKeys.date]||'';
    const day=r[fullKeys.day]||'';
    const title=r[fullKeys.title]||'';
    const speaker=r[fullKeys.speaker]||'';
    const subject=r[fullKeys.subject]||'';
    const site=r[fullKeys.site]||'';
    const k1=r[fullKeys.k1]||'';
    const hp=r[fullKeys.hp]||'';
    const k2=r[fullKeys.k2]||'';
    const k3=r[fullKeys.k3]||'';
    const doneCount=[fullKeys.checkK1,fullKeys.checkHp,fullKeys.checkK2,fullKeys.checkK3].filter(k=>isCheckedValue(r[k])).length;
    const pct=Math.round(doneCount/4*100);
    const subjBadge=subject==='研究者'?'<span class="badge bb">研究者</span>'
      :subject==='倫理審査委員会委員'?'<span class="badge be">倫理委員</span>'
      :'<span class="badge bo">研究支援者</span>';
    return `<tr data-no="${esc(no)}" style="cursor:pointer" onclick="clickTableRow('${esc(no)}')">
      <td style="color:var(--muted);font-weight:600">${esc(no)}</td>
      <td style="white-space:nowrap;font-weight:500">${esc(date)}${day?'（'+esc(day)+'）':''}</td>
      <td class="tc2"><div class="tt">${esc(title)}</div><div style="font-size:.65rem;color:var(--muted);margin-top:2px">${esc(speaker)}</div></td>
      <td>${subjBadge}</td>
      <td class="tc-site" style="color:var(--muted);font-size:.68rem">${esc(site)||'—'}</td>
      <td><div class="pw"><div class="pb"><div class="pf ${pct===100?'full':''}" style="width:${pct}%"></div></div><span class="pp">${pct}%</span></div></td>
      <td>${k1?`<div class="dtg">📋${esc(k1)}</div>`:''}</td>
      <td>${hp?`<div class="dtg">🌐${esc(hp)}</div>`:''}</td>
      <td>${k2?`<div class="dtg">📄${esc(k2)}</div>`:''}</td>
      <td>${k3?`<div class="dtg">🏅${esc(k3)}</div>`:''}</td>
      <td style="white-space:nowrap">
        <button class="btn small" style="min-height:26px;padding:0 6px;font-size:.65rem;border-color:var(--primary);color:var(--primary)" onclick="event.stopPropagation();moveRow('${esc(no)}',-1)" title="上に移動">▲</button>
        <button class="btn small" style="min-height:26px;padding:0 6px;font-size:.65rem;border-color:var(--primary);color:var(--primary)" onclick="event.stopPropagation();moveRow('${esc(no)}',1)" title="下に移動">▼</button>
        <button class="btn small" style="min-height:26px;padding:0 8px;font-size:.65rem;border-color:var(--danger);color:var(--danger)" onclick="event.stopPropagation();deleteRecord('${esc(no)}')">削除</button>
      </td>
    </tr>`;
  }).join('');
}

function deleteRecord(no){
  if(!no||!confirm(`No.${no} を削除してもよろしいですか？\nこの操作は元に戻せません。`))return;
  const rawIdx=rawRows.findIndex(r=>String(r?.[fullKeys.no]||'').trim()===String(no).trim());
  if(rawIdx<0){setStatus(`No.${no} が見つかりませんでした。`);return}
  const deletedDocId=rawRows[rawIdx].__docId;
  rawRows.splice(rawIdx,1);
  rawRows=compactRawRows(rawRows);
  dataRows=buildDisplayRowsFromRaw(rawRows);
  selectedRow=null;
  renderRecordOptions();
  renderTable();
  setNextNo();
  renderStats();
  renderAlerts();
  renderTodayCommand();
  renderExceptionQueue();
  updateTrainingProgressFromRows(rawRows);
  renderMergeOptions();
  if(typeof FirebaseApp!=='undefined'&&FirebaseApp.getCurrentUser()&&deletedDocId){
    FirebaseApp.deleteFromFirestore(deletedDocId).catch(function(err){console.error('Firestore delete error:',err);});
  }
  if(!dataRows.length){
    Object.keys(fields).forEach(k=>{if(fields[k]&&typeof fields[k].value!=='undefined'&&k!=='subject'&&k!=='site'&&k!=='cohost')fields[k].value=''});
    fields.subject.value='研究者';fields.site.value='Web会議室';fields.cohost.value=COHOST_OPTION_NONE;
    syncCohostFields();resetScheduleChecks();
  }
  setStatus(`No.${no} を削除しました。`);
}
window.deleteRecord=deleteRecord;
function moveRow(no,dir){
  if(!no||dir===0)return;
  var idx=dataRows.findIndex(function(r){return String(r[fullKeys.no]||'').trim()===String(no).trim()});
  if(idx<0)return;
  var targetIdx=idx+dir;
  if(targetIdx<0||targetIdx>=dataRows.length)return;
  var curRow=dataRows[idx],tgtRow=dataRows[targetIdx];
  var curOrder=Number(curRow._order||0),tgtOrder=Number(tgtRow._order||0);
  curRow._order=tgtOrder;tgtRow._order=curOrder;
  rawRows=compactRawRows(rawRows);
  dataRows=buildDisplayRowsFromRaw(rawRows);
  selectedRow=dataRows.find(function(r){return r===curRow})||null;
  renderTable();
  renderRecordOptions();
  renderMergeOptions();
  if(typeof FirebaseApp!=='undefined'&&FirebaseApp.getCurrentUser()){
    [curRow,tgtRow].forEach(function(r){
      if(r.__docId)FirebaseApp.saveToFirestore(r,currentHeaders).catch(function(err){console.error('Firestore save error:',err);});
    });
  }
  setStatus('No.'+no+' を移動しました。');
}
window.moveRow=moveRow;
function clickTableRow(no){
  if(typeof selectRecordByNo==='function')selectRecordByNo(no);
  if(els.loadSelectedBtn)els.loadSelectedBtn.click();
  var sec=document.getElementById('entryConsoleSection');
  if(sec)sec.scrollIntoView({behavior:'smooth',block:'start'});
}
window.clickTableRow=clickTableRow;
function parseMonthDayText(v, yearText){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})/);
  const y=String(yearText||'').match(/(\d{4})/);
  return m&&y?new Date(`${y[1]}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}T00:00:00`):null;
}
function parseAlertDateByEvent(rawValue, eventDateRaw, yearText){
  const raw=String(rawValue||'').trim();
  if(!raw) return null;

  const eventDate=parseShortJapaneseDate(eventDateRaw, yearText);
  if(!eventDate) return null;

  let target=null;

  if(/\d{1,2}\/\d{1,2}/.test(raw) || /\d{1,2}月\d{1,2}日/.test(raw)){
    target=parseMonthDayText(
      raw.replace(/（.*?）/g,'').replace(/\(.*?\)/g,'').replace('月','/').replace('日',''),
      yearText
    );
  }else{
    return null;
  }

  if(!target) return null;

  if(target > eventDate){
    target.setFullYear(target.getFullYear()-1);
  }
  return target;
}
function daysBetween(a,b){
  const x=new Date(a.getFullYear(),a.getMonth(),a.getDate());
  const y=new Date(b.getFullYear(),b.getMonth(),b.getDate());
  return Math.round((y-x)/86400000);
}
function collectDeadlineAlerts(){
  const today=new Date();
  const baseToday=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const items=[];

  dataRows.forEach(r=>{
    const year=r[fullKeys.year]||fields.year.value||'';
    const title=r[fullKeys.title]||'無題';
    const no=r[fullKeys.no]||'-';
    const eventDateRaw=r[fullKeys.date];

    // label→csvKey マッピング
    const labelToCsvKey={'起案1':'checkK1','起案2':'checkK2','起案3':'checkK3','院外締切':'checkK1','資料締切':'checkK2','配布資料DL締切':'checkK2'};

    const pushItem=(label,dateObj,raw)=>{
      if(!dateObj) return;
      const diff=daysBetween(baseToday,dateObj);
      if(diff<0||diff>7) return;
      items.push({
        no,
        title,
        label,
        raw:raw||fmtDate(dateObj),
        diff,
        csvKey:labelToCsvKey[label]||'checkK1'
      });
    };

    pushItem('起案1', parseAlertDateByEvent(r[fullKeys.k1], eventDateRaw, year), r[fullKeys.k1]);
    pushItem('起案2', parseAlertDateByEvent(r[fullKeys.k2], eventDateRaw, year), r[fullKeys.k2]);
    pushItem('起案3', parseAlertDateByEvent(r[fullKeys.k3], eventDateRaw, year), r[fullKeys.k3]);
    pushItem('院外締切', parseAlertDateByEvent(String(r[fullKeys.deadline1]||'').replace(/\s*\d{1,2}:\d{2}.*/, ''), eventDateRaw, year), r[fullKeys.deadline1]);
    pushItem('資料締切', parseAlertDateByEvent(r[fullKeys.dataDeadline], eventDateRaw, year), r[fullKeys.dataDeadline]);
    pushItem('配布資料DL締切', parseAlertDateByEvent(r[fullKeys.deadline3], eventDateRaw, year), r[fullKeys.deadline3]);
  });

  items.sort((a,b)=>a.diff-b.diff||Number(a.no)-Number(b.no));
  return items;
}
function renderAlerts(){
  if(!currentHeaders.length){
    els.alertList.innerHTML = `
      <div class="alert-item">
        <div><span class="alert-tag">WAIT</span></div>
        <div><strong>未読み込み</strong><p>CSVを読み込んでください</p></div>
        <div class="mono">No data</div>
      </div>
    `;
    renderTodayCommand();
    renderExceptionQueue();
    return;
  }

  const alerts = collectDeadlineAlerts();

  if(!alerts.length){
    els.alertList.innerHTML = `
      <div class="alert-item">
        <div><span class="alert-tag">CLEAR</span></div>
        <div><strong>期限アラートなし</strong><p>7日以内の対象はありません</p></div>
        <div class="mono">Stable</div>
      </div>
    `;
  } else {
    els.alertList.innerHTML = alerts.map((a,i)=>{
      const aid = `alert-item-${i}`;
      const tag = a.diff <= 0 ? 'TODAY' : a.diff === 1 ? 'TOMORROW' : `${a.diff}D`;

      const row = dataRows.find(r => String(r[fullKeys.no] || '').trim() === String(a.no || '').trim());
      const checkHeader = fullKeys[a.csvKey] || fullKeys.checkK1;
      const isDone = row ? isCheckedValue(row[checkHeader]) : false;
      const doneClass = isDone ? ' done' : '';
      const checkedAttr = isDone ? ' checked' : '';
      const bodyStyle = '';
      const metaStyle = '';
      const clickAttr = isDone ? ` onclick="alertToggleExpand('${aid}')" title="クリックで展開/折りたたみ"` : '';

      return `
        <div class="alert-item${doneClass}" id="${aid}" data-no="${esc(a.no)}" data-csvkey="${esc(a.csvKey || 'checkK1')}"${clickAttr}>
          <div class="alert-item-tag-wrap">
            <input type="checkbox" class="alert-check"${checkedAttr}
              onclick="event.stopPropagation();alertCheckDone('${aid}',this.checked)" title="完了">
            <span class="alert-tag">${tag}</span>
          </div>
          <div class="alert-body"${bodyStyle}>
            <strong>No.${esc(a.no)} ${esc(a.title)}</strong>
            <p>${esc(a.label)} : ${esc(a.raw || '-')}</p>
          </div>
          <div class="alert-meta mono"${metaStyle}>Task alert</div>
        </div>
      `;
    }).join('');
  }

  renderTodayCommand();
  renderExceptionQueue();
}

function updateAnnualGauge(done,total,yearCount,soon,draftCount){
  const circumference=578;
  const ratio=total?Math.max(0,Math.min(1,done/total)):0;
  const offset=circumference-(circumference*ratio);
  if(els.annualGauge) els.annualGauge.style.strokeDashoffset=String(offset);
  if(els.annualGaugeText) els.annualGaugeText.textContent=`${Math.round(ratio*100)}%`;
  if(els.annualGaugeSub) els.annualGaugeSub.textContent=`${done} / ${total} Completed`;
  if(els.paramYearCount) els.paramYearCount.textContent=String(yearCount);
  if(els.paramDoneCount) els.paramDoneCount.textContent=String(done);
  if(els.paramSoonCount) els.paramSoonCount.textContent=String(soon);
  if(els.paramDraftCount) els.paramDraftCount.textContent=String(draftCount);
}

function renderStats(){
  const total = dataRows.length;

  const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const fiscalStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
const fiscalStart = new Date(fiscalStartYear, 3, 1);   // 4/1
const fiscalEnd = new Date(fiscalStartYear + 1, 2, 31); // 翌年3/31

const yearCount = dataRows.filter(r => {
  const rowDate = parseShortJapaneseDate(r[fullKeys.date], r[fullKeys.year]);
  if(!rowDate) return false;
  return rowDate >= fiscalStart && rowDate <= fiscalEnd;
}).length;

  const today = new Date();
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const soon = dataRows.filter(r=>{
    const d = parseShortJapaneseDate(r[fullKeys.date], r[fullKeys.year]);
    if(!d) return false;
    const diff = (d - today0) / 86400000;
    return diff >= 0 && diff <= 30;
  }).length;

  const done = dataRows.filter(r=>{
    const d = parseShortJapaneseDate(r[fullKeys.date], r[fullKeys.year]);
    return d && d < today0;
  }).length;

  const next = dataRows.reduce((m,r)=>Math.max(m, Number(r[fullKeys.no] || 0)), 0) + 1;
  const draftCount = stagedRow ? 1 : 0;

  els.sumAll.textContent = total;
  els.sumYear.textContent = yearCount;
  els.sumSoon.textContent = `${soon}件`;
  els.sumDone.textContent = `${done}件`;
  els.sumDraft.textContent = `${draftCount}件`;
  els.sumSubject.textContent = fields.subject.value || '-';
  els.miniYearCount.textContent = String(yearCount);
  els.miniNext.textContent = `No.${next}`;
  els.sumNext.textContent = String(next);
  els.sumAllTop.textContent = String(total);
  els.sumYearTop.textContent = String(yearCount);
  els.sumNextTop.textContent = String(next);

  const ratio = total ? Math.round((done / total) * 100) : 0;
  els.roadmapLabel.textContent = `${done} / ${total}`;
  els.roadmapBar.style.width = `${ratio}%`;

  updateAnnualGauge(done, total, yearCount, soon, draftCount);
  // mailRecordSelect を常に同期
  renderMailRecordOptions();
}

function renderConfirm(warns){
  if(!currentHeaders.length){
    if(els.confirmCount) els.confirmCount.textContent='0件';
    if(els.confirmWarn) els.confirmWarn.textContent='0件';
    if(els.confirmState) els.confirmState.textContent='待機';
    if(els.checkList) els.checkList.innerHTML='<div class="list-row"><div><strong>次回研修会</strong><p>CSVを読み込むか、新規データベースを作成すると確認内容が表示されます。</p></div><div><span class="status s3">待機</span></div></div>';
    return;
  }
  const row=stagedRow||buildRow();
  const saveMode=getRawRowIndexByNo(row[fullKeys.no])>=0?'update':'insert';
  const checks=[
    row[fullKeys.checkK1]==='1'?'起案1':'',
    row[fullKeys.checkHp]==='1'?'HP':'',
    row[fullKeys.checkK2]==='1'?'起案2':'',
    row[fullKeys.checkK3]==='1'?'起案3':''
  ].filter(Boolean).join(' / ');
  if(els.confirmCount) els.confirmCount.textContent='1件';
  if(els.confirmWarn) els.confirmWarn.textContent=warns.length;
  if(els.confirmState) els.confirmState.textContent=warns.length?'要確認':(saveMode==='update'?'上書き保存':'新規追加');
  if(els.checkList) els.checkList.innerHTML=`<div class="list-row"><div><strong>${saveMode==='update'?'既存行を上書き保存':'新規行を追加保存'}</strong><p>No.${esc(row[fullKeys.no])} / ${esc(row[fullKeys.date]||'-')} / ${esc(row[fullKeys.title]||'-')} / ${esc(row[fullKeys.name]||'-')}</p></div><div><span class="status ${warns.length?'s3':'s2'}">${warns.length?'確認':(saveMode==='update'?'上書き':'追加')}</span></div></div><div class="list-row"><div><strong>自動計算項目</strong><p>START_TIME ${esc(row[fullKeys.lectureStart]||'-')} / QA_DADLINE ${esc(row[fullKeys.qaDeadline]||'-')} / QA_TIME ${esc(row[fullKeys.qaTime]||'-')} / PRE_MEETING ${esc(row[fullKeys.preMeeting]||'-')}</p></div><div><span class="status s2">反映済み</span></div></div><div class="list-row"><div><strong>起案チェック状態</strong><p>${esc(checks||'未チェック')}</p></div><div><span class="status s2">保持対象</span></div></div>${warns.map(w=>`<div class="list-row"><div><strong>確認事項</strong><p>${esc(w)}</p></div><div><span class="status s4">保留</span></div></div>`).join('')}`;
}

function renderResult(done=false){
  if(!currentHeaders.length){
    if(els.resultDone) els.resultDone.textContent='0件';
    if(els.resultHold) els.resultHold.textContent='0件';
    if(els.resultZip) els.resultZip.textContent='0式';
    if(els.folderView) els.folderView.innerHTML='<div class="list-row"><div><strong>更新CSV</strong><p>CSVを読み込むか、新規データベースを作成すると出力できます。</p></div><div><span class="status s3">待機</span></div></div>';
    return;
  }
  if(els.resultDone) els.resultDone.textContent=done?'1件':'0件';
  if(els.resultHold) els.resultHold.textContent=done?'0件':String(validateDraft().length);
  if(els.resultZip) els.resultZip.textContent='1式';
  const name=`${fields.date.value||'clinical-master'}_${safeName(fields.title.value||'updated')}.csv`;
  if(els.folderView) els.folderView.innerHTML=`<div class="list-row"><div><strong>${esc(name)}</strong><p>${done?(lastSaveMode==='update'?'同じNoの元行を上書きしたCSVです。':'新規追加したCSVです。'):'現在のマスターCSVをダウンロードできます。'}</p></div><button class="btn small primary" id="inlineDownloadBtn">ダウンロード</button></div>`;
  const inlineBtn=document.getElementById('inlineDownloadBtn');
  if(inlineBtn)inlineBtn.addEventListener('click',downloadCsv);
}

function downloadCsv(){
  if(!currentHeaders.length){setStatus('ダウンロード対象のマスターがありません。');return}
  // rawRowsはチェック時点で即時書き込み済み→そのまま CSV 出力
  rawRows=compactRawRows(rawRows);
  // 開催日_DATE_1（"6月2日" 形式）を parseShortJapaneseDate で Date に変換して昇順ソート
  const sorted = [...rawRows].sort((a, b) => {
    const yearA = String(a[fullKeys.year] ?? '');
    const yearB = String(b[fullKeys.year] ?? '');
    const da = parseShortJapaneseDate(a[fullKeys.date], yearA);
    const db = parseShortJapaneseDate(b[fullKeys.date], yearB);
    // 日付が解釈できない行は最後尾に
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return da.getTime() - db.getTime();
  });
  const csv=Papa.unparse({fields:currentHeaders,data:sorted.map(row=>currentHeaders.map(h=>row[h]??''))});
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  const url=URL.createObjectURL(blob);
  a.href=url;
  a.download=`${fields.date.value||'clinical-master'}_${safeName(fields.title.value||'updated')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function setStatus(msg){els.statusBox.textContent=msg}
function weekdayJa(iso){return iso?['日','月','火','水','木','金','土'][new Date(iso+'T00:00:00').getDay()]:''}
function addDays(d,days){const x=new Date(d);x.setDate(x.getDate()+days);return x}
function fmtDate(d){return d?`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`:'-'}
function fmtMonthDay(d){return d?`${d.getMonth()+1}/${d.getDate()}`:''}
function formatMonthDayWeek(d){if(!d)return'';const w=['日','月','火','水','木','金','土'][d.getDay()];return `${d.getMonth()+1}月${d.getDate()}日（${w}）`}
function parseShortJapaneseDate(v,yearText){
  const m=String(v||'').match(/(\d{1,2})月\s*(\d{1,2})日|^(\d{1,2})\/(\d{1,2})$/);
  const y=String(yearText||'').match(/(\d{4})/);
  if(!m||!y)return null;
  const mm=m[1]||m[3],dd=m[2]||m[4];
  return new Date(`${y[1]}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}T00:00:00`);
}
function toIsoDateFromShortDate(v,yearText){
  const d=parseShortJapaneseDate(v,yearText);
  return d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';
}
function diffMin(a,b){const [ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number);return (bh*60+bm)-(ah*60+am)}
function shiftTime(hhmm,diff){
  const mins=timeToMinutes(hhmm);
  if(mins==null)return'';
  const shifted=mins+diff;
  const normalized=((shifted%1440)+1440)%1440;
  return minutesToTime(normalized);
}
function timeToMinutes(hhmm){const m=String(hhmm||'').match(/^(\d{2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):null}
function minutesToTime(mins){const h=Math.floor(mins/60),m=mins%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}
function formatDeadline1(isoDate){
  const base=new Date(isoDate+'T00:00:00');
  base.setDate(base.getDate()-8);
  const week=['日','月','火','水','木','金','土'][base.getDay()];
  return `${base.getMonth()+1}月${base.getDate()}日（${week}）12:00`;
}
function normTime(v){const m=String(v||'').match(/(\d{1,2}):(\d{2})/);return m?`${m[1].padStart(2,'0')}:${m[2]}`:''}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeName(s){return String(s).replace(/[\\/:*?"<>|\s]+/g,'-')}

syncCohostFields();
recalcDraft();
renderTemplateList();

// ── AI Brushup （司会進行テキスト生成） ──
function buildMcPrompt(inputText) {
  return `あなたは臨床研究研修会の司会者です。
以下の講師情報をもとに、研修会の司会進行テキストを作成してください。

「出力形式」以下のテンプレートの「」内を講師情報から読み取って埋め、完成文を出力してください。
文末に引用先を表示しない
演題名の「」以外は「」は削除

＜開始アナウンス＞
定刻となりましたので、2026年度　静岡がんセンター臨床研究研修会「演題名」を開始いたします。
本日は、お忙しい中、ご参加まことにありがとうございます。

今回の研修会は、「研究者・研究支援者・倫理審査委員会委員のうち情報にあるもの1つのみを記載」を対象とした内容となっております。
本講演では、「講師所属・ただし静岡がんセンター所属の場合は所属の記載を省略」「講師役職と氏名」（「講師氏名のふりがな」）先生より、「目的文の内容を自然な話し言葉に変換し、語尾が『についてご解説いただきます。』で終るよう文章全体を一文に整える。です・ます調で100文字以内」
なお、本日は最後に質疑応答の時間を設けており、講師にご質問のある方は「研修終了時刻から20分前の時刻をXX時XX分の形式で記載」までにQ&A機能でご質問をお願いいたします。

＜講師紹介＞
「静岡がんセンター所属の講師の場合はこのブロック全体を省略する」
「静岡がんセンター以外の所属の場合のみ以下を出力する」
本日の講師「講師の姓」先生のご略歴をご紹介いたします。
「講師の姓」先生は、「略歴を以下のルールで300文字以内にまとめる。
・学歴→職歴→現職→委員会活動→論文・著書の順で記載する
・敗称は～されました・～務められ・～現在に至るに統一する
・西暦と和暦が混在している場合は西暦に統一する
・同一機関の連続した職歴はできるだけ１文にまとめる
・論文は代表的なものを1～2件のみ記載する」
・講師紹介は、文章の流れを意識して、視聴者が聴き取りやすいように、適宜、接続詞を入れる
それでは「講師の姓」先生、どうぞよろしくお願いいたします。

【条件】
講師が静岡がんセンター所属の場合：所属の記載を省略し、講師紹介ブロックを丸ごと省略する
講師が静岡がんセンター以外の所属の場合：所属を記載し、講師紹介ブロックを出力する
「今回の研修は」の後の対象の記載は、情報にある研究者・研究支援者・倫理審査委員会委員のうち、1つのみ記載、（薬剤師、看護師等）や（医師、歯科医師等）も記載しない
固有名詞・年号・役職名・論文タイトルは正確に保持する
研修終了時刻の20分前を計算してXX時XX分の形式で記載する
西暦と和暦が混在している場合は西暦に統一する
読み上げに適した自然な日本語にする
テンプレートの構造を必ず守る
出力は完成文のみとし、余分な説明は不要

《講師情報》
${inputText}`;
}

async function runAiBrushup(){
  const gasUrl   = 'https://script.google.com/macros/s/AKfycbwFGWXonRPSDqhToxurlrxmvb0oMydOdM18_2Jy5aQWDXP60o6bKjkjYYfu741dgkqB/exec';
  const inputText= document.getElementById('aiBrushupInput').value.trim();
  const btn      = document.getElementById('aiBrushupBtn');
  const copyBtn  = document.getElementById('aiBrushupCopyBtn');
  const statusBox= document.getElementById('aiBrushupStatus');
  const resultWrap= document.getElementById('aiBrushupResultWrap');
  const resultArea= document.getElementById('aiBrushupResult');

  const showErr = msg => {
    statusBox.style.display='';
    statusBox.style.color='var(--danger)';
    statusBox.textContent='⚠ ' + msg;
  };

  if(!inputText){ showErr('講師情報を入力してください。'); return; }

  btn.disabled = true;
  copyBtn.disabled = true;
  resultWrap.style.display = 'none';
  statusBox.style.display = '';
  statusBox.style.color = 'var(--muted)';
  statusBox.textContent = '⏳ Gemini AIが司会進行テキストを生成中です...';

  const prompt = buildMcPrompt(inputText);

  try{
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, topP: 0.9, maxOutputTokens: 4096 }
      })
    });

    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      throw new Error(err.error?.message || 'APIエラー ' + res.status);
    }

    const data = await res.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if(!output) throw new Error('レスポンスが空です。');

    resultArea.value = output;
    resultWrap.style.display = 'block';
    copyBtn.disabled = false;
    statusBox.style.color = 'var(--success)';
    statusBox.textContent = '✓ 司会進行テキストの生成が完了しました。';
  } catch(e){
    statusBox.style.color = 'var(--danger)';
    statusBox.textContent = '⚠ エラー：' + e.message;
  } finally{
    btn.disabled = false;
  }
}

/* ── Background Code Canvas ── */
window.addEventListener('load', function(){
  const canvas = document.getElementById('bgCodeCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const RAW_LINES = document.documentElement.outerHTML
    .split('\n')
    .map(function(l){ return l.trim(); })
    .filter(function(l){ return l.length > 4 && l.length < 120; });

  const FONT_SIZE = 11;
  const FONT = FONT_SIZE + "px 'Share Tech Mono','Courier New',monospace";
  const COL_W = 360;
  const SPEED_MIN = 0.20;
  const SPEED_MAX = 0.60;
  const COLORS = [
    'rgba(30,200,100,',
    'rgba(0,180,220,',
    'rgba(180,100,255,',
    'rgba(255,140,0,',
  ];

  var cols = [];
  var nodeCache = null;
  var nodeW = 0, nodeH = 0;
  var raf = null;

  function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    nodeCache = null;
  }

  function pickLines(n){
    var arr = [];
    for(var i=0;i<n;i++)
      arr.push(RAW_LINES[Math.floor(Math.random()*RAW_LINES.length)]);
    return arr;
  }

  function initCols(){
    resize();
    var n = Math.ceil(canvas.width / COL_W) + 1;
    cols = [];
    for(var i=0;i<n;i++){
      var lc = Math.floor(8 + Math.random()*10);
      cols.push({
        x: i * COL_W,
        y: -Math.random() * canvas.height,
        speed: SPEED_MIN + Math.random()*(SPEED_MAX-SPEED_MIN),
        color: COLORS[i % COLORS.length],
        lineCount: lc,
        lines: pickLines(lc)
      });
    }
  }

  function getNodes(){
    if(nodeCache && nodeW===canvas.width && nodeH===canvas.height) return nodeCache;
    var GS=40; nodeW=canvas.width; nodeH=canvas.height; nodeCache=[];
    for(var x=0;x<nodeW;x+=GS)
      for(var y=0;y<nodeH;y+=GS)
        if(Math.random()<0.18) nodeCache.push({x:x,y:y});
    return nodeCache;
  }

  function drawGrid(){
    var GS=40;
    ctx.strokeStyle='rgba(0,180,100,0.05)';
    ctx.lineWidth=0.5;
    for(var x=0;x<canvas.width;x+=GS){
      ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();
    }
    for(var y=0;y<canvas.height;y+=GS){
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();
    }
    var nodes=getNodes();
    ctx.fillStyle='rgba(0,220,120,0.14)';
    for(var i=0;i<nodes.length;i++){
      ctx.beginPath();ctx.arc(nodes[i].x,nodes[i].y,1.4,0,Math.PI*2);ctx.fill();
    }
  }

  function drawFrame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid();
    ctx.font=FONT;
    ctx.textBaseline='top';
    var LH=FONT_SIZE+3;
    for(var ci=0;ci<cols.length;ci++){
      var col=cols[ci];
      for(var li=0;li<col.lines.length;li++){
        var fy=col.y+li*LH;
        if(fy<-LH||fy>canvas.height) continue;
        var ratio=1-li/col.lineCount;
        var alpha=(0.05+ratio*0.25).toFixed(3);
        ctx.fillStyle=col.color+alpha+')';
        ctx.fillText(col.lines[li],col.x,fy);
      }
      col.y+=col.speed;
      if(col.y>canvas.height+LH*2){
        col.y=-(col.lineCount*LH)-Math.random()*200;
        col.lines=pickLines(col.lineCount);
        col.speed=SPEED_MIN+Math.random()*(SPEED_MAX-SPEED_MIN);
      }
    }
  }

  function loop(){ raf=requestAnimationFrame(loop); drawFrame(); }

  initCols();
  loop();

  var resizeTimer;
  window.addEventListener('resize',function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      cancelAnimationFrame(raf);
      initCols();
      loop();
    },200);
  });
});

/* ── Nixie Clock ── */
(function(){
  const DOW_JA = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    const now = new Date();
    const yEl  = document.getElementById('nixieYear');
    const moEl = document.getElementById('nixieMonth');
    const dEl  = document.getElementById('nixieDay');
    const hEl  = document.getElementById('nixieHour');
    const miEl = document.getElementById('nixieMin');
    const sEl  = document.getElementById('nixieSec');
    const dwEl = document.getElementById('nixieDow');
    if(!yEl) return;
    yEl.textContent  = now.getFullYear();
    moEl.textContent = pad(now.getMonth()+1);
    dEl.textContent  = pad(now.getDate());
    hEl.textContent  = pad(now.getHours());
    miEl.textContent = pad(now.getMinutes());
    sEl.textContent  = pad(now.getSeconds());
    dwEl.textContent = DOW_JA[now.getDay()];
  }
  tick();
  setInterval(tick, 1000);
})();

function toggleTaskBody(){
  const body = document.getElementById('taskBody');
  const btn  = document.getElementById('taskToggleBtn');
  const lbl  = document.getElementById('taskToggleLabel');
  const isOpen = !body.classList.contains('collapsed');
  if(isOpen){
    body.classList.add('collapsed');
    btn.classList.remove('open');
    lbl.textContent = '開く';
  } else {
    body.classList.remove('collapsed');
    btn.classList.add('open');
    lbl.textContent = '閉じる';
  }
}

function copyAiBrushupResult(){
  const resultArea = document.getElementById('aiBrushupResult');
  if(!resultArea.value) return;
  navigator.clipboard.writeText(resultArea.value).then(()=>{
    const btn = document.getElementById('aiBrushupCopyBtn');
    const orig = btn.textContent;
    btn.textContent = 'コピー完了';
    setTimeout(()=>{ btn.textContent = orig; }, 1800);
  });
}
window.runAiBrushup = runAiBrushup;
window.copyAiBrushupResult = copyAiBrushupResult;

function clearAiBrushup(){
  document.getElementById('aiBrushupInput').value = '';
  document.getElementById('aiBrushupResult').value = '';
  const resultWrap = document.getElementById('aiBrushupResultWrap');
  if(resultWrap) resultWrap.style.display = 'none';
  const status = document.getElementById('aiBrushupStatus');
  if(status){ status.style.display = 'none'; status.textContent = ''; }
  const copyBtn = document.getElementById('aiBrushupCopyBtn');
  if(copyBtn) copyBtn.disabled = true;
}
window.clearAiBrushup = clearAiBrushup;

// ============================================================
// 予備ボタン設定 — ここを直接編集するだけでURL・ラベルを変更できます
// ============================================================
const SPARE_BUTTONS = {
  1: { url: 'http://10.6.186.1/cms/maintenance-login.php?loggedout=true&wp_lang=ja', label: 'HP編集' },
  2: { url: 'https://zoom.us/signin#/login', label: 'Zoom' },
  3: { url: 'https://www.scchr.jp/clinicaltrial/cscc_seminar/index.html', label: 'SCC_HP' },
  4: { url: 'https://morikawa001.github.io/seminar/qr_maker.html', label: 'QR_maker' },
  5: { url: 'https://morikawa001.github.io/seminar/SilenceCutPro.html', label: 'SilenceCut' },
};

function sidebarSaveAndDownload(){
  if(!currentHeaders.length){setStatus('先にCSVを読み込むか、新規データベースを作成してください。');return}
  commitDraft();
  setTimeout(downloadCsv,100);
}
window.sidebarSaveAndDownload=sidebarSaveAndDownload;

// 起動時に SPARE_BUTTONS の設定を適用（in-memoryキャッシュ方式）
const _spareBtnCache = {}; // { [num]: {url, label} }
document.addEventListener('DOMContentLoaded', function(){
  [1,2,3,4,5].forEach(function(num){
    const btn = document.getElementById('spareBtn' + num);
    if(!btn) return;
    const cfg = SPARE_BUTTONS[num];
    btn.textContent = cfg.label;
    btn.setAttribute('href', cfg.url);
    _spareBtnCache[num] = {url: cfg.url, label: cfg.label};
  });
});

// ダブルクリックでURL・ラベルを変更（セッション中のみ保持）
function editSpareUrl(num){
  const btn = document.getElementById('spareBtn' + num);
  if(!btn) return;
  const currentUrl   = btn.getAttribute('href');
  const currentLabel = btn.textContent.trim();
  const newUrl = prompt('「ボタン' + num + '」 URLを入力:', currentUrl);
  if(newUrl === null) return;
  const newLabel = prompt('「ボタン' + num + '」 ラベルを入力:', currentLabel);
  if(newLabel === null) return;
  if(newUrl.trim())   { btn.setAttribute('href', newUrl.trim()); if(_spareBtnCache[num]) _spareBtnCache[num].url=newUrl.trim(); }
  if(newLabel.trim()) { btn.textContent = newLabel.trim(); if(_spareBtnCache[num]) _spareBtnCache[num].label=newLabel.trim(); }
}
window.editSpareUrl = editSpareUrl;


// ===== 追加機能 JS =====

// =====================================================
// TODAY COMMAND 判定ロジック
// =====================================================

function calcDaysUntilEvent(row){
  const d=parseShortJapaneseDate(row[fullKeys.date], row[fullKeys.year]);
  if(!d) return null;
  const today=new Date(); const t0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  return Math.round((d-t0)/86400000);
}

function countTasksDone(row){
  let done=0;
  for(let i=1;i<=33;i++){
    const k='task'+String(i).padStart(2,'0');
    if(isCheckedValue(row[fullKeys[k]])) done++;
  }
  return done;
}

function buildTodayCommands(rows){
  const today=new Date(); const t0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const cmds=[];
  rows.forEach(row=>{
    const days=calcDaysUntilEvent(row);
    if(days===null) return;
    const no=row[fullKeys.no]||'?';
    const title=row[fullKeys.title]||'（無題）';
    const speaker=row[fullKeys.speaker]||'';
    const zoomUrl=row[fullKeys.zoomUrl]||'';
    const passcode=row[fullKeys.passcode]||'';
    const zoomId=row[fullKeys.zoomId]||'';
    const intro1=row[fullKeys.intro1]||'';
    const intro2=row[fullKeys.intro2]||'';
    const intro3=row[fullKeys.intro3]||'';
    const taskDone=countTasksDone(row);

    // 開催当日
    if(days===0){
      cmds.push({no, title, urgency:'critical', csvKey:'task21',
  action:'本日開催です。当日準備を確認してください。',reason:`Task完了: ${taskDone}/33`,buttons:[{label:'詳細を見る',href:'#entryConsoleSection',no},{label:'メール作成',recipient:'attendee',purpose:'reminder',no}]});
      if(!zoomUrl||zoomUrl==='https://zoom.us/'){
        cmds.push({no,title,urgency:'critical',csvKey:'checkK3',action:'Zoom URLが未入力です。今すぐ登録してください。',reason:'当日前にZoom URLが必要です',buttons:[{label:'Entry Consoleで補完',href:'#entryConsoleSection',no}]});
      }
    }
    // 1-3日前
    else if(days>0&&days<=3){
      cmds.push({no,title,urgency:'critical',csvKey:'checkK2',action:`開催まで${days}日です。直前リマインドを送信してください。`,reason:`開催日: ${row[fullKeys.date]||'-'}`,buttons:[{label:'詳細を見る',href:'#entryConsoleSection',no},{label:'メール作成(講師)',recipient:'speaker',purpose:'reminder',no},{label:'メール作成(参加者)',recipient:'attendee',purpose:'reminder',no}]});
      if(!zoomUrl||zoomUrl==='https://zoom.us/'){
        cmds.push({no,title,urgency:'critical',csvKey:'checkK2',action:'Zoom URLが未設定です。至急入力してください。',reason:`開催${days}日前`,buttons:[{label:'Entry Consoleで補完',href:'#entryConsoleSection',no}]});
      }
    }
    // 4-7日前
    else if(days>3&&days<=7){
      cmds.push({no,title,urgency:'high',csvKey:'checkK2',action:`開催${days}日前です。起案2・資料の準備を確認してください。`,reason:`開催日: ${row[fullKeys.date]||'-'}`,buttons:[{label:'詳細を見る',href:'#entryConsoleSection',no},{label:'メール作成',recipient:'speaker',purpose:'data_request',no}]});
      if(!zoomUrl||zoomUrl==='https://zoom.us/'){
        cmds.push({no,title,urgency:'high',csvKey:'checkK2',action:'Zoom URLが未設定です。入力してください。',reason:'開催1週間前',buttons:[{label:'Entry Consoleで補完',href:'#entryConsoleSection',no},{label:'Zoom情報メール',recipient:'attendee',purpose:'zoom_info',no}]});
      }
    }
    // 8-14日前
    else if(days>7&&days<=14){
      const hasZoom=zoomUrl&&zoomUrl!=='https://zoom.us/';
      cmds.push({no,title,urgency:'normal',csvKey:'checkHp',action:`開催${days}日前です。参加者への開催案内を確認してください。`,reason:`HP/Zoom設定確認を推奨`,buttons:[{label:'詳細を見る',href:'#entryConsoleSection',no},{label:'メール作成',recipient:'attendee',purpose:'announce',no}]});
    }
    // 15-35日前（準備フェーズ）
    else if(days>14&&days<=35){
      if(!speaker||speaker.trim()===''){
        cmds.push({no,title,urgency:'high',csvKey:'checkK1',action:'講師名が未入力です。登壇依頼を進めてください。',reason:`開催${days}日前`,buttons:[{label:'Entry Consoleで補完',href:'#entryConsoleSection',no},{label:'登壇依頼メール',recipient:'speaker',purpose:'invitation',no}]});
      }
      if(!isCheckedValue(row[fullKeys.checkK1])){
        cmds.push({no,title,urgency:'normal',csvKey:'checkK1',action:`起案1がまだです。開催${days}日前なので起案1を進めてください。`,reason:'起案1は開催35日前が目安',buttons:[{label:'詳細を見る',href:'#entryConsoleSection',no}]});
      }
    }
    // 開催後（事後処理）
    else if(days<0&&days>=-30){
      const postTask25=isCheckedValue(row[fullKeys.task25]);
      const postTask28=isCheckedValue(row[fullKeys.task28]);
      const postTask29=isCheckedValue(row[fullKeys.task29]);
      const postTask33=isCheckedValue(row[fullKeys.task33]);
      if(!postTask25||!postTask28||!postTask29||!postTask33){
        const pending=[];
        if(!postTask25)pending.push('Zoomレポート');
        if(!postTask28)pending.push('起案3(受講証)');
        if(!postTask29)pending.push('講師へお礼');
        if(!postTask33)pending.push('受講証交付');
        const postKey=!postTask29?'task29':!postTask33?'task33':!postTask28?'task28':'task25';
        cmds.push({no,title,urgency:'high',csvKey:postKey,action:`事後処理が残っています: ${pending.join(' / ')}`,reason:`開催から${Math.abs(days)}日経過`,buttons:[{label:'Task Checklist',href:'#taskChecklistPanel',no},{label:'お礼メール',recipient:'speaker',purpose:'thanks',no}]});
      }
    }

    // 共通チェック: 進行表イントロ不備
    if(days>=0&&days<=14){
      if(!intro1.trim()||!intro2.trim()||!intro3.trim()){
        cmds.push({no,title,urgency:'info',csvKey:'checkK2',action:'進行表のイントロ文が不足しています。',reason:`intro1/2/3のいずれかが空`,buttons:[{label:'Entry Consoleで補完',href:'#entryConsoleSection',no}]});
      }
    }
  });

  // 緊急度順ソート
  const order={critical:0,high:1,normal:2,info:3};
  cmds.sort((a,b)=>order[a.urgency]-order[b.urgency]);
  return cmds.slice(0,6); // 最大6件
}

function renderTodayCommand(){
  const el=document.getElementById('todayCommandList');
  if(!el) return;
  const sec=el.closest('.section-collapsible');
  if(sec) sec.classList.add('open');

  if(!currentHeaders.length){
    el.innerHTML=`<div class="tc-empty"><i class="tc-empty-icon">⚡</i>CSVまたはDBを読み込んでください</div>`;
    return;
  }

  const cmds=buildTodayCommands(dataRows);
  if(!cmds.length){
    el.innerHTML=`<div class="tc-empty"><i class="tc-empty-icon">✅</i>今日の指示はありません</div>`;
    return;
  }

  el.innerHTML=cmds.map((cmd,idx)=>{
    const urgClass={
      critical:'critical',
      high:'high',
      normal:'normal',
      info:'info'
    }[cmd.urgency] || 'normal';

    const urgLabel={
      critical:'CRITICAL',
      high:'HIGH',
      normal:'NORMAL',
      info:'INFO'
    }[cmd.urgency] || 'NORMAL';

    const row = dataRows.find(r => String(r[fullKeys.no] || '').trim() === String(cmd.no || '').trim());
    const checkHeader = fullKeys[cmd.csvKey] || fullKeys.checkK1;
    const isDone = row ? isCheckedValue(row[checkHeader]) : false;
    const doneClass = isDone ? ' done' : '';
    const checkedAttr = isDone ? ' checked' : '';
    const hintText = isDone ? '▼ 展開' : '';

    const btns=(cmd.buttons||[]).map(b=>{
      if(b.href){
        const secId = b.href.replace('#','');
        return `<a class="tc-btn" href="${esc(b.href)}" onclick="scrollToSection('${secId}');${b.no ? `selectRecordByNo('${esc(b.no)}');` : ''}return false;">${esc(b.label)}</a>`;
      }
      return `<button class="tc-btn primary" onclick="openMailTemplate('${esc(b.no)}','${esc(b.recipient)}','${esc(b.purpose)}')">${esc(b.label)}</button>`;
    }).join('');

    const cardId=`tc-card-${idx}`;

    return `
      <div class="tc-card urgency-${urgClass}${doneClass}" id="${cardId}" data-no="${esc(cmd.no)}" data-csvkey="${esc(cmd.csvKey || 'checkK1')}">
        <div class="tc-card-head">
          <div class="tc-card-check-row" onclick="tcToggleExpand('${cardId}')">
            <input type="checkbox" class="tc-check" id="chk${cardId}"${checkedAttr}
              onclick="event.stopPropagation();tcCheckDone('${cardId}',this.checked)">
            <span class="tc-no-badge">No.${esc(cmd.no)}</span>
            <span class="tc-urgency-tag ${urgClass}">${urgLabel}</span>
            <span class="tc-title">${esc(cmd.title)}</span>
            <span class="tc-done-label">完了済み</span>
            <span class="tc-expand-hint">${hintText}</span>
          </div>
        </div>
        <div class="tc-action"><i class="tc-action-icon">▴</i>${esc(cmd.action || '')}</div>
        <div class="tc-reason">${esc(cmd.reason || '')}</div>
        <div class="tc-btns">${btns}</div>
      </div>
    `;
  }).join('');
}

// =====================================================
// EXCEPTION QUEUE 判定ロジック
// =====================================================

function buildExceptions(rows){
  const exceptions=[];
  rows.forEach(row=>{
    const no=row[fullKeys.no]||'?';
    const title=row[fullKeys.title]||'（無題）';
    const days=calcDaysUntilEvent(row);

    const push=(sev,label,detail)=>exceptions.push({no,title,sev,label,detail});

    // 必須フィールド欠落
    if(!String(row[fullKeys.title]||'').trim()) push('critical','タイトル未入力','テーマ(標題)_TITLEが空です');
    if(!String(row[fullKeys.speaker]||'').trim()) push('critical','講師未入力','担当講師_SPEAKERが空です');
    if(!String(row[fullKeys.date]||'').trim()) push('critical','開催日未入力','開催日_DATE_1が空です');

    // Zoom関連（開催14日前以内）
    if(days!==null&&days<=14&&days>=0){
      const zoomUrl=String(row[fullKeys.zoomUrl]||'').trim();
      if(!zoomUrl||zoomUrl==='https://zoom.us/') push('critical','Zoom URL未設定','zoom_url_zoom_urlが空または初期値です');
      const passcode=String(row[fullKeys.passcode]||'').trim();
      if(!passcode) push('warning','パスコード未入力','Zoom_パスコード_PASSCODEが空です');
      const zoomId=String(row[fullKeys.zoomId]||'').trim();
      if(!zoomId) push('warning','Zoom ID未入力','Zoom_ID_WEBINER_IDが空です');
    }

    // 進行表イントロ（開催7日前以内）
    if(days!==null&&days<=7&&days>=0){
      if(!String(row[fullKeys.intro1]||'').trim()) push('warning','進行表導入なし','進行表導入_INTRO_1が空です');
      if(!String(row[fullKeys.intro2]||'').trim()) push('warning','趣旨説明なし','進行表研修会趣旨説明_INTRO_2が空です');
      if(!String(row[fullKeys.intro3]||'').trim()) push('warning','講師紹介なし','進行表講師紹介_INTRO_3が空です');
    }

    // 起案関連チェック
    if(days!==null&&days<=-1){ // 開催済
      if(!isCheckedValue(row[fullKeys.checkK3])) push('warning','起案3未完','起案3チェック_CHECK_K3が未チェックです');
      if(!isCheckedValue(row[fullKeys.task29])) push('info','講師へお礼未完','講師へお礼連絡_CHECKが未チェックです');
      if(!isCheckedValue(row[fullKeys.task33])) push('info','受講証交付未完','受講証修了証メール交付_CHECKが未チェックです');
    }
    if(days!==null&&days<=0&&days>=-1){
      if(!isCheckedValue(row[fullKeys.checkK1])) push('warning','起案1未チェック','起案1チェック_CHECK_K1が未チェックです');
    }
  });

  const order={critical:0,warning:1,info:2};
  exceptions.sort((a,b)=>order[a.sev]-order[b.sev]);
  return exceptions;
}

function renderExceptionQueue(){
  const el=document.getElementById('exceptionQueueList');
  if(!el) return;
  if(!currentHeaders.length){
    el.innerHTML='<div class="alert-item"><div><span class="alert-tag">WAIT</span></div><div><strong>例外検出待機中</strong><p>CSVを読み込むか、新規DBを作成すると例外がここに表示されます。</p></div><div class="mono">No data</div></div>';
    return;
  }
  const exceptions=buildExceptions(dataRows);
  if(!exceptions.length){
    el.innerHTML='<div class="alert-item"><div><span class="alert-tag">CLEAR</span></div><div><strong>例外なし</strong><p>検出された不備・例外はありません。</p></div><div class="mono">OK</div></div>';
    return;
  }
  el.innerHTML=exceptions.map(ex=>{
    const tagClass=ex.sev==='critical'?'critical':ex.sev==='warning'?'warning':'info';
    const tagLabel=ex.sev==='critical'?'CRITICAL':ex.sev==='warning'?'WARNING':'INFO';
    return `<div class="eq-item sev-${ex.sev}">
      <div><span class="eq-tag ${tagClass}">${tagLabel}</span><div class="eq-no" style="margin-top:4px">No.${esc(ex.no)}</div></div>
      <div class="eq-item-body"><strong>${esc(ex.label)}</strong><p>${esc(ex.title)} ─ ${esc(ex.detail)}</p></div>
      <div><a class="btn small" href="#entryConsoleSection" onclick="scrollToSection('entryConsoleSection');selectRecordByNo('${esc(ex.no)}');return false;">確認する</a></div>
    </div>`;
  }).join('');
}

// =====================================================
// MAIL TEMPLATE ロジック
// =====================================================

function renderMailRecordOptions(){
  const sel=document.getElementById('mailRecordSelect');
  if(!sel) return;
  sel.innerHTML=['<option value="">Noを選択してください</option>'].concat(
    dataRows.map(r=>`<option value="${esc(r[fullKeys.no]||'')}">No.${esc(r[fullKeys.no]||'')} / ${esc(r[fullKeys.date]||'-')} / ${esc(r[fullKeys.title]||'-')}</option>`)
  ).join('');
}

function openTaskMail(taskId){
  var no=(typeof fields!=='undefined'&&fields.no)?String(fields.no.value||'').trim():document.getElementById('fNo')?.value?.trim()||'';
  if(!no){ alert('先に研修会Noを選択してください。'); return; }
  var map={
    '02':{recipient:'speaker',purpose:'ishi_req'},
    '03':{recipient:'cohost',purpose:'hp_upload_req'},
    '04a':{recipient:'speaker',purpose:'ishi_req'},
    '06':{recipient:'cohost',purpose:'hp_upload_req'},
    '08':{recipient:'cohost',purpose:'hp_done_report'},
    '09':{recipient:'cohost',purpose:'denshi_post_req'},
    '11':{recipient:'cohost',purpose:'denshi_replace_req'},
    '12':{recipient:'speaker',purpose:'honban_reminder_speaker'},
    '13':{recipient:'speaker',purpose:'data_reminder_speaker'},
    '20':{recipient:'speaker',purpose:'honban_reminder_speaker'},
    '22':{recipient:'speaker',purpose:'honban_reminder_speaker'},
    '26':{recipient:'cohost',purpose:'seminar_prep'},
    '31':{recipient:'cohost',purpose:'shakin_proc_req'},
    '32':{recipient:'speaker',purpose:'shakin_transfer'}
  };
  var m=map[taskId];
  if(!m) return;
  openMailTemplate(no,m.recipient,m.purpose);
}
window.openTaskMail=openTaskMail;

function openMailTemplate(no, recipient, purpose){
  const sel=document.getElementById('mailRecordSelect');
  if(sel&&no) sel.value=no;
  const rSel=document.getElementById('mailRecipient');
  if(rSel&&recipient) rSel.value=recipient;
  const pSel=document.getElementById('mailPurpose');
  if(pSel&&purpose) pSel.value=purpose;
  // タブ同期（purposeに対応する.mail-tabをアクティブに）
  if(purpose){
    document.querySelectorAll('.mail-tab').forEach(b=>{
      b.classList.toggle('active', b.dataset.purpose===purpose);
    });
  }
  generateMailTemplate();
  const mailEl=document.getElementById('mailTemplateSection');
  if(mailEl) mailEl.scrollIntoView({behavior:'smooth',block:'start'});
}
window.openMailTemplate=openMailTemplate;

function tcCheckDone(cardId, checked){
  const card=document.getElementById(cardId);
  if(!card) return;

  if(checked){
    card.classList.add('done');
    const hint=card.querySelector('.tc-expand-hint');
    if(hint) hint.textContent='▼ 展開';
  } else {
    card.classList.remove('done');
  }

  const no=card.dataset.no || '';
  const csvKeyName=card.dataset.csvkey || 'checkK1';

  if(no && csvKeyName){
    writeCheckToRaw(no, csvKeyName, checked);
    dataRows = buildDisplayRowsFromRaw(rawRows);
    renderTodayCommand();
    renderExceptionQueue();
    renderAlerts();
    renderTable();
    renderStats();
    updateTrainingProgressFromRows(rawRows);
    showCsvSavedToast();
  }
}
// rawRowsの該当行にCHECK値を書き込む（画面再描画なし）
function writeCheckToRaw(no, csvKeyName, checked){
  if(!no || !csvKeyName){
    console.warn('[CHECK] no or csvKeyName empty', no, csvKeyName);
    return;
  }

  const flagKey = fullKeys[csvKeyName];
  if(!flagKey){
    console.warn('[CHECK] flagKey not found for', csvKeyName);
    return;
  }

  const phaseMap = {
    checkK1: 'K1',
    checkHp: 'HP',
    checkK2: 'K2',
    checkK3: 'K3'
  };
  const phase = phaseMap[csvKeyName] || null;

  ensureHeader(flagKey);
  if(phase){
    ensureHeader(`STATUS_${phase}`);
    ensureHeader(`DONEAT_${phase}`);
    ensureHeader(`UPDATEDAT_${phase}`);
    ensureHeader(`HISTORY_${phase}`);
  }

  const row = rawRows.find(r =>
    String(r[fullKeys.no] || '').trim() === String(no).trim()
  );
  if(!row){
    console.warn('[CHECK] row not found for no=', no);
    return;
  }

  const before = row[flagKey];
  row[flagKey] = boolToCsv(checked);  // ← '1'/'0' を boolToCsv で統一

  // ── phase系（checkK1〜checkK3）のみ追加メタ情報を記録 ──
  if(phase){
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const timestamp =
      `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    row[`STATUS_${phase}`]    = checked ? 'DONE' : 'PENDING';
    row[`UPDATEDAT_${phase}`] = timestamp;

    if(checked){
      row[`DONEAT_${phase}`] = timestamp;
      const prev = String(row[`HISTORY_${phase}`] || '').trim();
      row[`HISTORY_${phase}`] = prev ? `${prev} | DONE:${timestamp}` : `DONE:${timestamp}`;
    } else {
      const prev = String(row[`HISTORY_${phase}`] || '').trim();
      row[`HISTORY_${phase}`] = prev ? `${prev} | UNCHECK:${timestamp}` : `UNCHECK:${timestamp}`;
    }
  }

  console.log('[CHECK] written: No=' + no + ' ' + flagKey + ' ' + before + '→' + row[flagKey]);
}
  
function showCsvSavedToast(){
  let t=document.getElementById('csvUpdateToast');
  if(!t){
    t=document.createElement('div');
    t.id='csvUpdateToast';
    t.style.cssText='position:fixed;bottom:24px;right:24px;background:var(--panel2);border:1px solid var(--cyan);color:var(--fg);padding:10px 16px;border-radius:8px;font-size:0.85rem;z-index:9999;transition:opacity 0.4s;display:flex;align-items:center;gap:12px;box-shadow:0 4px 16px rgba(0,0,0,0.4)';
    document.body.appendChild(t);
  }
  t.innerHTML=`<span style="color:var(--cyan)">✓ チェックを反映しました</span><span style="color:var(--fg);font-size:0.78rem;opacity:0.7">「更新CSVをダウンロード」でファイルに保存</span>`;
  t.style.opacity='1';
  clearTimeout(t._tid);
  t._tid=setTimeout(()=>{t.style.opacity='0';},3000);
}
function tcToggleExpand(cardId){
  const card=document.getElementById(cardId);
  if(!card) return;
  if(!card.classList.contains('done')) return; // 未完了時は無効
  // done状態でクリック→一時展開トグル
  const isExpanded=card.classList.contains('tc-temp-expand');
  card.classList.toggle('tc-temp-expand', !isExpanded);
  const els=card.querySelectorAll('.tc-action,.tc-reason,.tc-btns');
  els.forEach(el=>{
    el.style.display=isExpanded?'':'flex';
    if(el.classList.contains('tc-action')) el.style.display=isExpanded?'none':'flex';
    if(el.classList.contains('tc-reason')) el.style.display=isExpanded?'none':'block';
    if(el.classList.contains('tc-btns'))   el.style.display=isExpanded?'none':'flex';
  });
  const hint=card.querySelector('.tc-expand-hint');
  if(hint) hint.textContent=isExpanded?'▼ 展開':'▲ 折畳む';
}
window.tcCheckDone=tcCheckDone;

function alertCheckDone(aid, checked){
  const item=document.getElementById(aid);
  if(!item) return;

  if(checked){
    item.classList.add('done');
    item.title='クリックで展開/折りたたみ';
    item.onclick=function(e){
      if(e && e.target && e.target.type==='checkbox') return;
      alertToggleExpand(aid);
    };
    const body=item.querySelector('.alert-body');
    const meta=item.querySelector('.alert-meta');
    if(body) body.style.display='none';
    if(meta) meta.style.display='none';
  } else {
    item.classList.remove('done');
    item.onclick=null;
    item.title='';
    const body=item.querySelector('.alert-body');
    const meta=item.querySelector('.alert-meta');
    if(body) body.style.display='';
    if(meta) meta.style.display='';
  }

  const no=item.dataset.no || '';
  const csvKeyName=item.dataset.csvkey || 'checkK1';

  if(no && csvKeyName){
    writeCheckToRaw(no, csvKeyName, checked);
    dataRows = buildDisplayRowsFromRaw(rawRows);
    renderTodayCommand();
    renderExceptionQueue();
    renderAlerts();
    renderTable();
    renderStats();
    showCsvSavedToast();
  }
}
function alertToggleExpand(aid){
  const item=document.getElementById(aid);
  if(!item || !item.classList.contains('done')) return;
  const body=item.querySelector('.alert-body');
  const meta=item.querySelector('.alert-meta');
  const isHidden=body&&body.style.display==='none';
  if(body) body.style.display=isHidden?'':'none';
  if(meta) meta.style.display=isHidden?'':'none';
}
window.alertCheckDone=alertCheckDone;

// Mail Template タブ切替
function mailTabClick(btn){
  document.querySelectorAll('.mail-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const purpose=btn.dataset.purpose;
  const recip=btn.dataset.recip||'speaker';
  const pSel=document.getElementById('mailPurpose');
  const rSel=document.getElementById('mailRecipient');
  if(pSel) pSel.value=purpose;
  if(rSel) rSel.value=recip;
  if(document.getElementById('mailRecordSelect').value) generateMailTemplate();
}
window.mailTabClick=mailTabClick;

// openMailTemplate 拡張ブロックは上記の openMailTemplate 本体に統合済み—不要

window.alertToggleExpand=alertToggleExpand;

window.tcToggleExpand=tcToggleExpand;


function selectRecordByNo(no){
  const sel=document.getElementById('recordSelect');
  if(sel) sel.value=no;
  const row=dataRows.find(r=>String(r[fullKeys.no]||'').trim()===String(no||'').trim())||null;
  if(row){ selectedRow=row; }
}
window.selectRecordByNo=selectRecordByNo;

function generateMailTemplate(){
  const no=document.getElementById('mailRecordSelect').value;
  const recipient=document.getElementById('mailRecipient').value;
  const purpose=document.getElementById('mailPurpose').value;
  const row=dataRows.find(r=>String(r[fullKeys.no]||'').trim()===String(no||'').trim())||null;

  const preview=document.getElementById('mailPreviewWrap');
  const warn=document.getElementById('mailMissingWarn');
  const missingList=document.getElementById('mailMissingList');

  if(!row){
    if(preview) preview.style.display='none';
    if(warn){ warn.style.display='none'; }
    return;
  }

  // 差出人情報をDOMに反映（行データ→DOM）
  if(row[fullKeys.senderOrg]) document.getElementById('senderOrg').value=row[fullKeys.senderOrg];
  if(row[fullKeys.senderName]) document.getElementById('senderName').value=row[fullKeys.senderName];
  if(row[fullKeys.senderSig]) document.getElementById('senderSignature').value=row[fullKeys.senderSig];
  // 差出人情報取得
  const senderOrg=(document.getElementById('senderOrg')||{value:''}).value.trim()||'○○';
  const senderName=(document.getElementById('senderName')||{value:''}).value.trim()||'○○';
  const senderSig=(document.getElementById('senderSignature')||{value:''}).value.trim()||'シグネチャー';

  const sigBlock=`\n研修会担当　${senderName}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊`;

  // フィールド取得ヘルパー
  const fv=k=>String(row[fullKeys[k]]||'').trim();

  // 必須チェック
  const missing=[];
  if(!fv('title')) missing.push('タイトル');
  if(!fv('date')) missing.push('開催日');
  const isZoomNeeded=['denshi_post_req','denshi_replace_req','honban_reminder_speaker'].includes(purpose);
  const zUrl=fv('zoomUrl');
  if(isZoomNeeded&&(!zUrl||zUrl==='https://zoom.us/')) missing.push('Zoom URL');
  if(missing.length){
    if(warn){ warn.style.display=''; missingList.textContent=missing.join('、')+'が不足しています。'; }
  } else {
    if(warn) warn.style.display='none';
  }

  // 変数収集
  const title=fv('title')||'（研修会タイトル）';
  const year=fv('year')||'2026年';
  const yearNum=String(year).match(/(\d{4})/)?.[1]||'2026';
  const dateStr=fv('date')||'（開催日）';
  const day=fv('day')||'（曜）';
  const start=fv('start')||'17:30';
  const end=fv('end')||'19:00';
  const speaker=fv('speaker')||'（講師名）';
  const zoomUrl=fv('zoomUrl')||'（Zoom URL）';
  const zoomId=fv('zoomId')||'（Zoom ID）';
  const passcode=fv('passcode')||'（パスコード）';
  const hpUrl=fv('hpUrl')||'（HP URL）';
  const deadline2=fv('deadline2')||'（当日申込締切時刻）';
  const dataDeadline=fv('dataDeadline')||'（資料提出締切）';
  const date2=fv('date2')||dateStr;
  const head1=`${yearNum}年度　臨床研究研修会`;
  // PRE_MEETING（開始30分前）
  function subtractMin(timeStr, mins){
    const m=timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if(!m) return timeStr;
    let total=parseInt(m[1])*60+parseInt(m[2])-mins;
    if(total<0) total+=1440;
    return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
  }
  const preMeeting=subtractMin(start,30);
  // 講義開始・QA時刻はEntry Consoleに該当フィールドがない場合は計算値を使う
  const lectureStart=fv('lectureStart')||subtractMin(end,50)||start;
  const qaTime=subtractMin(end,15)||end;

  let subj='',body='';

  // ============================================================
  // 講師向け
  // ============================================================
  if(purpose==='ishi_req'){
    // 11: 開催日の5週間前 依頼状送付
    subj=`【静岡がんセンター】臨床研究研修会${dateStr}_ご依頼状提出について`;
    body=`${speaker} 先生\n\n平素より大変お世話になっております。${senderOrg}の${senderName}でございます。ご多忙のところ研修会の準備にご協力くださり、誠にありがとうございます。\n\nさて、ご講演のご依頼状につきまして、当院内の手続きが完了いたしましたので、PDFを添付のうえ送付申し上げます。ご査収のほどよろしくお願いいたします。\n\n当院のホームページにてご講演の案内を公開しましたら、改めてご報告させていただきます。\n\n引き続き、どうぞよろしくお願い申し上げます。${sigBlock}`;
  }
  else if(purpose==='hp_report_speaker'){
    // 3 or 6: HP掲載当日 講師への掲載報告+資料依頼
    subj=`【静岡がんセンター】臨床研究研修会${dateStr}_ご案内開始についてご報告`;
    body=`${speaker} 先生\n\n平素より大変お世話になっております。${senderOrg}　臨床研究研修会担当の${senderName}でございます。お忙しいところ、研修会準備にご協力くださり誠にありがとうございます。\n\n${dateStr}（${day}）開催の研修会のお知らせにつきまして、当センターのホームページにてご講演内容のご案内を開始させていただきましたので、ご連絡させていただきます。ホームページに掲載の研修会のご案内も本メールに添付させていただきました。\n\n静岡がんセンターホームページURL\n${hpUrl}\n\n講義資料について\n${dataDeadline}（講演日1週間前）までに、講演資料のご作成・ご提供をお願い致します。\n\n＜タイトル＞\n${head1}「${title}」\n\n今後とも、ご指導ご鞭撻の程よろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='data_reminder_speaker'){
    // 8: 開催2週間前 講師リマインド（資料提出依頼）
    subj=`【静岡がんセンター】臨床研究研修会 ${dateStr}について`;
    body=`${speaker} 先生\n\n平素より大変お世話になっております。${senderOrg}　研修会担当の${senderName}でございます。お忙しいところ、研修会準備にご協力くださり誠にありがとうございます。\n\n${dateStr}（${day}）に予定されている研修会が近づいておりますので、以下についてお知らせいたします。\n\n【講義資料について】\n${dataDeadline}（講演日1週間前）までに、講演資料のご作成・ご提供をお願い致します。\n\n＜タイトル＞\n${head1}「${title}」\n\n今後とも、ご指導ご鞭撻の程よろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='honban_reminder_speaker'){
    // 10: 開催1週間前 本番前リマインド
    subj=`【静岡がんセンター】臨床研究研修会${dateStr}について`;
    body=`${speaker} 先生\n\n平素より大変お世話になっております。\n${senderOrg}　臨床研究研修会担当の${senderName}でございます。\nお忙しい中、ご講演の準備にご協力いただき、誠にありがとうございます。\n\nご講演予定日が近づいてまいりましたので、改めてご案内申し上げます。\n当日の進行表およびウェビナー操作資料を添付いたしましたので、ご参照いただけますと幸いです。\n\n進行については、以下のスケジュールを予定しております。\n\n＜当日の進行＞\n${preMeeting}〜${start}（終了後、待機）　事前接続（練習セッション）\n${start}〜　司会挨拶\n${lectureStart}〜　講義\n${qaTime}〜　質疑応答\n〜${end}　司会挨拶\n\n＜先生ご招待URL＞\n${zoomUrl}\n\nご多忙のところ、大変恐縮ですが、よろしくお願い申し上げます。${sigBlock}`;
  }
  else if(purpose==='shakin_transfer'){
    // 9: 開催7日以内 謝金振込通知
    subj=`【静岡がんセンター】ご講演謝金の振り込みについて`;
    body=`${speaker} 先生\n\n平素より大変お世話になっております。${senderOrg}の${senderName}でございます。先日はお忙しい中、当院の臨床研究研修会にてご講演くださり誠にありがとうございました。\n\nさて、お謝金につきましては、XX月XX日（X）にご指定の口座へお振込みさせていただく予定でございます。お手すきの際にご確認いただけますと幸いです。\n\nなお、万が一お振込みが確認できない場合には、誠に恐れ入りますがご一報いただけますようお願い申し上げます。\n\n今後とも何卒よろしくお願い申し上げます。${sigBlock}`;
  }

  // ============================================================
  // 関係者向け
  // ============================================================
  else if(purpose==='hp_upload_req'){
    // 1: HP掲載1週間前 予約投稿依頼
    subj=`【研修会】アップロード設定（予約投稿）のお願い`;
    body=`マネジメントセンター○○ 様\n\nいつも大変お世話になっております。${senderOrg}　研修会担当の${senderName}でございます。以下について予約投稿設定をお願いいたします。\n\n＜予約投稿日＞\nXX月XX日（XX）13時〜\n\n＜タイトル＞\n＜研修会＞臨床研究研修会「${title}」${dateStr}（${day}）${start}〜開催のお知らせ\n\n＜研修会ページ＞\n${hpUrl}\n\nよろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='hp_done_report'){
    // 2: HP掲載1週間前 掲載完了報告（関係者）
    subj=`【静岡がんセンター】臨床研究研修会${dateStr}_ご案内開始についてご報告`;
    body=`皆様\n\nお忙しいところ失礼いたします。\n${senderOrg}　研修会担当の${senderName}でございます。\n\n以下の研修会案内がホームページにアップロードされましたので、ご報告させていただきます。\n講師の${speaker}にもご報告させていただきます。\n\n＜研修会＞\n日　時：${year}${dateStr}（${day}）${start}〜${end}\n演　題：「${title}」\n講　師：${speaker}\n\n${hpUrl}\n\nよろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='hp_done_report_day'){
    // 4: HP掲載当日 掲載完了報告（関係者）
    subj=`【研修会】${dateStr}_ご案内開始についてご報告`;
    body=`皆様\n\nお忙しいところ失礼いたします。研修会担当の${senderName}です。\n\n以下の研修会案内がホームページにアップロードされましたので、ご報告させていただきます。講師の${speaker}にもご報告させていただきます。\n\n＜研修会＞\n日　時：${year}${dateStr}（${day}）${start}〜${end}\n演　題：${title}\n講　師：${speaker}\n\n${hpUrl}\n\nよろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='denshi_post_req'){
    // 5: HP掲載当日 電子カルテ掲載依頼
    subj=`【掲載依頼】(${date2}開催)臨床研究研修会開催のお知らせ`;
    body=`情報システム課　御中\n\nお世話になっております。${senderOrg}の${senderName}と申します。お手数をおかけいたしますが、${dateStr}（${day}）まで、電子カルテの重要なお知らせ欄へ、以下のとおり掲載をお願いいたします。臨床研究研修会の開催は、特定臨床研究管理委員会やワーキングに諮っており、幹部の承諾を得ております。\n\n尚、電子カルテへの掲載は、20XX年XX月XX日の朝会にて承諾を得ております。\n\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n\n（標　題）\n（${date2}開催）　臨床研究研修会開催のお知らせ　${start}から\n\n----------------------------------------------------------\n（本文）\n\n日　時：${year}${dateStr}（${day}）${start}〜${end}\n演　題：「${title}」\n講　師：${speaker}\n\n場所：オンライン研修会\n受講方法：当日オンライン受講（ZOOMウェビナー）\n\n添付ファイルのQRコードを読み取るか、以下URLからお申込みください。\n${zoomUrl}\n\n申込み〆切：${dateStr}（${day}）${deadline2}まで\n\n※本講義はオンラインでの聴講になります。\n別添のファイルにつきまして、お知らせへ添付いただきますようお願いいたします。\n\nお忙しいところ大変恐縮ですが、よろしくお願いいたします。\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊`;
    // この用途は件名を本文の冒頭に含めないスタイルのため subj のみ
  }
  else if(purpose==='denshi_replace_req'){
    // 7: 開催1週間前 電子カルテ差替依頼
    subj=`【差替え掲載依頼】(${date2}開催)臨床研究研修会開催のお知らせ`;
    body=`情報システム課　御中\n\nお世話になっております。${senderOrg}の${senderName}と申します。\n\nXX月XX日に掲載をお願いさせていただきました研修会開催のお知らせですが、${dateStr}開催分につきまして、別添のファイルへの差し替えをお願いできますでしょうか。\n\nお手数をおかけいたしますが、${dateStr}（${day}）まで、電子カルテの重要なお知らせ欄へ、以下のとおり掲載をお願いいたします。臨床研究研修会の開催は、特定臨床研究管理委員会やワーキングに諮っており、幹部の承諾を得ております。\n\n尚、電子カルテへの掲載は、20XX年XX月XX日の朝会にて承諾を得ております。\n\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n\n（標　題）\n（${date2}開催間近）　臨床研究研修会開催のお知らせ　${start}から\n\n----------------------------------------------------------\n（本文）\n\n日　時：${year}${dateStr}（${day}）${start}〜${end}\n演　題：「${title}」\n講　師：${speaker}\n\n場所：オンライン研修会\n受講方法：当日オンライン受講（ZOOMウェビナー）\n\n添付ファイルのQRコードを読み取るか、以下URLからお申込みください。\n${zoomUrl}\n\n申込み〆切：${dateStr}（${day}）${deadline2}まで\n\n※本講義はオンラインでの聴講になります。\n別添のファイルにつきまして、お知らせへ添付いただきますようお願いいたします。\n\nお忙しいところ大変恐縮ですが、よろしくお願いいたします。\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊`;
  }
  else if(purpose==='shakin_proc_req'){
    // 12: 開催翌日〜3日 謝金支払い手続き依頼（関係者）
    subj=`【研修会】${dateStr}_謝金支払い手続きについて`;
    body=`○○様\n\nお忙しいところ失礼いたします。研修会担当の${senderName}でございます。下段、研修会の謝金お支払い手続きについて、ご対応いただきたくお願いいたします。\n\n＜研修会＞\n日　時：${year}${dateStr}（${day}）${start}〜${end}\n演　題：「${title}」\n講　師：${speaker}\n\n今後とも、よろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='seminar_prep'){
    // 13: 当日 研修会準備依頼
    subj=`【研修会準備】${dateStr}研修会準備について`;
    body=`皆様\n\nお忙しい中、失礼いたします。研修会担当の${senderName}です。\n\n本日${dateStr}の研修会準備につきまして、下記のとおりご協力をお願い申し上げます。\n\n■ 準備開始　XX:XX頃から\n■ 事前打合せ　14:30\n■ 会場　管理棟4階　XXXXXXX\n\n■ 皆様ご都合がつきましたら、XX:XX頃よりご自席にて、音声および画像のモニタリングにご協力いただけますと幸いです。\n\n何卒よろしくお願いいたします。${sigBlock}`;
  }
  else if(purpose==='jikan_gaizangyo'){
    // 14: 当日 時間外勤務前申請
    subj=`【時間外勤務_前申請】${dateStr}○○`;
    body=`□□様　△△様\n\nお忙しいところ失礼いたします。研修会担当の${senderName}です。\n\n本日の研修会運営について、以下の通り、時間外勤務の前申請をお願いいたします。\n\n【時間外勤務 前申請】\n■ ${dateStr}（${day}）${end}まで\n■ 研修会運営対応のため\n\n何卒よろしくお願いいたします。\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊\n${senderSig}\n＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊`;
  }
  else {
    subj=`【研修会ご連絡】${dateStr} 「${title}」`;
    body=`関係者各位\n\nお世話になっております。${senderOrg}の${senderName}でございます。\n\n${dateStr}（${day}）${start}〜${end}開催の研修会「${title}」についてご連絡いたします。\n\nよろしくお願いいたします。${sigBlock}`;
  }

  const subjectEl=document.getElementById('mailSubjectDisplay');
  const bodyEl=document.getElementById('mailBodyDisplay');
  if(subjectEl) subjectEl.value=subj;
  if(bodyEl){ bodyEl.value=body; bodyEl.removeAttribute('readonly'); }
  if(preview) preview.style.display='';
}

document.addEventListener('DOMContentLoaded',function(){
  // 「クリア」ボタン
  const genBtn=document.getElementById('mailGenerateBtn');
  if(genBtn) genBtn.addEventListener('click',function(){
    const subjectEl=document.getElementById('mailSubjectDisplay');
    const bodyEl=document.getElementById('mailBodyDisplay');
    const preview=document.getElementById('mailPreviewWrap');
    if(subjectEl) subjectEl.value='';
    if(bodyEl) bodyEl.value='';
    if(preview) preview.style.display='none';
  });

  // 件名コピー
  const copySubjectBtn=document.getElementById('mailCopySubjectBtn');
  if(copySubjectBtn) copySubjectBtn.addEventListener('click',function(){
    const t=document.getElementById('mailSubjectDisplay');
    if(t) navigator.clipboard.writeText(t.value||'').then(()=>{
      const orig=copySubjectBtn.textContent; copySubjectBtn.textContent='コピー完了';
      setTimeout(()=>{ copySubjectBtn.textContent=orig; },1600);
    });
  });

  // 件名+本文コピー
  const copyAllBtn=document.getElementById('mailCopyAllBtn');
  if(copyAllBtn) copyAllBtn.addEventListener('click',function(){
    const s=document.getElementById('mailSubjectDisplay');
    const b=document.getElementById('mailBodyDisplay');
    if(s&&b){
      const text=`件名: ${s.value||''}\n\n${b.value}`;
      navigator.clipboard.writeText(text).then(()=>{
        const orig=copyAllBtn.textContent; copyAllBtn.textContent='コピー完了';
        setTimeout(()=>{ copyAllBtn.textContent=orig; },1600);
      });
    }
  });

  // 本文コピー
  const copyBtn2=document.getElementById('mailCopyBtn2');
  if(copyBtn2) copyBtn2.addEventListener('click',function(){
    const b=document.getElementById('mailBodyDisplay');
    if(b) navigator.clipboard.writeText(b.value).then(()=>{
      const orig=copyBtn2.textContent; copyBtn2.textContent='コピー完了';
      setTimeout(()=>{ copyBtn2.textContent=orig; },1600);
    });
  });

  // mailRecordSelect / recipient / purpose 変更時に自動生成
  const mailSel=document.getElementById('mailRecordSelect');
  if(mailSel) mailSel.addEventListener('change',function(){
    if(this.value) generateMailTemplate();
  });
  const recipientSel=document.getElementById('mailRecipient');
  if(recipientSel) recipientSel.addEventListener('change',function(){
    if(document.getElementById('mailRecordSelect').value) generateMailTemplate();
  });
  const purposeSel=document.getElementById('mailPurpose');
  if(purposeSel) purposeSel.addEventListener('change',function(){
    if(document.getElementById('mailRecordSelect').value) generateMailTemplate();
  });
});

// renderAlerts / renderStats: Today Command・ExceptionQueue・mailRecordSelect は各関数本体に統合済み

// ── Firebase Integration ──
function onFirebaseLogin(user){
  if(typeof FirebaseApp === 'undefined') return;
  document.getElementById('loginMessage').style.display = 'none';
  currentHeaders = ensureAdditionalHeaders([...DEFAULT_HEADERS]);
  FirebaseApp.loadFromFirestore(currentHeaders, function(rows){
    rawRows = rows.map(function(r,i){var nr=normalizeRowShape(r);if(nr._order===undefined)nr._order=(Number(nr[fullKeys.no]||0)||(i+1))*1000;return nr;});
    dataRows = buildDisplayRowsFromRaw(rawRows);
    renderRecordOptions();
    renderTable();
    setNextNo();
    renderStats();
    recalcDraft();
    renderAlerts();
    renderTodayCommand();
    renderExceptionQueue();
    updateTrainingProgressFromRows(rawRows);
    renderMergeOptions();
    els.recordSelect.disabled = !dataRows.length;
    els.loadSelectedBtn.disabled = !dataRows.length;
    els.prefillBtn.disabled = !dataRows.length;
    els.deleteEntryBtn.disabled = !dataRows.length;
    els.appendBtn.disabled = false;
    els.openConfirmBtn.disabled = false;
    els.miniDbState.textContent = 'DB接続済';
    els.miniDbText.textContent = dataRows.length ? dataRows.length + '件のデータを読み込みました。' : 'データベースに接続しました。新規登録から追加できます。';
    if(dataRows.length){
      const first=rawRows[0];
      Object.entries({senderOrg:'senderOrg',senderName:'senderName',senderSig:'senderSignature'}).forEach(function(e){
        var v=String(first[fullKeys[e[0]]]||'').trim();
        if(v)document.getElementById(e[1]).value=v;
      });
      prefillFromLast();
    }else{
      fields.no.value = '1';
      fields.cohost.value = COHOST_OPTION_NONE;
      syncCohostFields();
      resetScheduleChecks();
    }
    setStatus(dataRows.length ? dataRows.length + '件のデータをDBから読み込みました。' : 'DBに接続しました。データがありません。');
  });
}
function onFirebaseLogout(){
  rawRows = [];
  dataRows = [];
  selectedRow = null;
  stagedRow = null;
  lastSaveMode = '';
  currentHeaders = [];
  els.recordSelect.innerHTML = '<option value="">--- No Select ---</option>';
  els.recordSelect.disabled = true;
  els.loadSelectedBtn.disabled = true;
  els.prefillBtn.disabled = true;
  els.deleteEntryBtn.disabled = true;
  els.appendBtn.disabled = true;
  els.openConfirmBtn.disabled = true;
  renderTable();
  els.miniDbState.textContent = '未接続';
  els.miniDbText.textContent = 'ログインしてください';
  var loginMsg = document.getElementById('loginMessage');
  if(loginMsg) loginMsg.style.display = 'none';
}

// ログイン済みの場合、onAuthStateChanged が firebase-config.js 読み込み時に
// 発火しても onFirebaseLogin が未定義だったためスキップされる → ここで再チェック
(function(){
  if(typeof FirebaseApp !== 'undefined' && FirebaseApp.getCurrentUser()){
    onFirebaseLogin(FirebaseApp.getCurrentUser());
  }
})();

// ダミーデータ挿入
function loadDummyData(){
  const today=new Date();
  function addD(n){const d=new Date(today);d.setDate(d.getDate()+n);return d;}
  function fmt1(d){return `${d.getMonth()+1}月${d.getDate()}日`;}
  function fmtDeadline1(isoDate){const base=new Date(isoDate+'T00:00:00');base.setDate(base.getDate()-8);const w=['日','月','火','水','木','金','土'][base.getDay()];return `${base.getMonth()+1}月${base.getDate()}日（${w}）12:00`;}
  function toISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  const day5=addD(5); const day14=addD(14); const day45=addD(45); const dayM7=addD(-7);

  const makeRow=(no,dateD,title,speaker,zoomUrl,passcode,zoomId,extraChecks={})=>{
    const iso=toISO(dateD);
    const row={};
    currentHeaders.forEach(h=>row[h]='');
    row[fullKeys.no]=String(no);
    row[fullKeys.year]='2026年';
    row[fullKeys.date]=fmt1(dateD);
    row[fullKeys.day]=['日','月','火','水','木','金','土'][dateD.getDay()];
    row[fullKeys.title]=title;
    row[fullKeys.speaker]=speaker;
    row[fullKeys.start]='17:30'; row[fullKeys.end]='19:00';
    row[fullKeys.lectureStart]='17:30';
    row[fullKeys.zoomUrl]=zoomUrl; row[fullKeys.passcode]=passcode; row[fullKeys.zoomId]=zoomId;
    row[fullKeys.deadline1]=fmtDeadline1(iso);
    row[fullKeys.subject]='研究者'; row[fullKeys.subject2]='（医師・歯科医師等）';
    row[fullKeys.site]='Web会議室'; row[fullKeys.cohost]='なし';
    row[fullKeys.purpose]='本研修会では、臨床研究に必要な実務の基本をわかりやすく学びます。';
    row[fullKeys.intro1]='本日は臨床研究研修会にご参加いただきありがとうございます。';
    row[fullKeys.intro2]='本研修会では、臨床研究を進めるうえで必要となる基本事項と実務上のポイントを共有します。';
    row[fullKeys.intro3]='本日の講師は、臨床研究支援に関する実務経験を有する専門家です。';
    row[fullKeys.date2]=`${dateD.getMonth()+1}/${dateD.getDate()}`;
    row[fullKeys.name]='森川 担当者';
    row[fullKeys.hpUrl]='https://www.scchr.jp/clinicaltrial/cscc_seminar/index.html';
    row[fullKeys.dataDeadline]=fmt1(addD(-7+Math.round((dateD-today)/86400000)));
    Object.assign(row, extraChecks);
    return row;
  };

  const dummy1=makeRow(1,day5,'臨床試験の倫理審査と研究計画書作成実務','田中 研一','','',''); // ZoomURL未設定
  const dummy2=makeRow(2,day14,'臨床研究データ管理実務','佐藤 美咲','https://zoom.us/j/99999999999','12345','999 9999 9999',{[fullKeys.checkK1]:'1',[fullKeys.checkHp]:'1'});
  const dummy3=makeRow(3,dayM7,'研究倫理・インフォームドコンセント','鈴木 倫理','https://zoom.us/j/88888888888','67890','888 8888 8888',{[fullKeys.checkK1]:'1',[fullKeys.checkHp]:'1',[fullKeys.checkK2]:'1',[fullKeys.task25]:'1'}); // 開催済みzoom済み、事後処理一部残
  const dummy4=makeRow(4,day45,'統計解析の基礎と実践（演習付き）','山田 統計子','','',''); // 遠い将来

  currentHeaders = ensureAdditionalHeaders(currentHeaders && currentHeaders.length ? currentHeaders : [...DEFAULT_HEADERS]);
rawRows=[dummy1,dummy2,dummy3,dummy4].map(r=>normalizeRowShape(r));
  dataRows=buildDisplayRowsFromRaw(rawRows);
  renderRecordOptions();
  renderTable();
  setNextNo();
  renderStats();
  renderAlerts();
  renderTodayCommand();
  renderExceptionQueue();
  updateTrainingProgressFromRows(rawRows);
  renderMergeOptions();
  els.appendBtn.disabled=false;
  els.openConfirmBtn.disabled=false;
  els.prefillBtn.disabled=false;
  els.deleteEntryBtn.disabled=false;
  els.loadSelectedBtn.disabled=false;
  els.recordSelect.disabled=false;
  els.miniDbState.textContent='ダミーDB読込済';
  els.miniDbText.textContent='4件のダミーデータを読み込みました。';
  setStatus('ダミーデータを4件読み込みました。Today Command / Exception Queueを確認してください。');
}
window.loadDummyData=loadDummyData;

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href="#topControlPanel"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const target=document.getElementById('topControlPanel');
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      if(history.replaceState){ history.replaceState(null,'','#topControlPanel'); }
    });
  });
});