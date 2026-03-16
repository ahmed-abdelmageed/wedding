/* =====================================================
   Wedding Invitation – script.js
   Ahmed & Shahd  ·  28 May 2026
   ===================================================== */

const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelope        = document.getElementById('envelope');
const envFlap         = document.getElementById('envFlap');
const waxSeal         = document.getElementById('waxSeal');
const card            = document.getElementById('card');
const hint            = document.getElementById('hint');
const petalsContainer = document.getElementById('petals');
const closeBtn        = document.getElementById('closeBtn');

let opened = false;

/* ── Petals ─────────────────────────────────────────── */
const PETAL_CHARS = ['🌸', '🌺', '✨', '🌼', '💮', '⭐'];

function createPetal() {
  const el = document.createElement('span');
  el.className = 'petal';
  el.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
  el.style.left     = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  el.style.opacity  = 0.4 + Math.random() * 0.5;
  const dur = 5 + Math.random() * 8;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = (Math.random() * dur) + 's';
  petalsContainer.appendChild(el);
  // remove after animation
  el.addEventListener('animationiteration', () => {
    el.style.left = Math.random() * 100 + 'vw';
  });
}

// Spawn initial petals
for (let i = 0; i < 18; i++) createPetal();
// Keep spawning new ones
setInterval(createPetal, 2500);

/* ── Sparkle burst at click position ───────────────── */
function burst(x, y) {
  const CHARS = ['✨', '💛', '🌟', '💫', '⭐'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    const angle = Math.random() * 360;
    const dist  = 60 + Math.random() * 120;
    s.style.left = x + 'px';
    s.style.top  = y + 'px';
    s.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * dist + 'px');
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

/* ── Open envelope ──────────────────────────────────── */
function openEnvelope(e) {
  if (opened) return;
  opened = true;

  // Hide hint
  hint.classList.add('hidden');

  // Sparkle where user clicked
  burst(e.clientX, e.clientY);

  // 1. Crack the seal
  waxSeal.classList.add('cracked');

  // 2. Open flap (after a small delay)
  setTimeout(() => {
    envFlap.classList.add('open');
  }, 300);

  // 3. Slide card up (after flap opens)
  setTimeout(() => {
    card.classList.add('open');
  }, 800);

  // 4. Push envelope down slightly
  setTimeout(() => {
    envelope.classList.add('opened');
  }, 850);

  // 5. Extra sparkles when card appears
  setTimeout(() => {
    const rect = card.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + 60);
    burst(rect.left + rect.width / 2, rect.top + 100);
  }, 1200);

  // Remove click listener
  envelopeWrapper.removeEventListener('click', openEnvelope);
}

/* ── Close card ─────────────────────────────────────── */
function closeCard() {
  card.classList.remove('open');
  
  // After card closes, reset everything
  setTimeout(() => {
    envelope.classList.remove('opened');
    envFlap.classList.remove('open');
    waxSeal.classList.remove('cracked');
    hint.classList.remove('hidden');
    opened = false;
    // Re-enable opening
    envelopeWrapper.addEventListener('click', openEnvelope);
  }, 1000);
}

envelopeWrapper.addEventListener('click', openEnvelope);
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeCard();
});

/* ── Subtle hover tilt on envelope ─────────────────── */
envelopeWrapper.addEventListener('mousemove', (e) => {
  if (opened) return;
  const rect = envelopeWrapper.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const dx = (e.clientX - cx) / rect.width;
  const dy = (e.clientY - cy) / rect.height;
  envelopeWrapper.style.transform =
    `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) scale(1.03)`;
  envelopeWrapper.style.transition = 'transform .1s ease';
});

envelopeWrapper.addEventListener('mouseleave', () => {
  if (opened) return;
  envelopeWrapper.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  envelopeWrapper.style.transition = 'transform .5s ease';
});
