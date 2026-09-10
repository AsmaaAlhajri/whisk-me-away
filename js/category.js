/* ============================================================
   category.js - one page that serves all six categories.
   Which one it shows comes from the URL: category.html?cat=bowls
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;          /* session + basket are loaded by app.js */

  if(!Store.currentUser()) return;

  const params = new URLSearchParams(location.search);
  const cat = getCategory(params.get('cat'));

  /* unknown or missing category - send her back to the shop */
  if(!cat){ location.replace('categories.html'); return; }

  document.title = `Whisk Me Away · ${cat.name}`;
  document.getElementById('catJp').textContent    = cat.jp;
  document.getElementById('catName').innerHTML    = esc(cat.name);
  document.getElementById('catBlurb').textContent = cat.blurb;

  /* ---- products ---- */
  const grid = document.getElementById('prodGrid');
  const items = getProducts(cat.id);

  grid.innerHTML = items.map(p => `
    <article class="prod-card">
      <div class="prod-card__media" style="background-image:${cat.grad}">
        ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}
        ${ART[p.art] || ART[cat.id]}
      </div>
      <div class="prod-card__body">
        <h3 class="prod-card__name">${esc(p.name)}</h3>
        <p class="prod-card__jp">${esc(p.jp)}</p>
        <p class="prod-card__desc">${esc(p.desc)}</p>
        <div class="prod-card__foot">
          <span class="price">${KD(p.price)} <small>KD</small></span>
          ${needsOptions(p)
            ? `<a class="add-btn" href="customise.html?id=${p.id}" data-nav>Add to basket</a>`
            : `<button class="add-btn" data-add="${p.id}">Add to basket</button>`}
        </div>
      </div>
    </article>
  `).join('');

  /* add to basket, with a short confirmation on the button itself */
  /* products with options go to customise.html instead of straight in */
  grid.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.getAttribute('href'));
    });
  });

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.add);
      const original = btn.textContent;
      btn.textContent = 'Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('added');
      }, 1400);
    });
  });

  /* the breadcrumb is already wired for the fade transition by app.js */

  revealOnScroll('.prod-card');
});
