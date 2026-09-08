/* ============================================================
   steps.js
   The animations themselves are pure CSS and run on hover.
   This only adds tap-to-play for phones, where there is no hover.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if(!Store.currentUser()) return;

  const steps = document.querySelectorAll('.step');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const wasOn = step.classList.contains('is-playing');
      steps.forEach(s => s.classList.remove('is-playing'));
      if(!wasOn) step.classList.add('is-playing');
    });
    /* keyboard: Enter or Space plays it too */
    step.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        step.click();
      }
    });
  });

  revealOnScroll('.step');
});
