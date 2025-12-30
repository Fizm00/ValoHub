import { isValidObjectId } from 'mongoose';
import { Request, Response } from 'express';
import { User, Skin, Squad } from '../models';
import { Crosshair } from '../models/Crosshair';

export const toggleSavedCrosshair = async (req: Request, res: Response) => {
    try {
        const { crosshairId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.savedCrosshairs.indexOf(crosshairId);

        if (index === -1) {
            user.savedCrosshairs.push(crosshairId);
        } else {
            user.savedCrosshairs.splice(index, 1);
        }

        await user.save();

        res.status(200).json({
            message: index === -1 ? 'Crosshair saved' : 'Crosshair removed',
            savedCrosshairs: user.savedCrosshairs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling saved crosshair' });
    }
};

export const getSavedCrosshairs = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('savedCrosshairs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.savedCrosshairs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved crosshairs' });
    }
};

// --- SKINS ---

export const toggleSavedSkin = async (req: Request, res: Response) => {
    try {
        const { skinId } = req.body; // skinId sent from frontend is UUID
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the skin document first!
        // Try finding by UUID first as that's what frontend sends
        let skin = await Skin.findOne({ uuid: skinId });

        // If not found by UUID, try by _id if it's a valid ObjectId
        if (!skin && isValidObjectId(skinId)) {
            skin = await Skin.findById(skinId);
        }

        if (!skin) {
            return res.status(404).json({ message: 'Skin not found in database' });
        }

        // Use the actual Mongo _id for the relationship
        const skinObjectId = skin._id;

        // Check if already saved using string comparison to be safe with ObjectIds
        const existingIndex = user.savedSkins.findIndex((id: any) => id.toString() === skinObjectId.toString());

        if (existingIndex === -1) {
            user.savedSkins.push(skinObjectId);
        } else {
            user.savedSkins.splice(existingIndex, 1);
        }

        await user.save();

        // Populate to return the updated list immediately if needed, 
        // or just return the IDs. Frontend might prefer IDs to toggle local state simple.
        // But for consistency with getSavedSkins, maybe return objects? 
        // The current frontend implementation expects `savedSkins` in response to update user context.
        // Let's return the list of IDs or Objects? 
        // Existing code returned `user.savedSkins` (which is list of IDs). 
        // However, if we populate it in getSavedSkins, consistency matters.
        // For now, let's keep it as IDs to be safe with existing types or populated if that's what user.savedSkins is.
        // Since we didn't populate user on findById, it's just IDs.

        res.status(200).json({
            message: existingIndex === -1 ? 'Skin saved' : 'Skin removed',
            savedSkins: user.savedSkins // These are ObjectId references
        });
    } catch (error) {
        console.error("Error saving skin:", error);
        res.status(500).json({ message: 'Error toggling saved skin' });
    }
};

export const getSavedSkins = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('savedSkins');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.savedSkins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved skins' });
    }
};

// --- SQUADS ---

export const saveSquad = async (req: Request, res: Response) => {
    try {
        const { name, map, agents } = req.body;
        const userId = req.userId;

        // Create Squad
        const newSquad = await Squad.create({
            name,
            map,
            agents,
            createdBy: userId
        });

        // Add to User
        const user = await User.findById(userId);
        if (user) {
            user.savedSquads.push(newSquad._id as any);
            await user.save();
        }

        res.status(201).json(newSquad);
    } catch (error) {
        console.error("Error creating squad:", error);
        res.status(500).json({ message: 'Error creating squad' });
    }
};

export const getSavedSquads = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('savedSquads');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.savedSquads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved squads' });
    }
};

export const deleteSavedSquad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const squad = await Squad.findOneAndDelete({ _id: id, createdBy: userId });
        if (!squad) return res.status(404).json({ message: 'Squad not found or unauthorized' });

        // Remove from User
        await User.findByIdAndUpdate(userId, {
            $pull: { savedSquads: id }
        });

        res.status(200).json({ message: 'Squad deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting squad' });
    }
};
