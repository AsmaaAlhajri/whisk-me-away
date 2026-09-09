/* ============================================================
   data.js - categories, products and the SVG artwork
   Everything the shop displays comes from here, so adding a
   product is just adding one object to the PRODUCTS array.
   ============================================================ */

/* ---- Hand-drawn SVG art, one per category ---------------- */
const ART = {

  /* chasen: bamboo handle at the base, ~80 tines flaring UP and OUT,
     tips curling over into loops so the crown is the widest part */
  whisks: `<svg class="art" viewBox="0 0 100 100" fill="none" stroke="#FFF8F5" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <!-- the looped tine tips, scalloped across the top -->
      <path d="M20 27 q3-8 6 0 q3-8 6 0 q3-8 6 0 q3-8 6 0 q3-8 6 0
               q3-8 6 0 q3-8 6 0 q3-8 6 0 q3-8 6 0 q3-8 6 0"
            stroke="#F9DDD8" stroke-width="2"/>
      <!-- outer tines, fanning out from the binding to the crown -->
      <path d="M46 60 C40 48 30 35 21 27" stroke="#F9DDD8"/>
      <path d="M48 60 C44 46 36 32 29 25" stroke="#F9DDD8"/>
      <path d="M49 60 C47 45 43 31 38 24" stroke="#F9DDD8"/>
      <path d="M50 60 V23"                stroke="#F9DDD8"/>
      <path d="M51 60 C53 45 57 31 62 24" stroke="#F9DDD8"/>
      <path d="M52 60 C56 46 64 32 71 25" stroke="#F9DDD8"/>
      <path d="M54 60 C60 48 70 35 79 27" stroke="#F9DDD8"/>
      <!-- a few shorter inner tines for density -->
      <path d="M49 60 C47 49 45 40 44 32" opacity=".55"/>
      <path d="M51 60 C53 49 55 40 56 32" opacity=".55"/>
      <!-- binding thread -->
      <path d="M42 61h16" stroke="#F3BABA" stroke-width="4"/>
      <!-- bamboo handle -->
      <rect x="43" y="62" width="14" height="30" rx="3"
            fill="rgba(249,221,216,.30)" stroke="#F9DDD8"/>
      <path d="M43 79h14" stroke="#F9DDD8" stroke-width="1.5" opacity=".65"/>
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

  /* --- Matcha drinks: made to order at the counter, like a cafe menu ---
     Temperature is an option now rather than a separate product, so
     there is one "Matcha Latte" instead of an iced and a hot one.
     Anything with fruit, boba or lemon is iced only and carries
     skip:['temp'] so the choice never appears. --- */
  {id:'d1', cat:'drinks', name:'Matcha Latte', jp:'Rate', price:2.250, tag:'Bestseller',
   desc:'Ceremonial matcha whisked smooth with fresh milk. Iced or hot, the one we make most.'},
  {id:'d3', cat:'drinks', name:'Strawberry Matcha', jp:'Ichigo', price:2.750, tag:'Girls’ favourite',
   skip:['temp'],
   desc:'Fresh strawberry at the bottom, milk and matcha layered on top. Stir before the first sip.'},
  {id:'d4', cat:'drinks', name:'Sakura Matcha Latte', jp:'Sakura', price:2.500, tag:'',
   desc:'Cherry blossom syrup, matcha and milk, finished with a salted blossom.'},
  {id:'d5', cat:'drinks', name:'Matcha Lemonade', jp:'Remon', price:2.000, tag:'Iced',
   skip:['temp'],
   desc:'Matcha shaken with fresh lemon and soda water. Sharp, green and barely sweet.'},
  {id:'d6', cat:'drinks', name:'Matcha Boba', jp:'Boba', price:3.000, tag:'',
   skip:['temp'],
   desc:'Brown sugar tapioca pearls under a matcha latte, with a wide straw.'},
  {id:'d7', cat:'drinks', name:'Salted Vanilla Matcha', jp:'Banira', price:2.750, tag:'New',
   desc:'Vanilla bean and a pinch of sea salt, which pulls the sweetness back and lets the matcha through.'},
  {id:'d8', cat:'drinks', name:'Naughty Matcha', jp:'Ii Ko Ja Nai', price:3.000, tag:'New',
   desc:'Our indulgent one: dark chocolate through the matcha under a thick cream top.'},
  {id:'d9', cat:'drinks', name:'Mango Matcha', jp:'Mango', price:2.750, tag:'New',
   skip:['temp'],
   desc:'Ripe mango puree under cold matcha. Sweet, tropical and very orange-and-green.'},

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

/* ============================================================
   OPTION GROUPS
   What the customer picks on customise.html before the item goes
   in the basket. Keyed by category, so every drink gets the drink
   options and every tin gets the size options.

   type 'single' = pick one (radio)   'multi' = pick any (checkbox)
   type 'count'  = a 0..max stepper
   A choice adds `price` KD, or multiplies the base price by `mult`.
   ============================================================ */
const OPTION_GROUPS = {

  drinks: [
    {id:'temp', label:'Iced or hot', jp:'Ondo', type:'single', required:true,
     note:'Choose one', default:'iced',
     choices:[
       {id:'iced', name:'Iced', price:0},
       {id:'hot',  name:'Hot',  price:0}
     ]},

    {id:'milk', label:'Milk', jp:'Miruku', type:'single', required:true,
     note:'Choose one',
     choices:[
       {id:'whole',   name:'Whole milk',   price:0},
       {id:'skimmed', name:'Skimmed milk', price:0},
       {id:'oat',     name:'Oat milk',     price:0.250},
       {id:'almond',  name:'Almond milk',  price:0.250},
       {id:'coconut', name:'Coconut milk', price:0.250}
     ]},

    {id:'foam', label:'Cold foam', jp:'Fomu', type:'multi',
     note:'Add as many as you like',
     choices:[
       {id:'vanilla-foam', name:'Vanilla sweet cream', price:0.500},
       {id:'caramel-foam', name:'Salted caramel foam', price:0.500},
       {id:'berry-foam',   name:'Strawberry foam',     price:0.500},
       {id:'matcha-foam',  name:'Matcha cold foam',    price:0.600}
     ]},

    {id:'syrup', label:'Syrup', jp:'Shiroppu', type:'multi',
     note:'Add as many as you like',
     choices:[
       {id:'vanilla',     name:'Vanilla',     price:0.250},
       {id:'caramel',     name:'Caramel',     price:0.250},
       {id:'hazelnut',    name:'Hazelnut',    price:0.250},
       {id:'rose',        name:'Rose',        price:0.300},
       {id:'brown-sugar', name:'Brown sugar', price:0.250}
     ]},

    {id:'shots', label:'Extra matcha shot', jp:'Shotto', type:'count',
     note:'Up to three', max:3, price:0.750},

    /* how much ice only makes sense once the drink is iced */
    {id:'ice', label:'Ice', jp:'Kori', type:'single', required:true,
     note:'Choose one', default:'regular',
     showIf:{group:'temp', value:'iced'},
     choices:[
       {id:'extra',   name:'Extra ice',   price:0},
       {id:'regular', name:'Regular ice', price:0},
       {id:'less',    name:'Less ice',    price:0},
       {id:'none',    name:'No ice',      price:0}
     ]}
  ],

  matcha: [
    {id:'size', label:'How much', jp:'Ryo', type:'single', required:true,
     note:'The listed price is for 30g', default:'30',
     choices:[
       {id:'30',  name:'30 g',  mult:1},
       {id:'50',  name:'50 g',  mult:1.55},
       {id:'100', name:'100 g', mult:2.85},
       {id:'200', name:'200 g', mult:5.2}
     ]}
  ]
};

/* ============================================================
   KUWAIT DELIVERY AREAS
   One flat list, no governorates. The address field is a search
   box backed by a <datalist>: the customer types a few letters and
   picks from what matches. Add an area here and both the signup
   form and the checkout page pick it up.
   ============================================================ */
const AREAS = [
  "Abdally", "Abdulla Al-Salem", "Abdullah Mubarak Al-Sabah", "Abu Ftaira",
  "Abu Halifa", "Abu Hassaniah", "Adailiya", "AL Bida'a", "Al Masayel",
  "Al Mutlaa", "Al Naayem", "Al Sheqaya", "Al Sour Gardens", "Al-Adan",
  "Al-Fintas", "Al-Fnaitees", "Al-Nuwaiseeb", "Al-Qurain", "Al-Qusour",
  "Al-Siddiq", "Amghara Industrial", "Andalus", "Ardhiya", "Ardhiya 4",
  "Ardhiya 6", "Ashbeliah", "Bar Al-Jahra Governorate", "Bayan",
  "Bnaid Al-Qar", "Daiya", "Dasma", "Dasman", "Dhaher", "Doha",
  "East Ahmadi", "Egaila", "Fahad Al-Ahmad", "Fahaheel", "Faiha",
  "Farwaniya", "Firdous", "Granada", "Hadiya", "Hawalli", "Hitteen",
  "Jaber Al-Ahmad", "Jaber Al-Ali", "Jabriya", "Jahra", "Jahra Camps",
  "Jahra-Industrial", "Janobyia Aljawakheer", "Jawakher Al Jahra", "Kabd",
  "Kazima", "Khaitan", "Khaldiya", "Khiran City", "Kifan", "Kuwait City",
  "Mahboula", "Maidan Hawally", "Mangaf", "Mansouriya", "Messila",
  "Middle of Ahmadi", "Mina Abdulla", "Ministries Area", "Mirqab",
  "Mishrif", "Mubarak Al-Abdullah", "Mubarak Al-Kabeer", "Mubarakiya Camps",
  "Mubarakyia", "Naeem", "Nahda", "Nasseem", "New Wafra", "North Ahmadi",
  "North West Jahra", "Northwest Sulaibikhat", "Nuzha", "Old Jahra",
  "Om Alhaiman", "Omariya", "Oyoun", "Qadsiya", "Qairawan", "Qasr", "Qibla",
  "Qortuba", "Rabiya", "Rai", "Rawda", "Rawdatain", "Rehab", "Riggai",
  "Riqqa", "Rumaithiya", "Saad Al-Abdulla City", "Sabah Al-Ahmad 1",
  "Sabah Al-Ahmad 2", "Sabah Al-Ahmad 3", "Sabah Al-Ahmad 4",
  "Sabah Al-Ahmad 6", "Sabah Al-Ahmad Al-marine", "Sabah Al-Nasser",
  "Sabah Al-Salim", "Sabah health region", "Sabahiya", "Salam", "Salhiya",
  "Salmiya", "Salmy", "Salwa", "Shaab", "Shalehat Al-Khiran",
  "Shalehat Al-Nuwaiseeb", "Shalehat Bneder", "Shalehat Dba'ayeh",
  "Shalehat Doha", "Shalehat Jlea'a", "Shalehat Kazima",
  "Shalehat Mina Abdullah", "Shalehat Subiya", "Shalehat Zoor", "Shamiya",
  "Sharq", "Shuhada", "Shuwaikh", "Shuwaikh Industrial-1",
  "Shuwaikh Industrial-2", "Shuwaikh Industrial-3", "Shuwaikh Port",
  "South", "South Abdullah Al Mubarak", "South Al Mutlaa",
  "South Al Mutlaa 1", "South Al Mutlaa 10", "South Al Mutlaa 12",
  "South Al Mutlaa 2", "South Al Mutlaa 3", "South Al Mutlaa 4",
  "South Al Mutlaa 5", "South Al Mutlaa 6", "South Al Mutlaa 7",
  "South Al Mutlaa 8", "South Al Mutlaa 9", "South Amghara", "Sulaibikhat",
  "Sulaibiya", "Sulaibiya Agricultural", "Sulaibiya Industrial 1",
  "Sulaibiya Industrial 2", "Sulaibiya Industrial 3", "Sulaibyia", "Surra",
  "Taima", "Umm Al-Aish", "Wafra", "Wafra Farms", "Waha",
  "West Abdullah Al-Mubarak", "Yarmouk", "Zahra", "Zoor"
];

/* the <option> list behind the search box */
function areaOptions(){
  return AREAS.map(a => `<option value="${a}"></option>`).join('');
}

/* Accept what was typed only if it really is one of our areas, and
   give it back in our spelling - so "salmiya" is stored as "Salmiya".
   Returns null for anywhere we do not deliver. */
function normaliseArea(text){
  const t = String(text || '').trim().toLowerCase();
  if(!t) return null;
  return AREAS.find(a => a.toLowerCase() === t) || null;
}

/* ============================================================
   PHONE NUMBERS
   Kuwait numbers are 8 digits for mobiles and 7 for some
   landlines, so we accept 7 or 8 digits and nothing else.
   ============================================================ */
const PHONE_MIN = 7, PHONE_MAX = 8;

/* digits only, with a leading +965 country code dropped.
   Deliberately does NOT truncate - validation has to be able to
   see that 9 digits were entered and reject them. */
function phoneDigits(raw){
  let d = String(raw || '').replace(/\D/g, '');
  if(d.length > PHONE_MAX && d.startsWith('965')) d = d.slice(3);
  return d;
}

/* what the input box should hold as you type */
function cleanPhone(raw){
  return phoneDigits(raw).slice(0, PHONE_MAX);
}

/* validate the raw entry, so a pasted 9-digit number is refused
   rather than quietly trimmed down to a different number */
function phoneIsValid(raw){
  const d = phoneDigits(raw);
  return d.length >= PHONE_MIN && d.length <= PHONE_MAX;
}

/* ---- helpers --------------------------------------------- */

/* the groups this product actually shows - a hot drink skips the ice */
function optionGroupsFor(product){
  if(!product) return [];
  const skip = product.skip || [];
  return (OPTION_GROUPS[product.cat] || []).filter(g => !skip.includes(g.id));
}

/* does this product need a trip to customise.html first? */
function needsOptions(product){
  return optionGroupsFor(product).length > 0;
}

/* Some groups only apply once another has been answered: "how much
   ice" is meaningless on a hot drink. A group whose showIf points at
   a group this product does not even have (an iced-only drink has no
   temperature choice) still counts as visible. */
function groupIsVisible(product, group, opts){
  const cond = group.showIf;
  if(!cond) return true;
  const hasControlling = optionGroupsFor(product).some(g => g.id === cond.group);
  if(!hasControlling) return true;
  return (opts ? opts[cond.group] : null) === cond.value;
}

/* the groups actually on show for the current choices */
function visibleGroups(product, opts){
  return optionGroupsFor(product).filter(g => groupIsVisible(product, g, opts));
}

/* price of ONE unit with the chosen options applied */
function configuredPrice(product, opts){
  if(!product) return 0;
  let price = product.price, mult = 1;

  visibleGroups(product, opts).forEach(group => {
    const chosen = opts ? opts[group.id] : null;
    if(chosen === undefined || chosen === null) return;

    if(group.type === 'count'){
      price += (group.price || 0) * Number(chosen);
      return;
    }
    const ids = Array.isArray(chosen) ? chosen : [chosen];
    ids.forEach(id => {
      const choice = group.choices.find(c => c.id === id);
      if(!choice) return;
      if(choice.price) price += choice.price;
      if(choice.mult)  mult  *= choice.mult;
    });
  });

  /* keep it to fils, so totals never drift on a floating point tail */
  return Math.round(price * mult * 1000) / 1000;
}

/* a short line for the basket: "Oat milk - Vanilla - Less ice" */
function optionSummary(product, opts){
  const bits = [];
  visibleGroups(product, opts).forEach(group => {
    const chosen = opts ? opts[group.id] : null;
    if(chosen === undefined || chosen === null) return;

    if(group.type === 'count'){
      const n = Number(chosen);
      if(n > 0) bits.push(n + (n > 1 ? ' extra shots' : ' extra shot'));
      return;
    }
    const ids = Array.isArray(chosen) ? chosen : [chosen];
    ids.forEach(id => {
      const choice = group.choices.find(c => c.id === id);
      if(choice) bits.push(choice.name);
    });
  });
  return bits.join(' · ');
}

function getCategory(id){
  return CATEGORIES.find(c => c.id === id) || null;
}
function getProducts(catId){
  return PRODUCTS.filter(p => p.cat === catId);
}
function getProduct(id){
  return PRODUCTS.find(p => p.id === id) || null;
}
