// app.js - behavior for Aadhaar login/signup page
const btnSignin = document.getElementById('btn-signin');
const btnSignup = document.getElementById('btn-signup');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const toSignupBtn = document.getElementById('to-signup');
const toSigninBtn = document.getElementById('to-signin');

function showSignin(){
  btnSignin.classList.add('active'); btnSignup.classList.remove('active');
  btnSignin.setAttribute('aria-selected','true'); btnSignup.setAttribute('aria-selected','false');
  signinForm.style.display = '';
  signupForm.style.display = 'none';
  document.getElementById('authTitle').textContent = 'Welcome back';
}
function showSignup(){
  btnSignup.classList.add('active'); btnSignin.classList.remove('active');
  btnSignup.setAttribute('aria-selected','true'); btnSignin.setAttribute('aria-selected','false');
  signinForm.style.display = 'none';
  signupForm.style.display = '';
  document.getElementById('authTitle').textContent = 'Create your account';
}

btnSignin.addEventListener('click', showSignin);
btnSignup.addEventListener('click', showSignup);
toSignupBtn.addEventListener('click', showSignup);
toSigninBtn.addEventListener('click', showSignin);

// Aadhaar helpers
function normalizeAadhaar(value){
  return value.replace(/\D/g,'');
}
function formatAadhaarForDisplay(v){
  const s = normalizeAadhaar(v);
  return s.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
}
function isValidAadhaar(value){
  const s = normalizeAadhaar(value);
  return /^\d{12}$/.test(s);
}

['signin-aadhaar','signup-aadhaar'].forEach(id=>{
  const el = document.getElementById(id);
  el.addEventListener('input', e=>{
    const newVal = el.value.replace(/[^0-9\s]/g,'');
    el.value = newVal;
  });
  el.addEventListener('blur', e=>{
    el.value = formatAadhaarForDisplay(el.value);
  });
});

const signinMsg = document.getElementById('signin-msg');
const signupMsg = document.getElementById('signup-msg');

signinForm.addEventListener('submit', e=>{
  e.preventDefault();
  signinMsg.textContent = '';
  const aad = document.getElementById('signin-aadhaar').value;
  const pwd = document.getElementById('signin-password').value;

  if(!isValidAadhaar(aad)){
    signinMsg.innerHTML = '<span class="error">Enter a valid 12-digit Aadhaar number.</span>';
    return;
  }
  if(!pwd || pwd.length < 6){
    signinMsg.innerHTML = '<span class="error">Password must be at least 6 characters.</span>';
    return;
  }

  signinMsg.innerHTML = '<span class="success">Signed in (demo). Integrate with server to authenticate.</span>';
  console.log('Signin payload ->', {aadhaar: normalizeAadhaar(aad), password: pwd});
});

signupForm.addEventListener('submit', e=>{
  e.preventDefault();
  signupMsg.textContent = '';
  const name = document.getElementById('signup-name').value.trim();
  const aad = document.getElementById('signup-aadhaar').value;
  const pwd = document.getElementById('signup-password').value;
  const conf = document.getElementById('signup-confirm').value;

  if(!name){ signupMsg.innerHTML = '<span class="error">Please enter your full name.</span>'; return; }
  if(!isValidAadhaar(aad)){ signupMsg.innerHTML = '<span class="error">Enter a valid 12-digit Aadhaar number.</span>'; return; }
  if(!pwd || pwd.length < 6){ signupMsg.innerHTML = '<span class="error">Password must be at least 6 characters.</span>'; return; }
  if(pwd !== conf){ signupMsg.innerHTML = '<span class="error">Passwords do not match.</span>'; return; }

  signupMsg.innerHTML = '<span class="success">Account created (demo). Send data to server for real signup.</span>';
  console.log('Signup payload ->', {name, aadhaar: normalizeAadhaar(aad), password: pwd});

  setTimeout(()=>{
    showSignin();
    document.getElementById('signin-msg').innerHTML = '<span class="success">Account created. Please sign in.</span>';
  },800);
});

// Accessibility: allow Enter on toggle
document.querySelectorAll('.toggle button').forEach(b=>b.addEventListener('keydown', e=>{ if(e.key==='Enter') b.click(); }));
