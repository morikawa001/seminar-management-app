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
    'rgba(40,170,255,',
    'rgba(0,200,235,',
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
    ctx.strokeStyle='rgba(40,150,255,0.05)';
    ctx.lineWidth=0.5;
    for(var x=0;x<canvas.width;x+=GS){
      ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();
    }
    for(var y=0;y<canvas.height;y+=GS){
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();
    }
    var nodes=getNodes();
    ctx.fillStyle='rgba(40,170,255,0.14)';
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
