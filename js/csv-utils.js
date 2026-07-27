(function(){
  function parseCSV(raw) {
    var rows = [], cur = '', inQ = false, cells = [];
    for (var i = 0; i < raw.length; i++) {
      var c = raw[i];
      if (c === '"') {
        if (inQ && raw[i+1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ) {
        cells.push(cur); cur = '';
      } else if ((c === '\n' || c === '\r') && !inQ) {
        if (c === '\r' && raw[i+1] === '\n') i++;
        cells.push(cur); cur = '';
        if (cells.some(function(x){ return x !== ''; })) rows.push(cells);
        cells = [];
      } else {
        cur += c;
      }
    }
    if (cur || cells.length) { cells.push(cur); if (cells.some(function(x){ return x !== ''; })) rows.push(cells); }
    return rows;
  }

  function csvToObjects(raw) {
    var rows = parseCSV(raw);
    if (rows.length < 2) return [];
    var headers = rows[0].map(function(h){ return h.replace(/[\r\n]+/g,' ').trim(); });
    return rows.slice(1).map(function(r){
      var o = {};
      headers.forEach(function(h, i){ o[h] = (r[i] || '').trim(); });
      return o;
    });
  }

  function excelSerialToDate(serial){
    if (typeof serial !== 'number') return null;
    return new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
  }

  function excelSerialToDateTime(serial){
    if (serial == null) return '';
    if (typeof serial === 'string'){
      var m = serial.match(/(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (m) return m[1]+'/'+m[2].padStart(2,'0')+'/'+m[3].padStart(2,'0')+' '+m[4].padStart(2,'0')+':'+m[5].padStart(2,'0')+':'+String(m[6]||'00').padStart(2,'0');
      return serial;
    }
    if (typeof serial !== 'number') return '';
    var d = excelSerialToDate(serial);
    if (!d) return '';
    return d.getUTCFullYear()+'/'+String(d.getUTCMonth()+1).padStart(2,'0')+'/'+String(d.getUTCDate()).padStart(2,'0')+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0')+':'+String(d.getUTCSeconds()).padStart(2,'0');
  }

  function normalizeMail(v){ return String(v||'').trim().toLowerCase(); }

  function hhmmssToSec(s){
    if (!s && s !== 0) return null;
    var m = String(s).match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!m) return null;
    return parseInt(m[1],10)*3600 + parseInt(m[2],10)*60 + parseInt(m[3]||'0',10);
  }

  function secToHHMMSS(sec){
    if (sec == null || isNaN(sec)) return '';
    var h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = Math.abs(sec%60);
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function exportCSV(headers, rows, prefix, date){
    var csvRows = [headers.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(',')];
    rows.forEach(function(row){
      csvRows.push(headers.map(function(c){ return '"'+String(row[c]||'').replace(/"/g,'""')+'"'; }).join(','));
    });
    var csv = '\uFEFF' + csvRows.join('\r\n');
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (prefix||'export')+'_'+(date||new Date().toISOString().slice(0,10))+'.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  function toast(msg){
    var t = document.createElement('div');
    t.className='toast'; t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 2800);
  }

  window.SharedCSV = { parseCSV, csvToObjects, excelSerialToDate, excelSerialToDateTime, normalizeMail, hhmmssToSec, secToHHMMSS, exportCSV, toast };
})();
