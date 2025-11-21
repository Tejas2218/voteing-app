document.addEventListener("DOMContentLoaded", async () => {

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

    const result = await res.json()

    const candidates = result.candidateData       
    let userVoted = result.userVotes              

    // DOM
    const list = document.getElementById("candidateList");
    const popup = document.getElementById("popupOverlay");
    const popupText = document.getElementById("popupText");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    let selectedCandidate = null;

    // Render Candidates
    function renderCandidates() {
        list.innerHTML = "";

        candidates.forEach(c => {
            const div = document.createElement("div");
            div.className = "candidate-card";

            div.innerHTML = `
                <div class="candidate-info">
                    <span class="candidate-name">${c.name}</span>
                    <span class="vote-count">Votes: ${c.voteCount}</span>
                </div>
                <button class="btn voteBtn" data-id="${c._id}" ${userVoted ? "disabled" : ""}>Vote</button>
            `;

            list.appendChild(div);
        });

        attachVoteEvents();
    }

    function attachVoteEvents() {
        document.querySelectorAll(".voteBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                selectedCandidate = candidates.find(c => c._id == btn.dataset.id);
                popupText.innerText = `Are you sure you want to vote for "${selectedCandidate.name}"?`;
                popup.classList.remove("hidden");
            });
        });
    }

    cancelBtn.onclick = () => popup.classList.add("hidden");

    confirmBtn.onclick = async () => {
        const id = selectedCandidate._id;

        const res = await fetch(`http://localhost:3000/user/vote/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            selectedCandidate.voteCount += 1;
            userVoted = true;
            popup.classList.add("hidden");
            renderCandidates();
        } else {
            alert(data.message || "Something went wrong");
        }
    };

    renderCandidates();
});
