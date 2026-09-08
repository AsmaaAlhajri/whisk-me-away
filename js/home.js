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
});
