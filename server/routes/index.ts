import express from 'express';
import { register, login, updateProfile } from '../controllers/auth';
import { auth } from '../middleware/authMiddleware';
import { cache } from '../middleware/cache';
import { syncData } from '../controllers/dataSync';
import { Agent, MapModel, Weapon } from '../models';
import { getCrosshairs, createCrosshair } from '../controllers/crosshair';

const router = express.Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/profile', auth, updateProfile);

// User Routes
import {
    toggleSavedCrosshair, getSavedCrosshairs,
    toggleSavedSkin, getSavedSkins,
    saveSquad, getSavedSquads, deleteSavedSquad
} from '../controllers/user';

router.post('/user/saved-crosshairs', auth, toggleSavedCrosshair);
router.get('/user/saved-crosshairs', auth, getSavedCrosshairs);

router.post('/user/saved-skins', auth, toggleSavedSkin);
router.get('/user/saved-skins', auth, getSavedSkins);

router.post('/user/saved-squads', auth, saveSquad);
router.get('/user/saved-squads', auth, getSavedSquads);
router.delete('/user/saved-squads/:id', auth, deleteSavedSquad);

// Admin Routes
router.post('/sync', syncData);

// Public Routes
router.get('/agents', cache(3600), async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching agents' });
    }
});

router.get('/maps', cache(3600), async (req, res) => {
    try {
        const maps = await MapModel.find();
        res.json(maps);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching maps' });
    }
});

router.get('/weapons', cache(3600), async (req, res) => {
    try {
        const weapons = await Weapon.find();
        res.json(weapons);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error fetching weapons' });
    }
});

// Crosshair Routes
router.get('/crosshairs', getCrosshairs);
router.post('/crosshairs', createCrosshair);

export default router;
