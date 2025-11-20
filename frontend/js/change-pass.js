function changePassword() {
  const oldPass = document.getElementById("oldPass").value.trim();
  const newPass = document.getElementById("newPass").value.trim();
  const confirmPass = document.getElementById("confirmPass").value.trim();
  const msg = document.getElementById("msg");

  msg.style.color = "var(--danger)";

  if (!oldPass || !newPass || !confirmPass) {
    msg.textContent = "Please fill all fields.";
    return;
  }

  if (newPass.length < 6) {
    msg.textContent = "New password must be at least 6 characters.";
    return;
  }

  if (newPass !== confirmPass) {
    msg.textContent = "New passwords do not match.";
    return;
  }

  // Only frontend message (no backend logic)
  msg.style.color = "var(--success)";
  msg.textContent = "Password updated successfully (frontend only).";
}
