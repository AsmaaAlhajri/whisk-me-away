/* ============================================================
   account.js - her details and her orders
   ============================================================ */

/* How long she has to change her mind. A drink is made to order the
   moment it reaches the bar, so that window is short; everything else
   is picked off a shelf and can wait an hour. The database enforces
   the same two numbers, so keep them in step with the
   order_cancel_minutes() function in Supabase. */
const CANCEL_MINUTES_WITH_DRINKS = 10;
const CANCEL_MINUTES_OTHERWISE   = 60;

function cancelMinutes(order){
  return order.drinks > 0 ? CANCEL_MINUTES_WITH_DRINKS : CANCEL_MINUTES_OTHERWISE;
}
function minutesSince(order){
  return (Date.now() - new Date(order.date).getTime()) / 60000;
}
function minutesLeft(order){
  return cancelMinutes(order) - minutesSince(order);
}
function canCancel(order){
  return order.status !== 'cancelled' && minutesLeft(order) > 0;
}

/* what we tell her once that moment has gone */
function tooLateMessage(order){
  if(order.drinks > 0){
    return order.drinks === 1
      ? 'Our matcha barista is already making your drink at our matcha bar.'
      : 'Our matcha barista is already making your drinks at our matcha bar.';
  }
  return 'This order is already packed for delivery, so it can no longer be cancelled.';
}

/* In a real shop the kitchen updates the status. There is no back office
   here, so the demo moves an order along by itself. How long it spends
   being prepared depends on what is in it: drinks are quick, a parcel of
   equipment takes longer, and an order with both waits for the packing. */
const PREPARING_DRINKS_ONLY = 25;
const PREPARING_MIXED       = 45;
const PREPARING_NO_DRINKS   = 75;
const DELIVERING_MINUTES    = 5;

function prepareMinutes(order){
  const hasDrinks = order.drinks > 0;
  const hasOther  = order.items.some(i => i.category !== 'drinks');
  if(hasDrinks && hasOther) return PREPARING_MIXED;
  if(hasDrinks)             return PREPARING_DRINKS_ONLY;
  return PREPARING_NO_DRINKS;
}

function statusOf(order){
  if(order.status === 'cancelled') return 'cancelled';
  const minutes = minutesSince(order);
  const prep    = prepareMinutes(order);
  if(minutes < prep)                     return 'preparing';
  if(minutes < prep + DELIVERING_MINUTES) return 'delivering';
  return 'delivered';
}

const STATUS_LABEL = {
  preparing:  'Preparing',
  delivering: 'Delivering',
  delivered:  'Delivered',
  cancelled:  'Cancelled'
};

