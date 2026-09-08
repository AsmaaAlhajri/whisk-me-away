/* ============================================================
   data.js - categories, products and the SVG artwork
   Everything the shop displays comes from here, so adding a
   product is just adding one object to the PRODUCTS array.
   ============================================================ */

/* ---- Hand-drawn SVG art, one per category ---------------- */
const ART = {

  whisks: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 18v34" stroke="#F9DDD8" stroke-width="6"/>
      <path d="M40 20v-4M50 18v-6M60 20v-4" stroke="#F3BABA"/>
      <path d="M34 52c0 12 5 22 16 22s16-10 16-22" stroke="#F3BABA"/>
      <path d="M38 52c0 13 3 24 12 24M62 52c0 13-3 24-12 24" opacity=".85"/>
      <path d="M42 52c0 14 1 25 8 25M58 52c0 14-1 25-8 25" opacity=".65"/>
      <path d="M34 52h32" stroke="#F8D0C8" stroke-width="3"/>
      <path d="M30 84h40" stroke="#A7B59E" stroke-width="3"/>
    </svg>`,

  /* a small matcha tin: the can the powder is actually kept in */
  matcha: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <!-- tin body -->
      <rect x="30" y="28" width="40" height="57" rx="6"
            fill="rgba(121,149,103,.55)" stroke="#F9DDD8"/>
      <!-- paper label wrapped around the middle -->
      <rect x="30" y="46" width="40" height="23" fill="rgba(249,221,216,.92)" stroke="none"/>
      <path d="M30 46h40M30 69h40" stroke="#F3BABA" stroke-width="2"/>
      <!-- the leaf printed on the label -->
      <path d="M56 51c-8 1-12 6-11 11 4 1 9-1 11-5 1-2 1-4 0-6z"
            fill="#799567" stroke="none"/>
      <path d="M45 62c4-4 7-6 11-7" stroke="#5B744B" stroke-width="1.6"/>
      <!-- press-on lid -->
      <rect x="26" y="16" width="48" height="14" rx="5"
            fill="rgba(243,186,186,.75)" stroke="#F9DDD8"/>
      <path d="M34 16v-2a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v2"
            fill="rgba(243,186,186,.45)" stroke="#F9DDD8"/>
      <path d="M33 23h34" stroke="#FFF8F5" stroke-width="1.4" opacity=".5"/>
    </svg>`,

  bowls: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 44h60c0 20-12 34-30 34S20 64 20 44z" fill="rgba(121,149,103,.5)" stroke="#F9DDD8"/>
      <path d="M20 44h60" stroke="#F3BABA" stroke-width="3"/>
      <path d="M26 50c8 4 40 4 48 0" stroke="#F8D0C8" opacity=".8"/>
      <path d="M38 84h24" stroke="#A7B59E" stroke-width="3"/>
      <path d="M36 34c2-5 0-8-2-11M50 30c2-5 0-8-2-11M64 34c2-5 0-8-2-11" stroke="#F9DDD8" opacity=".7"/>
    </svg>`,

  spoons: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 76 62 30" stroke="#F9DDD8" stroke-width="5"/>
      <path d="M58 24c8-6 16-4 18 2 2 7-5 12-12 12-5 0-8-3-8-7 0-3 1-5 2-7z"
        fill="rgba(243,186,186,.6)" stroke="#F3BABA"/>
      <path d="M24 76c-3 2-5 4-5 6" stroke="#A7B59E"/>
      <path d="M40 58c4 2 8 2 11 0" stroke="#F8D0C8" opacity=".7"/>
    </svg>`,

  glasses: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 18h36v58a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8z" fill="rgba(249,221,216,.22)" stroke="#F9DDD8"/>
      <path d="M32 46h36v30a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8z" fill="rgba(121,149,103,.55)" stroke="none"/>
      <path d="M32 46h36" stroke="#F3BABA" stroke-width="3"/>
      <path d="M32 40h36" stroke="#F8D0C8" opacity=".55"/>
      <path d="M40 26v10" stroke="#FFF8F5" opacity=".55"/>
      <circle cx="58" cy="60" r="2" fill="#F3BABA" stroke="none"/>
    </svg>`,

  drinks: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 24h40l-4 58a8 8 0 0 1-8 7H42a8 8 0 0 1-8-7z" fill="rgba(249,221,216,.20)" stroke="#F9DDD8"/>
      <path d="M32 52h36l-2 30a8 8 0 0 1-8 7H42a8 8 0 0 1-8-7z" fill="rgba(121,149,103,.6)" stroke="none"/>
      <path d="M31 44h38" stroke="#F3BABA" stroke-width="3"/>
      <path d="M32 52h36" stroke="#F8D0C8" stroke-width="2.4" opacity=".9"/>
      <path d="M60 20 68 8" stroke="#F3BABA" stroke-width="4"/>
      <circle cx="42" cy="66" r="2.6" fill="#F9DDD8" stroke="none"/>
      <circle cx="56" cy="74" r="2" fill="#F9DDD8" stroke="none" opacity=".8"/>
      <path d="M38 34h6M50 34h12" stroke="#FFF8F5" opacity=".45"/>
    </svg>`,

  /* not a category - a product can point at this with art:'hotcup' */
  hotcup: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M28 40h44v26a16 16 0 0 1-16 16H44a16 16 0 0 1-16-16z"
            fill="rgba(249,221,216,.22)" stroke="#F9DDD8"/>
      <path d="M30 52h40v14a16 16 0 0 1-16 16H46a16 16 0 0 1-16-16z"
            fill="rgba(121,149,103,.6)" stroke="none"/>
      <path d="M30 52h40" stroke="#F3BABA" stroke-width="2.6"/>
      <path d="M72 46h6a9 9 0 0 1 0 18h-6" stroke="#F3BABA"/>
      <path d="M26 40h48" stroke="#F3BABA" stroke-width="3"/>
      <path d="M42 30c-5-6 4-9 0-15M56 30c-5-6 4-9 0-15" stroke="#F9DDD8" opacity=".8"/>
      <path d="M36 88h28" stroke="#A7B59E" stroke-width="3"/>
    </svg>`,

  holders: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M28 46a22 22 0 0 1 44 0v6a22 22 0 0 1-44 0z" fill="rgba(243,186,186,.45)" stroke="#F9DDD8"/>
      <path d="M28 52c0 16 10 26 22 26s22-10 22-26" stroke="#F3BABA"/>
      <path d="M50 26v20" stroke="#A7B59E" stroke-width="4"/>
      <path d="M42 78h16" stroke="#A7B59E" stroke-width="3"/>
      <path d="M36 46c6 4 22 4 28 0" stroke="#F8D0C8" opacity=".75"/>
    </svg>`
};

