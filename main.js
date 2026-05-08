/* ===========================
   FRESH START BY RISS — JS
   =========================== */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Scroll-reveal animation
const revealEls = document.querySelectorAll(
  '.service-card, .section-header, .why-img-col, .why-text-col, .gallery-item, .testimonial-card, .contact-info, .contact-form, .pillar'
);
revealEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// Contact form — mock submit
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e05a5a';
      valid = false;
    }
  });
  if (!valid) return;
  successMsg.classList.add('visible');
  setTimeout(() => {
    successMsg.classList.remove('visible');
    form.reset();
  }, 4000);
});

// Testimonials Carousel
(function () {
  const track    = document.getElementById('testimonialsTrack');
  if (!track) return;
  const pauseBtn = document.getElementById('carouselPause');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  const carousel = document.getElementById('testimonialsCarousel');

  const SPEED = 0.55; // px per rAF tick

  // 2-set layout: [originals 1-9][clones 1-9]
  // When offset reaches setW, we instantly reset to 0 — both views are identical.
  const origCards = Array.from(track.children);
  const N = origCards.length;
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));

  let setW         = 0;   // pixel width of one full set of N cards
  let offset       = 0;   // current scroll position (translateX magnitude)
  let manualPaused = false;
  let hovering     = false;
  let transitioning = false;

  function measure() {
    const card = track.querySelector('.testimonial-card');
    if (!card || !card.offsetWidth) return;
    // Each slot = card width + gap between cards
    setW = N * (card.offsetWidth + 24);
  }

  // Auto-scroll tick: move right-to-left, loop when originals are exhausted
  function tick() {
    if (!manualPaused && !hovering && !transitioning && setW > 0) {
      offset += SPEED;
      if (offset >= setW) {
        // Instant (no-transition) reset to the equivalent position in the originals
        offset -= setW;
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(tick);
  }

  function cardSlotWidth() { return setW / N; }

  function stepBy(dir) {
    if (setW === 0 || transitioning) return;
    const step = cardSlotWidth();

    if (dir === -1 && offset < step) {
      // Going backward past card 1 → jump silently to clone territory first,
      // then animate back so card 9 (Michael T.) appears to the left.
      track.style.transition = 'none';
      offset += setW;
      track.style.transform = `translateX(-${offset}px)`;
      void track.offsetHeight; // flush reflow so next transition is clean
    }

    transitioning = true;
    offset += dir * step;
    track.style.transition = 'transform 0.45s ease';
    track.style.transform   = `translateX(-${offset}px)`;
    setTimeout(() => {
      track.style.transition = 'none';
      // After going forward into clone territory, silently snap back to originals
      if (offset >= setW) offset -= setW;
      track.style.transform = `translateX(-${offset}px)`;
      transitioning = false;
    }, 460);
  }

  function updatePauseBtn() {
    pauseBtn.innerHTML = manualPaused ? '&#9654;' : '&#10074;&#10074;';
    pauseBtn.setAttribute('aria-label', manualPaused ? 'Resume carousel' : 'Pause carousel');
  }

  pauseBtn.addEventListener('click', () => { manualPaused = !manualPaused; updatePauseBtn(); });
  prevBtn.addEventListener('click',  () => { manualPaused = true; updatePauseBtn(); stepBy(-1); });
  nextBtn.addEventListener('click',  () => { manualPaused = true; updatePauseBtn(); stepBy(1);  });
  carousel.addEventListener('mouseenter', () => { hovering = true;  });
  carousel.addEventListener('mouseleave', () => { hovering = false; });
  window.addEventListener('resize', () => {
    measure();
    // Clamp offset so it stays in-range after card width changes
    if (setW > 0 && offset >= setW) offset = offset % setW;
  });

  var started = false;

  function init() {
    if (started) return;
    measure();
    if (setW === 0) {
      // Cards not laid out yet — keep retrying every 50 ms (up to 2 s)
      setTimeout(init, 50);
      return;
    }
    started = true;
    offset = 0;
    track.style.transition = 'none';
    track.style.transform  = 'translateX(0)';
    requestAnimationFrame(tick);
  }

  // The script sits at the end of <body> so the DOM is already parsed.
  // Two rAF calls let the browser finish painting before we measure widths.
  requestAnimationFrame(function () {
    requestAnimationFrame(init);
  });
}());

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id], .contact-section[id]');
const navAnchs = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchs.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
