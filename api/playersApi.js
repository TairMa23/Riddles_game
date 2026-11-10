const baseUrl = 'http://localhost:3000/players';

async function findPlayerByName(name) {
    const response = await fetch(`${baseUrl}?name=${encodeURIComponent(name)}`);

    if (!response.ok) {
        throw new Error(`Failed to find player: ${response.status}`);
    }

    const players = await response.json();
    return players[0]; // undefined if the array is empty
}
async function createPlayer(name) {

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lowestTime: null }),
    });
    if (!response.ok) {
        throw new Error(`Failed to create player: ${response.status}`);
    }

    return response.json();
}

async function updatePlayer(player) {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(player.id)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lowestTime: player.lowestTime }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update player: ${response.status}`);
    }

    return response.json();
}

async function getAllPlayers() {
    const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to get players: ${response.status}`);
    }

    return response.json();
}

export { findPlayerByName, createPlayer, updatePlayer, getAllPlayers };

