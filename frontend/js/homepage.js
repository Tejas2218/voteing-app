// Navigation function
function navigate(page){
  window.location.href = page;
}

// Logout button
document.getElementById('logout-btn').addEventListener('click', ()=>{
  // Remove token if stored
  // localStorage.removeItem('token');
  window.location.href = "/index.html";
});
