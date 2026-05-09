const products = [
  {
    id: 'ganesha',
    name: 'Ganesha Mukha Mask',
    price: 3499,
    priceText: '₹3,499',
    material: 'Papier-mâché, natural pigments, matte finish',
    size: '14 x 10 in',
    image: 'assets/ganesha-mask.png',
    line: 'An auspicious form for thresholds and sacred corners.',
    badge: 'Best Seller'
  },
  {
    id: 'chhau',
    name: 'Traditional Chhau Face Mask',
    price: 4299,
    priceText: '₹4,299',
    material: 'Papier-mâché, clay grain texture, hand-painted',
    size: '16 x 12 in',
    image: 'assets/chhau-mask.png',
    line: 'Inspired by expressive Chhau performance traditions.',
    badge: ''
  },
  {
    id: 'guardian',
    name: 'Vermilion Guardian Mask',
    price: 5999,
    priceText: '₹5,999',
    material: 'Papier-mâché, layered paint, archival matte coating',
    size: '18 x 13 in',
    image: 'assets/wall-decor-mask.png',
    line: 'A bold wall presence with protective visual energy.',
    badge: ''
  },
  {
    id: 'custom',
    name: 'Custom Mythic Mask',
    price: 7999,
    priceText: 'Starts at ₹7,999',
    material: 'Custom handmade construction',
    size: 'Made to order',
    image: 'assets/collector-mask.png',
    line: 'Made around a chosen deity, story, mood, or space.',
    badge: 'Made to Order'
  }
];

const testimonials = [
  {
    name: 'Ananya Rao',
    city: 'Bengaluru',
    role: 'Interior Designer',
    quote: 'Maskriti pieces have the rare balance of cultural depth and modern restraint. They work beautifully in premium homes.'
  },
  {
    name: 'Rohit Sen',
    city: 'Kolkata',
    role: 'Cultural Enthusiast',
    quote: 'The mask feels handmade in the best way: textured, expressive, and full of character.'
  },
  {
    name: 'Meera Kapoor',
    city: 'Mumbai',
    role: 'Gift Buyer',
    quote: 'It felt far more meaningful than a standard decor gift. The story behind the piece made it memorable.'
  }
];

const state = {
  cart: {},
  testimonial: 0,
  testimonialTimer: null
};

const money = value => `₹${Number(value).toLocaleString('en-IN')}`;
const byId = id => products.find(product => product.id === id);
const productAlt = {
  ganesha: 'Handcrafted Ganesha Mukha mask with ornate crown detailing',
  chhau: 'Traditional Chhau face mask inspired by Indian performance craft',
  guardian: 'Vermilion guardian mask for cultural wall decor',
  custom: 'Custom mythological mask handcrafted for collectors'
};

