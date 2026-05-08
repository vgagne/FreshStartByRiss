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
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  const pauseBtn = document.getElementById('carouselPause');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  const carousel = document.getElementById('testimonialsCarousel');

  const SPEED = 0.55; // px per animation frame — slow drift
  const GAP   = 24;

  let offset        = 0;
  let manualPaused  = false;
  let hovering      = false;
  let transitioning = false;
  let totalWidth    = 0;

  // Duplicate all cards so the loop is seamless
  const origCards = [...track.children];
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));

  function measure() {
    const card = track.querySelector('.testimonial-card');
    totalWidth = origCards.length * (card.offsetWidth + GAP);
  }

  function isRunning() { return !manualPaused && !hovering; }

  function tick() {
    if (isRunning() && !transitioning) {
      offset += SPEED;
      if (offset >= totalWidth) offset -= totalWidth;
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(tick);
  }

  function slideTo(target) {
    if (target < 0) target += totalWidth;
    if (target >= totalWidth) target -= totalWidth;
    transitioning = true;
    track.style.transition = 'transform 0.45s ease';
    offset = target;
    track.style.transform = `translateX(-${offset}px)`;
    setTimeout(() => {
      track.style.transition = '';
      transitioning = false;
    }, 450);
  }

  function stepBy(dir) {
    measure();
    const cardW = track.querySelector('.testimonial-card').offsetWidth + GAP;
    slideTo(offset + dir * cardW);
  }

  function updatePauseBtn() {
    if (manualPaused) {
      pauseBtn.innerHTML = '&#9654;';
      pauseBtn.setAttribute('aria-label', 'Resume carousel');
    } else {
      pauseBtn.innerHTML = '&#10074;&#10074;';
      pauseBtn.setAttribute('aria-label', 'Pause carousel');
    }
  }

  pauseBtn.addEventListener('click', () => {
    manualPaused = !manualPaused;
    updatePauseBtn();
  });
  prevBtn.addEventListener('click', () => {
    manualPaused = true;
    updatePauseBtn();
    stepBy(-1);
  });
  nextBtn.addEventListener('click', () => {
    manualPaused = true;
    updatePauseBtn();
    stepBy(1);
  });

  carousel.addEventListener('mouseenter', () => { hovering = true; });
  carousel.addEventListener('mouseleave', () => { hovering = false; });

  window.addEventListener('load', () => {
    measure();
    requestAnimationFrame(tick);
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
