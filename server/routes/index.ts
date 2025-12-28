import express from 'express';
import { register, login } from '../controllers/auth';
import { syncData } from '../controllers/dataSync';
import { Agent, MapModel, Weapon } from '../models';

import { getCrosshairs, createCrosshair } from '../controllers/crosshair';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/sync', syncData);

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

router.get('/crosshairs', getCrosshairs);
router.post('/crosshairs', createCrosshair);

export default router;
