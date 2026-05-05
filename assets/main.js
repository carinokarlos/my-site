document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ─────────────────────────────────────────────
  const themeToggleBtn = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  const savedTheme = localStorage.getItem('theme');

  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
      localStorage.setItem('theme', 'light');
    }
  };

  if (savedTheme === 'dark') {
    setTheme(true);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
  });

  // ── BURGER MENU ──────────────────────────────────────────────
  const burgerToggle = document.getElementById('burger-toggle');
  const burgerDropdown = document.getElementById('burger-dropdown');

  burgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerDropdown.classList.toggle('open');
  });

  // Close dropdown when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!burgerToggle.contains(e.target) && !burgerDropdown.contains(e.target)) {
      burgerDropdown.classList.remove('open');
    }
  });

  // Close dropdown after navigating through one of its links
  burgerDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      burgerDropdown.classList.remove('open');
    }
  });

  // ── STICKY NAVBAR + BACK TO TOP ──────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 0);
      backToTop.classList.toggle('visible', window.scrollY > 300);
    });
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── SCROLLSPY ────────────────────────────────────────────────
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a, .burger-dropdown a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── TYPEWRITER ───────────────────────────────────────────────
  const roles = ['Full-Stack Developer', 'IoT Integrator', 'Cloud Enthusiast', 'UI/UX Thinker'];
  const typeTarget = document.getElementById('typewriter');

  if (typeTarget) {
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
      const current = roles[roleIndex];

      if (isDeleting) {
        typeTarget.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeTarget.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 38 : 95;

      if (!isDeleting && charIndex === current.length) {
        speed = 2600;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 480;
      }

      setTimeout(type, speed);
    }

    setTimeout(type, 900);
  }

  // ── SCROLL REVEAL ────────────────────────────────────────────
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const appearObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => appearObserver.observe(el));

  // ── COPY EMAIL ───────────────────────────────────────────────
  let tooltipTimeout;

  window.copyEmail = async function () {
    const email = 'miguel.carlosc27@gmail.com';
    const tooltip = document.getElementById('email-tooltip');

    try {
      await navigator.clipboard.writeText(email);
      tooltip.classList.add('show');
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => tooltip.classList.remove('show'), 2000);
    } catch {
      tooltip.textContent = 'Failed';
      tooltip.classList.add('show');
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => tooltip.classList.remove('show'), 2000);
    }
  };

});