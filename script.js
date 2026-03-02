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

  /* ─── Origin/Destination Data Map ─── */
  const mapElement = document.getElementById('routingMap');
  
  if (mapElement && typeof L !== 'undefined') {
    // 1. Initialize map centered over the US
    const map = L.map('routingMap', {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: window.matchMedia('(pointer: fine)').matches // Disable drag on mobile to prevent page scroll issues
    }).setView([39.5, -96.0], 4);

    // 2. Add sleek dark tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // 3. Define your mock data: Origin & Destinations with rates
    const origin = { name: "Kansas City Hub", coords: [39.0997, -94.5786] };
    const destinations = [
      { name: "New York", coords: [40.7128, -74.0060], initial: "$4.50/mi", final: "$4.20/mi" },
      { name: "San Francisco", coords: [37.7749, -122.4194], initial: "$5.10/mi", final: "$4.85/mi" },
      { name: "Austin", coords: [30.2672, -97.7431], initial: "$3.80/mi", final: "$3.95/mi" },
      { name: "Chicago", coords: [41.8781, -87.6298], initial: "$3.20/mi", final: "$3.10/mi" }
    ];

    // 4. Custom glowing dot markers
    const createMarker = (color) => L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; box-shadow: 0 0 12px ${color}; border: 2px solid #0a0a0f;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    // 5. Plot the Origin
    L.marker(origin.coords, { icon: createMarker('var(--c-accent2)') })
      .bindPopup(`<div class="rate-popup-title">Origin Hub</div><div style="color: white; font-size: 0.9rem;">${origin.name}</div>`)
      .addTo(map);

    // 6. Plot Destinations, Rates, and Flow Lines
    destinations.forEach(dest => {
      // Draw the animated connecting line
      L.polyline([origin.coords, dest.coords], {
        color: 'var(--c-accent)',
        weight: 2,
        opacity: 0.6,
        className: 'flow-line'
      }).addTo(map);

      // Add the destination node with popup data
      L.marker(dest.coords, { icon: createMarker('var(--c-accent)') })
        .bindPopup(`
          <div class="rate-popup-title">${dest.name}</div>
          <div class="rate-popup-data"><span>Initial Rate:</span> <strong>${dest.initial}</strong></div>
          <div class="rate-popup-data"><span>Final Rate:</span> <strong style="color:var(--c-accent)">${dest.final}</strong></div>
        `)
        .addTo(map);
    });
  }

});
