document.addEventListener("DOMContentLoaded", async () => {
// -------------------------------
// STATIC RESULT DATE
// -------------------------------
const RESULT_DATE = "2025-12-25 10:00";
const statusText = document.getElementById("statusText");

// -------------------------------
// STATIC TOP 5 CANDIDATES
// -------------------------------
// const candidates = [
//   { name: "John Carter", party: "National Unity Party", votes: 612 },
//   { name: "Aisha Verma", party: "People First Front", votes: 544 },
//   { name: "Rohit Sharma", party: "Progressive Alliance", votes: 420 },
//   { name: "Mira Khan", party: "Social Democratic Front", votes: 385 },
//   { name: "David Lee", party: "Future Vision Party", votes: 310 }
// ];

const token = localStorage.getItem("token")
if(!token)
  window.location.replace("html/index.html")
  const res = await fetch("http://localhost:3000/user/candidate", {
  method: "GET",
  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
  }
})

const data = await res.json()
const candidates = data.candidateData

// -------------------------------
// DATE LOGIC (ONLY TEXT CHANGES)
// -------------------------------
const now = new Date();
const resultDate = new Date(RESULT_DATE);

// If invalid date
if (isNaN(resultDate)) {
  statusText.innerHTML = "⚠ Invalid result date format";
}
// Before result date
else if (now < resultDate) {
  statusText.innerHTML =
    `⏳ Final result will be declared on <strong>${RESULT_DATE}</strong>`;
}
// After result date
else {
  statusText.innerHTML = `🎉 Final Results Declared (${RESULT_DATE})`;
}

// -------------------------------
// ALWAYS SHOW TOP 5 LIST
// -------------------------------
const list = document.getElementById("candidateList");

candidates.forEach(c => {
  list.innerHTML += `
    <div class="candidate">
      <h3>${c.name}</h3>
      <p>${c.party}</p>
      <p><strong>Votes:</strong> ${c.voteCount}</p>
    </div>
  `;
});
})