document.getElementById("player-stats-link").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(".player-stats-section").style.display = "block";
});

async function loadPlayerStats() {
    const name = document.getElementById("playerName").value;
    const response = await fetch(`http://127.0.0.1:5000/player/${name}`);
    const data = await response.json();
    displayResults(data, "playerResults");
}

async function loadLiveScores() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/live_scores");
        const data = await response.json();
        displayLiveScores(data);
    } catch (error) {
        console.error("Error loading live scores:", error);
        document.getElementById("liveScores").innerHTML = "<p>Error loading scores. Please try again later.</p>";
    }
}

function displayLiveScores(data) {
    const container = document.getElementById("liveScores");
    container.innerHTML = "";
    
    if (data.length === 0) {
        container.innerHTML = "<p>No live games currently.</p>";
        return;
    }
    
    data.forEach(game => {
        const gameDiv = document.createElement("div");
        gameDiv.className = "game-card";
        
        // Format team names to be used in logo URLs
        const homeTeamFormatted = formatTeamNameForLogo(game.home_team);
        const awayTeamFormatted = formatTeamNameForLogo(game.away_team);
        
        gameDiv.innerHTML = `
            <div class="teams-container">
                <div class="team">
                    <img src="https://cdn.nba.com/logos/nba/${awayTeamFormatted}/global/L/logo.svg" alt="${game.away_team} logo" class="team-logo" onerror="this.src='/api/placeholder/60/60'; this.alt='Team logo placeholder';">
                    <div class="team-name">${game.away_team}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <img src="https://cdn.nba.com/logos/nba/${homeTeamFormatted}/global/L/logo.svg" alt="${game.home_team} logo" class="team-logo" onerror="this.src='/api/placeholder/60/60'; this.alt='Team logo placeholder';">
                    <div class="team-name">${game.home_team}</div>
                </div>
            </div>
            <div class="score-container">
                <div class="score">${game.away_score}</div>
                <div>-</div>
                <div class="score">${game.home_score}</div>
            </div>
            <div class="game-status">${game.game_status}</div>
        `;
        container.appendChild(gameDiv);
    });
}

function formatTeamNameForLogo(teamName) {
    const teamMappings = {
        "Lakers": "1610612747",
        "Celtics": "1610612738",
        "Warriors": "1610612744",
        "Bucks": "1610612749",
        "Heat": "1610612748",
        "Hawks": "1610612737",
        "Nets": "1610612751",
        "Hornets": "1610612766",
        "Cavaliers": "1610612739",
        "Bulls": "1610612741",
        "Mavericks": "1610612742",
        "Nuggets": "1610612743",
        "Pistons": "1610612765",
        "Rockets": "1610612745",
        "Pacers": "1610612754",
        "Clippers": "1610612746",
        "Grizzlies": "1610612763",
        "Timberwolves": "1610612750",
        "Knicks": "1610612752",
        "Pelicans": "1610612740",
        "Thunder": "1610612760",
        "Magic": "1610612753",
        "76ers": "1610612755",
        "Suns": "1610612756",
        "Trail Blazers": "1610612757",
        "Spurs": "1610612759",
        "Kings": "1610612758",
        "Raptors": "1610612761",
        "Jazz": "1610612762",
        "Wizards": "1610612764",
    };
    
    // Try to find the team ID by looking for the team name in the mappings
    for (const [key, value] of Object.entries(teamMappings)) {
        if (teamName.includes(key)) {
            return value;
        }
    }
    
    // Return a default if no match found
    return "1610612742"; // Default ID as fallback
}

function displayResults(data, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";
    
    const table = document.createElement("table");
    table.border = "1";
    
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    container.appendChild(table);
}

// Load live scores initially and refresh every 30 seconds
window.onload = function() {
    loadLiveScores();
    setInterval(loadLiveScores, 30000);
};