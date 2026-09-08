/* ============================================================
   app.js - shared engine for Whisk Me Away
   - cinematic forest scene + falling sakura
   - top bar (cart button + menu button)
   - centre menu modal (Home / My Account)
   - cart drawer, checkout, toast, page transitions
   Every page loads this file.
   ============================================================ */

/* ============================================================
   1. STORAGE
   Everything lives in localStorage so the site works with no
   backend. Keys are prefixed with "wma_".
   NOTE: this is a bootcamp demo - passwords are stored in plain
   text in the browser. Never do this on a real store.
   ============================================================ */
const Store = {
  read(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch(e){ return fallback; }
  },
  write(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }
    catch(e){ /* storage blocked - the page still works, nothing persists */ }
  },

  /* --- users --- */
  users(){ return this.read('wma_users', []); },
  findUser(email){
    return this.users().find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
  },
  addUser(user){
    const users = this.users();
    users.push(user);
    this.write('wma_users', users);
  },

  /* --- session --- */
  session(){ return this.read('wma_session', null); },
  login(email, remember = true){
    this.write('wma_session', email);
    this.write('wma_remember', !!remember);
    /* a marker that only lives as long as this browser tab */
    try{ sessionStorage.setItem('wma_tab', '1'); }catch(e){}
  },
  logout(){
    localStorage.removeItem('wma_session');
    localStorage.removeItem('wma_remember');
    try{ sessionStorage.removeItem('wma_tab'); }catch(e){}
  },
  currentUser(){
    const email = this.session();
    return email ? this.findUser(email) : null;
  },

  /* --- cart (per user) --- */
  cartKey(){ return 'wma_cart_' + (this.session() || 'guest'); },
  cart(){ return this.read(this.cartKey(), []); },
  saveCart(items){ this.write(this.cartKey(), items); },

  /* --- orders (per user) --- */
  orderKey(){ return 'wma_orders_' + (this.session() || 'guest'); },
  orders(){ return this.read(this.orderKey(), []); },
  saveOrders(list){ this.write(this.orderKey(), list); }
};

/* ============================================================
   2. SMALL HELPERS
   ============================================================ */
const KD = n => Number(n).toFixed(3);          // Kuwaiti Dinar, 3 decimals
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* escape anything a user typed before putting it in the page */
function esc(str){
  return String(str).replace(/[&<>"']/g, c => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
  ));
}

/* fade out, then go */
function goTo(url){
  const veil = $('.veil');
  if(!veil){ location.href = url; return; }
  veil.classList.add('is-on');
  setTimeout(() => { location.href = url; }, 380);
}

/* ============================================================
   3. THE FOREST SCENE
   Layered SVG silhouettes + fog + fireflies + film grain.
   ============================================================ */
