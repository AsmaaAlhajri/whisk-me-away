/* ============================================================
   customise.js - the options page

   Reached as customise.html?id=d1 from the category grid, for any
   product that has option groups (drinks and matcha powder).
   Builds the groups from OPTION_GROUPS in data.js, keeps a running
   total, then puts one configured line in the basket.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;          /* session + basket are loaded by app.js */

  if(!Store.currentUser()) return;                 // app.js redirects

  const params  = new URLSearchParams(location.search);
  const product = getProduct(params.get('id'));

  /* unknown product, or one with nothing to choose - nothing to do here */
  if(!product || !needsOptions(product)){
    location.replace('categories.html');
    return;
  }

  const groups = optionGroupsFor(product);
  const cat    = getCategory(product.cat);

  /* ---- header ---- */
  document.title = `Whisk Me Away · ${product.name}`;
  document.getElementById('prodJp').textContent   = product.jp;
  document.getElementById('prodName').textContent = product.name;
  document.getElementById('prodDesc').textContent = product.desc;

  const back = document.getElementById('backLink');
  back.href = `category.html?cat=${product.cat}`;
  document.getElementById('backLabel').textContent = cat ? cat.name : 'Back';

  /* ---- the product tile, same artwork as the grid ---- */
  document.getElementById('prodMedia').innerHTML = `
    <div class="cust__art" style="background-image:${cat ? cat.grad : ''}">
      ${ART[product.art || product.cat] || ''}
    </div>
    <p class="cust__base">Base price <strong>${KD(product.price)} KD</strong></p>
  `;

  /* ============================================================
     Selection state. Single groups hold one id, multi groups hold
     an array, count groups hold a number.
     ============================================================ */
  const chosen = {};
  groups.forEach(g => {
    if(g.type === 'multi')      chosen[g.id] = [];
    else if(g.type === 'count') chosen[g.id] = 0;
    else                        chosen[g.id] = g.default || (g.required ? g.choices[0].id : null);
  });

  /* ---- build the form ---- */
  const form = document.getElementById('optForm');
  form.innerHTML = groups.map(group => {
    if(group.type === 'count'){
      return `
        <fieldset class="opt" data-group="${group.id}">
          <legend class="opt__head">
            <span class="opt__label">${esc(group.label)}</span>
            ${group.note ? `<span class="opt__note">${esc(group.note)}</span>` : ''}
          </legend>
          <div class="opt__count">
            <div class="qty qty--lg">
              <button type="button" data-step="-1" aria-label="One fewer">&minus;</button>
              <span data-count="${group.id}">0</span>
              <button type="button" data-step="1" aria-label="One more">+</button>
            </div>
            <span class="opt__price">+${KD(group.price)} KD each</span>
          </div>
        </fieldset>`;
    }

    const input = group.type === 'multi' ? 'checkbox' : 'radio';
    return `
      <fieldset class="opt" data-group="${group.id}">
        <legend class="opt__head">
          <span class="opt__label">${esc(group.label)}</span>
          ${group.note ? `<span class="opt__note">${esc(group.note)}</span>` : ''}
        </legend>
        <div class="opt__choices">
          ${group.choices.map(c => `
            <label class="choice">
              <input type="${input}" name="${group.id}" value="${c.id}"
                     ${chosen[group.id] === c.id ? 'checked' : ''}>
              <span class="choice__body">
                <span class="choice__name">${esc(c.name)}</span>
                ${c.price ? `<span class="choice__price">+${KD(c.price)} KD</span>` : ''}
              </span>
            </label>`).join('')}
        </div>
      </fieldset>`;
  }).join('');

  /* ---- quantity + live total ---- */
  let qty = 1;
  const qtyValue  = document.getElementById('qtyValue');
  const liveTotal = document.getElementById('liveTotal');

  function refresh(){
    qtyValue.textContent  = qty;
    liveTotal.textContent = KD(configuredPrice(product, chosen) * qty) + ' KD';
  }

  form.addEventListener('change', e => {
    const field = e.target.closest('fieldset');
    if(!field) return;
    const id = field.dataset.group;
    const group = groups.find(g => g.id === id);
    if(!group) return;

    if(group.type === 'multi'){
      chosen[id] = [...form.querySelectorAll(`input[name="${id}"]:checked`)]
        .map(i => i.value)
        .sort();                                   /* sorted so the basket key is stable */
    } else {
      chosen[id] = e.target.value;
    }
    refresh();
  });

  /* the 0..max steppers inside count groups */
  form.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if(!step) return;
    const field = step.closest('fieldset');
    const id = field.dataset.group;
    const group = groups.find(g => g.id === id);
    const next = chosen[id] + Number(step.dataset.step);
    chosen[id] = Math.min(group.max ?? 9, Math.max(0, next));
    field.querySelector(`[data-count="${id}"]`).textContent = chosen[id];
    refresh();
  });

  document.getElementById('qtyMinus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1); refresh();
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    qty = Math.min(20, qty + 1); refresh();
  });

  /* ---- into the basket ---- */
  document.getElementById('addBtn').addEventListener('click', () => {
    addToCart(product.id, chosen, qty);
    setTimeout(() => goTo(`category.html?cat=${product.cat}`), 900);
  });

  refresh();
});
