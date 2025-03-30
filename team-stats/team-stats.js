function loadStatLeaders() {
    const container = document.getElementById("statsLeadersContainer");

    const categories = [
        { name: "Points", shortName: "PPG", endpoint: "/api/team_stats_leaders/ppg"},
        // { name: "Rebounds", shortName: "RPG", endpoint: "/api/team_stats_leaders/rpg"},
        // { name: "Assists", shortName: "APG", endpoint: "/api/team_stats_leaders/apg" },
        // { name: "Steals", shortName: "SPG", endpoint: "/api/team_stats_leaders/spg" },
        // { name: "Blocks", shortName: "BPG", endpoint: "/api/team_stats_leaders/bpg" },
        // { name: "Field Goal %", shortName: "FG%", endpoint: "/api/team_stats_leaders/fgp" },
        // { name: "3-Point %", shortName: "3P%", endpoint: "/api/team_stats_leaders/3pp" },
        // { name: "Free Throw %", shortName: "FT%", endpoint: "/api/team_stats_leaders/ftp" },
        // { name: "Wins", shortName: "W", endpoint: "/api/team_stats_leaders/wins" },
        // { name: "Losses", shortName: "L", endpoint: "/api/team_stats_leaders/losses" },
        // { name: "Win Percentage", shortName: "Win%", endpoint: "/api/team_stats_leaders/winpct" }
    ];

    fetch("http://127.0.0.1:5000/api/team_stats_leaders/all")
        .then(response => response.json())
        .then(data => {
            renderStatLeaders(data, categories);
        })
        .catch(error => {
            console.error("Error loading team stats:", error);
            container.innerHTML = "<div class='loading'>Failed to load team stats. Please try again later.</div>";
        });
}

function renderStatLeaders(data, categories) {
    const container = document.getElementById("statsLeadersContainer");

    const numRows = Math.ceil(categories.length / 3);

    for (let i = 0; i < numRows; i++) {
        const rowContainer = document.createElement("div");
        rowContainer.className = 'stats-leaders-container';
                    
        const rowCategories = categories.slice(i * 3, (i + 1) * 3);
        
        rowCategories.forEach(category => {
            const keyMap = {
                "Points": "points",
                "Rebounds": "rebounds",
                "Assists": "assists",
                "Steals": "steals",
                "Blocks": "blocks",
                "Field Goal %": "fieldgoal",
                "3-Point %": "threepoint",
                "Free Throw %": "freethrow",
                "Wins": "wins",
                "Losses": "losses",
                "Win Percentage": "winpct"
            };
            
            const statData = data[keyMap[category.name]];
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'stat-category';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'stat-header';
            headerDiv.innerHTML = `${category.name} <span>${category.shortName}</span>`;
            categoryDiv.appendChild(headerDiv);
            
            const listUl = document.createElement('ul');
            listUl.className = 'leader-list';
            
            statData.forEach((team, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'leader-item';
                
                const logoUrl = `https://cdn.nba.com/logos/nba/${team.team_id}/primary/L/logo.svg`;
                
                listItem.innerHTML = `
                    <div class="rank">${index + 1}</div>
                    <div class="team-info">
                        <div class="team-logo">
                            <img src="${logoUrl}" alt="${team.team_name}">
                        </div>
                        <div>
                            <span class="team-name">${team.team_name}</span>
                        </div>
                    </div>
                    <div class="stat-value">${team.stat_value}</div>
                `;
                
                listUl.appendChild(listItem);
            });
            
            categoryDiv.appendChild(listUl);
        
            const viewAllLink = document.createElement('a');
            viewAllLink.href = '#';
            viewAllLink.className = 'view-all-btn';
            viewAllLink.textContent = 'View All Teams';
            categoryDiv.appendChild(viewAllLink);
            
            rowContainer.appendChild(categoryDiv);
        });
        
        container.appendChild(rowContainer);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadStatLeaders();
});