import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';


const router = express.Router();

// GET /api/riddles
router.get('/', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.riddles);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const db = await readDb();
        const riddle = db.riddles.find(row => row.id === id);

        if (!riddle) {
            return res.status(404).json({ error: 'Riddle not found' });
        }

        return res.json(riddle);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post('/', async (req, res) => {
    try {
        const newRiddle = req.body;
        const db = await readDb();
        newRiddle.id = Math.max(0, ...db.riddles.map(r => r.id)) + 1;
        db.riddles.push(newRiddle);
        await writeDb(db);
        return res.status(201).json(newRiddle);
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updatedRiddle = req.body;
        const db = await readDb();
        const index = db.riddles.findIndex(row => row.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Riddle not found' });
        }

        db.riddles[index] = { ...db.riddles[index], ...updatedRiddle, id };
        await writeDb(db);
        return res.json(db.riddles[index]);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const db = await readDb();
        const index = db.riddles.findIndex(row => row.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Riddle not found' });
        }
        db.riddles.splice(index, 1);
        await writeDb(db);
        return res.status(204).send();
    }
    catch {
        return res.status(500).json({ error: "Server error" });
    }
});
export default router;
