/* ============================================================
   story.js - the five growing regions and the map

   x / y are the region's real position plotted into the map SVG:
       x = (longitude - 128) * 24.5 + 10
       y = (45.7 - latitude) * 31  + 30
   dx / dy / anchor only move the printed label so the five names
   do not sit on top of each other.
   ============================================================ */

const REGIONS = [
  {
    id:'uji',
    name:'Uji',
    pref:'Kyoto Prefecture',
    x:200, y:360, dx:-14, dy:4, anchor:'end',
    since:'Growing tea since the 1100s',
    note:'The oldest matcha region in Japan, and still the reference point everyone else is measured against. Cool river mist sits over the fields most mornings, which slows the leaf down and sweetens it.',
    buy:'Uji Ceremonial &middot; Sakura Blend'
  },
  {
    id:'nishio',
    name:'Nishio',
    pref:'Aichi Prefecture',
    x:233, y:362, dx:0, dy:24, anchor:'middle',
    since:'Growing tea since the 1270s',
    note:'Flat, sandy river land that grows a huge share of the country’s tencha. Nishio matcha is dependable and vivid, which is why so much of it ends up in cafes rather than tea rooms.',
    buy:'Everyday Latte Grade &middot; every drink on the menu'
  },
  {
    id:'shizuoka',
    name:'Shizuoka',
    pref:'Shizuoka Prefecture',
    x:265, y:362, dx:14, dy:-6, anchor:'start',
    since:'Japan’s largest tea prefecture',
    note:'Mount Fuji sits behind the fields and the sea sits in front of them. Better known for sencha, but the high slopes here also grow a clean, brisk tencha we use in our blends.',
    buy:'Morning Mist Organic &middot; Hojicha Roast'
  },
  {
    id:'yame',
    name:'Yame',
    pref:'Fukuoka Prefecture',
    x:74, y:417, dx:-14, dy:-4, anchor:'end',
    since:'Famous for deep shade growing',
    note:'A mountain valley in northern Kyushu that shades its tea longer than almost anywhere else. The result is thick, heavy and low in bitterness — the one to drink on its own.',
    buy:'Deep-shade lots for our ceremonial tins'
  },
  {
    id:'kagoshima',
    name:'Kagoshima',
    pref:'Kagoshima Prefecture',
    x:76, y:462, dx:14, dy:5, anchor:'start',
    since:'The earliest harvest in Japan',
    note:'Volcanic soil at the southern tip of Kyushu, warm enough that picking starts weeks before Kyoto. Bold, grassy and bright green, and increasingly organic.',
    buy:'Kagoshima Reserve &middot; Morning Mist Organic'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if(!Store.currentUser()) return;

  const pins = document.getElementById('pins');
  const list = document.getElementById('regionList');
  const card = document.getElementById('regionCard');

  /* ---- pins on the map ---- */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  pins.innerHTML = REGIONS.map(r => `
    <g class="pin" data-region="${r.id}" tabindex="0" role="button"
       aria-label="${esc(r.name)}, ${esc(r.pref)}">
      <circle class="pin__pulse" cx="${r.x}" cy="${r.y}" r="9"/>
      <circle class="pin__dot"   cx="${r.x}" cy="${r.y}" r="6"/>
      <text class="pin__label" text-anchor="${r.anchor}"
            x="${r.x + r.dx}" y="${r.y + r.dy}">${esc(r.name)}</text>
    </g>
  `).join('');

  /* a soft dark pill behind each label, sized to the text, so names
     stay readable where they cross the land */
  pins.querySelectorAll('.pin').forEach(pin => {
    const label = pin.querySelector('.pin__label');
    const box = label.getBBox();
    const pad = 6;
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('class', 'pin__plate');
    rect.setAttribute('x', box.x - pad);
    rect.setAttribute('y', box.y - pad / 2);
    rect.setAttribute('width',  box.width  + pad * 2);
    rect.setAttribute('height', box.height + pad);
    rect.setAttribute('rx', (box.height + pad) / 2);
    pin.insertBefore(rect, label);
  });

  /* ---- the list beside it ---- */
  list.innerHTML = REGIONS.map(r => `
    <li>
      <button class="region-row" data-region="${r.id}">
        <span class="region-row__name">${esc(r.name)}</span>
        <span class="region-row__pref">${esc(r.pref)}</span>
      </button>
    </li>
  `).join('');

  /* ---- show one region ---- */
  function show(id){
    const r = REGIONS.find(x => x.id === id) || REGIONS[0];

    document.querySelectorAll('.pin').forEach(p =>
      p.classList.toggle('is-active', p.dataset.region === r.id));
    document.querySelectorAll('.region-row').forEach(b =>
      b.classList.toggle('is-active', b.dataset.region === r.id));

    card.innerHTML = `
      <p class="region-card__jp">${esc(r.since)}</p>
      <h3 class="region-card__name">${esc(r.name)}</h3>
      <p class="region-card__pref">${esc(r.pref)}</p>
      <p class="region-card__note">${esc(r.note)}</p>
      <p class="region-card__buy"><span>What we buy here</span>${r.buy}</p>
    `;
    /* re-run the fade-in each time the card changes */
    card.classList.remove('is-in');
    void card.offsetWidth;
    card.classList.add('is-in');
  }

  /* hover, focus and tap all select a region */
  document.querySelectorAll('.pin, .region-row').forEach(el => {
    const id = el.dataset.region;
    el.addEventListener('mouseenter', () => show(id));
    el.addEventListener('focus',      () => show(id));
    el.addEventListener('click',      () => show(id));
  });

  show(REGIONS[0].id);
  revealOnScroll('.journey__item');
});
