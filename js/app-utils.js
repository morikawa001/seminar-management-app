function isCheckedValue(v){
  const s=String(v??'').trim().toLowerCase();
  return ['1','true','yes','y','on','checked','済','済み','done'].includes(s);
}
function boolToCsv(v){return v?'1':'0'}
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
function parseCautionDate(raw, yearText){
  const s=String(raw||'').trim();
  if(!s) return null;
  let y=0,mo=0,d=0;
  let m=s.match(/(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})日?/);
  if(m){ y=+m[1]; mo=+m[2]; d=+m[3]; }
  else{
    m=s.match(/(\d{1,2})月\s*(\d{1,2})日/);
    if(m){ mo=+m[1]; d=+m[2]; }
    else{
      m=s.match(/(\d{1,2})\/(\d{1,2})/);
      if(m){ mo=+m[1]; d=+m[2]; }
    }
    const yt=String(yearText||'').match(/(\d{4})/);
    if(mo&&d&&yt) y=+yt[1]+(mo<=3?1:0);
  }
  if(!mo||!d||mo>12||d>31) return null;
  return new Date(y,mo-1,d);
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
