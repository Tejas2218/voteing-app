document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("html/index.html");
    return;
  }

  const res = await fetch("http://localhost:3000/user/candidate", {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });

  const candidates = await res.json();

  if (res.ok) {
    // const candidates = data.candidates;

    const list = document.getElementById("candidateList");

    candidates.forEach(c => {
      const card = document.createElement("div");
      card.className = "c-card";

      card.innerHTML = `
        <div class="c-top">
          <div class="c-info-section">
            <div class="c-avatar">${c.name.charAt(0)}</div>
            <div>
              <p class="c-name">${c.name}</p>
              <p class="c-party">${c.party}</p>
            </div>
          </div>

          <div class="vote-badge">${c.voteCount} Votes</div>
        </div>
      `;

      list.appendChild(card);
    });

  } else {
    console.log(data);
  }

});
