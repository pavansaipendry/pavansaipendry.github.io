document.addEventListener('DOMContentLoaded', () => {

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

  const heroBgText = document.querySelector('.hero-bg-text');
  window.addEventListener('scroll', () => {
    if (heroBgText) {
      // Moves the text down slightly as the user scrolls down
      const scrollY = window.scrollY;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.35}px))`;
    }
  });

  const cta = document.querySelector('.cta-primary');
  if (cta && window.matchMedia('(pointer: fine)').matches) {
    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cta.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    cta.addEventListener('mouseleave', () => {
      cta.style.transform = `translate(0px, 0px)`;
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
    }
  });

  // Close when tapping outside the nav on mobile
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  // Smooth scroll & close mobile nav
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
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

    // Hover effects on interactive elements
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
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 100);
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
    
  /* ─── Neural Node Canvas ─── */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.querySelector('.hero').offsetHeight;
      particles = [];
      for(let i = 0; i < (window.innerWidth < 768 ? 30 : 70); i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1
        });
      }
    }
    
    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(200, 255, 0, 0.5)';
      ctx.strokeStyle = 'rgba(200, 255, 0, 0.1)';
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect nearby particles
        for(let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    }
    
    initCanvas();
    drawParticles();
    window.addEventListener('resize', initCanvas);
  }

  /* ─── Animated Instant Tech-Stack Filtering ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Update button styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      // 2. Animate the cards
      projectCards.forEach(card => {
        // Strip the animation class first so we can re-trigger it
        card.classList.remove('show-filter');
        
        const categories = card.getAttribute('data-category') || "";
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
          // Force a browser reflow to restart the animation
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeDrawer() {
    caseDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  drawerTriggers.forEach(btn => btn.addEventListener('click', openDrawer));
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  
  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

});
