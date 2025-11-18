// app.js - behavior for Aadhaar login/signup page (frosted theme)
// UI elements
const btnSignin = document.getElementById('btn-signin');
const btnSignup = document.getElementById('btn-signup');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const toSignupBtn = document.getElementById('to-signup');
const toSigninBtn = document.getElementById('to-signin');
const signinMsg = document.getElementById('signin-msg');
const signupMsg = document.getElementById('signup-msg');

function showSignin(){
  btnSignin.classList.add('active'); btnSignup.classList.remove('active');
  btnSignin.setAttribute('aria-selected','true'); btnSignup.setAttribute('aria-selected','false');
  signinForm.style.display = ''; signupForm.style.display = 'none';
  document.getElementById('authTitle').textContent = 'Welcome back';
}
function showSignup(){
  btnSignup.classList.add('active'); btnSignin.classList.remove('active');
  btnSignup.setAttribute('aria-selected','true'); btnSignin.setAttribute('aria-selected','false');
  signinForm.style.display = 'none'; signupForm.style.display = '';
  document.getElementById('authTitle').textContent = 'Create your account';
}

btnSignin.addEventListener('click', showSignin);
btnSignup.addEventListener('click', showSignup);
toSignupBtn.addEventListener('click', showSignup);
toSigninBtn.addEventListener('click', showSignin);

// Aadhaar helpers
function normalizeAadhaar(value){ return value.replace(/\D/g,''); }
function formatAadhaarForDisplay(v){
  const s = normalizeAadhaar(v);
  return s.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
}
function isValidAadhaar(value){ return /^\d{12}$/.test(normalizeAadhaar(value)); }

// simple validators
function isValidEmail(v){ return /^\S+@\S+\.\S+$/.test(v); }
function isValidMobile(v){ return /^[6-9]\d{9}$/.test(v); }

// wire aadhaar inputs
['signin-aadhaar','signup-aadhaar'].forEach(id=>{
  const el = document.getElementById(id);
  el.addEventListener('input', ()=> { el.value = el.value.replace(/[^\d\s]/g,''); });
  el.addEventListener('blur', ()=> { el.value = formatAadhaarForDisplay(el.value); });
});

// SIGNIN handler (demo)
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signinMsg.textContent = '';
  const aad = document.getElementById('signin-aadhaar').value;
  const pwd = document.getElementById('signin-password').value;

  if(!isValidAadhaar(aad)){
    signinMsg.innerHTML = '<span class="error">Enter a valid 12-digit Aadhaar number.</span>'; return;
  }
  if(!pwd || pwd.length < 6){
    signinMsg.innerHTML = '<span class="error">Password must be at least 6 characters.</span>'; return;
  }
  
  const aadNumber = Number(normalizeAadhaar(aad));
  // connect with backend
  const res = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({aadharCardNumber: aadNumber, password: pwd})
  })

  const data = await res.json()

  if(res.ok){
    localStorage.setItem("token", data.token)
    signinMsg.innerHTML = `<span class="error">${data.error}</span>`;
    signinMsg.innerHTML = '<span class="success">Signed in (demo). Integrate with server to authenticate.</span>';

    window.location.href = "/html/homepage.html";
    
    console.log('Signin payload ->', { aadhaar: normalizeAadhaar(aad), password: pwd });
  }else{
    signinMsg.innerHTML = `<span class="error">${data.error}</span>`;
  }
});

// SIGNUP handler (demo validation only)
signupForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  signupMsg.textContent = '';

  const name = document.getElementById('signup-name').value.trim();
  const age = document.getElementById('signup-age').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();
  const address = document.getElementById('signup-address').value.trim();
  const aad = document.getElementById('signup-aadhaar').value;
  const pwd = document.getElementById('signup-password').value;
  const conf = document.getElementById('signup-confirm').value;

  // validations
  if(!name){ signupMsg.innerHTML = '<span class="error">Please enter your full name.</span>'; return; }
  if(!age || Number(age) < 18){ signupMsg.innerHTML = '<span class="error">Age must be 18 or older.</span>'; return; }
  if(email && !isValidEmail(email)){ signupMsg.innerHTML = '<span class="error">Enter a valid email or leave empty.</span>'; return; }
  if(mobile && !isValidMobile(mobile)){ signupMsg.innerHTML = '<span class="error">Enter valid 10-digit mobile or leave empty.</span>'; return; }
  if(!address){ signupMsg.innerHTML = '<span class="error">Please enter your address.</span>'; return; }
  if(!isValidAadhaar(aad)){ signupMsg.innerHTML = '<span class="error">Enter a valid 12-digit Aadhaar number.</span>'; return; }
  if(!pwd || pwd.length < 6){ signupMsg.innerHTML = '<span class="error">Password must be at least 6 characters.</span>'; return; }
  if(pwd !== conf){ signupMsg.innerHTML = '<span class="error">Passwords do not match.</span>'; return; }

  // connect with backend
  const aadNumber = Number(normalizeAadhaar(aad)); // "123456781234" -> 123456781234

  const data = {
    name: name,
    age: Number(age),
    email: email,
    mobile: mobile,
    address: address,
    aadharCardNumber: aadNumber,
    password: pwd
  }

  const res = await fetch("http://localhost:3000/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  const out = await res.json()

  // Demo success - replace this with fetch() to your backend
  signupMsg.innerHTML = `<span class="success">${out.message}</span>`;
  
  console.log('Signup payload ->', {
    name, age: Number(age), email: email || null, mobile: mobile || null,
    address, aadharCardNumber: Number(normalizeAadhaar(aad)), password: pwd
  });

  // switch to sign-in after short delay
  setTimeout(()=>{
    showSignin(); 
    document.getElementById('signin-msg').innerHTML = '<span class=\"success\">Account created. Plase sign in.</span>';
    window.location.href = "/html/homepage.html"
  }, 700);
});

function normalizeAadhaar(value){ 
    return value.replace(/\D/g,''); // removes everything except digits
  }

// keyboard accessibility for toggle
document.querySelectorAll('.toggle button').forEach(b=>b.addEventListener('keydown', e=>{ if(e.key === 'Enter') b.click(); }));
