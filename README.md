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
| `customise.html` | Options for drinks and matcha powder: `customise.html?id=d1` |
| `checkout.html` | Delivery address, the gift option, and placing the order. |
| `account.html` | Her details and her orders with their status. |

The seven categories are whisks, matcha powder, bowls, spoons, glasses,
matcha drinks and whisk holders.

## Files

```
index.html  signup.html  home.html  categories.html
category.html  customise.html  story.html  steps.html  account.html
css/style.css       all styling, numbered sections 1-22
js/data.js          categories, products, prices, SVG artwork
js/app.js           forest scene, sakura, top bar, menu modal, cart, checkout
js/auth.js          login + signup
js/home.js          the landing page greeting
js/categories.js    the seven category cards
js/category.js      the product grid
js/story.js         the five growing regions and the map pins
js/steps.js         tap-to-play for the step animations (hover is pure CSS)
js/customise.js     the milk / foam / syrup / size options page
js/supabase.js      database connection (publishable key, safe to commit)
js/checkout.js      the address book, the gift option, writing the order
js/account.js       details + orders
media/matcha.mp4    the looping video behind the home hero
```

## How it works

**Supabase backend.** Accounts, baskets and orders live in Postgres on Supabase,
not in the browser. `js/supabase.js` holds the project URL and the *publishable*
key - both are safe in front-end code, because every table is protected by Row
Level Security keyed on `auth.uid()`. Someone who reads the page source and
calls the API with that key gets an empty list back; writes are refused.

Tables: `profiles` (name, phone, area), `addresses` (up to four saved
addresses per customer), `cart_items` (one row per configured basket line),
`orders` (with `placed_at` and `cancelled_at`) and `order_items` (each line
keeps its `category`, which decides how long the order can be cancelled). A trigger on signup copies name, phone and area
into `profiles` automatically.

**Login is real.** Supabase Auth hashes and checks passwords on its servers -
the site never sees or stores one. Note that Supabase deliberately will not say
whether a failed login was a wrong email or a wrong password, so the error
message covers both.

**Peeking at a password.** The lock beside a password field is a button. Click
it and the password is readable for three seconds, then it hides itself again -
long enough to check a typo, short enough that a password is never left sitting
on a screen someone else can see. The lock swings open while it shows, a second
click hides it early, and moving focus away hides it immediately. Three seconds
is `PEEK_SECONDS` at the top of that block in `js/auth.js`.

**Google and Apple sign-in.** The login page carries both buttons and the code
behind them is finished, but they only work once the providers are switched on
in the Supabase dashboard — see *Two settings to check in Supabase* below. Until
then `js/auth.js` asks Supabase which providers are actually enabled (a single
call to `/auth/v1/settings` at page load), greys out any that are not, and says
so plainly if one is clicked. That check exists because `signInWithOAuth()`
navigates the whole browser to Supabase before any error handler could run, so
without it a curious customer would land on a raw JSON error page.

The rest of the app is written synchronously, so `js/app.js` loads the session
and basket once at boot and exposes an `AppReady` promise. Every page script
starts with `await AppReady`, which is why none of them read an empty basket.

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

**The hero video** is `media/matcha.mp4`, played muted on a loop behind the
home hero. A beige veil over it is clear in the middle and solid at every edge,
so the footage dissolves into the page and is gone before the next section. The
layer stays behind an opaque beige lid until the video is actually running, so
no blank box is ever visible. To swap the clip, drop a new .mp4 in `media/` and
change the `<source src>` in `home.html`.

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

**Order status** advances by itself in the demo, and how long it spends being
prepared depends on what is in the basket:

| What she ordered | Preparing | Then delivering | Delivered after |
|---|---|---|---|
| Drinks only | 25 min | 5 min | 30 min |
| Drinks *and* other items | 45 min | 5 min | 50 min |
| No drinks at all | 1 hr 15 min | 5 min | 1 hr 20 min |

Every order is on the road for the same five minutes. The four numbers are at
the top of `js/account.js`. The database stores a real `status` column, so swap
`statusOf()` for that column once someone is actually updating orders.

**Cancelling an order.** Every order in My Account shows the day *and time* it
was placed, and a Cancel order button counting down the minutes she has left.
How long she gets depends on what she bought: **ten minutes** if the order
contains a matcha drink, because a barista starts making it, and **an hour** for
everything else, which is picked off a shelf. A mixed order takes the shorter
window - somebody is still making the drink.

Once the time is up the button fades and stops cancelling, but it stays
clickable so it can explain itself rather than refusing in silence: it says
*"Our matcha barista is already making your drink at our matcha bar"* - drink or
drinks, counted from the order - or, for an order with no drinks, that it is
already packed for delivery. Cancelling asks for a second tap first, since it
cannot be undone, and a cancelled order shows a **Cancelled** badge with the
time it was cancelled.

The countdown repaints every thirty seconds, so a button fades while she is
looking at the page rather than only after a reload.

A cancelled order stays on the page for **a week** so she can see what happened,
then it is cleared away with its order lines. That is a `pg_cron` job in
Supabase - `purge-cancelled-orders`, hourly at seventeen minutes past - calling
`purge_cancelled_orders()`. Hourly rather than daily only so that "a week" is
accurate to the hour. To look at it:

