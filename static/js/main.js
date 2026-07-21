/**
 * Premium Portfolio — Main JavaScript (v2 - Bug Fixes)
 * ============================================================================
 * Features:
 *   1. Lenis Smooth Scroll (connected to GSAP ticker)
 *   2. Custom Cursor (dot + ring)
 *   3. Particle System (canvas)
 *   4. Spotlight Effect
 *   5. Hero Entrance — ONLY targets hero section elements
 *   6. Magnetic Buttons
 *   7. Scroll Progress Bar
 *   8. GSAP ScrollTrigger Stacked Cards (CORE)
 *   9. Card Morphing Modal (CORE)
 *  10. Scroll Reveals (GSAP) — for non-hero sections
 *  11. Metric Counters (GSAP)
 *  12. Reduced Motion Check
 *  13. Scroll Spy
 *  14. Smooth Nav Scroll
 *  15. Navbar Scroll Effect
 * ============================================================================
 */
(function () {
  'use strict';

  /* ── 0. Reduced Motion Check ─────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
    document.querySelectorAll('.stack-card').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    initSmoothScroll();
    return;
  }

  let lenis;

  /* ── 1. Lenis Smooth Scroll ─────────────────────────────────────────── */
  function initLenis() {
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
      orientation: 'vertical',
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── 2. Custom Cursor ──────────────────────────────────────────────────── */
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    });

    const hoverTargets = 'a, button, .stack-card, .chip, .impact-card, .cert-card, .magnetic-btn';
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) ring.classList.remove('hover');
    });
  }

  /* ── 3. Particle System ───────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles(count) {
      const num = count || 20;
      particles = [];
      for (let i = 0; i < num; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 77, 48, ${pulseOpacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 77, 48, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* ── 4. Spotlight Effect ──────────────────────────────────────────────── */
  function initSpotlight() {
    const spotlight = document.getElementById('spotlightOverlay');
    if (!spotlight) return;
    let mouseX = 0, mouseY = 0;
    let smoothX = 0, smoothY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      smoothX += (mouseX - smoothX) * 0.06;
      smoothY += (mouseY - smoothY) * 0.06;
      spotlight.style.background = `
        radial-gradient(600px circle at ${smoothX}px ${smoothY}px, 
        rgba(255, 77, 48, 0.06) 0%, 
        transparent 60%)
      `;
    });
  }

  /* ── 5. Hero Entrance Animation (FIXED: only hero section) ──────────── */
  function initHeroAnimation() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    // Only animate elements INSIDE the hero section
    const heroReveals = hero.querySelectorAll('[data-reveal]');
    if (!heroReveals.length) return;

    gsap.fromTo(heroReveals, 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      }
    );
  }

  /* ── 6. Magnetic Buttons ──────────────────────────────────────────────── */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = parseFloat(btn.dataset.strength) || 0.3;
        gsap.to(btn, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  /* ── 7. Scroll Progress Bar ──────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    gsap.to(bar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }

  /* ── 8. GSAP ScrollTrigger Stacked Cards (CORE - FIXED) ─────────────── */
  function initStackedCards() {
    const cards = document.querySelectorAll('.stack-card');
    if (!cards.length) return;

    const container = document.getElementById('stackedCards');
    
    // Make all cards visible initially (no CSS opacity hiding)
    gsap.set(cards, { opacity: 1, visibility: 'visible' });

    cards.forEach((card, i) => {
      // Scale down all cards except the first one
      if (i === 0) {
        gsap.set(card, { scale: 1, y: 0 });
      } else {
        gsap.set(card, { scale: 0.92, y: 40 });
      }

      // For card 0, it's always visible. For others, trigger when they approach viewport
      if (i > 0) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              scale: 0.92,
              y: 40,
              duration: 0.6,
              ease: 'power2.inOut',
            });
          },
        });
      }

      // Mouse parallax glow on cards
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const bg = card.querySelector('.stack-card-bg');
        if (bg) {
          bg.style.setProperty('--mouse-x', `${x * 100 + 50}%`);
          bg.style.setProperty('--mouse-y', `${y * 100 + 50}%`);
        }
      });
    });

    // Add scroll room
    if (container) {
      container.style.paddingBottom = window.innerHeight * 0.8 + 'px';
    }
  }

  /* ── 9. Card Morphing Modal (CORE) ───────────────────────────────────── */
  function initCardModal() {
    const overlay = document.getElementById('cardModal');
    const closeBtn = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const dataScript = document.getElementById('projects-data-json');
    let projectsData = [];

    if (dataScript) {
      try { projectsData = JSON.parse(dataScript.textContent); } catch(e) {
        console.warn('Failed to parse projects data', e);
      }
    }

    let activeCard = null;

    function openModal(index) {
      const project = projectsData[index];
      if (!project) return;

      const card = document.querySelector(`[data-stack-card="${index}"]`);
      if (!card) return;

      activeCard = card;

      // Build tech tags
      let techHtml = '';
      if (project.tech_stack && project.tech_stack.length) {
        techHtml = project.tech_stack.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('');
        techHtml = `<div class="card-modal-tags">${techHtml}</div>`;
      }

      // Build metrics
      let metricsHtml = '';
      if (project.metrics && project.metrics.length) {
        metricsHtml = project.metrics.map(m => 
          `<span class="metric-badge">${escapeHtml(m.label)}: ${escapeHtml(m.value)}</span>`
        ).join('');
        metricsHtml = `<div class="stack-card-metrics" style="margin-bottom:24px">${metricsHtml}</div>`;
      }

      modalBody.innerHTML = `
        <h2 class="card-modal-title">${escapeHtml(project.title)}</h2>
        <p class="card-modal-description">${escapeHtml(project.summary)}</p>
        ${metricsHtml}
        <div class="card-modal-details">
          <div class="card-modal-section">
            <h4>Tech Stack</h4>
            ${techHtml}
          </div>
      `;

      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      card.setAttribute('aria-expanded', 'true');

      setTimeout(() => closeBtn.focus(), 100);
    }

    function closeModal() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (activeCard) {
        activeCard.setAttribute('aria-expanded', 'false');
        activeCard.focus();
        activeCard = null;
      }
    }

    // Click handlers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-expand-card]');
      if (trigger) {
        e.preventDefault();
        const idx = parseInt(trigger.getAttribute('data-expand-card'), 10);
        openModal(idx);
        return;
      }
      const card = e.target.closest('[data-stack-card]');
      if (card && !e.target.closest('[data-expand-card]')) {
        const idx = parseInt(card.getAttribute('data-stack-card'), 10);
        openModal(idx);
      }
    });

    // Keyboard: Enter/Space on cards
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-stack-card]');
        if (card) {
          e.preventDefault();
          const idx = parseInt(card.getAttribute('data-stack-card'), 10);
          openModal(idx);
        }
      }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    // Focus trap
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !overlay.classList.contains('active')) return;
      const focusable = overlay.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    function escapeHtml(str) {
      if (typeof str !== 'string') return String(str);
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
  }

  /* ── 10. Scroll Reveals (GSAP) — excludes hero section ──────────────── */
  function initScrollReveals() {
    // Only reveal elements NOT inside hero
    const hero = document.getElementById('hero');
    const allReveals = document.querySelectorAll('[data-reveal]');
    
    const nonHeroReveals = [];
    allReveals.forEach(el => {
      if (!hero || !hero.contains(el)) {
        nonHeroReveals.push(el);
      }
    });

    nonHeroReveals.forEach(el => {
      const delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
      
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  /* ── 11. Metric Counters (GSAP) ───────────────────────────────────────── */
  function initMetricCounters() {
    const counters = document.querySelectorAll('.impact-value[data-target]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      counter.textContent = '0' + suffix;
      counter.style.opacity = '1';
      counter.style.transform = 'none';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(counter, {
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: function() {
              const val = Math.floor(this.progress() * target);
              counter.textContent = val + suffix;
            },
            onComplete: () => {
              counter.textContent = target + suffix;
            },
          });
        },
        once: true,
      });
    });
  }

  /* ── 12. Scroll Spy ────────────────────────────────────────────────────── */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');
    if (!sections.length || !navLinks.length) return;

    ScrollTrigger.create({
      onUpdate: () => {
        const scrollPos = window.scrollY || window.pageYOffset;
        let current = sections[0];
        sections.forEach(s => {
          const top = s.offsetTop - 120;
          const bottom = top + s.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) current = s;
        });
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === '#' + current.id);
        });
      },
    });
  }

  /* ── 13. Smooth Scroll via Lenis ──────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (!target) return;
      if (lenis) {
        lenis.scrollTo(target, { 
          offset: -80, 
          duration: 1.2, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      }
    });
  }

  /* ── 14. Navbar Scroll Effect ──────────────────────────────────────────── */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        if (self.progress > 0) {
          navbar.style.transform = 'translateX(-50%) scale(0.96)';
          navbar.style.background = 'rgba(15, 15, 16, 0.85)';
        } else {
          navbar.style.transform = 'translateX(-50%) scale(1)';
          navbar.style.background = 'var(--glass-bg)';
        }
      },
    });
  }

  /* ── Initialise All ───────────────────────────────────────────────────── */
  function init() {
    // First: make all content visible immediately to prevent flash
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.stack-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.impact-value').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Initialize all modules
    initLenis();
    initCustomCursor();
    initParticles();
    initSpotlight();
    initMagneticButtons();
    initScrollProgress();
    initCardModal();

    // Reset impact values
    document.querySelectorAll('.impact-value[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (!isNaN(target)) {
        el.textContent = '0' + (el.getAttribute('data-suffix') || '');
      }
    });

    // Run animations
    initHeroAnimation();
    initStackedCards();
    initScrollReveals();
    initMetricCounters();
    initScrollSpy();
    initNavbar();
    initSmoothScroll();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