/* ---- Categories ------------------------------------------ */
const CATEGORIES = [
  {
    id:'whisks',
    name:'Whisks',
    jp:'Chasen',
    blurb:'Hand-split bamboo chasen, 80 to 120 prongs, carved by one artisan from a single node.',
    grad:'linear-gradient(150deg,#799567,#35522B)'
  },
  {
    id:'matcha',
    name:'Matcha Powder',
    jp:'Matcha',
    blurb:'Stone-milled first-harvest leaves from Uji and Kagoshima, sealed the week they are ground.',
    grad:'linear-gradient(150deg,#A7B59E,#5B744B)'
  },
  {
    id:'bowls',
    name:'Bowls',
    jp:'Chawan',
    blurb:'Wide-mouthed chawan glazed in blush and moss, thrown to hold the heat of the whisk.',
    grad:'linear-gradient(150deg,#F3BABA,#799567)'
  },
  {
    id:'spoons',
    name:'Spoons',
    jp:'Chashaku',
    blurb:'Slender bamboo scoops, each one curve of a single stalk, measuring the perfect gram.',
    grad:'linear-gradient(150deg,#F8D0C8,#5B744B)'
  },
  {
    id:'glasses',
    name:'Glasses',
    jp:'Glass',
    blurb:'Tall, thin-walled glass made for the layered iced matcha you want to photograph.',
    grad:'linear-gradient(150deg,#A7B59E,#35522B)'
  },
  {
    id:'drinks',
    name:'Matcha Drinks',
    jp:'Nomimono',
    blurb:'Drinks made to order at our counter and sent out cold, whisked the minute your order comes in. Iced lattes, strawberry matcha, boba and the rest of the menu.',
    grad:'linear-gradient(150deg,#F3BABA,#5B744B)'
  },
  {
    id:'holders',
    name:'Whisk Holders',
    jp:'Kusenaoshi',
    blurb:'Ceramic kusenaoshi that dry your chasen in shape, so the prongs never lose their bloom.',
    grad:'linear-gradient(150deg,#F9DDD8,#799567)'
  }
];

