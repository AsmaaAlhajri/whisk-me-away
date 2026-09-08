/* ============================================================
   categories.js - the seven category cards
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = Store.currentUser();
  if(!user) return;                       // app.js already redirects

  /* a small hello above the title */
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent =
    `${timeOfDay}, ${user.name.split(' ')[0]}`;

  const grid = document.getElementById('catGrid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <a class="cat-card" href="category.html?cat=${cat.id}" data-nav
       style="background-image:linear-gradient(180deg,rgba(30,48,24,.04) 30%,rgba(30,48,24,.60)),${cat.grad}">
      <span class="cat-card__glow"></span>
      <div class="cat-card__art">${ART[cat.id]}</div>
      <div class="cat-card__body">
        <p class="cat-card__jp">${esc(cat.jp)}</p>
        <h3 class="cat-card__name">${esc(cat.name)}</h3>
        <span class="cat-card__go">
          Shop ${esc(cat.name.toLowerCase())}
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
          </svg>
        </span>
      </div>
    </a>
  `).join('');

  /* the art fills its 110px wrapper */
  grid.querySelectorAll('.cat-card__art svg').forEach(svg => {
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
  });

  /* cards are built after app.js wired the page, so wire them here */
  grid.querySelectorAll('[data-nav]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      goTo(card.getAttribute('href'));
    });
  });

  revealOnScroll('.cat-card');
});