function initHeader() {
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

  menu.querySelectorAll('a,button').forEach(item => {
    item.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

function renderProducts() {
  const grid = document.querySelector('[data-product-grid]');
  grid.innerHTML = products.map(product => `
    <article class="product-card product-${product.id}">
      <div class="product-image product-image-wrap">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <img src="${product.image}" alt="${productAlt[product.id] || product.name}" loading="lazy" decoding="async" width="900" height="900">
      </div>
      <div class="product-body product-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.line}</p>
        <div class="product-meta" aria-label="${product.name} details">
          <span>${product.material}</span>
          <span>${product.size}</span>
        </div>
        <strong class="product-price">${product.priceText}</strong>
        <div class="product-actions">
          <button class="btn small primary btn-primary" type="button" data-add="${product.id}">Add to Cart</button>
          <button class="btn small quiet btn-secondary" type="button" data-details="${product.id}">View Details</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    const detail = event.target.closest('[data-details]');
    if (add) addToCart(add.dataset.add);
    if (detail) openModal(detail.dataset.details);
  });
}

function initCart() {
  document.querySelectorAll('[data-cart-open]').forEach(button => button.addEventListener('click', openCart));
  document.querySelector('[data-cart-close]').addEventListener('click', closeCart);
  document.querySelector('[data-cart-overlay]').addEventListener('click', closeCart);
  document.querySelector('[data-checkout]').addEventListener('click', checkout);
  document.querySelector('[data-cart-items]').addEventListener('click', event => {
    const action = event.target.closest('[data-qty], [data-remove]');
    if (!action) return;
    if (action.dataset.remove) {
      delete state.cart[action.dataset.remove];
    } else {
      updateQty(action.dataset.qty, Number(action.dataset.delta));
    }
    renderCart();
  });
  renderCart();
}

function openCart() {
  document.querySelector('[data-cart-drawer]').classList.add('is-open');
  document.querySelector('[data-cart-drawer]').setAttribute('aria-hidden', 'false');
  document.querySelector('[data-cart-overlay]').classList.add('is-open');
}

function closeCart() {
  document.querySelector('[data-cart-drawer]').classList.remove('is-open');
  document.querySelector('[data-cart-drawer]').setAttribute('aria-hidden', 'true');
  document.querySelector('[data-cart-overlay]').classList.remove('is-open');
}

function addToCart(id) {
  const product = byId(id);
  if (!state.cart[id]) {
    state.cart[id] = { ...product, qty: 0 };
  }
  state.cart[id].qty += 1;
  renderCart();
  openCart();
}

function updateQty(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id].qty += delta;
  if (state.cart[id].qty <= 0) delete state.cart[id];
}

function renderCart() {
  const items = Object.values(state.cart);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  document.querySelector('[data-cart-count]').textContent = count;
  document.querySelector('[data-mobile-cart-count]').textContent = count;
  document.querySelector('[data-cart-subtotal]').textContent = money(subtotal);
  document.querySelector('[data-cart-empty]').hidden = count > 0;
  document.querySelector('[data-cart-items]').innerHTML = items.map(item => `
    <article class="cart-item">
      <img src="${item.image}" alt="${productAlt[item.id] || item.name}" loading="lazy" decoding="async" width="72" height="72">
      <div>
        <h3>${item.name}</h3>
        <p>${item.priceText}</p>
        <div class="qty-row">
          <button type="button" data-qty="${item.id}" data-delta="-1" aria-label="Decrease ${item.name}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="${item.id}" data-delta="1" aria-label="Increase ${item.name}">+</button>
          <button class="remove" type="button" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join('');
}

function checkout() {
  const items = Object.values(state.cart);
  if (!items.length) return;
  const lines = items.map((item, index) => `${index + 1}. ${item.name} x ${item.qty} - ${item.priceText}`).join('\n');
  const subtotal = money(items.reduce((sum, item) => sum + item.qty * item.price, 0));
  const text = `Hello Maskriti, I am interested in these pieces:\n${lines}\nSubtotal: ${subtotal}\nPlease share availability and delivery details.`;
  window.open(`https://wa.me/910000000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function openModal(id) {
  const product = byId(id);
  const modal = document.querySelector('[data-modal]');
  document.querySelector('[data-modal-body]').innerHTML = `
    <div class="modal-grid">
      <div class="modal-image"><img src="${product.image}" alt="${productAlt[product.id] || product.name}" decoding="async" width="900" height="900"></div>
      <div>
        <p class="eyebrow">Product Details</p>
        <h2 id="modal-title">${product.name}</h2>
        <strong class="modal-price">${product.priceText}</strong>
        <p>${product.line}</p>
        <dl>
          <div><dt>Material</dt><dd>${product.material}</dd></div>
          <div><dt>Size</dt><dd>${product.size}</dd></div>
          <div><dt>Price</dt><dd>${product.priceText}</dd></div>
        </dl>
        <button class="btn primary" type="button" data-modal-add="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.querySelector('[data-modal-add]').addEventListener('click', () => addToCart(product.id));
}

function closeModal() {
  const modal = document.querySelector('[data-modal]');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function initModal() {
  document.querySelector('[data-modal-close]').addEventListener('click', closeModal);
  document.querySelector('[data-modal]').addEventListener('click', event => {
    if (event.target.matches('[data-modal]')) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      closeCart();
    }
  });
}

function renderTestimonial() {
  const item = testimonials[state.testimonial];
  document.querySelector('[data-testimonial-card]').innerHTML = `
    <span class="quote-mark" aria-hidden="true">“</span>
    <blockquote>${item.quote}</blockquote>
    <p>${item.name}</p>
    <span>${item.role} · ${item.city}</span>
  `;
  document.querySelectorAll('[data-testimonial-dot]').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === state.testimonial);
    dot.setAttribute('aria-current', index === state.testimonial ? 'true' : 'false');
  });
}

function shiftTestimonial(step) {
  state.testimonial = (state.testimonial + step + testimonials.length) % testimonials.length;
  renderTestimonial();
}

function initTestimonials() {
  const wrap = document.querySelector('[data-testimonial-wrap]');
  const dots = document.querySelector('[data-testimonial-dots]');
  dots.innerHTML = testimonials.map((_, index) => `<button type="button" data-testimonial-dot="${index}" aria-label="Show testimonial ${index + 1}"></button>`).join('');
  dots.addEventListener('click', event => {
    const dot = event.target.closest('[data-testimonial-dot]');
    if (!dot) return;
    state.testimonial = Number(dot.dataset.testimonialDot);
    renderTestimonial();
  });
  document.querySelector('[data-testimonial-prev]').addEventListener('click', () => shiftTestimonial(-1));
  document.querySelector('[data-testimonial-next]').addEventListener('click', () => shiftTestimonial(1));
  const start = () => {
    stop();
    state.testimonialTimer = window.setInterval(() => shiftTestimonial(1), 5000);
  };
  const stop = () => window.clearInterval(state.testimonialTimer);
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  renderTestimonial();
  start();
}

function initNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const note = form.querySelector('[data-newsletter-note]');
    note.textContent = 'Thank you. Collection updates will arrive with care.';
  });
}

initHeader();
renderProducts();
initCart();
initModal();
initTestimonials();
initNewsletter();
