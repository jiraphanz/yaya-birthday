// Simple confetti + hearts for mobile surprise
const portrait = document.getElementById('portrait');
const photoHearts = document.querySelector('.photo-hearts');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext && canvas.getContext('2d');
let confettiPieces = [];
let portraitClickCount = 0;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function rand(min,max){return Math.random()*(max-min)+min}

function spawnConfetti(count=80){
  confettiPieces = [];
  const colors = ['#ff6b81','#ffd166','#06d6a0','#4d96ff','#c77dff'];
  for(let i=0;i<count;i++){
    confettiPieces.push({
      x:rand(0,canvas.width),
      y:rand(-canvas.height,0),
      w:rand(6,12),
      h:rand(8,16),
      vx:rand(-0.6,0.6),
      vy:rand(1,3),
      r:rand(0,360),
      color:colors[Math.floor(rand(0,colors.length))]
    });
  }
}

function updateConfetti(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiPieces.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravity
    p.r += p.vx*6;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.r*Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    ctx.restore();
  });
  confettiPieces = confettiPieces.filter(p=>p.y < canvas.height+50);
}

let confettiAnim;
function startConfetti(duration=3500){
  spawnConfetti(120);
  const start = performance.now();
  function loop(t){
    updateConfetti();
    if(performance.now() - start < duration || confettiPieces.length){
      confettiAnim = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(confettiAnim);
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }
  loop();
}

function makeHeart(){
  const el = document.createElement('span');
  el.className = 'heart';
  el.style.left = (50 + rand(-35,35)) + '%';
  el.style.top = (80 + rand(-10,30)) + 'px';
  el.style.animationDuration = (2500 + rand(0,1200)) + 'ms';
  el.style.transform = `rotate(-45deg) translate(-50%,0) scale(${rand(0.8,1.2)})`;
  heartsContainer.appendChild(el);
  setTimeout(()=>el.remove(),3500);
}

function makePhotoHeart(x,y){
  if(!photoHearts) return;
  const el = document.createElement('span');
  el.className = 'heart';
  const size = 16;
  el.style.left = (x - size/2) + 'px';
  el.style.top = (y - size/2) + 'px';
  el.style.animationDuration = (1600 + Math.random()*800) + 'ms';
  photoHearts.appendChild(el);
  setTimeout(()=>el.remove(),2400);
}

function burstPhotoHearts(n = 8, x=0, y=0){
  for(let i=0;i<n;i++){
    setTimeout(()=>{
      const dx = (Math.random()-0.5)*60;
      const dy = (Math.random()-0.5)*30;
      makePhotoHeart(x + dx, y + dy);
    }, i*80 + Math.random()*80);
  }
}

function burstHearts(n=12){
  for(let i=0;i<n;i++) setTimeout(makeHeart, i*120 + Math.random()*200);
}

// click on portrait: spawn hearts multiple times, then navigate after enough clicks
if(portrait){
  portrait.addEventListener('click', (ev)=>{
    portraitClickCount++;
    const rect = portrait.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    burstPhotoHearts(12, x, y);
    
    // after 3 clicks, navigate to surprise page
    if(portraitClickCount >= 3){
      setTimeout(()=>{
        window.location.href = 'surprise.html';
      }, 1200);
    }
  });
}
