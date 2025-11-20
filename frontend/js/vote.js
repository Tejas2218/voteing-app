// Static candidate data (sorted by vote count)
let candidates = [
    { id: 1, name: "John Carter", votes: 40 },
    { id: 2, name: "Aisha Patel", votes: 35 },
    { id: 3, name: "Rohit Sharma", votes: 30 },
    { id: 4, name: "Emily Stone", votes: 22 },
];

// DOM
const list = document.getElementById("candidateList");
const popup = document.getElementById("popupOverlay");
const popupText = document.getElementById("popupText");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let selectedCandidate = null;
let userVoted = false;

// Render Candidates
function renderCandidates() {
    list.innerHTML = "";

    candidates.forEach(c => {
        const div = document.createElement("div");
        div.className = "candidate-card";

        div.innerHTML = `
            <div class="candidate-info">
                <span class="candidate-name">${c.name}</span>
                <span class="vote-count">Votes: ${c.votes}</span>
            </div>
            <button class="btn voteBtn" data-id="${c.id}" ${userVoted ? "disabled" : ""}>Vote</button>
        `;

        list.appendChild(div);
    });

    attachVoteEvents();
}

function attachVoteEvents() {
    document.querySelectorAll(".voteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedCandidate = candidates.find(c => c.id == btn.dataset.id);
            popupText.innerText = `Are you sure you want to vote for "${selectedCandidate.name}"?`;
            popup.classList.remove("hidden");
        });
    });
}

cancelBtn.onclick = () => popup.classList.add("hidden");

confirmBtn.onclick = () => {
    selectedCandidate.votes += 1;
    userVoted = true;

    popup.classList.add("hidden");
    renderCandidates();
};

// Initial
renderCandidates();