function buildScene(){
  const scene = document.createElement('div');
  scene.className = 'scene';

  scene.innerHTML = `
    <div class="fog fog--2"></div>
    <div class="fog fog--1"></div>

    <!-- far mountains -->
    <div class="layer layer--far" data-depth="6">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
        <path fill="#2C4524" d="M0 300 L150 190 L260 260 L400 130 L560 250 L700 160
          L860 270 L1000 180 L1160 265 L1300 175 L1440 280 L1440 420 L0 420 Z"/>
      </svg>
    </div>

    <!-- mid treeline -->
    <div class="layer layer--mid" data-depth="14">
      <svg viewBox="0 0 1440 380" preserveAspectRatio="none">
        <path fill="#25391E" d="M0 380 V250 l40-70 30 70 30-95 34 95 26-60 40 60 34-85
          32 85 40-55 36 55 34-100 34 100 30-70 32 70 40-90 36 90 32-55 34 55 30-95
          34 95 30-60 36 60 34-85 34 85 30-70 34 70 40-95 34 95 30-55 34 55 32-80
          34 80 30-60 36 60 34-90 34 90 30-50 34 50 V380 Z"/>
      </svg>
    </div>

    <!-- near trunks + ferns -->
    <div class="layer layer--near" data-depth="26">
      <svg viewBox="0 0 1440 340" preserveAspectRatio="none">
        <path fill="#16240F" d="M0 340 V300 q60-40 120-10 t120 0 120-30 120 20 120-25
          120 15 120-20 120 25 120-15 120 20 120-10 V340 Z"/>
        <rect x="70"   y="0" width="26" height="340" fill="#16240F"/>
        <rect x="300"  y="0" width="18" height="340" fill="#16240F" opacity=".9"/>
        <rect x="1080" y="0" width="22" height="340" fill="#16240F" opacity=".95"/>
        <rect x="1330" y="0" width="30" height="340" fill="#16240F"/>
        <path fill="#16240F" d="M96 90 q70-20 96-56 -10 46-56 70 z"/>
        <path fill="#16240F" d="M1330 120 q-70-22-96-58 10 48 56 72 z"/>
      </svg>
    </div>
  `;

  /* fireflies drifting up through the trees */
  for(let i = 0; i < 16; i++){
    const mote = document.createElement('span');
    mote.className = 'mote';
    mote.style.left = Math.random() * 100 + '%';
    mote.style.bottom = (Math.random() * 40) + '%';
    mote.style.animationDuration = (14 + Math.random() * 18) + 's';
    mote.style.animationDelay = (-Math.random() * 20) + 's';
    mote.style.opacity = 0.4 + Math.random() * 0.5;
    scene.appendChild(mote);
  }

  const grain = document.createElement('div');
  grain.className = 'grain';

  const canvas = document.createElement('canvas');
  canvas.id = 'sakura';

  document.body.prepend(canvas);
  document.body.prepend(grain);
  document.body.prepend(scene);

  /* gentle parallax on mouse move (desktop only) */
  if(window.matchMedia('(hover:hover)').matches){
    const layers = $$('.layer', scene);
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      layers.forEach(l => {
        const d = Number(l.dataset.depth || 10);
        l.style.transform = `translate(${-x * d}px, ${-y * d * 0.4}px)`;
      });
    });
  }
}

/* ============================================================
   4. FALLING SAKURA
   Canvas petals: each one drifts, spins and sways.
   ============================================================ */
function startSakura(count){
  const canvas = document.getElementById('sakura');
  if(!canvas) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, petals = [];

  const COLORS = ['#F3BABA', '#F8D0C8', '#F9DDD8', '#FFF0EC'];

  function resize(){
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makePetal(startAbove){
    return {
      x: Math.random() * w,
      y: startAbove ? -20 - Math.random() * h : Math.random() * h,
      size: 6 + Math.random() * 9,
      speed: 0.5 + Math.random() * 1.1,
      sway: 0.6 + Math.random() * 1.4,
      swayOffset: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      angle: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.45 + Math.random() * 0.5
    };
  }

  /* one petal: two rounded lobes with a soft notch, like a real blossom */
  function drawPetal(p){
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.6,  -s * 0.4, -s * 0.5, -s * 1.2, 0, -s);
    ctx.bezierCurveTo( s * 0.5,  -s * 1.2,  s * 0.6, -s * 0.4, 0,  0);
    ctx.fill();
    /* the little notch at the tip */
    ctx.globalAlpha = p.alpha * 0.35;
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.95, s * 0.14, s * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF8F5';
    ctx.fill();
    ctx.restore();
  }

  function tick(t){
    ctx.clearRect(0, 0, w, h);
    petals.forEach(p => {
      p.y += p.speed;
      p.x += Math.sin(t / 1400 + p.swayOffset) * p.sway * 0.5;
      p.angle += p.spin;
      if(p.y - p.size > h){
        p.y = -p.size * 2;
        p.x = Math.random() * w;
      }
      if(p.x < -40) p.x = w + 20;
      if(p.x > w + 40) p.x = -20;
      drawPetal(p);
    });
    requestAnimationFrame(tick);
  }

  resize();
  /* fewer petals on small screens so phones stay smooth */
  const total = window.innerWidth < 700 ? Math.round(count * 0.55) : count;
  petals = Array.from({length: total}, () => makePetal(false));

  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
}

/* ============================================================
   5. ICONS
   ============================================================ */
