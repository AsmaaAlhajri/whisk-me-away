/* ============================================================
   account.js - her details and her orders
   ============================================================ */

/* In a real shop the warehouse updates the status. There is no
   backend here, so the demo moves an order along by itself:
   preparing for 2 minutes, shipped until 10, then delivered.
   Change these two numbers (or just read order.status) whenever
   you plug in a real API. */
const PREPARING_MINUTES = 2;
const SHIPPED_MINUTES   = 10;

function statusOf(order){
  const minutes = (Date.now() - new Date(order.date).getTime()) / 60000;
  if(minutes < PREPARING_MINUTES) return 'preparing';
  if(minutes < SHIPPED_MINUTES)   return 'shipped';
  return 'delivered';
}

const STATUS_LABEL = {
  preparing: 'Preparing',
  shipped:   'On the way',
  delivered: 'Delivered'
};

/* "Block 4, Street 12, Avenue 3, House 21 - Salmiya, Hawalli" */
function addressLine(order){
  const a = order.address;
  if(!a || !a.city) return '';
  const parts = [
    a.block  ? 'Block ' + a.block   : null,
    a.street ? 'Street ' + a.street : null,
    a.avenue ? 'Avenue ' + a.avenue : null,
    a.house  ? 'House ' + a.house   : null
  ].filter(Boolean);
  const where = [a.city, a.governorate].filter(Boolean).join(', ');
  return `<p class="order__addr">${esc(parts.join(', '))}${
    parts.length && where ? ' &mdash; ' : ''}${esc(where)}</p>`;
}

/* who the gift is for, and the note they get with it */
function giftBlock(order){
  const g = order.gift;
  if(!g) return '';
  return `
    <div class="order__gift">
      <strong>Gift for ${esc(g.name)}</strong>${g.phone ? ' &middot; ' + esc(g.phone) : ''}
      ${g.message ? `<em>&ldquo;${esc(g.message)}&rdquo;</em>` : ''}
    </div>`;
}

function formatDate(iso){
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;          /* session + basket are loaded by app.js */

  const user = Store.currentUser();
  if(!user) return;

  /* ---------- her info ---------- */
  document.getElementById('avatar').textContent = user.name.trim()[0].toUpperCase();
  document.getElementById('userName').textContent = user.name;

  const rows = [
    ['Email', user.email],
    ['Phone', user.phone || 'Not added yet'],
    ['Area',  user.city  || 'Not added yet'],
    ['Governorate', user.governorate || 'Not added yet'],
    ['Member since', formatDate(user.joined)]
  ];
  document.getElementById('infoList').innerHTML = rows.map(([label, value]) => `
    <div class="info-row">
      <dt>${esc(label)}</dt>
      <dd>${esc(value)}</dd>
    </div>
  `).join('');

  /* ---------- her orders ---------- */
  const box = document.getElementById('orders');
  const orders = await Store.orders();

  if(orders.length === 0){
    box.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="#799567" stroke-width="1.4" stroke-linecap="round">
          <path d="M3 10h18c0 6-4 10-9 10s-9-4-9-10z"/><path d="M3 10h18"/>
          <path d="M8 6c1-1.5.5-2.5 0-3M12 5c1-1.5.5-2.5 0-3M16 6c1-1.5.5-2.5 0-3"/>
        </svg>
        <h4>No orders yet</h4>
        <p>Your first bowl is waiting on the shelves.</p>
        <a class="btn btn--primary" href="categories.html" data-nav>Start shopping</a>
      </div>`;
  } else {
    box.innerHTML = orders.map(order => {
      const status = statusOf(order);
      return `
        <article class="order">
          <div class="order__top">
            <div>
              <div class="order__id">${esc(order.id)}</div>
              <div class="order__date">${formatDate(order.date)}</div>
            </div>
            <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              ${order.gift ? '<span class="gift-tag">Gift</span>' : ''}
              <span class="status status--${status}">${STATUS_LABEL[status]}</span>
            </span>
          </div>
          ${addressLine(order)}
          ${giftBlock(order)}
          <div class="order__items">
            ${order.items.map(item => `
              <div class="order__line">
                <span>${esc(item.name)} &times; ${item.qty}${
                  item.options ? `<small class="order__opts">${esc(item.options)}</small>` : ''}</span>
                <span>${KD(item.price * item.qty)} KD</span>
              </div>`).join('')}
          </div>
          <div class="order__foot">
            <span>Total paid</span>
            <span class="order__total">${KD(order.total)} KD</span>
          </div>
        </article>`;
    }).join('');
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.getAttribute('href'));
    });
  });
});
