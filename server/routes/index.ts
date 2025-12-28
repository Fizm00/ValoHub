import express from 'express';
import { register, login } from '../controllers/auth';
import { syncData } from '../controllers/dataSync';
import { Agent, MapModel, Weapon } from '../models';

import { getCrosshairs, createCrosshair } from '../controllers/crosshair';

const router = express.Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Admin/Sync Routes
router.post('/sync', syncData);

// Public Routes (Read from DB now)
router.get('/agents', async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching agents' });
    }
});

router.get('/maps', async (req, res) => {
    try {
        const maps = await MapModel.find();
        res.json(maps);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching maps' });
    }
});

router.get('/weapons', async (req, res) => {
    try {
        const weapons = await Weapon.find();
        res.json(weapons);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching weapons' });
    }
});

// Crosshair Routes (Public)
router.get('/crosshairs', getCrosshairs);
router.post('/crosshairs', createCrosshair);

export default router;
