// Static candidate list with vote count
let candidates = [
  { name: "Rahul Sharma", party: "Progressive Party", votes: 420 },
  { name: "Anita Verma", party: "People’s Alliance", votes: 380 },
  { name: "Karan Patel", party: "United India Front", votes: 250 },
  { name: "Sneha Kapoor", party: "Green Future Party", votes: 220 },
  { name: "Rohit Shinde", party: "Youth Power Party", votes: 190 },
  { name: "Jaydeep Rana", party: "Development Force", votes: 150 },
  { name: "Vishal Thakkar", party: "People First Movement", votes: 120 },
  { name: "Komal Singh", party: "Aasha Party", votes: 90 }
];

// Sort by votes DESCENDING
candidates.sort((a, b) => b.votes - a.votes);

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

        <div class="vote-badge">${c.votes} Votes</div>
     </div>
  `;

  list.appendChild(card);
});
