document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page Loader ─── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('done');
    }, 600);
  });

  /* ─── Lenis Smooth Scroll ─── */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ─── Theme Toggle ─── */
  if (localStorage.getItem('psr-theme') === 'light') {
    document.body.classList.add('theme-light');
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      localStorage.setItem('psr-theme', document.body.classList.contains('theme-light') ? 'light' : 'dark');
    });
  }

  /* ─── Mobile Navigation ─── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
  });

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').substring(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    });
  });

  /* ─── Navbar scroll effect ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ─── Custom Cursor ─── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .nav-toggle, summary, .skill-pills span, .tech-tags span').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '16px';
        cursor.style.height = '16px';
        follower.style.width = '50px';
        follower.style.height = '50px';
        follower.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.opacity = '0.5';
      });
    });
  }

  /* ─── Scroll Animations ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ─── GSAP ScrollTrigger Animations ─── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Parallax hero content
    gsap.to('.hero-content', {
      y: 80,
      opacity: 0.3,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.hero-visual', {
      y: 50,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '60% top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /* ─── Active Nav Link Highlighting ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ─── Skills Canvas — Colored Moving Lines ─── */
  const skillsCanvas = document.getElementById('skillsCanvas');
  const skillsCore = document.getElementById('skillsCore');
  const skillsTop = document.getElementById('skillsTop');
  const skillsBottom = document.getElementById('skillsBottom');

  if (skillsCanvas && skillsCore && skillsTop && skillsBottom && window.innerWidth > 768) {
    const ctx = skillsCanvas.getContext('2d');
    let sWidth, sHeight;
    let lines = [];
    let skillsRunning = false;
    let skillsAnimId = null;

    const lineColors = [
      { r: 200, g: 255, b: 0 },   // lime
      { r: 124, g: 92,  b: 252 },  // purple
      { r: 0,   g: 200, b: 255 },  // cyan
      { r: 255, g: 100, b: 100 },  // red
      { r: 255, g: 200, b: 0 },    // yellow
      { r: 100, g: 255, b: 150 }   // green
    ];

    const lightColors = [
      { r: 59,  g: 130, b: 246 },  // blue
      { r: 124, g: 92,  b: 252 },  // purple
      { r: 0,   g: 150, b: 200 },  // teal
      { r: 220, g: 38,  b: 38 },   // red
      { r: 180, g: 140, b: 0 },    // amber
      { r: 22,  g: 163, b: 74 }    // green
    ];

    function getRelPos(el, container) {
      const cr = container.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      return {
        x: er.left - cr.left + er.width / 2,
        y: er.top - cr.top + er.height / 2,
        top: er.top - cr.top,
        bottom: er.top - cr.top + er.height
      };
    }

    function buildPaths() {
      const container = skillsCanvas.parentElement;
      const cr = container.getBoundingClientRect();
      sWidth = skillsCanvas.width = cr.width;
      sHeight = skillsCanvas.height = cr.height;

      const core = getRelPos(skillsCore, container);
      const topBlocks = skillsTop.querySelectorAll('.skill-block');
      const bottomBlocks = skillsBottom.querySelectorAll('.skill-block');
      lines = [];

      // Top blocks connect downward to chip
      topBlocks.forEach((block, i) => {
        const bp = getRelPos(block, container);
        const midY = bp.bottom + (core.y - bp.bottom) * 0.5;
        lines.push({
          waypoints: [
            { x: bp.x, y: bp.bottom },
            { x: bp.x, y: midY },
            { x: core.x, y: midY },
            { x: core.x, y: core.y - 30 }
          ],
          colorIndex: i,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.004
        });
      });

      // Bottom blocks connect upward from chip
      bottomBlocks.forEach((block, i) => {
        const bp = getRelPos(block, container);
        const midY = core.y + (bp.top - core.y) * 0.5;
        lines.push({
          waypoints: [
            { x: core.x, y: core.y + 30 },
            { x: core.x, y: midY },
            { x: bp.x, y: midY },
            { x: bp.x, y: bp.top }
          ],
          colorIndex: i + 3,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.004
        });
      });
    }

    function lerpPath(waypoints, t) {
      let totalLen = 0;
      const segments = [];
      for (let i = 0; i < waypoints.length - 1; i++) {
        const dx = waypoints[i + 1].x - waypoints[i].x;
        const dy = waypoints[i + 1].y - waypoints[i].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        segments.push(len);
        totalLen += len;
      }
      let targetDist = t * totalLen;
      for (let i = 0; i < segments.length; i++) {
        if (targetDist <= segments[i]) {
          const frac = segments[i] > 0 ? targetDist / segments[i] : 0;
          return {
            x: waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * frac,
            y: waypoints[i].y + (waypoints[i + 1].y - waypoints[i].y) * frac
          };
        }
        targetDist -= segments[i];
      }
      return waypoints[waypoints.length - 1];
    }

    function drawSkills() {
      if (!skillsRunning) return;
      ctx.clearRect(0, 0, sWidth, sHeight);

      const isLight = document.body.classList.contains('theme-light');
      const colors = isLight ? lightColors : lineColors;

      lines.forEach(line => {
        const c = colors[line.colorIndex % colors.length];

        // Draw static path line
        ctx.beginPath();
        ctx.moveTo(line.waypoints[0].x, line.waypoints[0].y);
        for (let i = 1; i < line.waypoints.length; i++) {
          ctx.lineTo(line.waypoints[i].x, line.waypoints[i].y);
        }
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw corner dots
        line.waypoints.forEach((wp, i) => {
          if (i > 0 && i < line.waypoints.length - 1) {
            ctx.beginPath();
            ctx.arc(wp.x, wp.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.2)`;
            ctx.fill();
          }
        });

        // Animated moving line segment
        line.progress += line.speed;
        if (line.progress > 1) line.progress = 0;

        const lineLen = 0.15; // length of the moving segment
        const t1 = line.progress;
        const t2 = Math.min(1, t1 + lineLen);

        // Draw the moving colored segment
        const steps = 20;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const t = t1 + (t2 - t1) * (s / steps);
          const pos = lerpPath(line.waypoints, t);
          if (s === 0) ctx.moveTo(pos.x, pos.y);
          else ctx.lineTo(pos.x, pos.y);
        }
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow at head of the line
        const headPos = lerpPath(line.waypoints, t2);
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.4)`;
        ctx.fill();
      });

      skillsAnimId = requestAnimationFrame(drawSkills);
    }

    const skillsSection = document.getElementById('skills');
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          buildPaths();
          skillsRunning = true;
          drawSkills();
        } else {
          skillsRunning = false;
          if (skillsAnimId) cancelAnimationFrame(skillsAnimId);
        }
      });
    }, { threshold: 0.1 });
    skillsObserver.observe(skillsSection);

    window.addEventListener('resize', () => {
      if (skillsRunning) buildPaths();
    });
  }

  /* ─── Project Filters ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        card.classList.remove('show-filter');
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
          void card.offsetWidth;
          card.classList.add('show-filter');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ─── Contact Chat Form (AJAX via formsubmit.co) ─── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const msgText = formData.get('message');
      const nameText = formData.get('name');
      if (!msgText || !nameText) return;

      const messages = document.getElementById('contactMessages');

      // Show user message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-msg chat-msg-user';
      userBubble.innerHTML = `
        <div class="chat-avatar chat-avatar-you">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="chat-msg-body">
          <div class="chat-msg-meta"><strong>${nameText.replace(/</g, '&lt;')}</strong><span class="chat-time">now</span></div>
          <p>${msgText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `;
      messages.appendChild(userBubble);
      messages.scrollTop = messages.scrollHeight;

      // Submit via AJAX
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        const reply = document.createElement('div');
        reply.className = 'chat-msg';
        if (res.ok) {
          reply.innerHTML = `
            <div class="chat-avatar chat-avatar-bot">P</div>
            <div class="chat-msg-body">
              <div class="chat-msg-meta"><strong>Pavan</strong><span class="chat-time">now</span></div>
              <p>Thanks for reaching out! I'll get back to you soon.</p>
            </div>
          `;
          contactForm.reset();
        } else {
          reply.innerHTML = `
            <div class="chat-avatar chat-avatar-bot">P</div>
            <div class="chat-msg-body">
              <div class="chat-msg-meta"><strong>Pavan</strong><span class="chat-time">now</span></div>
              <p>Something went wrong. Please try emailing me directly.</p>
            </div>
          `;
        }
        messages.appendChild(reply);
        messages.scrollTop = messages.scrollHeight;
      });
    });
  }

  /* ─── Slide-Out Drawer ─── */
  const drawerTriggers = document.querySelectorAll('.drawer-trigger');
  const caseDrawer = document.getElementById('caseDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    caseDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    caseDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  drawerTriggers.forEach(btn => btn.addEventListener('click', openDrawer));
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseDrawer.classList.contains('open')) closeDrawer();
  });

});
