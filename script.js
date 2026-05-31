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
/* ── CERT CARD CLICK → MODAL ─────────────────────────────────── */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', e => {
    // Don't open modal if clicking directly on the "View Cert" button (handled below)
    if (e.target.closest('.cert-card__view')) return;
    const imgSrc     = card.getAttribute('data-img');
    const viewBtn    = card.querySelector('.cert-card__view');
    const certTitle  = viewBtn ? viewBtn.getAttribute('data-cert')   : '';
    const certIssuer = viewBtn ? viewBtn.getAttribute('data-issuer') : '';
    const certYear   = viewBtn ? viewBtn.getAttribute('data-year')   : '';
    openCertModal(certTitle, certIssuer, certYear, imgSrc);
  });
});

// Close any open preview when tapping elsewhere on mobile
document.addEventListener('click', e => {
  if (!e.target.closest('.cert-card')) {
    document.querySelectorAll('.cert-card.preview-open').forEach(c => c.classList.remove('preview-open'));
  }
});

/* ── CERT MODAL ──────────────────────────────────────────────── */
const certModal        = document.getElementById('certModal');
const certModalBackdrop= document.getElementById('certModalBackdrop');
const certModalClose   = document.getElementById('certModalClose');
const certModalTitle   = document.getElementById('certModalTitle');
const certModalIssuer  = document.getElementById('certModalIssuer');
const certModalYear    = document.getElementById('certModalYear');
const certModalPreview = document.getElementById('certModalPreview');

function openCertModal(title, issuer, year, imgSrc) {
  certModalTitle.textContent  = title;
  certModalIssuer.textContent = issuer;
  certModalYear.textContent   = year;

  // Clear previous preview content
  certModalPreview.innerHTML = '';

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    certModalPreview.appendChild(img);
  } else {
    certModalPreview.innerHTML = `
      <div class="cert-modal__placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="14" r="3"/><path d="M9.5 17l-1 2 3.5-1 3.5 1-1-2"/></svg>
        <span>Certificate Preview</span>
      </div>`;
  }

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
    e.stopPropagation();
    const card   = viewBtn.closest('.cert-card');
    const imgSrc = card ? card.getAttribute('data-img') : null;
    openCertModal(
      viewBtn.getAttribute('data-cert'),
      viewBtn.getAttribute('data-issuer'),
      viewBtn.getAttribute('data-year'),
      imgSrc
    );
  }
});

certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

/* ── ACADEMIC CARD CLICK → IMAGE MODAL ───────────────────────── */
// Reuse the cert modal for academic images
document.querySelectorAll('.acad-card').forEach(card => {
  card.addEventListener('click', () => {
    const img     = card.querySelector('.acad-card__img-wrap img');
    const title   = card.querySelector('.acad-card__title');
    const subject = card.querySelector('.acad-card__subject');
    const imgSrc  = img ? img.src : null;

    certModalTitle.textContent  = title  ? title.textContent  : '';
    certModalIssuer.textContent = subject ? subject.textContent : '';
    certModalYear.textContent   = '';

    certModalPreview.innerHTML = '';
    if (imgSrc) {
      const imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imgEl.alt = title ? title.textContent : '';
      certModalPreview.appendChild(imgEl);
    } else {
      certModalPreview.innerHTML = `
        <div class="cert-modal__placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>No Image</span>
        </div>`;
    }

    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
/* ── ACADEMIC GALLERY CAROUSEL ───────────────────────────────── */
(function () {
  const track    = document.getElementById('acadTrack');
  const prevBtn  = document.getElementById('acadPrev');
  const nextBtn  = document.getElementById('acadNext');
  const dotsWrap = document.getElementById('acadDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.acad-card'));
  let current = 0;

  // Determine visible count based on viewport
  function visibleCount() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function totalSlides() {
    return Math.max(1, cards.length - visibleCount() + 1);
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const n = totalSlides();
    for (let i = 0; i < n; i++) {
      const d = document.createElement('button');
      d.className = 'acad-carousel__dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, totalSlides() - 1));
    const cardWidth = cards[0].offsetWidth + 16; // gap = 16px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= totalSlides() - 1;
    dotsWrap.querySelectorAll('.acad-carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = 0;
      buildDots();
      goTo(0);
    }, 150);
  }, { passive: true });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  buildDots();
  goTo(0);
})();