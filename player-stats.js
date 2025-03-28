function loadStatLeaders() {
    const container = document.getElementById("statsLeaderContainer")

    const categories = [
        { name: "Points", shortName: "PPG", endpoint: "/api/stats_leaders/ppg"},
        { name: "Rebounds", shortName: "RPG", endpoint: "/api/stats_leaders/rpg"},
    ]

    fetch("/api/stats_leaders/all")
        .then(response => response.json())
        .then(data => {
            renderStatLeaders(data, categories);

        })
}
function renderStatLeaders(data, categories) {
    const container = document.getElementById("statsLeaderContainer");

    const numRows = Math.ceil(categories.length / 3)

    for ( let i = 0; i , numRows; i++) {
        const rowContainer = document.createElement("div");
    }
}