/* ============================================================
   home.js - the landing page
   The category grid now lives on categories.html.
   ============================================================ */

/* The video starts first, before anything else on the page.

   It used to be kicked off at the end of the block below, which meant
   it sat waiting on AppReady - the Supabase session, basket and saved
   addresses - so the clip only began once the network came back. A
   muted background loop has no reason to know who is signed in. */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', startHeroVideo, {once:true});
} else {
  startHeroVideo();
}

document.addEventListener('DOMContentLoaded', async () => {
  await AppReady;          /* session + basket are loaded by app.js */

  const user = Store.currentUser();
  if(!user) return;                       // app.js already redirects

  /* personal greeting in the hero */
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent =
    `${timeOfDay}, ${user.name.split(' ')[0]}`;

  revealOnScroll('.door');
});

/* ============================================================
   The hero background video.

   The clip is our own file in media/, so it just autoplays muted on a
   loop. A poster frame stands in while the file arrives, so the hero
   looks right from the first moment and then starts moving, instead of
   showing a flat beige box and catching up later.
   ============================================================ */
function startHeroVideo(){
  const layer = document.querySelector('.hero__video');
  const video = document.getElementById('heroVideo');
  if(!layer || !video) return;

  /* someone who asked for less motion gets no video at all */
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    layer.remove();
    return;
  }

  /* Off with the lid straight away. It used to wait for the "playing"
     event, which was wrong twice over: that event needs megabytes of a
     fragmented mp4 to arrive first, and on a fast connection it can fire
     before this code even runs - and a listener added afterwards never
     hears it, so the lid stayed shut over a video already playing
     underneath. There is nothing to hide now in any case, because the
     poster frame is standing in until the clip catches up. */
  layer.classList.add('is-ready');

  /* autoplay usually starts it, but a few browsers only start on an
     explicit play(). If one refuses outright the poster simply stays. */
  const started = video.play();
  if(started && started.catch) started.catch(() => {});
}
