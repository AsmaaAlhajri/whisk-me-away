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

   YouTube's plain autoplay is unreliable - it can be slow to buffer or
   refused outright - and a half-started player shows a grey spinner,
   which looks broken on a pale page. So the video layer starts fully
   transparent and only fades in once the player reports it is actually
   PLAYING. If that never happens (no network, autoplay blocked, video
   removed) the hero simply stays beige, which is a fine hero on its own.
   ============================================================ */
function startHeroVideo(){
  const layer = document.querySelector('.hero__video');
  if(!layer) return;

  /* someone who asked for less motion gets no video at all */
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    layer.remove();
    return;
  }

  window.onYouTubeIframeAPIReady = () => {
    new YT.Player('heroVideo', {
      events:{
        onReady: e => { e.target.mute(); e.target.playVideo(); },
        onStateChange: e => {
          if(e.data === YT.PlayerState.PLAYING) layer.classList.add('is-ready');
        }
      }
    });
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}
