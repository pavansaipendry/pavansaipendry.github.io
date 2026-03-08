document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page Loader ─── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('done');
    }, 600);
  });

  /* ─── Theme Toggle ─── */
  if (localStorage.getItem('psr-theme') === 'cyan') {
    document.body.classList.add('theme-cyan');
  }
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

  /* ─── Skills Canvas — Animated Connection Lines ─── */
  const skillsCanvas = document.getElementById('skillsCanvas');
  const skillsCore = document.getElementById('skillsCore');
  const skillsGrid = document.getElementById('skillsGrid');

  if (skillsCanvas && skillsCore && skillsGrid && window.innerWidth > 768) {
    const ctx = skillsCanvas.getContext('2d');
    let sWidth, sHeight;
    let particles = [];
    let paths = [];
    let skillsRunning = false;
    let skillsAnimId = null;

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
      const blocks = skillsGrid.querySelectorAll('.skill-block');
      paths = [];
      particles = [];

      blocks.forEach((block) => {
        const bp = getRelPos(block, container);
        // Create right-angle path: go down from core, then horizontal, then down to block
        const midY = core.y + (bp.top - core.y) * 0.5;
        const waypoints = [
          { x: core.x, y: core.y + 20 },
          { x: core.x, y: midY },
          { x: bp.x, y: midY },
          { x: bp.x, y: bp.top }
        ];
        paths.push(waypoints);

        // Create a particle for each path
        particles.push({
          pathIndex: paths.length - 1,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.002
        });
      });
    }

    function lerpPath(waypoints, t) {
      // Calculate total length
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
          const frac = targetDist / segments[i];
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
      const lineColor = isLight ? 'rgba(59,130,246,0.15)' : 'rgba(200,255,0,0.12)';
      const dotColor = isLight ? 'rgba(59,130,246,0.9)' : 'rgba(200,255,0,0.9)';
      const glowColor = isLight ? 'rgba(59,130,246,0.3)' : 'rgba(200,255,0,0.3)';

      // Draw paths
      paths.forEach(waypoints => {
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
          ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw small dots at corners
        waypoints.forEach((wp, i) => {
          if (i > 0 && i < waypoints.length - 1) {
            ctx.beginPath();
            ctx.arc(wp.x, wp.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
          }
        });
      });

      // Animate particles flowing along paths
      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const pos = lerpPath(paths[p.pathIndex], p.progress);

        // Glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      skillsAnimId = requestAnimationFrame(drawSkills);
    }

    // Only run when visible
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
