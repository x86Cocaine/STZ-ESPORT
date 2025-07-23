let role = null;
let matches = JSON.parse(localStorage.getItem("matches") || "[]");

function loginAs(selected) {
  role = selected;
  if (role === "coach") {
    document.getElementById("coachForm").style.display = "block";
  } else {
    startApp();
  }
}

function validateCoach(e) {
  e.preventDefault();
  const user = document.getElementById("coachUser").value;
  const pass = document.getElementById("coachPass").value;
  if (user === "coach" && pass === "1234@") {
    startApp();
  } else {
    alert("Mauvais identifiants.");
  }
}

function startApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("appScreen").style.display = "flex";
  document.getElementById("sidebarRole").innerText = role.toUpperCase();
  document.getElementById("welcomeMessage").innerText = `Connecté en tant que ${role}`;
  if (role === "coach") {
    document.getElementById("coachTools").style.display = "block";
  }
  renderMatches();
  showSection("dashboard");
}

function showSection(section) {
  document.getElementById("dashboardSection").style.display = section === "dashboard" ? "block" : "none";
  document.getElementById("matchesSection").style.display = section === "matches" ? "block" : "none";

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  const all = document.querySelectorAll(".sidebar li");
  if (section === "dashboard") all[0].classList.add("active");
  else all[1].classList.add("active");
}

document.getElementById("matchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("matchDate").value;
  const location = document.getElementById("matchLocation").value;
  matches.push({ date, location, players: [] });
  localStorage.setItem("matches", JSON.stringify(matches));
  this.reset();
  renderMatches();
});

function renderMatches() {
  const container = document.getElementById("matchList");
  container.innerHTML = "";

  matches.forEach((match, i) => {
    const percent = Math.min((match.players.length / 10) * 100, 100);
    const div = document.createElement("div");
    div.className = "match";
    div.innerHTML = `
      <strong>${new Date(match.date).toLocaleString()}</strong><br>
      📍 ${match.location}<br>
      👥 ${match.players.length}/10 joueurs
      <div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div>
    `;

    if (role === "joueur" && match.players.length < 10) {
      const form = document.createElement("form");
      form.innerHTML = `
        <input type="text" placeholder="Pseudo" required>
        <input type="text" placeholder="Rôle" required>
        <button type="submit">Rejoindre</button>
      `;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const pseudo = form.querySelectorAll("input")[0].value;
        const agent = form.querySelectorAll("input")[1].value;
        matches[i].players.push({ name: pseudo, role: agent });
        localStorage.setItem("matches", JSON.stringify(matches));
        renderMatches();
      });
      div.appendChild(form);
    }

    container.appendChild(div);
  });
}
