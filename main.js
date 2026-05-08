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

  const SPEED = 0.55; // px per rAF tick — slow drift
  const GAP   = 24;

  // Capture originals before cloning
  const origCards = Array.from(track.children);
  const N = origCards.length;

  // Build triple set: [pre-clones][originals][post-clones]
  // Pre-clones go BEFORE the originals so prev can scroll back seamlessly
  const pre = document.createDocumentFragment();
  origCards.forEach(c => pre.appendChild(c.cloneNode(true)));
  track.insertBefore(pre, track.firstChild);
  // Post-clones go AFTER the originals so forward scrolling loops
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));

  let setW         = 0;  // pixel width of one full set (N cards + gaps)
  let offset       = 0;  // current translateX magnitude
  let manualPaused = false;
  let hovering     = false;
  let inView       = false;
  let transitioning = false;
  let rafId;

  function measure() {
    const card = track.querySelector('.testimonial-card');
    if (!card) return;
    setW = N * (card.offsetWidth + GAP);
  }

  // Keep offset inside [setW, 2*setW) without animation — visually identical
  function normalize() {
    track.style.transition = 'none';
    if (offset < setW)       offset += setW;
    if (offset >= 2 * setW)  offset -= setW;
    track.style.transform = `translateX(-${offset}px)`;
    // Force reflow so the next animated transform won't inherit the jump
    track.getBoundingClientRect();
  }

  function isRunning() { return inView && !manualPaused && !hovering && !transitioning; }

  function tick() {
    if (isRunning()) {
      offset += SPEED;
      if (offset >= 2 * setW) offset -= setW; // seamless right-to-left loop
      track.style.transform = `translateX(-${offset}px)`;
    }
    rafId = requestAnimationFrame(tick);
  }

  function stepBy(dir) {
    if (setW === 0 || transitioning) return;
    const cardW = setW / N; // width of one card slot (card + gap)
    transitioning = true;
    offset += dir * cardW;
    track.style.transition = 'transform 0.45s ease';
    track.style.transform   = `translateX(-${offset}px)`;
    setTimeout(() => {
      transitioning = false;
      normalize(); // silently reposition within the safe zone
    }, 460);
  }

  function updatePauseBtn() {
    pauseBtn.innerHTML = manualPaused ? '&#9654;' : '&#10074;&#10074;';
    pauseBtn.setAttribute('aria-label', manualPaused ? 'Resume carousel' : 'Pause carousel');
  }

  pauseBtn.addEventListener('click', () => { manualPaused = !manualPaused; updatePauseBtn(); });
  prevBtn.addEventListener('click',  () => { manualPaused = true; updatePauseBtn(); stepBy(-1); });
  nextBtn.addEventListener('click',  () => { manualPaused = true; updatePauseBtn(); stepBy(1);  });

  // Pause on hover (desktop)
  carousel.addEventListener('mouseenter', () => { hovering = true;  });
  carousel.addEventListener('mouseleave', () => { hovering = false; });

  // Only auto-scroll when the section is actually visible
  const sectionObserver = new IntersectionObserver(
    entries => { inView = entries[0].isIntersecting; },
    { threshold: 0.1 }
  );
  sectionObserver.observe(document.getElementById('testimonials'));

  function init() {
    measure();
    if (setW === 0) { requestAnimationFrame(init); return; } // retry until layout settles
    offset = setW; // start at beginning of originals
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${offset}px)`;
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', measure);
  // Double rAF ensures the browser has completed layout before we measure
  window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(init)));
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
