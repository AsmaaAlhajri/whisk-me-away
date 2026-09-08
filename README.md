# Whisk Me Away

A matcha store for Kuwait. Light, modern and editorial: deep green type on warm
white, blush accents, and a full shopping flow — all plain HTML, CSS and JS.

## Run it

Double-clicking `index.html` works, but a tiny local server is safer
(some browsers block `localStorage` on `file://`):

```bash
python -m http.server 5173
```

Then open <http://localhost:5173>.

## Pages

| File | What it is |
|---|---|
| `index.html` | Login. "Create an account" sits underneath the login button. |
| `signup.html` | Registration. |
| `home.html` | The landing page: hero, three doors (shop / story / how-to), the short ritual strip. |
| `categories.html` | The seven category cards, with a "Back to home" button at the top. |
| `category.html` | One page serving all seven categories: `category.html?cat=bowls` |
| `story.html` | Our Story: what matcha is, an interactive map of Japan, the journey, our promise. |
| `steps.html` | How to whisk: six steps, each with an animation that plays on hover or tap. |
| `account.html` | Her details and her orders with their status. |

The seven categories are whisks, matcha powder, bowls, spoons, glasses,
matcha drinks and whisk holders.

## Files

```
index.html  signup.html  home.html  categories.html
category.html  story.html  steps.html  account.html
css/style.css       all styling, numbered sections 1-22
js/data.js          categories, products, prices, SVG artwork
js/app.js           forest scene, sakura, top bar, menu modal, cart, checkout
js/auth.js          login + signup
js/home.js          the landing page greeting
js/categories.js    the seven category cards
js/category.js      the product grid
js/story.js         the five growing regions and the map pins
js/steps.js         tap-to-play for the step animations (hover is pure CSS)
js/account.js       details + orders
```

## How it works

**No backend.** Accounts, carts and orders live in `localStorage` under keys
starting with `wma_`. Carts and orders are stored per customer, so two accounts
never see each other's basket.

**Top bar** — on every shop page: a cart button (with a live count badge) and a
menu button. The menu opens a medium, centred card with a 50%-transparent pink
background holding Home, Categories, Our Story, How to Whisk, My Account and
Log out. Login and signup have no top bar, since there is no cart or account yet
— if you want it there too, remove the `page !== 'login'` check at the bottom of
`js/app.js`.

**Sakura** is drawn on a `<canvas>` in `js/app.js` (`startSakura`) and falls on
the **home page only**. The single line that decides this is at the bottom of
that file: `if(page === 'home') startSakura(20)`. Raise the number for more
petals, or add other page names to put it back on more pages.

**The theme** lives entirely in the tokens at the top of `css/style.css`. The
seven brand colours are unchanged; what changed is their roles — the greens are
now the ink and the pinks are the accents, on a warm white page. Artwork that
sits on a coloured tile (category cards, product images, the step animations)
still uses cream strokes; artwork on white uses pine and moss instead.

**The map** on `story.html` is drawn from real latitude and longitude. The
formula is at the top of `js/story.js`, so to add a sixth region you only need
its coordinates — the pin lands in the right place on its own. The outline is
simplified into straight segments between real capes and coastal cities, which
is why the page calls it illustrative.

**The step animations** are pure CSS keyframes in section 21 of `css/style.css`.
Each one is written as `.step:hover .thing { animation: ... }`, so nothing moves
until you hover; `js/steps.js` only adds the same effect on tap for phones.

**Order status** advances by itself in the demo: preparing for 2 minutes, then
on the way, then delivered. The two numbers are at the top of `js/account.js`.
Replace `statusOf()` with a real API call when you have a backend.

## Adding a product

Add one object to the `PRODUCTS` array in `js/data.js`:

```js
{id:'b7', cat:'bowls', name:'New Bowl', jp:'Chawan', price:20.000, tag:'New',
 desc:'One short sentence about it.'}
```

`cat` must be one of `whisks`, `matcha`, `bowls`, `spoons`, `glasses`,
`drinks`, `holders`.
Prices are Kuwaiti Dinar and shown to three decimals. Delivery is a flat
`SHIPPING` constant in `js/app.js`.

Matcha Drinks is a cafe menu, not equipment: those are real drinks made to order,
priced like a coffee shop (2-3 KD) rather than like a tin or a bowl.

Product pictures are hand-drawn SVGs in the `ART` object in `js/data.js`, one per
category. A single product can override its category icon by naming another entry
in `ART`, e.g. the Hot Matcha Latte carries `art:'hotcup'` so it shows a mug
instead of the iced glass. To use real photos instead, add an `img` field to each product and
swap the `${ART[cat.id]}` line in `js/category.js` for an `<img>`.

## Palette

| | |
|---|---|
| `#F3BABA` | blush — buttons, accents, sakura |
| `#F8D0C8` | petal |
| `#F9DDD8` | mist pink — body text on dark |
| `#A7B59E` | sage |
| `#799567` | moss |
| `#5B744B` | pine |
| `#35522B` | deep forest — background |

All of them are CSS variables at the top of `css/style.css`.

## While you are editing

Browsers cache `.js` and `.css` hard on `localhost`. If a change does not show
up, do a hard refresh: **Ctrl+F5** (or Ctrl+Shift+R). A normal refresh will often
serve you the old file.

## Two things to know before you submit

1. **Passwords are stored in plain text in the browser.** That is fine for a
   bootcamp demo but must never ship. A real store hashes passwords on a server.
2. Anyone can read or edit `localStorage` from devtools, so nothing here is
   secure. It is a front-end prototype, not a real shop.