const ICONS = {
  leaf: `<svg class="leaf" viewBox="0 0 24 24" fill="none" stroke="#F3BABA" stroke-width="1.6"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s7 0 11-4c3-3 4-8 4-12z"/>
          <path d="M5 20c4-6 8-9 13-12"/>
        </svg>`,
  cart: `<svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>
        <circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>`,
  menu: `<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>`,
  home: `<svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>`,
  grid: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/>
        <rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>`,
  leafSolid: `<svg viewBox="0 0 24 24"><path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s7 0 11-4c3-3 4-8 4-12z"/><path d="M5 20c4-6 8-9 13-12"/></svg>`,
  whisk: `<svg viewBox="0 0 24 24"><path d="M12 3v8"/><path d="M7 11c0 5 2 9 5 9s5-4 5-9"/><path d="M7 11h10"/></svg>`,
  user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>`,
  out:  `<svg viewBox="0 0 24 24"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/></svg>`,
  close:`<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  arrow:`<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`,
  back: `<svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>`,
  check:`<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>`,
  bowl: `<svg viewBox="0 0 24 24" fill="none" stroke="#5B744B" stroke-width="1.4" stroke-linecap="round">
        <path d="M3 10h18c0 6-4 10-9 10s-9-4-9-10z"/><path d="M3 10h18"/>
        <path d="M8 6c1-1.5.5-2.5 0-3M12 5c1-1.5.5-2.5 0-3M16 6c1-1.5.5-2.5 0-3"/></svg>`
};

/* ============================================================
   6. TOP BAR + MENU MODAL + CART DRAWER
   Injected into every logged-in page so the markup stays in
   one place and can never drift between pages.
   ============================================================ */
function buildChrome(activePage){
  /* ---- top bar ---- */
  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML = `
    <a class="topbar__brand" href="home.html" data-nav>
      ${ICONS.leaf}
      <span>Whisk Me Away</span>
    </a>
    <div class="topbar__actions">
      <button class="icon-btn" id="cartBtn" aria-label="Open cart">
        ${ICONS.cart}
        <span class="icon-btn__badge" id="cartCount">0</span>
      </button>
      <button class="icon-btn" id="menuBtn" aria-label="Open menu">
        ${ICONS.menu}
      </button>
    </div>
  `;

  /* ---- centre menu (medium, 50% pink) ---- */
  const menu = document.createElement('div');
  menu.className = 'menu-overlay';
  menu.id = 'menuOverlay';
  menu.innerHTML = `
    <div class="menu-card" role="dialog" aria-modal="true" aria-label="Menu">
      <h3 class="menu-card__title">Where to?</h3>
      <p class="menu-card__sub">Menu &middot; Doko e</p>
      <div class="menu-list">
        <button class="menu-list__item ${activePage === 'home' ? 'is-active' : ''}" data-go="home.html">
          ${ICONS.home}
          <span>Home<small>Back to the beginning</small></span>
        </button>
        <button class="menu-list__item ${activePage === 'categories' ? 'is-active' : ''}" data-go="categories.html">
          ${ICONS.grid}
          <span>Categories<small>Shop all seven shelves</small></span>
        </button>
        <button class="menu-list__item ${activePage === 'story' ? 'is-active' : ''}" data-go="story.html">
          ${ICONS.leafSolid}
          <span>Our Story<small>Where our matcha grows</small></span>
        </button>
        <button class="menu-list__item ${activePage === 'steps' ? 'is-active' : ''}" data-go="steps.html">
          ${ICONS.whisk}
          <span>How to Whisk<small>Six steps, one bowl</small></span>
        </button>
        <button class="menu-list__item ${activePage === 'account' ? 'is-active' : ''}" data-go="account.html">
          ${ICONS.user}
          <span>My Account<small>Orders &amp; details</small></span>
        </button>
        <button class="menu-list__item" id="logoutBtn">
          ${ICONS.out}
          <span>Log out<small>See you soon</small></span>
        </button>
      </div>
      <button class="menu-card__close" id="menuClose">Close</button>
    </div>
  `;

  /* ---- cart drawer ---- */
  const cartOverlay = document.createElement('div');
  cartOverlay.className = 'cart-overlay';
  cartOverlay.id = 'cartOverlay';

  const cart = document.createElement('aside');
  cart.className = 'cart';
  cart.id = 'cartPanel';
  cart.innerHTML = `
    <div class="cart__head">
      <div>
        <span>Kago</span>
        <h3>Your Basket</h3>
      </div>
      <button class="cart__close" id="cartClose" aria-label="Close cart">${ICONS.close}</button>
    </div>
    <div class="cart__body" id="cartBody"></div>
    <div class="cart__foot">
      <div class="cart__row"><span>Subtotal</span><span id="cartSub">0.000 KD</span></div>
      <div class="cart__row"><span>Delivery in Kuwait</span><span id="cartShip">1.500 KD</span></div>
      <div class="cart__total"><span>Total</span><span id="cartTotal">0.000 KD</span></div>
      <button class="btn btn--forest btn--full" id="checkoutBtn">Place order</button>
    </div>
  `;

  /* ---- toast + page veil ---- */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'toast';
  toast.innerHTML = `${ICONS.check}<span id="toastText"></span>`;

  const veil = document.createElement('div');
  veil.className = 'veil';

  document.body.append(bar, menu, cartOverlay, cart, toast, veil);
  wireChrome();
  renderCart();
}

