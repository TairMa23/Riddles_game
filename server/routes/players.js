import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const db = await readDb();
        const { name } = req.query;

        if (name) {
            return res.json(db.players.filter(player => player.name === name));
        }
        return res.json(db.players);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

// POST /api/players
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const db = await readDb();
        const newPlayer = {
            id: Math.max(0, ...db.players.map(p => p.id)) + 1,
            name,
            lowestTime: null
        };

        db.players.push(newPlayer);
        await writeDb(db);
        return res.status(201).json(newPlayer);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

// PUT /api/players/:id
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const db = await readDb();
        const index = db.players.findIndex(player => player.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Player not found" });
        }

        db.players[index] = { ...db.players[index], ...req.body, id };
        await writeDb(db);
        return res.json(db.players[index]);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;