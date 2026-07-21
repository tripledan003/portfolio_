document.querySelectorAll('.project__header').forEach((header) => {
  const project = header.closest('.project');
  const panel = project.querySelector('.project__collapse-inner');

  header.addEventListener('click', () => {
    const open = !project.classList.contains('is-open');
    project.classList.toggle('is-open', open);
    header.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('inert', !open);
  });
});

const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', String(document.documentElement.getAttribute('data-theme') === 'dark'));

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
    localStorage.setItem('theme', next);
  });
}

const galleryImages = document.querySelectorAll('.project__images img');

if (galleryImages.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Chiudi">&times;</button>' +
    '<img class="lightbox__img" src="" alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  let lastFocused = null;

  function openLightbox(img) {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('is-visible');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-visible');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastFocused) lastFocused.focus();
  }

  galleryImages.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-visible')) closeLightbox();
  });
}

const navLinks = document.querySelectorAll('.nav__links a');
const scrollSections = document.querySelectorAll('main > section[id]');

if (navLinks.length && scrollSections.length) {
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  scrollSections.forEach((section) => sectionObserver.observe(section));
}
