document.addEventListener('DOMContentLoaded', () => {

  // CURSOR FOLLOWER
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
  });

  const hoverElements = document.querySelectorAll('a, button, .project-card, .tag');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'var(--ink-4)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'var(--ink-3)';
    });
  });

  // THEME TOGGLE & TRANSITION OVERLAY
  const burgerThemeToggle = document.getElementById('burger-theme-toggle'); 
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  const themeFlash = document.getElementById('theme-flash');
  const savedTheme = localStorage.getItem('theme');

  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if(iconSun) iconSun.style.display = 'block';
      if(iconMoon) iconMoon.style.display = 'none';
      localStorage.setItem('theme', 'dark');
      if (burgerThemeToggle) burgerThemeToggle.innerText = 'Light Mode';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if(iconSun) iconSun.style.display = 'none';
      if(iconMoon) iconMoon.style.display = 'block';
      localStorage.setItem('theme', 'light');
      if (burgerThemeToggle) burgerThemeToggle.innerText = 'Dark Mode';
    }
  };

  if (savedTheme === 'dark') setTheme(true);

  if (burgerThemeToggle) {
    burgerThemeToggle.addEventListener('click', (e) => {
      themeFlash.style.opacity = '0.12';
      setTimeout(() => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
        themeFlash.style.opacity = '0';
      }, 120);
    });
  }

  // BURGER MENU
  const burgerToggle = document.getElementById('burger-toggle');
  const burgerDropdown = document.getElementById('burger-dropdown');

  burgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerDropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!burgerToggle.contains(e.target) && !burgerDropdown.contains(e.target)) {
      burgerDropdown.classList.remove('open');
    }
  });

  burgerDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') burgerDropdown.classList.remove('open');
  });

  // STICKY NAVBAR, BACK TO TOP & PROGRESS BAR
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const progressBar = document.getElementById('progress-bar');

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 0);
      backToTop.classList.toggle('visible', window.scrollY > 300);
      
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = pct + '%';
    });
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // SCROLLSPY & SECTION PROGRESS DOTS
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a, .burger-dropdown a');
  const sectionDots = document.querySelectorAll('.section-dot');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === id) link.classList.add('active');
        });
        sectionDots.forEach(dot => {
          dot.classList.remove('active');
          if (dot.getAttribute('href').substring(1) === id) dot.classList.add('active');
        });
      }
    });
  }, { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // SKILLS FILTER TOGGLE
  const filterBtns = document.querySelectorAll('#skills-filter .tag');
  const skillGroups = document.querySelectorAll('.skill-group');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      skillGroups.forEach(group => {
        if (filter === 'all' || group.getAttribute('data-category') === filter) {
          group.classList.remove('dimmed');
        } else {
          group.classList.add('dimmed');
        }
      });
    });
  });

  // PROJECT CARD MODAL
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalYear = document.getElementById('modal-year');
  const modalBullets = document.getElementById('modal-bullets');
  const modalExpanded = document.getElementById('modal-expanded');
  const modalTags = document.getElementById('modal-tags');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.querySelector('.project-name').textContent;
      modalYear.textContent = card.querySelector('.project-year').textContent;
      modalBullets.innerHTML = card.querySelector('.project-bullets').innerHTML;
      modalTags.innerHTML = card.querySelector('.project-tags').innerHTML;
      modalExpanded.textContent = card.getAttribute('data-expanded');
      modal.classList.add('open');
    });
  });

  const closeModal = () => modal.classList.remove('open');
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  // FOCUS MODE — DISTRACTION-FREE READING
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key.toLowerCase() === 'f') {
      document.body.classList.toggle('focus-mode');
    }
  });

  // TYPEWRITER
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
      if (!isDeleting && charIndex === current.length) { speed = 2600; isDeleting = true; } 
      else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 480; }
      setTimeout(type, speed);
    }
    setTimeout(type, 900);
  }

  // SCROLL REVEAL
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

  // COPY EMAIL
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

  // GSAP MAXIMALIST SCROLL EFFECTS
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-title-wrap", {
      y: "40vh",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-max",
        start: "top 58px",
        end: "bottom top",
        scrub: true,
      }
    });
  }

});