function wireChrome(){
  const menu = $('#menuOverlay');
  const cartOverlay = $('#cartOverlay');
  const cartPanel = $('#cartPanel');

  const openMenu  = () => menu.classList.add('is-open');
  const closeMenu = () => menu.classList.remove('is-open');
  const openCart  = () => {
    cartOverlay.classList.add('is-open');
    cartPanel.classList.add('is-open');
    $('#toast').classList.remove('is-on');   // it would cover the totals
  };
  const closeCart = () => { cartOverlay.classList.remove('is-open'); cartPanel.classList.remove('is-open'); };

  $('#menuBtn').addEventListener('click', openMenu);
  $('#menuClose').addEventListener('click', closeMenu);
  menu.addEventListener('click', e => { if(e.target === menu) closeMenu(); });

  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeMenu(); closeCart(); }
  });

  $$('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.go));
  });

  $('#logoutBtn').addEventListener('click', () => {
    Store.logout();
    goTo('index.html');
  });

  $$('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.getAttribute('href'));
    });
  });

  $('#checkoutBtn').addEventListener('click', checkout);
}

/* ============================================================
   7. CART LOGIC
   ============================================================ */
const SHIPPING = 1.500;

function addToCart(productId){
  const product = getProduct(productId);
  if(!product) return;

  const items = Store.cart();
  const line = items.find(i => i.id === productId);
  if(line){ line.qty += 1; }
  else{ items.push({id: productId, qty: 1}); }

  Store.saveCart(items);
  renderCart();
  bouncebadge();
  showToast(`${product.name} added to your basket`);
}

function setQty(productId, delta){
  const items = Store.cart();
  const line = items.find(i => i.id === productId);
  if(!line) return;
  line.qty += delta;
  const next = line.qty <= 0 ? items.filter(i => i.id !== productId) : items;
  Store.saveCart(next);
  renderCart();
}

function removeFromCart(productId){
  Store.saveCart(Store.cart().filter(i => i.id !== productId));
  renderCart();
}

