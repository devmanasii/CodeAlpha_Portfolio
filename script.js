// Basic DOM refs
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const themeToggle = document.getElementById('themeToggle');
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const modalClose = document.getElementById('modalClose');
const yearSpan = document.getElementById('year');

// Set year
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Mobile nav toggle
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
  });
}

// Theme toggle (remember preference)
const userPref = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
if (userPref === 'light') document.documentElement.style.setProperty('--bg', '#f7f8fb');
if (userPref === 'light') document.documentElement.style.color = '#0b1220';
if (userPref === 'light') document.body.classList.add('light-theme');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '🌙';
  }
});

// Smooth reveal on scroll using IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // optionally unobserve to avoid re-running
      io.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

reveals.forEach(r => io.observe(r));

// Project card click opens modal
projectCards.forEach(card => {
  card.addEventListener('click', () => showModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') showModal(card);
  });
});

function showModal(card) {
  const title = card.dataset.title || 'Project';
  const desc = card.dataset.desc || '';
  const link = card.dataset.link || '#';
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalLink.href = link;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  // trap focus for accessibility (simple)
  modalClose.focus();
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

// Simple progressive enhancement: smooth scroll for internal links (already via CSS scroll-behavior)
// Close mobile nav when link clicked
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  if (nav.classList.contains('open')) nav.classList.remove('open');
}));

// Optional: lightweight animate background using canvas (subtle)
(function bgCanvas(){
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = 0;
  canvas.style.zIndex = -2;
  canvas.style.opacity = 0.06;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  function resize(){canvas.width = innerWidth; canvas.height = innerHeight;}
  resize(); window.addEventListener('resize', resize);
  const dots = Array.from({length: 40}, ()=>({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*2 + 0.5,
    vx: (Math.random()-0.5)*0.2,
    vy: (Math.random()-0.5)*0.2
  }));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    dots.forEach(d=>{
      d.x += d.vx; d.y += d.vy;
      if(d.x<0||d.x>canvas.width) d.vx *= -1;
      if(d.y<0||d.y>canvas.height) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
