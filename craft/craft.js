function initCraftHeader() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-compact', window.scrollY > 48);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

function initCraftNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('[data-newsletter-note]').textContent = 'Thank you. Collection updates will arrive with care.';
  });
}

initCraftHeader();
initCraftNewsletter();