/* "Block 4, Street 12, Avenue 3, House 21 - Salmiya, Hawalli" */
function addressLine(order){
  const a = order.address;
  if(!a || !a.area) return '';
  const parts = [
    a.block  ? 'Block ' + a.block   : null,
    a.street ? 'Street ' + a.street : null,
    a.avenue ? 'Avenue ' + a.avenue : null,
    a.house  ? 'House ' + a.house   : null
  ].filter(Boolean);
  const where = a.area || '';
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

function formatTime(iso){
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

/* "10 Sept 2026 at 3:42 pm" */
function formatWhen(iso){
  return formatDate(iso) + ' at ' + formatTime(iso);
}

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;          /* session + basket are loaded by app.js */

  const user = Store.currentUser();
  if(!user) return;

  /* ---------- her info ---------- */
  function renderInfo(){
    const u = Store.currentUser();
    document.getElementById('avatar').textContent = u.name.trim()[0].toUpperCase();
    document.getElementById('userName').textContent = u.name;
    const rows = [
      ['Email', u.email],
      ['Phone', u.phone || 'Not added yet'],
      ['Area',  u.area  || 'Not added yet'],
      ['Member since', formatDate(u.joined)]
    ];
    document.getElementById('infoList').innerHTML = rows.map(([label, value]) => `
      <div class="info-row">
        <dt>${esc(label)}</dt>
        <dd>${esc(value)}</dd>
      </div>
    `).join('');
  }
  renderInfo();

  /* ---------- editing name, phone and area ---------- */
  const editBtn  = document.getElementById('editBtn');
  const editForm = document.getElementById('editForm');
  const infoList = document.getElementById('infoList');
  const edMsg    = document.getElementById('edMsg');
  document.getElementById('areaList').innerHTML = areaOptions();

  const edName  = document.getElementById('edName');
  const edPhone = document.getElementById('edPhone');
  const edArea  = document.getElementById('edArea');

  edPhone.addEventListener('input', () => {
    const clean = cleanPhone(edPhone.value);
    if(edPhone.value !== clean) edPhone.value = clean;
  });

  function showForm(on){
    editForm.hidden = !on;
    infoList.hidden = on;
    editBtn.hidden  = on;
    if(on){
      const u = Store.currentUser();
      edName.value  = u.name;
      edPhone.value = u.phone;
      edArea.value  = u.area;
      edMsg.textContent = '';
      edName.focus();
    }
  }

  editBtn.addEventListener('click', () => showForm(true));
  document.getElementById('cancelEdit').addEventListener('click', () => showForm(false));

  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = edName.value.trim();
    const phone = cleanPhone(edPhone.value);
    const area  = normaliseArea(edArea.value);

    if(!name)                       { edMsg.textContent = 'Please add your name.'; return; }
    if(!phoneIsValid(edPhone.value)){ edMsg.textContent = 'Phone needs to be 7 or 8 digits.'; return; }
    if(!area)                       { edMsg.textContent = 'Please pick your area from the list.'; return; }

    const save = editForm.querySelector('button[type="submit"]');
    save.disabled = true; save.textContent = 'Saving...';

    const {error} = await Store.saveProfile({name, phone, area});

    save.disabled = false; save.textContent = 'Save changes';
    if(error){ edMsg.textContent = 'Could not save. Please try again.'; return; }

    edMsg.textContent = '';      /* don't leave a stale error behind */
    renderInfo();
    showForm(false);
    showToast('Your details are updated.');
  });

  /* ---------- her orders ---------- */
  const box = document.getElementById('orders');
  let orders = await Store.orders();

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

    /* the cancel button fades on its own once the window closes, so the
       list repaints itself every half minute rather than only on load */
    function cancelRow(order){
      if(order.status === 'cancelled'){
        return order.cancelledAt
          ? `<p class="order__cancelled">Cancelled ${esc(formatWhen(order.cancelledAt))}</p>`
          : '';
      }
      const left = minutesLeft(order);
      const open = left > 0;
      return `
        <div class="order__actions">
          <button type="button" class="order__cancel${open ? '' : ' is-closed'}"
                  data-cancel="${esc(order.id)}"${open ? '' : ' aria-disabled="true"'}>
            ${open
              ? `Cancel order &middot; ${Math.max(1, Math.ceil(left))} min left`
              : 'Cancel order'}
          </button>
        </div>`;
    }

    function paint(){
      box.innerHTML = orders.map(order => {
        const status = statusOf(order);
        return `
        <article class="order${status === 'cancelled' ? ' is-cancelled' : ''}">
          <div class="order__top">
            <div>
              <div class="order__id">${esc(order.id)}</div>
              <div class="order__date">${esc(formatWhen(order.date))}</div>
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
          ${cancelRow(order)}
        </article>`;
      }).join('');
    }
    paint();

    /* keep the countdown honest without a reload, but never yank the
       button out from under a second tap */
    setInterval(() => {
      if(!box.querySelector('.is-armed')) paint();
    }, 30000);

    box.addEventListener('click', async e => {
      const btn = e.target.closest('[data-cancel]');
      if(!btn) return;

      const order = orders.find(o => o.id === btn.dataset.cancel);
      if(!order) return;

      /* the button stays clickable when it is faded, so it can explain
         itself rather than just refusing silently */
      if(!canCancel(order)) return showToast(tooLateMessage(order));

      /* cancelling cannot be undone, so ask for a second tap */
      if(!btn.dataset.armed){
        btn.dataset.armed = '1';
        btn.classList.add('is-armed');
        btn.textContent = 'Tap again to cancel';
        setTimeout(() => { if(btn.isConnected && btn.dataset.armed) paint(); }, 4000);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Cancelling...';

      const {error} = await Store.cancelOrder(order.id);

      if(error){
        /* the window may have closed while she was deciding */
        orders = await Store.orders();
        paint();
        return showToast(/time to cancel/i.test(error.message || '')
          ? tooLateMessage(order)
          : 'Could not cancel that order. Please try again.');
      }

      order.status = 'cancelled';
      order.cancelledAt = new Date().toISOString();
      paint();
      showToast(`Order ${order.id} is cancelled.`);
    });
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.getAttribute('href'));
    });
  });
});
