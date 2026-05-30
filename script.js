/* ─────────────────────────────────────────────────────────────
   NINA DELA CRUZ — PORTFOLIO JAVASCRIPT
───────────────────────────────────────────────────────────── */

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

/* ── FLOATING NAV — scroll + active section ─────────────────── */
const mainNav     = document.getElementById('mainNav');
const progressBar = document.getElementById('progressBar');
const navLinks    = document.querySelectorAll('.nav-link:not(.cta)');
const sections    = document.querySelectorAll('section[id]');
const backTopBtn  = document.getElementById('backTop');

// Cache section offsets — only recalculate on resize, not every scroll
let sectionOffsets = [];
function cacheSectionOffsets() {
  sectionOffsets = Array.from(sections).map(sec => ({
    id:  sec.getAttribute('id'),
    top: sec.offsetTop - 120
  }));
}
cacheSectionOffsets();
window.addEventListener('resize', cacheSectionOffsets, { passive: true });

// Single rAF-throttled scroll handler
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Nav pill
    mainNav.classList.toggle('scrolled', scrollY > 60);

    // Progress bar
    progressBar.style.width = ((scrollY / docHeight) * 100) + '%';

    // Back-to-top
    backTopBtn.classList.toggle('visible', scrollY > 400);

    // Active nav link
    let current = '';
    for (let i = sectionOffsets.length - 1; i >= 0; i--) {
      if (scrollY >= sectionOffsets[i].top) { current = sectionOffsets[i].id; break; }
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    scrollTicking = false;
  });
}, { passive: true });

/* ── MOBILE DRAWER ───────────────────────────────────────────── */
const navBurger      = document.getElementById('navBurger');
const mobileDrawer   = document.getElementById('mobileDrawer');
const drawerOverlay  = document.getElementById('drawerOverlay');
const drawerClose    = document.getElementById('drawerClose');
const drawerLinks    = document.querySelectorAll('.drawer-link');

function openDrawer()  { mobileDrawer.classList.add('open'); drawerOverlay.classList.add('open'); }
function closeDrawer() { mobileDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }

navBurger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));

/* ── REVEAL ON SCROLL (IntersectionObserver) ─────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── SKILL BARS (animate on scroll) ─────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar   = entry.target;
      const level = bar.getAttribute('data-level');
      const fill  = bar.querySelector('.skill-bar__fill');
      setTimeout(() => { fill.style.width = level + '%'; }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ── PROJECT TABS ────────────────────────────────────────────── */
const projTabs   = document.querySelectorAll('.proj-tab');
const projPanels = document.querySelectorAll('.proj-panel');

projTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.getAttribute('data-tab');

    projTabs.forEach(t => t.classList.remove('active'));
    projPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.proj-panel[data-panel="${idx}"]`).classList.add('active');

    // Re-trigger reveal animations inside the new panel
    document.querySelectorAll(`.proj-panel[data-panel="${idx}"] .reveal`).forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});

/* ── CERTIFICATION FILTER ────────────────────────────────────── */
const certBtns  = document.querySelectorAll('.cert-btn');
const certCards = document.querySelectorAll('.cert-card');

certBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    certBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    certCards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        // small stagger re-reveal
        card.style.animation = 'none';
        requestAnimationFrame(() => { card.style.animation = ''; });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── CONTACT FORM (demo — no backend) ───────────────────────── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formNote.style.color = '#e87070';
      formNote.textContent = 'Please fill in all fields.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNote.style.color = '#e87070';
      formNote.textContent = 'Please enter a valid email address.';
      return;
    }

    // Simulate send
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      formNote.style.color = 'var(--gold-light)';
      formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;

      setTimeout(() => { formNote.textContent = ''; }, 5000);
    }, 1200);
  });
}

/* ── BACK TO TOP ─────────────────────────────────────────────── */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SMOOTH ANCHOR SCROLL (override for all internal links) ──── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── INIT: trigger hero reveals immediately ──────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 200);
});

/* ── LIGHT / DARK MODE TOGGLE ────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  if (theme === 'dark') {
    themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    themeToggle.style.color = '';
  } else {
    themeToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeToggle.style.color = '#9b6fc4';
  }
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
/* ── CERT MODAL ──────────────────────────────────────────────── */
const certModal        = document.getElementById('certModal');
const certModalBackdrop= document.getElementById('certModalBackdrop');
const certModalClose   = document.getElementById('certModalClose');
const certModalTitle   = document.getElementById('certModalTitle');
const certModalIssuer  = document.getElementById('certModalIssuer');
const certModalYear    = document.getElementById('certModalYear');

function openCertModal(title, issuer, year) {
  certModalTitle.textContent  = title;
  certModalIssuer.textContent = issuer;
  certModalYear.textContent   = year;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const viewBtn = e.target.closest('.cert-card__view');
  if (viewBtn && viewBtn.hasAttribute('data-cert')) {
    e.preventDefault();
    openCertModal(
      viewBtn.getAttribute('data-cert'),
      viewBtn.getAttribute('data-issuer'),
      viewBtn.getAttribute('data-year')
    );
  }
});

certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });