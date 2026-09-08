/* ============================================================
   auth.js - login + sign up
   Accounts are kept in localStorage (see Store in app.js).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* smooth fade for the swap links */
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.getAttribute('href'));
    });
  });

  const msg = document.getElementById('msg');
  const say = (text, ok = false) => {
    msg.textContent = text;
    msg.classList.toggle('ok', ok);
  };

  /* ---------- LOGIN ---------- */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    /* already signed in? go straight to the shop */
    if(Store.currentUser()){ location.replace('home.html'); return; }

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if(!email || !password) return say('Please fill in both fields.');

      const user = Store.findUser(email);
      if(!user)                    return say('No account found with that email. Try signing up.');
      if(user.password !== password) return say('That password does not match. Have another go.');

      Store.login(user.email, document.getElementById('remember').checked);
      say('Welcome back, ' + user.name.split(' ')[0] + '.', true);
      setTimeout(() => goTo('home.html'), 550);
    });
  }

  /* ---------- SIGN UP ---------- */
  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    signupForm.addEventListener('submit', e => {
      e.preventDefault();

      const name     = document.getElementById('name').value.trim();
      const email    = document.getElementById('email').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const area     = document.getElementById('area').value.trim();
      const password = document.getElementById('password').value;
      const confirm  = document.getElementById('confirm').value;

      if(!name || !email || !password)        return say('Name, email and password are required.');
      if(!/^\S+@\S+\.\S+$/.test(email))       return say('That email does not look right.');
      if(password.length < 6)                 return say('Password needs at least 6 characters.');
      if(password !== confirm)                return say('The two passwords do not match.');
      if(Store.findUser(email))               return say('That email already has an account. Log in instead.');

      Store.addUser({
        name, email, phone, area, password,
        joined: new Date().toISOString()
      });
      Store.login(email);

      say('Account created. Taking you inside...', true);
      setTimeout(() => goTo('home.html'), 700);
    });
  }
});
