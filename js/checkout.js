/* ============================================================
   checkout.js - delivery address, gift details, place the order

   This is where an order is actually written to Supabase, because
   this is where the address and gift details are collected.
   ============================================================ */

/* the customer's saved area, as a dropdown value */
function profileAreaValue(user){
  if(!user || !user.city) return '';

  const byName = GOVERNORATES.find(g => g.name === user.governorate);
  if(byName && byName.cities.includes(user.city)) return areaValue(byName.id, user.city);

  /* older accounts stored only a free-text area, so fall back to
     finding that city under whichever governorate owns it */
  const lc = user.city.toLowerCase();
  const gov = GOVERNORATES.find(g => g.cities.some(c => c.toLowerCase() === lc));
  if(!gov) return '';
  return areaValue(gov.id, gov.cities.find(c => c.toLowerCase() === lc));
}

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;

  const user = Store.currentUser();
  if(!user) return;                                  // app.js redirects

  /* nothing to check out */
  if(Store.cart().length === 0){
    location.replace('categories.html');
    return;
  }

  const msg = document.getElementById('msg');
  const say = (text, ok = false) => {
    msg.textContent = text;
    msg.classList.toggle('ok', ok);
  };

  /* ---------- address dropdown, prefilled from the account ---------- */
  const areaSelect = document.getElementById('coArea');
  const saved = profileAreaValue(user);
  areaSelect.innerHTML =
    `<option value="" disabled${saved ? '' : ' selected'}>Choose the area</option>` +
    areaOptions(saved);

  /* ---------- digits-only phone for the recipient ---------- */
  const giftPhone = document.getElementById('giftPhone');
  giftPhone.addEventListener('input', () => {
    const clean = cleanPhone(giftPhone.value);
    if(giftPhone.value !== clean) giftPhone.value = clean;
  });

  /* ---------- gift toggle + message counter ---------- */
  const isGift     = document.getElementById('isGift');
  const giftFields = document.getElementById('giftFields');
  const giftMsg    = document.getElementById('giftMessage');
  const giftCount  = document.getElementById('giftCount');

  isGift.addEventListener('change', () => {
    giftFields.hidden = !isGift.checked;
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
  renderSummary();

  /* ---------- place the order ---------- */
  const placeBtn = document.getElementById('placeBtn');

  placeBtn.addEventListener('click', async () => {
    const area   = parseArea(areaSelect.value);
    const block  = document.getElementById('coBlock').value.trim();
    const street = document.getElementById('coStreet').value.trim();
    const avenue = document.getElementById('coAvenue').value.trim();
    const house  = document.getElementById('coHouse').value.trim();

    const gift     = isGift.checked;
    const giftName = document.getElementById('giftName').value.trim();
    const giftRaw  = giftPhone.value;
    const giftTel  = cleanPhone(giftRaw);
    const giftText = giftMsg.value.trim();

    /* ---- validation ---- */
    if(!area)   return say('Please choose the delivery area.');
    if(!block)  return say('Please add the block.');
    if(!street) return say('Please add the street.');
    if(!house)  return say('Please add the house or building number.');
    if(gift){
      if(!giftName)              return say("Please add the recipient's full name.");
      if(!phoneIsValid(giftRaw)) return say("The recipient's mobile needs to be 7 or 8 digits.");
      if(giftText.length > 250)  return say('The gift message can be at most 250 characters.');
    }

    const items = Store.cart();
    if(items.length === 0) return;

    placeBtn.disabled = true;
    placeBtn.textContent = 'Placing...';
    say('');

    /* let any in-flight basket write land before we read it back */
    await Store._pushing;

    const {total} = cartTotals();
    const {data: order, error} = await sb.from('orders')
      .insert({
        user_id:      user.id,
        total,
        governorate:  area.governorate,
        city:         area.city,
        block, street, house,
        avenue:       avenue || null,
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
