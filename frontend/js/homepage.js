// Navigation function
function navigate(page){
  window.location.href = page;
}

// Logout button
document.getElementById('logout-btn').addEventListener('click', ()=>{
  // Remove token if stored
  // localStorage.removeItem('token');]
  localStorage.removeItem("token")
  window.location.replace("../html/index.html");
});
