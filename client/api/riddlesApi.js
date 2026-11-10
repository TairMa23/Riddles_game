const baseUrl = 'http://localhost:3000/api/riddles';
async function getAllRiddles() {
    const response = await fetch(baseUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch riddles: ${response.status}`);
    }

    return response.json();
}

async function createRiddle(riddle) {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(riddle),
    });
    if (!response.ok) {
        throw new Error(`Failed to create riddle: ${response.status}`);
    }

    return response.json();
}
async function updateRiddle(riddle) {
    const response = await fetch(`${baseUrl}/${riddle.id}`, {
        method: 'PUT',  
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(riddle),
    });   
        if (!response.ok) {
        throw new Error(`Failed to update riddle: ${response.status}`);
    }

    return response.json();

}

async function deleteRiddle(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete riddle: ${response.status}`);
    }

    return response.json();
}
async function getRiddleById(id) {
    const response = await fetch(`${baseUrl}/${id}`);
    if (response.status === 404) return undefined;
    if (!response.ok) {
        throw new Error(`Failed to fetch riddle: ${response.status}`);
    }
    return response.json();
}


export { getAllRiddles, createRiddle, updateRiddle, deleteRiddle,getRiddleById };
export default getAllRiddles;