/* ---- Products -------------------------------------------- */
/* price is in Kuwaiti Dinar (KD) */
const PRODUCTS = [

  /* --- Whisks --- */
  {id:'w1', cat:'whisks', name:'Kyoto 100',        jp:'Hyappondate', price:14.500, tag:'Bestseller',
   desc:'100 prongs of Kyoto bamboo. The softest, thickest foam for daily usucha.'},
  {id:'w2', cat:'whisks', name:'Sakura 80',        jp:'Chasen',      price:11.750, tag:'',
   desc:'80 prongs, pale pink-toned bamboo. Forgiving and light in the hand for beginners.'},
  {id:'w3', cat:'whisks', name:'Kurotake Noir',    jp:'Kurotake',    price:19.000, tag:'Limited',
   desc:'Rare black bamboo, aged three winters. A dramatic piece for the counter.'},
  {id:'w4', cat:'whisks', name:'Mori 120',         jp:'Chasen',      price:22.500, tag:'',
   desc:'120 fine prongs for ceremonial koicha. Whips the thickest tea into silk.'},
  {id:'w5', cat:'whisks', name:'Petite Travel Whisk', jp:'Tabi',     price:9.250,  tag:'New',
   desc:'A shorter chasen with its own linen pouch, made for desks and hotel rooms.'},
  {id:'w6', cat:'whisks', name:'Shiro Ivory',      jp:'Shiratake',   price:16.000, tag:'',
   desc:'Sun-bleached ivory bamboo with 90 prongs. Understated and very photogenic.'},

  /* --- Matcha powder --- */
  {id:'m1', cat:'matcha', name:'Uji Ceremonial',   jp:'Uji',        price:18.500, tag:'Bestseller',
   desc:'First-harvest Uji leaves, stone-milled slowly. Sweet, deep, almost no bitterness.'},
  {id:'m2', cat:'matcha', name:'Sakura Blend',     jp:'Sakura',     price:15.750, tag:'Girls’ favourite',
   desc:'Ceremonial matcha with real cherry blossom. Floral, soft, made for pink lattes.'},
  {id:'m3', cat:'matcha', name:'Everyday Latte Grade', jp:'Nichijo', price:11.000, tag:'',
   desc:'Bold enough to cut through milk and ice. Our house tin for iced matcha.'},
  {id:'m4', cat:'matcha', name:'Kagoshima Reserve', jp:'Kagoshima', price:24.000, tag:'Limited',
   desc:'Single-estate, shaded 30 days. Umami-heavy with a long, cool finish.'},
  {id:'m5', cat:'matcha', name:'Hojicha Roast',    jp:'Hojicha',    price:9.500,  tag:'',
   desc:'Roasted stem tea, caffeine-light and toasty. Lovely warm on a slow evening.'},
  {id:'m6', cat:'matcha', name:'Morning Mist Organic', jp:'Asagiri', price:16.250, tag:'Organic',
   desc:'JAS-certified organic, bright and grassy. The one we drink before the shop opens.'},

  /* --- Bowls --- */
  {id:'b1', cat:'bowls', name:'Blush Moon Chawan', jp:'Chawan',     price:21.000, tag:'Bestseller',
   desc:'Wide blush glaze with a pooled cream centre. Every bowl fires slightly differently.'},
  {id:'b2', cat:'bowls', name:'Moss Stone Bowl',   jp:'Koke',       price:23.500, tag:'',
   desc:'Deep moss glaze over speckled clay. Heavy base, keeps the tea hot to the last sip.'},
  {id:'b3', cat:'bowls', name:'Petal Rim',         jp:'Hanabira',   price:26.000, tag:'New',
   desc:'A scalloped petal rim in soft pink. Delicate to look at, sturdy to hold.'},
  {id:'b4', cat:'bowls', name:'Forest Ash',        jp:'Hai',        price:19.750, tag:'',
   desc:'Ash-glazed and matte, the colour of pine bark after rain.'},
  {id:'b5', cat:'bowls', name:'Snow Cloud Katakuchi', jp:'Katakuchi', price:28.500, tag:'Limited',
   desc:'A spouted bowl for whisking then pouring. White crackle glaze, gold-kissed lip.'},
  {id:'b6', cat:'bowls', name:'Mini Bowl Duo',     jp:'Futatsu',    price:31.000, tag:'Set of 2',
   desc:'Two smaller chawan, one blush and one sage. Made for tea with a friend.'},

  /* --- Spoons --- */
  {id:'s1', cat:'spoons', name:'Classic Chashaku', jp:'Chashaku',   price:6.500,  tag:'Bestseller',
   desc:'The traditional bamboo scoop. One curve, one gram, zero fuss.'},
  {id:'s2', cat:'spoons', name:'Blush Lacquer Scoop', jp:'Urushi',  price:12.000, tag:'',
   desc:'Bamboo finished in pale pink lacquer. Wipes clean, stays glossy.'},
  {id:'s3', cat:'spoons', name:'Sakura Carved',    jp:'Sakura',     price:14.500, tag:'New',
   desc:'A blossom carved into the handle, hollowed by hand. Small and quietly special.'},
  {id:'s4', cat:'spoons', name:'Brass Measure Spoon', jp:'Shinchu', price:8.750,  tag:'',
   desc:'A precise 1g brass scoop for anyone who weighs everything.'},
  {id:'s5', cat:'spoons', name:'Kurotake Scoop',   jp:'Kurotake',   price:10.250, tag:'',
   desc:'Black bamboo with a dark, matte grain. Pairs with the Noir whisk.'},
  {id:'s6', cat:'spoons', name:'Sifter & Spoon Set', jp:'Furui',    price:17.500, tag:'Set',
   desc:'A fine mesh sifter with a matching scoop. No clumps, ever again.'},

  /* --- Glasses --- */
  {id:'g1', cat:'glasses', name:'Iced Matcha Tall', jp:'Guraso',    price:8.500,  tag:'Bestseller',
   desc:'350ml of thin, clear glass. Built to show off the layers in an iced matcha.'},
  {id:'g2', cat:'glasses', name:'Ribbed Blush Tumbler', jp:'Shima', price:10.750, tag:'',
   desc:'Ribbed body with a faint pink cast. Catches the light beautifully on a shelf.'},
  {id:'g3', cat:'glasses', name:'Double-Wall Pair',  jp:'Nijuu',    price:16.500, tag:'Set of 2',
   desc:'Double-walled so hot stays hot, cold stays cold, and hands stay comfortable.'},
  {id:'g4', cat:'glasses', name:'Forest Green Tint', jp:'Midori',   price:11.250, tag:'',
   desc:'A soft green tint through the glass, like light under a canopy.'},
  {id:'g5', cat:'glasses', name:'Petal Stem Cup',    jp:'Hana',     price:14.000, tag:'New',
   desc:'A short stem and a flared, petal-shaped lip. Our most photographed glass.'},
  {id:'g6', cat:'glasses', name:'Travel Tumbler',    jp:'Tabi',     price:19.500, tag:'',
   desc:'Sealed lid, matte blush finish, 400ml. Made for Kuwait traffic and long commutes.'},

  /* --- Matcha drinks: made to order at the counter, like a cafe menu --- */
  {id:'d1', cat:'drinks', name:'Iced Matcha Latte', jp:'Aisu Rate', price:2.250, tag:'Bestseller',
   desc:'Ceremonial matcha whisked cold, poured over ice and fresh milk. The one we make most.'},
  {id:'d2', cat:'drinks', name:'Hot Matcha Latte', jp:'Hotto Rate', price:2.250, tag:'Hot', art:'hotcup',
   desc:'Steamed milk over a thick whisked shot, in a warm cup. Oat milk on request.'},
  {id:'d3', cat:'drinks', name:'Strawberry Matcha', jp:'Ichigo', price:2.750, tag:'Girls’ favourite',
   desc:'Fresh strawberry at the bottom, milk and matcha layered on top. Stir before the first sip.'},
  {id:'d4', cat:'drinks', name:'Sakura Matcha Latte', jp:'Sakura', price:2.500, tag:'New',
   desc:'Cherry blossom syrup, matcha and cold milk, finished with a salted blossom. Iced or hot.'},
  {id:'d5', cat:'drinks', name:'Matcha Lemonade', jp:'Remon', price:2.000, tag:'Iced',
   desc:'Matcha shaken with fresh lemon and soda water. Sharp, green and barely sweet.'},
  {id:'d6', cat:'drinks', name:'Matcha Boba', jp:'Boba', price:3.000, tag:'',
   desc:'Brown sugar tapioca pearls under an iced matcha latte, with a wide straw.'},

  /* --- Whisk holders --- */
  {id:'h1', cat:'holders', name:'Blush Kusenaoshi', jp:'Kusenaoshi', price:9.750,  tag:'Bestseller',
   desc:'The classic dome in soft pink. Dries your chasen with the prongs held open.'},
  {id:'h2', cat:'holders', name:'Moss Ceramic Rest', jp:'Koke',      price:11.500, tag:'',
   desc:'Moss-glazed ceramic with a drainage lip. Keeps the counter dry.'},
  {id:'h3', cat:'holders', name:'Sakura Dome',       jp:'Sakura',    price:13.250, tag:'New',
   desc:'Blossoms pressed into the glaze. Pretty enough to leave out on display.'},
  {id:'h4', cat:'holders', name:'Marble Whisk Stand', jp:'Dairiseki', price:18.000, tag:'Limited',
   desc:'Cool white marble with pink veining. Weighted so it never tips.'},
  {id:'h5', cat:'holders', name:'Bamboo Ring Rest',  jp:'Take',      price:7.500,  tag:'',
   desc:'A simple bamboo ring that cradles the whisk sideways. Minimal and cheap to love.'},
  {id:'h6', cat:'holders', name:'Ritual Trio Set',   jp:'Mittsu',    price:29.500, tag:'Set of 3',
   desc:'Holder, scoop rest and small tray in one blush glaze. The whole counter, sorted.'}
];

/* ---- helpers --------------------------------------------- */
function getCategory(id){
  return CATEGORIES.find(c => c.id === id) || null;
}
function getProducts(catId){
  return PRODUCTS.filter(p => p.cat === catId);
}
function getProduct(id){
  return PRODUCTS.find(p => p.id === id) || null;
}
