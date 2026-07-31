(function(){
  var canvas = document.getElementById('matrixRain') || document.getElementById('matrixCanvas') || document.getElementById('mc') || document.getElementById('bgCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var fontSize = 14;
  var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var drops = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols = Math.floor(canvas.width / fontSize);
    while (drops.length < cols) drops.push(Math.random() * -50);
    while (drops.length > cols) drops.pop();
  }
  window.addEventListener('resize', resize);
  resize();
  function draw(){
    ctx.fillStyle = 'rgba(2,5,12,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px "Share Tech Mono", monospace';
    for (var i = 0; i < drops.length; i++){
      var c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = 'rgba(56,180,255,0.9)';
      ctx.fillText(c, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(draw);
  } else {
    draw();
  }
})();
