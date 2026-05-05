document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── CURSOR FOLLOWER ──
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
    let ringX = cursorX, ringY = cursorY;

    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX; cursorY = e.clientY;
        dot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      });

      function animateRing() {
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
      }
      requestAnimationFrame(animateRing);

      const hoverElements = document.querySelectorAll('a, button, .project-card, .tag, .status-badge');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          ring.style.width = '52px'; ring.style.height = '52px'; ring.style.borderColor = 'var(--ink-4)';
        });
        el.addEventListener('mouseleave', () => {
          ring.style.width = '32px'; ring.style.height = '32px'; ring.style.borderColor = 'var(--ink-3)';
        });
      });
    }

    // ── THEME TOGGLE ──
    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawerThemeToggle = document.getElementById('drawer-theme-toggle'); 
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
        if (drawerThemeToggle) drawerThemeToggle.innerText = 'Light Mode';
      } else {
        document.documentElement.removeAttribute('data-theme');
        if(iconSun) iconSun.style.display = 'none';
        if(iconMoon) iconMoon.style.display = 'block';
        localStorage.setItem('theme', 'light');
        if (drawerThemeToggle) drawerThemeToggle.innerText = 'Dark Mode';
      }
    };

    if (savedTheme === 'dark') setTheme(true);

    const handleThemeToggle = () => {
      themeFlash.style.opacity = '0.12';
      setTimeout(() => {
        setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
        themeFlash.style.opacity = '0';
      }, 120);
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', handleThemeToggle);
    if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', handleThemeToggle);

    // ── MOBILE NAV DRAWER ──
    const burgerToggle = document.getElementById('burger-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerClose = document.getElementById('drawer-close');

    const openDrawer = () => {
      navDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      navDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if(burgerToggle) burgerToggle.addEventListener('click', openDrawer);
    if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
    
    document.querySelectorAll('.drawer-links a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // ── SCROLL / BACK TO TOP RING ──
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.ring-progress');
    const radius = progressCircle ? progressCircle.r.baseVal.value : 0;
    const circumference = radius * 2 * Math.PI;
    
    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 0);
        backToTop.classList.toggle('visible', window.scrollY > 300);
        
        if (progressCircle) {
          const scrollPos = window.scrollY;
          const height = document.body.scrollHeight - window.innerHeight;
          const pct = Math.min(Math.max(scrollPos / height, 0), 1);
          progressCircle.style.strokeDashoffset = circumference - pct * circumference;
        }
      });
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── SCROLLSPY ──
    const sections = document.querySelectorAll('section');
    const navLinksList = [
      ...document.querySelectorAll('.nav-links a'), 
      ...document.querySelectorAll('.drawer-links a'),
      ...document.querySelectorAll('.section-dot'),
      ...document.querySelectorAll('#mini-toc a'),
      ...document.querySelectorAll('.mobile-section-nav a')
    ];

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === id) link.classList.add('active');
          });
        }
      });
    }, { root: null, rootMargin: '-30% 0px -70% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));

    // ── SKILLS FILTER TOGGLE ──
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

    // ── PROJECT CARD MODAL ──
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalBullets = document.getElementById('modal-bullets');
    const modalExpanded = document.getElementById('modal-expanded');
    const modalTags = document.getElementById('modal-tags');

    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if(e.target.closest('a')) return; // Ignore clicks on icon links
        modalTitle.textContent = card.querySelector('.project-name').textContent;
        modalYear.textContent = card.querySelector('.project-year').textContent;
        modalBullets.innerHTML = card.querySelector('.project-bullets').innerHTML;
        modalTags.innerHTML = card.querySelector('.project-tags').innerHTML;
        modalExpanded.textContent = card.getAttribute('data-expanded');
        modal.classList.add('open');
      });
    });

    const closeModalModal = () => modal.classList.remove('open');
    if(modalClose) modalClose.addEventListener('click', closeModalModal);
    if(modal) modal.addEventListener('click', (e) => { if(e.target === modal) closeModalModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModalModal(); });

    // ── FOCUS MODE ──
    const focusInd = document.getElementById('focus-indicator');
    document.addEventListener('keydown', (e) => {
      if (window.innerWidth < 768) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key.toLowerCase() === 'f') {
        document.body.classList.toggle('focus-mode');
        if(focusInd) {
          focusInd.classList.add('active');
          setTimeout(() => focusInd.classList.remove('active'), 2000);
        }
      }
    });

    // ── TYPEWRITER ──
    const roles = ['Full-Stack Developer', 'IoT Integrator', 'Cloud Enthusiast', 'UI/UX Thinker'];
    const typeTarget = document.getElementById('typewriter');

    if (typeTarget && !prefersReducedMotion) {
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
    } else if (typeTarget) {
      typeTarget.textContent = roles[0];
    }

    // ── SCROLL REVEAL ──
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (!prefersReducedMotion) {
      const appearObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      animateElements.forEach(el => appearObserver.observe(el));
    }

    // ── COPY EMAIL ──
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

    // ── GSAP MAXIMALIST SCROLL EFFECTS ──
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
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