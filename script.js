// Toggle the mobile navigation menu
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Add smooth scrolling behavior for internal anchor links.
  // We attach click handlers to all navigation links that start with "#".
  // When clicked, prevent the default jump and instead scroll the target into view
  // using smooth animation. This complements the CSS scroll-behavior property
  // and improves cross-browser consistency.
  const anchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile navigation after clicking a link
      navLinks.classList.remove('open');
    });
  });
});