/* ============================================================
   checkout.js - saved addresses, gift details, place the order

   The address a customer picks is COPIED onto the order, not just
   referenced, so editing or deleting an address later never
   rewrites where a past order actually went.
   ============================================================ */

/* "Block 4, Street 12, Avenue 3, House 21 - Salmiya" */
function addressLines(a){
  const parts = [
    a.block  ? 'Block '  + a.block  : null,
    a.street ? 'Street ' + a.street : null,
    a.avenue ? 'Avenue ' + a.avenue : null,
    a.house  ? 'House '  + a.house  : null
  ].filter(Boolean);
  return parts.join(', ') + (a.area ? ' — ' + a.area : '');
}

const PEN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M14 6l4 4"/></svg>`;
const BIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>
      <path d="M10 11v6M14 11v6"/></svg>`;

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;

  const user = Store.currentUser();
  if(!user) return;                                  // app.js redirects

  if(Store.cart().length === 0){
    location.replace('categories.html');
    return;
  }

  const msg = document.getElementById('msg');
  const say = (text, ok = false) => {
    msg.textContent = text;
    msg.classList.toggle('ok', ok);
  };

  /* ---------- elements ---------- */
  const addrList = document.getElementById('addrList');
  const addrNote = document.getElementById('addrNote');
  const addBtn   = document.getElementById('addAddrBtn');
  const addrForm = document.getElementById('addrForm');
  const addrMsg  = document.getElementById('addrMsg');
  const saveAddr = document.getElementById('saveAddrBtn');
  const adLabel  = document.getElementById('adLabel');
  const adArea   = document.getElementById('adArea');
  const adBlock  = document.getElementById('adBlock');
  const adStreet = document.getElementById('adStreet');
  const adAvenue = document.getElementById('adAvenue');
  const adHouse  = document.getElementById('adHouse');

  const isGift     = document.getElementById('isGift');
  const giftFields = document.getElementById('giftFields');
  const giftPhone  = document.getElementById('giftPhone');
  const giftMsg    = document.getElementById('giftMessage');
  const giftCount  = document.getElementById('giftCount');

  document.getElementById('areaList').innerHTML = areaOptions();

  /* ---------- the address book ---------- */
  let selectedId = null;
  let editingId  = null;          /* null while adding a new one */

  function renderAddresses(){
    const list = Store.addresses();

    if(list.length === 0){
      addrList.innerHTML = `<p class="addr-empty">
        Nothing saved yet. Add an address below and we will keep it for next time.
      </p>`;
    } else {
      if(!list.some(a => a.id === selectedId)) selectedId = list[0].id;
      addrList.innerHTML = list.map(a => `
        <div class="addr${a.id === selectedId ? ' is-picked' : ''}">
          <label class="addr__pick">
            <input type="radio" name="addr" value="${a.id}" ${a.id === selectedId ? 'checked' : ''}>
            <span class="addr__body">
              <span class="addr__label">${esc(a.label)}</span>
              <span class="addr__lines">${esc(addressLines(a))}</span>
            </span>
          </label>
          <div class="addr__tools">
            <button type="button" class="addr__tool" data-edit="${a.id}"
                    title="Edit this address" aria-label="Edit ${esc(a.label)}">${PEN}</button>
            <button type="button" class="addr__tool addr__tool--del" data-del="${a.id}"
                    title="Delete this address" aria-label="Delete ${esc(a.label)}">${BIN}</button>
          </div>
        </div>`).join('');
    }

    const full = list.length >= MAX_ADDRESSES;
    addBtn.hidden = full || !addrForm.hidden;

    addrNote.textContent = isGift.checked
      ? 'Not needed for a gift'
      : full ? `All ${MAX_ADDRESSES} saved` : `${list.length} of ${MAX_ADDRESSES} saved`;
  }

  /* pick one */
  addrList.addEventListener('change', e => {
    if(e.target.name === 'addr'){
      selectedId = e.target.value;
      renderAddresses();
    }
  });

  /* edit and delete */
  addrList.addEventListener('click', async e => {
    const edit = e.target.closest('[data-edit]');
    if(edit){
      const a = Store.addresses().find(x => x.id === edit.dataset.edit);
      if(a) openForm(a);
      return;
    }

    const del = e.target.closest('[data-del]');
    if(!del) return;

    /* one click arms it, a second within three seconds deletes - so a
       stray tap never throws away a saved address */
    if(!del.dataset.armed){
      del.dataset.armed = '1';
      del.classList.add('is-armed');
      del.title = 'Click again to delete';
      setTimeout(() => {
        delete del.dataset.armed;
        del.classList.remove('is-armed');
        del.title = 'Delete this address';
      }, 3000);
      return;
    }

    const {error} = await Store.removeAddress(del.dataset.del);
    if(error) return showToast('Could not delete that address.');
    if(selectedId === del.dataset.del) selectedId = null;
    renderAddresses();
    showToast('Address deleted.');
  });

  /* ---------- the add / edit form ---------- */
  function openForm(addr){
    editingId = addr ? addr.id : null;
    adLabel.value  = addr ? addr.label  : '';
    adArea.value   = addr ? addr.area   : (normaliseArea(user.area) || '');
    adBlock.value  = addr ? addr.block  : '';
    adStreet.value = addr ? addr.street : '';
    adAvenue.value = addr ? (addr.avenue || '') : '';
    adHouse.value  = addr ? addr.house  : '';
    addrMsg.textContent = '';
    saveAddr.textContent = addr ? 'Save changes' : 'Save address';
    addrForm.hidden = false;
    addBtn.hidden = true;
    adLabel.focus();
  }

  function closeForm(){
    addrForm.hidden = true;
    editingId = null;
    addrMsg.textContent = '';
    renderAddresses();
  }

  addBtn.addEventListener('click', () => openForm(null));
  document.getElementById('cancelAddrBtn').addEventListener('click', closeForm);

  saveAddr.addEventListener('click', async () => {
    const label  = adLabel.value.trim() || 'Home';
    const area   = normaliseArea(adArea.value);
    const block  = adBlock.value.trim();
    const street = adStreet.value.trim();
    const avenue = adAvenue.value.trim();
    const house  = adHouse.value.trim();

    if(!area)   { addrMsg.textContent = 'Please pick the area from the list.'; return; }
    if(!block)  { addrMsg.textContent = 'Please add the block.'; return; }
    if(!street) { addrMsg.textContent = 'Please add the street.'; return; }
    if(!house)  { addrMsg.textContent = 'Please add the house or building number.'; return; }

    const wasEditing = editingId;
    saveAddr.disabled = true;

    const fields = {label, area, block, street, house, avenue: avenue || null};
    const {data, error} = wasEditing
      ? await Store.updateAddress(wasEditing, fields)
      : await Store.addAddress(fields);

    saveAddr.disabled = false;

    if(error){
      addrMsg.textContent = /at most 4/i.test(error.message || '')
        ? 'You can save at most 4 addresses. Delete one first.'
        : 'Could not save that address. Please try again.';
      return;
    }

    selectedId = data.id;
    closeForm();
    showToast(wasEditing ? 'Address updated.' : 'Address saved.');
  });

  /* ---------- gift ---------- */
  giftPhone.addEventListener('input', () => {
    const clean = cleanPhone(giftPhone.value);
    if(giftPhone.value !== clean) giftPhone.value = clean;
  });

  isGift.addEventListener('change', () => {
    giftFields.hidden = !isGift.checked;
    /* a gift goes to the recipient, so their address is not ours to ask for */
    document.getElementById('addressPanel').classList.toggle('is-optional', isGift.checked);
    renderAddresses();
  });

  giftMsg.addEventListener('input', () => {
    giftCount.textContent = giftMsg.value.length;
  });

  /* ---------- order summary ---------- */
  function renderSummary(){
    const items = Store.cart();
    const {subtotal, total} = cartTotals();

    document.getElementById('summaryLines').innerHTML = items.map(i => {
      const p = getProduct(i.id);
      if(!p) return '';
      const opts = optionSummary(p, i.opts);
      return `
        <div class="summary__line">
          <div>
            <span class="summary__name">${esc(p.name)} &times; ${i.qty}</span>
            ${opts ? `<span class="summary__opts">${esc(opts)}</span>` : ''}
          </div>
          <span class="summary__price">${KD(linePrice(i) * i.qty)} KD</span>
        </div>`;
    }).join('');

    document.getElementById('sumSub').textContent   = KD(subtotal) + ' KD';
    document.getElementById('sumShip').textContent  = KD(subtotal > 0 ? SHIPPING : 0) + ' KD';
    document.getElementById('sumTotal').textContent = KD(total) + ' KD';
  }

  renderAddresses();
  renderSummary();

  /* ---------- place the order ---------- */
  const placeBtn = document.getElementById('placeBtn');

  placeBtn.addEventListener('click', async () => {
    const gift     = isGift.checked;
    const giftName = document.getElementById('giftName').value.trim();
    const giftRaw  = giftPhone.value;
    const giftTel  = cleanPhone(giftRaw);
    const giftText = giftMsg.value.trim();

    /* a gift is delivered to the recipient, so no address is needed */
    let addr = null;
    if(!gift){
      addr = Store.addresses().find(a => a.id === selectedId);
      if(!addr) return say('Please choose or add a delivery address.');
    } else {
      if(!giftName)              return say("Please add the recipient's full name.");
      if(!phoneIsValid(giftRaw)) return say("The recipient's mobile needs to be 7 or 8 digits.");
      if(giftText.length > 250)  return say('The gift message can be at most 250 characters.');
    }

    const items = Store.cart();
    if(items.length === 0) return;

    placeBtn.disabled = true;
    placeBtn.textContent = 'Placing...';
    say('');

    await Store._pushing;

    const {total} = cartTotals();
    const {data: order, error} = await sb.from('orders')
      .insert({
        user_id:      user.id,
        total,
        area:         addr ? addr.area   : null,
        block:        addr ? addr.block  : null,
        street:       addr ? addr.street : null,
        avenue:       addr ? addr.avenue : null,
        house:        addr ? addr.house  : null,
        is_gift:      gift,
        gift_name:    gift ? giftName : null,
        gift_phone:   gift ? giftTel  : null,
        gift_message: gift && giftText ? giftText : null
      })
      .select('id,code')
      .single();

    if(error || !order){
      placeBtn.disabled = false;
      placeBtn.textContent = 'Place order';
      return say('Could not place the order. Please try again.');
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

    showToast(`Order ${order.code} placed. We are preparing it now.`);
    setTimeout(() => goTo('account.html'), 1500);
  });
});
