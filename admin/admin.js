function getData() {
    return {
        rocks: parseInt(localStorage.getItem("rocks") || "0"),
        inventory: JSON.parse(localStorage.getItem("inventory") || "[]"),
        playerHP: parseInt(localStorage.getItem("playerHP") || "30"),
        missionCompleted: localStorage.getItem("missionCompleted") === "true",
    };
}

function saveData(data) {
    localStorage.setItem("rocks", data.rocks);
    localStorage.setItem("inventory", JSON.stringify(data.inventory));
    localStorage.setItem("playerHP", data.playerHP);
    localStorage.setItem("missionCompleted", data.missionCompleted);
}

function updateStatus() {
    const d = getData();
    document.getElementById("status").textContent = JSON.stringify(d, null, 2);
}

function addRocks(amount) {
    const d = getData();
    d.rocks += amount;
    saveData(d);
    updateStatus();
}

function addItem(itemName) {
    const d = getData();
    d.inventory.push(itemName);
    saveData(d);
    updateStatus();
}

function healPlayer() {
    const d = getData();
    d.playerHP = 30; // HP máximo
    saveData(d);
    updateStatus();
}

function completeMission() {
    const d = getData();
    d.missionCompleted = true;
    saveData(d);
    updateStatus();
}

function resetGame() {
    localStorage.clear();
    updateStatus();
    alert("Jogo resetado.");
}

window.onload = updateStatus;
