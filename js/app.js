/* ============================================================
   app.js - shared engine for Whisk Me Away
   - cinematic forest scene + falling sakura
   - top bar (cart button + menu button)
   - centre menu modal (Home / My Account)
   - cart drawer, checkout, toast, page transitions
   Every page loads this file.
   ============================================================ */

/* ============================================================
   1. STORAGE - Supabase

   Customers, baskets and orders live in Postgres. Every table is
   protected by Row Level Security keyed on auth.uid(), so the
   browser can only ever reach the signed-in customer's own rows.

   The rest of the app is written synchronously, so the session and
   basket are loaded ONCE at boot (see AppReady at the bottom of
   this file) and the getters below just read that in-memory copy.
   Writes update memory immediately and push to Supabase right
   after, so the interface never waits on the network.
   ============================================================ */
const Store = {
  _user: null,
  _cart: [],
  _pushing: null,

  /* --- who is signed in --- */
  currentUser(){ return this._user; },
  session(){ return this._user ? this._user.email : null; },

  async load(){
    const {data:{user}} = await sb.auth.getUser();
    if(!user){ this._user = null; this._cart = []; return null; }

    const {data:profile} = await sb.from('profiles')
      .select('name,phone,area,created_at')
      .eq('id', user.id)
      .maybeSingle();

    const meta = user.user_metadata || {};
    this._user = {
      id:    user.id,
      email: user.email,
      name:  (profile && profile.name)  || meta.name  || '',
      phone: (profile && profile.phone) || meta.phone || '',
      area:  (profile && profile.area)  || meta.area  || '',
      joined:(profile && profile.created_at) || user.created_at
    };

    await this.loadCart();
    return this._user;
  },

  async logout(){
    await sb.auth.signOut();
    this._user = null;
    this._cart = [];
  },

  /* --- the basket --- */
  cart(){ return this._cart; },

  async loadCart(){
    if(!this._user){ this._cart = []; return; }
    const {data} = await sb.from('cart_items')
      .select('line_key,product_id,qty,opts')
      .eq('user_id', this._user.id);
    this._cart = (data || []).map(r => ({
      key: r.line_key, id: r.product_id, qty: r.qty, opts: r.opts
    }));
  },

  saveCart(items){
    this._cart = items;
    this._pushCart();
  },

  /* A basket is a handful of rows, so replacing it wholesale is
     simpler than working out which single line changed.

     These writes MUST be serialised. Two quick taps used to fire two
     overlapping delete-then-insert cycles, and the second insert hit
     the unique(user_id, line_key) constraint against a row the first
     had just re-added - so the whole insert failed and a line went
     missing. Chaining each push onto the last, and reading the cart
     when the push actually runs, means the final write always holds
     the current basket. _pushing lets checkout wait for it to land. */
  _pushCart(){
    if(!this._user) return Promise.resolve();

    const run = async () => {
      const uid  = this._user.id;
      const rows = this._cart.map(i => ({
        user_id:    uid,
        line_key:   keyOf(i),
        product_id: i.id,
        qty:        i.qty,
        opts:       i.opts || null
      }));
      await sb.from('cart_items').delete().eq('user_id', uid);
      if(rows.length) await sb.from('cart_items').insert(rows);
    };

    /* run on both settle paths, so one failed push never jams the queue */
    this._pushing = (this._pushing || Promise.resolve()).then(run, run);
    return this._pushing;
  },

  /* --- past orders, newest first --- */
  async orders(){
    if(!this._user) return [];
    const {data, error} = await sb.from('orders')
      .select('code,status,total,placed_at,order_items(name,qty,price,options)')
      .eq('user_id', this._user.id)
      .order('placed_at', {ascending:false});

    if(error) return [];
    return (data || []).map(o => ({
      id:     o.code,
      date:   o.placed_at,
      status: o.status,
      total:  Number(o.total),
      items:  (o.order_items || []).map(i => ({
        name: i.name, qty: i.qty, price: Number(i.price), options: i.options
      }))
    }));
  }
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
   3. THE BACKDROP
   A calm tinted page: soft blush and sage blooms on warm white.
   All of the colour lives in .scene in the stylesheet, so this
   only has to put the element on the page.
   ============================================================ */
function buildScene(){
  const scene = document.createElement('div');
  scene.className = 'scene';

  const canvas = document.createElement('canvas');
  canvas.id = 'sakura';

  document.body.prepend(canvas);
  document.body.prepend(scene);
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

  /* On the old dark page almost-white petals showed up well. On a
     pale page they vanish, so these are the two strongest pinks in
     the palette, outlined in a darker shade of the same blush. */
  const COLORS = ['#F3BABA', '#F8D0C8'];
  const OUTLINE = 'rgba(199,136,139,.55)';

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
      alpha: 0.55 + Math.random() * 0.4
    };
  }

  /* one petal: two rounded lobes, outlined so it reads on pale paper */
  function drawPetal(p){
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.6,  -s * 0.4, -s * 0.5, -s * 1.2, 0, -s);
    ctx.bezierCurveTo( s * 0.5,  -s * 1.2,  s * 0.6, -s * 0.4, 0,  0);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
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
  leaf: `<svg class="leaf" viewBox="0 0 24 24" fill="none" stroke="#5B744B" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s7 0 11-4c3-3 4-8 4-12z" fill="#F3BABA"/>
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

  $('#logoutBtn').addEventListener('click', async () => {
    try{ localStorage.removeItem('wma_remember'); }catch(e){}
    await Store.logout();
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

/* A basket line is identified by the product AND its options, so an
   oat-milk latte and an almond-milk latte sit on separate lines. */
function lineKey(productId, opts){
  return productId + '|' + JSON.stringify(opts || null);
}
function keyOf(line){
  return line.key || lineKey(line.id, line.opts);
}

function addToCart(productId, opts, qty){
  const product = getProduct(productId);
  if(!product) return;

  qty = Math.max(1, Number(qty) || 1);
  opts = opts || null;
  const key = lineKey(productId, opts);

  const items = Store.cart();
  const line = items.find(i => keyOf(i) === key);
  if(line){ line.qty += qty; }
  else{ items.push({key, id: productId, qty, opts}); }

  Store.saveCart(items);
  renderCart();
  bouncebadge();
  showToast(`${product.name} added to your basket`);
}

function setQty(key, delta){
  const items = Store.cart();
  const line = items.find(i => keyOf(i) === key);
  if(!line) return;
  line.qty += delta;
  const next = line.qty <= 0 ? items.filter(i => keyOf(i) !== key) : items;
  Store.saveCart(next);
  renderCart();
}

function removeFromCart(key){
  Store.saveCart(Store.cart().filter(i => keyOf(i) !== key));
  renderCart();
}

/* what one unit of this line costs, options included */
function linePrice(line){
  const p = getProduct(line.id);
  return p ? configuredPrice(p, line.opts) : 0;
}

function cartTotals(){
  const items = Store.cart();
  const subtotal = items.reduce((sum, i) => sum + linePrice(i) * i.qty, 0);
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
      const key = keyOf(i);
      const summary = optionSummary(p, i.opts);
      return `
        <div class="cart-item">
          <div class="cart-item__thumb">${ART[p.art] || ART[p.cat]}</div>
          <div>
            <div class="cart-item__name">${esc(p.name)}</div>
            ${summary ? `<div class="cart-item__opts">${esc(summary)}</div>` : ''}
            <div class="cart-item__price">${KD(linePrice(i))} KD each</div>
            <div class="qty">
              <button data-minus="${esc(key)}" aria-label="Decrease quantity">&minus;</button>
              <span>${i.qty}</span>
              <button data-plus="${esc(key)}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-remove="${esc(key)}">Remove</button>
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
async function checkout(){
  const items = Store.cart();
  const user  = Store.currentUser();
  if(items.length === 0 || !user) return;

  const {total} = cartTotals();
  const btn = $('#checkoutBtn');
  btn.disabled = true;

  /* let any in-flight basket write finish before we read it back */
  await Store._pushing;

  const {data: order, error} = await sb.from('orders')
    .insert({user_id: user.id, total})
    .select('id,code')
    .single();

  if(error || !order){
    btn.disabled = false;
    showToast('Could not place the order. Please try again.');
    return;
  }

  const lines = items.map(i => {
    const p = getProduct(i.id);
    return {
      order_id:   order.id,
      product_id: i.id,
      name:       p.name,
      qty:        i.qty,
      price:      linePrice(i),
      options:    optionSummary(p, i.opts) || null
    };
  });
  await sb.from('order_items').insert(lines);

  Store.saveCart([]);
  await Store._pushing;
  renderCart();
  btn.disabled = false;

  $('#cartOverlay').classList.remove('is-open');
  $('#cartPanel').classList.remove('is-open');
  showToast(`Order ${order.code} placed. We are preparing it now.`);

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
/* "Keep me signed in" was unticked? Then the session only lasts as
   long as the browser tab that created it. Supabase keeps its own
   session in localStorage, so we sign out on the first load in a
   new tab instead. */
async function enforceRemember(){
  let remember = true, sameTab = true;
  try{
    remember = localStorage.getItem('wma_remember') !== 'false';
    sameTab  = sessionStorage.getItem('wma_tab') === '1';
  }catch(e){ return; }
  if(!remember && !sameTab) await sb.auth.signOut();
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

   AppReady resolves once the Supabase session and basket are in
   memory. Every page script starts with `await AppReady`, so none
   of them read an empty Store before it has loaded.
   ============================================================ */
const AppReady = (async () => {
  await enforceRemember();
  await Store.load();
})();

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  buildScene();
  /* Sakura falls on the home page only. */
  if(page === 'home') startSakura(20);

  await AppReady;

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
