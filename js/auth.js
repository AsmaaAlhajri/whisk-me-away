/* ============================================================
   auth.js - login + sign up, on Supabase Auth

   Passwords are hashed and checked on Supabase's servers; none of
   this file ever sees or stores one. Signing in returns a session
   that Row Level Security then keys every database read on.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

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

  /* remember the "keep me signed in" choice for app.js to enforce */
  function rememberChoice(remember){
    try{
      localStorage.setItem('wma_remember', remember ? 'true' : 'false');
      sessionStorage.setItem('wma_tab', '1');
    }catch(e){}
  }

  /* disable a submit button while the network call is in flight */
  function busy(form, on, label){
    const btn = form.querySelector('button[type="submit"]');
    if(!btn) return;
    btn.disabled = on;
    btn.style.opacity = on ? .6 : 1;
    if(on){ btn.dataset.label = btn.textContent; btn.textContent = label; }
    else if(btn.dataset.label){ btn.textContent = btn.dataset.label; }
  }

  await AppReady;

  /* ---------- LOGIN ---------- */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    /* already signed in? go straight to the shop */
    if(Store.currentUser()){ location.replace('home.html'); return; }

    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;

      if(!email || !password) return say('Please fill in both fields.');

      busy(loginForm, true, 'Signing in...');
      const {error} = await sb.auth.signInWithPassword({email, password});
      busy(loginForm, false);

      if(error){
        /* Supabase deliberately does not say whether it was the email
           or the password that was wrong, so neither do we. */
        return say(
          /invalid login/i.test(error.message)
            ? 'That email and password do not match. Try again, or sign up.'
            : error.message
        );
      }

      rememberChoice(remember);
      await Store.load();
      say('Welcome back' + (Store.currentUser()?.name ? ', ' + Store.currentUser().name.split(' ')[0] : '') + '.', true);
      setTimeout(() => goTo('home.html'), 500);
    });
  }

  /* ---------- SIGN UP ---------- */
  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    if(Store.currentUser()){ location.replace('home.html'); return; }

    signupForm.addEventListener('submit', async e => {
      e.preventDefault();

      const name     = document.getElementById('name').value.trim();
      const email    = document.getElementById('email').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const area     = document.getElementById('area').value.trim();
      const password = document.getElementById('password').value;
      const confirm  = document.getElementById('confirm').value;

      if(!name || !email || !password)  return say('Name, email and password are required.');
      if(!/^\S+@\S+\.\S+$/.test(email)) return say('That email does not look right.');
      if(password.length < 6)           return say('Password needs at least 6 characters.');
      if(password !== confirm)          return say('The two passwords do not match.');

      busy(signupForm, true, 'Creating...');
      /* name, phone and area ride along as metadata; a trigger on the
         database copies them into the profiles table. */
      const {data, error} = await sb.auth.signUp({
        email, password,
        options:{ data:{ name, phone, area } }
      });
      busy(signupForm, false);

      if(error){
        return say(
          /already registered|already exists/i.test(error.message)
            ? 'That email already has an account. Log in instead.'
            : error.message
        );
      }

      /* no session means the project still requires email confirmation */
      if(!data.session){
        return say('Almost there - check your email to confirm the account, then log in.', true);
      }

      rememberChoice(true);
      await Store.load();
      say('Account created. Taking you inside...', true);
      setTimeout(() => goTo('home.html'), 700);
    });
  }
});