function cartTotals(){
  const items = Store.cart();
  const subtotal = items.reduce((sum, i) => {
    const p = getProduct(i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);
  return {subtotal, count, total: subtotal + (subtotal > 0 ? SHIPPING : 0)};
}

function renderCart(){
  const body = $('#cartBody');
  if(!body) return;

  const items = Store.cart();
  const {subtotal, count, total} = cartTotals();

  if(items.length === 0){
    body.innerHTML = `
      <div class="cart__empty">
        ${ICONS.bowl}
        <p>Your basket is empty</p>
        <small>Pick something calm and green.</small>
      </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProduct(i.id);
      if(!p) return '';
      return `
        <div class="cart-item">
          <div class="cart-item__thumb">${ART[p.art] || ART[p.cat]}</div>
          <div>
            <div class="cart-item__name">${esc(p.name)}</div>
            <div class="cart-item__price">${KD(p.price)} KD each</div>
            <div class="qty">
              <button data-minus="${p.id}" aria-label="Decrease quantity">&minus;</button>
              <span>${i.qty}</span>
              <button data-plus="${p.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-remove="${p.id}">Remove</button>
        </div>`;
    }).join('');

    $$('[data-plus]',  body).forEach(b => b.onclick = () => setQty(b.dataset.plus,  1));
    $$('[data-minus]', body).forEach(b => b.onclick = () => setQty(b.dataset.minus, -1));
    $$('[data-remove]',body).forEach(b => b.onclick = () => removeFromCart(b.dataset.remove));
  }

  $('#cartSub').textContent   = KD(subtotal) + ' KD';
  $('#cartShip').textContent  = KD(subtotal > 0 ? SHIPPING : 0) + ' KD';
  $('#cartTotal').textContent = KD(total) + ' KD';

  const badge = $('#cartCount');
  badge.textContent = count;
  badge.classList.toggle('is-on', count > 0);

  $('#checkoutBtn').disabled = items.length === 0;
  $('#checkoutBtn').style.opacity = items.length === 0 ? .45 : 1;
}

function bouncebadge(){
  const badge = $('#cartCount');
  if(!badge) return;
  badge.classList.remove('badge-pop');
  void badge.offsetWidth;           // restart the animation
  badge.classList.add('badge-pop');
}

/* turn the basket into an order */
function checkout(){
  const items = Store.cart();
  if(items.length === 0) return;

  const {total} = cartTotals();
  const orders = Store.orders();

  const order = {
    id: 'WMA-' + String(1000 + orders.length + 1),
    date: new Date().toISOString(),
    status: 'preparing',
    total: total,
    items: items.map(i => {
      const p = getProduct(i.id);
      return {name: p.name, qty: i.qty, price: p.price};
    })
  };

  orders.unshift(order);
  Store.saveOrders(orders);
  Store.saveCart([]);
  renderCart();

  $('#cartOverlay').classList.remove('is-open');
  $('#cartPanel').classList.remove('is-open');
  showToast(`Order ${order.id} placed. We are preparing it now.`);

  setTimeout(() => goTo('account.html'), 1600);
}

/* ============================================================
   8. TOAST
   ============================================================ */
let toastTimer;
function showToast(message){
  const toast = $('#toast');
  if(!toast) return;
  /* if the basket is already open she can see the item land in it,
     and the toast would sit on top of the totals */
  const cart = $('#cartPanel');
  if(cart && cart.classList.contains('is-open')) return;
  $('#toastText').textContent = message;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2600);
}

/* ============================================================
   9. REVEAL ON SCROLL
   ============================================================ */
function revealOnScroll(selector){
  const items = $$(selector);
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('reveal'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const i = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('reveal'), (i % 6) * 90);
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: .12, rootMargin: '0px 0px -40px'});
  items.forEach(el => io.observe(el));
}

/* ============================================================
   10. AUTH GUARD
   Shop pages are only for logged-in customers.
   ============================================================ */
/* "Keep me signed in" was unticked? Then the session only lasts
   as long as the browser tab that created it. */
function enforceRemember(){
  if(!Store.session()) return;
  const remember = Store.read('wma_remember', true);
  let sameTab = false;
  try{ sameTab = sessionStorage.getItem('wma_tab') === '1'; }catch(e){ sameTab = true; }
  if(!remember && !sameTab) Store.logout();
}

function requireLogin(){
  if(!Store.currentUser()){
    location.replace('index.html');
    return false;
  }
  return true;
}

/* ============================================================
   11. BOOT
   data-page on <body> decides what gets built.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  enforceRemember();
  buildScene();

  /* petal density per page */
  const petals = {
    login: 34, signup: 26, home: 32, categories: 30,
    story: 18, steps: 14, category: 16, account: 14
  };
  startSakura(petals[page] ?? 20);

  /* login + signup have no top bar: there is no cart or account yet */
  if(page !== 'login' && page !== 'signup'){
    if(!requireLogin()) return;
    buildChrome(page);
  } else {
    const veil = document.createElement('div');
    veil.className = 'veil';
    document.body.append(veil);
  }
});
