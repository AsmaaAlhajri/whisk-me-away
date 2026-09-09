/* ============================================================
   home.js - the landing page
   The category grid now lives on categories.html.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = Store.currentUser();
  if(!user) return;                       // app.js already redirects

  /* personal greeting in the hero */
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent =
    `${timeOfDay}, ${user.name.split(' ')[0]}`;

  revealOnScroll('.door');
  startHeroVideo();
});

/* ============================================================
   The hero background video.

   The clip is our own file in media/, so it just autoplays muted on a
   loop. The layer still sits behind an opaque beige lid until the video
   is genuinely running, so nobody sees a blank box while it loads.
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

  const reveal = () => layer.classList.add('is-ready');
  video.addEventListener('playing', reveal, {once:true});

  /* the autoplay attribute is usually enough, but a few browsers only
     start on an explicit play(). If they refuse it anyway, show the
     first frame rather than leaving the lid closed on a beige box. */
  const started = video.play();
  if(started && started.catch){
    started.catch(() => video.addEventListener('loadeddata', reveal, {once:true}));
  }
}
