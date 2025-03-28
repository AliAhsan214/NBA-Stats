document.addEventListener('DOMContentLoaded', function() {
    const compareBtn = document.getElementById('compare-btn');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const loadingDiv = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const comparisonResults = document.getElementById('comparison-results');
    
    compareBtn.addEventListener('click', comparePlayersHandler);
    
    // Also trigger comparison on Enter key in either input
    player1Input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            comparePlayersHandler();
        }
    });
    
    player2Input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            comparePlayersHandler();
        }
    });
    
    async function comparePlayersHandler() {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        if (!player1Name || !player2Name) {
            displayError('Please enter both player names');
            return;
        }
        
        showLoading(true);
        
        try {
            const player1Data = await fetchPlayerData(player1Name);
            const player2Data = await fetchPlayerData(player2Name);
            
            if (player1Data.length === 0) {
                throw new Error(`Could not find player: ${player1Name}`);
            }
            
            if (player2Data.length === 0) {
                throw new Error(`Could not find player: ${player2Name}`);
            }
            
            displayComparisonResults(player1Data, player2Data, player1Name, player2Name);
        } catch (error) {
            displayError(error.message);
        } finally {
            showLoading(false);
        }
    }
    
    async function fetchPlayerData(playerName) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/player/${playerName}`);
            
            if (!response.ok) {
                throw new Error(`Error fetching player data: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`Error fetching data for ${playerName}: ${error.message}`);
        }
    }
    
    function showLoading(isLoading) {
        loadingDiv.style.display = isLoading ? 'flex' : 'none';
        // comparisonResults.style.display = 'none';
        errorContainer.innerHTML = '';
    }
    
    function displayError(message) {
        errorContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
        comparisonResults.style.display = 'none';
    }
    
    function displayComparisonResults(player1Data, player2Data, player1Name, player2Name) {
        // Get the most recent season data for each player
        const player1Recent = player1Data[player1Data.length - 1];
        const player2Recent = player2Data[player2Data.length - 1];
        
        // Update player headers
        updatePlayerHeader('player1-header', player1Name, player1Recent.TEAM_ABBREVIATION);
        updatePlayerHeader('player2-header', player2Name, player2Recent.TEAM_ABBREVIATION);
        
        // Update table headers
        document.getElementById('player1-name-header').textContent = player1Name;
        document.getElementById('player2-name-header').textContent = player2Name;
        
        // Populate the stats table
        const statsToCompare = [
            { key: 'PTS', name: 'Points Per Game', higherIsBetter: true },
            { key: 'AST', name: 'Assists Per Game', higherIsBetter: true },
            { key: 'REB', name: 'Rebounds Per Game', higherIsBetter: true },
            { key: 'STL', name: 'Steals Per Game', higherIsBetter: true },
            { key: 'BLK', name: 'Blocks Per Game', higherIsBetter: true },
            { key: 'FG_PCT', name: 'Field Goal %', higherIsBetter: true },
            { key: 'FG3_PCT', name: '3-Point %', higherIsBetter: true },
            { key: 'FT_PCT', name: 'Free Throw %', higherIsBetter: true },
            { key: 'TOV', name: 'Turnovers Per Game', higherIsBetter: false }
        ];
        
        const statsTableBody = document.querySelector('#stats-table tbody');
        statsTableBody.innerHTML = '';
        
        let player1Advantages = 0;
        let player2Advantages = 0;
        
        statsToCompare.forEach(stat => {
            const player1Value = player1Recent[stat.key] || 0;
            const player2Value = player2Recent[stat.key] || 0;
            
            let player1Class = '';
            let player2Class = '';
            let player1Better = false;
            let player2Better = false;
            
            if (player1Value !== player2Value) {
                if ((stat.higherIsBetter && player1Value > player2Value) || 
                    (!stat.higherIsBetter && player1Value < player2Value)) {
                    player1Class = 'better';
                    player2Class = 'worse';
                    player1Better = true;
                    player1Advantages++;
                } else {
                    player1Class = 'worse';
                    player2Class = 'better';
                    player2Better = true;
                    player2Advantages++;
                }
            } else {
                player1Class = 'equal';
                player2Class = 'equal';
            }
            
            // Calculate the percentage difference for the bar
            const maxValue = Math.max(player1Value, player2Value);
            const difference = Math.abs(player1Value - player2Value);
            const percentageDiff = maxValue > 0 ? (difference / maxValue) * 100 : 0;
            const cappedPercentage = Math.min(percentageDiff, 50); // Cap at 50% for visual purposes
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="stat-name">${stat.name}</td>
                <td class="${player1Class}">${player1Value.toFixed(1)}</td>
                <td class="${player2Class}">${player2Value.toFixed(1)}</td>
            `;
            statsTableBody.appendChild(row);
            
            // Add a difference bar under this row
            const barRow = document.createElement('tr');
            const barCell = document.createElement('td');
            barCell.colSpan = 3;
            barCell.style.padding = '0';
            
            const barDiv = document.createElement('div');
            barDiv.className = 'stat-difference-bar';
            
            const diffIndicator = document.createElement('div');
            diffIndicator.className = `difference-indicator ${player1Better ? 'player1-better' : 'player2-better'}`;
            diffIndicator.style.width = `${cappedPercentage}%`;
            
            barDiv.appendChild(diffIndicator);
            barCell.appendChild(barDiv);
            barRow.appendChild(barCell);
            
            statsTableBody.appendChild(barRow);
        });
        
        // Create the summary text
        createSummary(player1Name, player2Name, player1Recent, player2Recent, player1Advantages, player2Advantages);
        
        // Show the results
        comparisonResults.style.display = 'block';
    }
    
    function updatePlayerHeader(elementId, playerName, teamAbbreviation) {
        const element = document.getElementById(elementId);
        element.innerHTML = `
           
            <div class="player-name">${playerName}</div>
            <div class="player-team">${teamAbbreviation || 'N/A'}</div>
        `;
    }
    
    function createSummary(player1Name, player2Name, player1Data, player2Data, player1Advantages, player2Advantages) {
        const summaryDiv = document.getElementById('summary-content');
        
        // Calculate career averages and other notable stats
        const player1Points = player1Data.PTS || 0;
        const player2Points = player2Data.PTS || 0;
        
        let summary = '';
        
        if (player1Advantages > player2Advantages) {
            summary += `<p>${player1Name} has better stats in ${player1Advantages} out of ${player1Advantages + player2Advantages} major statistical categories compared to ${player2Name}.</p>`;
        } else if (player2Advantages > player1Advantages) {
            summary += `<p>${player2Name} has better stats in ${player2Advantages} out of ${player1Advantages + player2Advantages} major statistical categories compared to ${player1Name}.</p>`;
        } else {
            summary += `<p>${player1Name} and ${player2Name} are evenly matched, with each player having advantages in ${player1Advantages} statistical categories.</p>`;
        }
        
        // Add points comparison
        if (player1Points > player2Points) {
            summary += `<p>${player1Name} is the better scorer, averaging ${player1Points.toFixed(1)} points per game compared to ${player2Points.toFixed(1)} for ${player2Name}.</p>`;
        } else if (player2Points > player1Points) {
            summary += `<p>${player2Name} is the better scorer, averaging ${player2Points.toFixed(1)} points per game compared to ${player1Points.toFixed(1)} for ${player1Name}.</p>`;
        } else {
            summary += `<p>Both players average the same number of points per game at ${player1Points.toFixed(1)}.</p>`;
        }
        
        // Add playstyle characteristics based on stats
        summary += '<p><strong>Player Styles:</strong></p>';
        
        // Player 1 style
        summary += `<p>${player1Name}: `;
        if (player1Data.AST > 7) {
            summary += 'Elite playmaker, ';
        } else if (player1Data.AST > 5) {
            summary += 'Good facilitator, ';
        }
        
        if (player1Data.REB > 10) {
            summary += 'dominant rebounder, ';
        } else if (player1Data.REB > 7) {
            summary += 'strong on the boards, ';
        }
        
        if (player1Data.STL + player1Data.BLK > 3) {
            summary += 'excellent defender, ';
        }
        
        if (player1Data.FG3_PCT > 0.38 && player1Data.FG3A > 5) {
            summary += 'reliable 3-point shooter, ';
        }
        
        // Remove trailing comma and space
        summary = summary.slice(0, -2) + '.</p>';
        
        // Player 2 style
        summary += `<p>${player2Name}: `;
        if (player2Data.AST > 7) {
            summary += 'Elite playmaker, ';
        } else if (player2Data.AST > 5) {
            summary += 'Good facilitator, ';
        }
        
        if (player2Data.REB > 10) {
            summary += 'dominant rebounder, ';
        } else if (player2Data.REB > 7) {
            summary += 'strong on the boards, ';
        }
        
        if (player2Data.STL + player2Data.BLK > 3) {
            summary += 'excellent defender, ';
        }
        
        if (player2Data.FG3_PCT > 0.38 && player2Data.FG3A > 5) {
            summary += 'reliable 3-point shooter, ';
        }
        
        // Remove trailing comma and space
        summary = summary.slice(0, -2) + '.</p>';
        
        summaryDiv.innerHTML = summary;
    }
});

// https://cdn.nba.com/headshots/nba/latest/260x190/{id}.png