```sql
select * from cron.job where jobname = 'purge-cancelled-orders';
select * from cron.job_run_details order by start_time desc limit 5;
```

None of that is left to the browser. A `guard_order_update()` trigger on
`orders` re-checks the window against `placed_at` and refuses a late
cancellation, and it also refuses *any* other change to an order - so a page
left open overnight, or a hand-written API call, cannot rewrite a total, fake a
delivery, backdate `placed_at` to reopen the window, or cancel twice. The window
itself comes from `order_cancel_minutes()`, which reads the `category` recorded
on each order line, so those ten and sixty minutes live in the database as well
as in `js/account.js` - change them in both.

**Customising an order.** Drinks and matcha powder open `customise.html` before
going in the basket; everything else adds in one click. The choices live in
`OPTION_GROUPS` in `js/data.js`, keyed by category, so adding a syrup is one
line of data. A basket line is identified by product *and* options, so an
oat-milk latte and an almond-milk latte are separate lines.

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
priced like a coffee shop (2-3 KD) rather than like a tin or a bowl. Temperature
is an option rather than a separate product, so there is one Matcha Latte. A
drink that only works cold - anything with fruit, boba or lemon - carries
`skip:['temp']` so the iced/hot choice never appears. An option group can also
depend on another: "how much ice" carries `showIf:{group:'temp',value:'iced'}`
and disappears the moment the drink is switched to hot, dropping out of the
price and the basket summary with it.

**Editing an account**: the My Account page has an Edit details button for name,
phone and area, saved straight back to `profiles`.

Product pictures are hand-drawn SVGs in the `ART` object in `js/data.js`, one per
category. A single product can override its category icon by naming another entry
in `ART`, e.g. the Hot Matcha Latte carries `art:'hotcup'` so it shows a mug
instead of the iced glass. To use real photos instead, add an `img` field to each product and
swap the `${ART[cat.id]}` line in `js/category.js` for an `<img>`.

## Addresses, phones and gifts

**Areas** are one flat list, `AREAS` in `js/data.js` - 166 of them, no
governorates. The address field is a search box backed by a `<datalist>`, so
the customer types a few letters and picks a match. `normaliseArea()` accepts
only a real area and returns it in our spelling, so "salmiya" is stored as
"Salmiya" and anything else is refused. Add or rename an area there and the
signup form, the checkout page and the account editor all follow.

**Phone numbers** are digits only, 7 or 8 of them (8 for Kuwaiti mobiles, 7 for
some landlines). `cleanPhone()` strips a `+965` prefix and anything non-numeric;
`phoneIsValid()` deliberately checks the untruncated value, so a pasted 9-digit
number is refused rather than quietly trimmed into a different number. The
database enforces the same rule with a CHECK constraint.

**Saved addresses.** A customer types an address once. It is stored in the
`addresses` table under her own name — Home, Work, Mum's — and every later
checkout just offers it back. The My addresses panel at the top of the checkout
page shows what she has saved: pick one with the radio, edit one with the pen,
delete one with the bin, or add another with the **+**. Deleting takes two
clicks — the first arms the bin for three seconds — so a stray tap never throws
an address away.

Four is the limit, and the limit is real: the **+** button hides at four, and an
`enforce_address_limit()` trigger on the table refuses a fifth even if the
request is made by hand. Each address carries a label, area, block, street,
avenue (optional) and house.

The address a customer picks is **copied** onto the order rather than pointed
at, so editing or deleting an address later never rewrites where a past order
actually went. `MAX_ADDRESSES` is at the top of `js/app.js`; the address book
itself is `renderAddresses()` in `js/checkout.js`.

**Gifts.** Tick the gift box and the recipient's name and mobile become
required, plus an optional note capped at 250 characters — and the address panel
goes quiet, because a gift is delivered to the recipient and her address is not
ours to ask for. All of it is enforced twice: in `js/checkout.js` for a helpful
message, and by CHECK constraints on the `orders` table so a bad row cannot be
written even by hand. The address constraint is `orders_address_unless_gift`:
an order needs a full address *unless* it is a gift.

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

## Two settings to check in Supabase

**1. Email confirmation.** New Supabase projects require customers to confirm
their email before they can log in. To keep signup instant, turn it off:

**Supabase dashboard → Authentication → Sign In / Providers → Email →
turn off "Confirm email" → Save.**

The code copes either way: if confirmation is on, signup says to check your
inbox instead of logging you straight in.

**2. Google and Apple.** Both buttons are on the login page already, but they
stay greyed out until the providers are enabled under **Authentication → Sign
In / Providers**. Each one needs credentials from the provider itself: a Google
Cloud Console OAuth client for Google, and a Services ID plus key from the Apple
Developer program for Apple (Apple's costs an annual membership fee, Google's is
free). Paste the client ID and secret into Supabase, add the Supabase callback
URL to the provider's allowed redirects, and the buttons start working with no
change to this code.

## Still worth knowing

Passwords are now hashed by Supabase, which fixes the big one. What remains is
ordinary demo-shop shape: there is no payment step, order status is faked on a
timer, and the product catalogue is a JavaScript file rather than database rows.
