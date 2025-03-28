function loadStatLeaders() {
    const container = document.getElementById("statsLeadersContainer")

    const categories = [
        { name: "Points", shortName: "PPG", endpoint: "/api/stats_leaders/ppg"},
        { name: "Rebounds", shortName: "RPG", endpoint: "/api/stats_leaders/rpg"},
        { name: "Assists", shortName: "APG", endpoint: "/api/stats_leaders/apg" },
        { name: "Steals", shortName: "SPG", endpoint: "/api/stats_leaders/spg" },
        { name: "Blocks", shortName: "BPG", endpoint: "/api/stats_leaders/bpg" },
        { name: "Field Goal %", shortName: "FG%", endpoint: "/api/stats_leaders/fgp" },
        { name: "3-Point %", shortName: "3P%", endpoint: "/api/stats_leaders/3pp" },
        { name: "Free Throw %", shortName: "FT%", endpoint: "/api/stats_leaders/ftp" }
    ]

    fetch("http://127.0.0.1:5000/api/stats_leaders/all")
        .then(response => response.json())
        .then(data => {
            renderStatLeaders(data, categories);
        })
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
                "Free Throw %": "freethrow"
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
            
            statData.forEach((player, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'leader-item';
                
                // Get player ID (you might need to modify your backend to include this)
                // For now, we'll use the NBA's headshot URL pattern
                const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${player.player_id}.png`;
                // Fallback image if player headshot doesn't exist
                const fallbackUrl = 'https://cdn.nba.com/headshots/nba/latest/260x190/fallback.png';
                
                listItem.innerHTML = `
                    <div class="rank">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-photo">
                            <img src="${headshotUrl}" onerror="this.src='${fallbackUrl}'" alt="${player.player_name}">
                        </div>
                        <div>
                            <span class="player-name">${player.player_name}</span>
                            <span class="player-team">${player.team_name}</span>
                        </div>
                    </div>
                    <div class="stat-value">${player.stat_value}</div>
                `;
                
                listUl.appendChild(listItem);
            });
            
            categoryDiv.appendChild(listUl);
        
            const viewAllLink = document.createElement('a');
            viewAllLink.href = '#';
            viewAllLink.className = 'view-all-btn';
            viewAllLink.textContent = 'View All Stats';
            categoryDiv.appendChild(viewAllLink);
            
            rowContainer.appendChild(categoryDiv);
        });
        
        container.appendChild(rowContainer);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    loadStatLeaders();
})