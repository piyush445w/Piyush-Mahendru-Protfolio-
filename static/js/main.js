(function () {
  'use strict';

  /* ==========================================================================
     Utility helpers
     ========================================================================== */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Theme Toggle
     ========================================================================== */
  var themeToggle = document.getElementById('themeToggle');
  var html = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    } else {
      html.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    }
  }

  function toggleTheme() {
    var current = html.getAttribute('data-theme');
    var next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  var stored = (function () {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  })();
  applyTheme(stored || getSystemTheme());

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ==========================================================================
     2. Lenis Smooth Scroll
     ========================================================================== */
  var lenis = null;
  if (!reducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ==========================================================================
     3. GSAP + ScrollTrigger
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* Reveal animations */
    if (!reducedMotion) {
      var reveals = document.querySelectorAll('[data-reveal]');
      reveals.forEach(function (el) {
        var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            onComplete: function () { el.classList.add('revealed'); },
          }
        );
      });
    } else {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('revealed');
      });
    }

    /* Stack cards */
    if (!reducedMotion) {
      var stackCards = document.querySelectorAll('.stack-card');
      stackCards.forEach(function (card, i) {
        gsap.fromTo(card,
          { y: 120, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }

    /* Impact counters */
    var impactValues = document.querySelectorAll('.impact-value[data-target]');
    impactValues.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target) || reducedMotion) {
        el.textContent = target + suffix;
        el.classList.add('animated');
        return;
      }
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        },
        onComplete: function () { el.classList.add('animated'); },
      });
    });
  }

  /* ==========================================================================
     4. Scroll Progress Bar
     ========================================================================== */
  var progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ==========================================================================
     5. Navbar Scroll Effect
     ========================================================================== */
  var navbar = document.querySelector('.navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.pageYOffset > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ==========================================================================
     6. Mobile Nav Toggle
     ========================================================================== */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? '' : 'flex';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.style.display = '';
      });
    });
  }

  /* ==========================================================================
     7. Custom Cursor
     ========================================================================== */
  var cursor = document.getElementById('customCursor');
  var cursorDot = cursor ? cursor.querySelector('.cursor-dot') : null;
  var cursorRing = cursor ? cursor.querySelector('.cursor-ring') : null;

  if (cursor && cursorDot && cursorRing && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = 'translate(' + (mx - 4) + 'px, ' + (my - 4) + 'px)';
    });

    function animateRing() {
      var ringX = parseFloat(cursorRing.style.left || -20);
      var ringY = parseFloat(cursorRing.style.top || -20);
      ringX += (mx - (ringX + 20)) * 0.15;
      ringY += (my - (ringY + 20)) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      cursorRing.style.transform = 'none';
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    var hoverTargets = document.querySelectorAll('a, button, .stack-card, .skill-card, input, textarea');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hover'); });
    });
  }

  /* ==========================================================================
     8. Spotlight Effect
     ========================================================================== */
  var spotlight = document.getElementById('spotlightOverlay');

  if (spotlight && !reducedMotion) {
    document.addEventListener('mousemove', function (e) {
      spotlight.style.background = 'radial-gradient(600px circle at ' + e.clientX + 'px ' + e.clientY + 'px, rgba(59, 130, 246, 0.06), transparent 60%)';
    });
  }

  /* ==========================================================================
     9. Particle Canvas
     ========================================================================== */
  var canvas = document.getElementById('particleCanvas');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p, idx) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        var isBlue = idx % 2 === 0;
        var color = isBlue ? '59, 130, 246' : '255, 77, 48';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ', ' + p.opacity + ')';
        ctx.fill();
      });

      particles.forEach(function (p1, idx) {
        for (var j = idx + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p1.x - p2.x;
          var dy = p1.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            var isBlue1 = idx % 2 === 0;
            var isBlue2 = j % 2 === 0;
            var lineColor = (isBlue1 && isBlue2) ? '59, 130, 246' : '255, 77, 48';
            var alpha = 0.06 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + lineColor + ', ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    }
    requestAnimationFrame(drawParticles);
  }

  /* ==========================================================================
     10. Stack Cards & Card Modal
     ========================================================================== */
  var cardModal = document.getElementById('cardModal');
  var modalClose = document.getElementById('modalClose');
  var modalBody = document.getElementById('modalBody');
  var projectsDataEl = document.getElementById('projects-data-json');
  var PROJECTS_DATA = [];
  try { PROJECTS_DATA = JSON.parse(projectsDataEl.textContent); } catch (e) {}

  function openCardModal(projectId) {
    if (!cardModal || !modalBody) return;
    var project = PROJECTS_DATA.find(function (p) { return p.id === projectId; });
    if (!project) return;
    modalBody.innerHTML = '<h2>' + project.title + '</h2>' +
      '<p>' + project.description + '</p>' +
      '<p><strong>Tech Stack:</strong> ' + project.tech_stack.join(', ') + '</p>' +
      (project.metrics ? '<p><strong>Metrics:</strong> ' + project.metrics.map(function (m) { return m.label + ': ' + m.value; }).join(', ') + '</p>' : '') +
      (project.link ? '<a href="' + project.link + '" target="_blank" rel="noopener" class="btn btn-primary">View Project</a>' : '');
    cardModal.classList.add('active');
    cardModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCardModal() {
    if (!cardModal) return;
    cardModal.classList.remove('active');
    cardModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeCardModal);
  }
  if (cardModal) {
    cardModal.addEventListener('click', function (e) { if (e.target === cardModal) closeCardModal(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCardModal(); closeSkillModal(); } });

  var stackExpandButtons = document.querySelectorAll('.stack-card-expand');
  stackExpandButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var idx = btn.getAttribute('data-expand-card');
      openCardModal(idx);
    });
  });

  var stackCards = document.querySelectorAll('.stack-card');
  stackCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var idx = card.getAttribute('data-project-id');
      openCardModal(idx);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var idx = card.getAttribute('data-project-id');
        openCardModal(idx);
      }
    });
  });

  /* ==========================================================================
     11. Skill Modal
     ========================================================================== */
  var skillModal = document.getElementById('skillModal');
  var skillModalClose = document.getElementById('skillModalClose');
  var skillModalBody = document.getElementById('skillModalBody');
  var skillDefsEl = document.getElementById('skill-definitions-json');
  var skillMapEl = document.getElementById('skill-project-map-json');
  var SKILL_DEFS = {};
  var SKILL_MAP = {};
  try { SKILL_DEFS = JSON.parse(skillDefsEl.textContent); } catch (e) {}
  try { SKILL_MAP = JSON.parse(skillMapEl.textContent); } catch (e) {}

  function openSkillModal(skillName) {
    if (!skillModal || !skillModalBody) return;
    var def = SKILL_DEFS[skillName] || 'No details available.';
    var projects = SKILL_MAP[skillName] || [];
    var html = '<h2>' + skillName + '</h2>' +
      '<p>' + def + '</p>';
    if (projects.length) {
      html += '<h4>Used in:</h4><ul class="skill-projects-list">';
      projects.forEach(function (p) { html += '<li>' + p + '</li>'; });
      html += '</ul>';
    }
    skillModalBody.innerHTML = html;
    skillModal.classList.add('active');
    skillModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSkillModal() {
    if (!skillModal) return;
    skillModal.classList.remove('active');
    skillModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (skillModalClose) {
    skillModalClose.addEventListener('click', closeSkillModal);
  }
  if (skillModal) {
    skillModal.addEventListener('click', function (e) { if (e.target === skillModal) closeSkillModal(); });
  }

  var skillButtons = document.querySelectorAll('.skill-card');
  skillButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var skill = btn.getAttribute('data-skill');
      openSkillModal(skill);
    });
  });

  /* ==========================================================================
     12. Magnetic Buttons
     ========================================================================== */
  if (!reducedMotion) {
    var magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(function (btn) {
      var strength = parseFloat(btn.getAttribute('data-strength')) || 0.3;
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     13. Hero Char Animation (GSAP text split fallback)
     ========================================================================== */
  if (!reducedMotion && typeof gsap !== 'undefined') {
    var heroName = document.getElementById('heroName');
    if (heroName && !heroName.querySelector('.hero-char')) {
      var text = heroName.textContent || '';
      heroName.innerHTML = '';
      text.split('').forEach(function (char) {
        var span = document.createElement('span');
        span.className = 'hero-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        heroName.appendChild(span);
      });

      gsap.fromTo('.hero-char',
        { y: 60, opacity: 0, rotateX: -40 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.03, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: heroName, start: 'top 88%' },
        }
      );
    }
  }

})();
