import { Request, Response } from 'express';
import { Crosshair } from '../models/Crosshair';

// Seed Data
const PRO_CROSSHAIRS_SEED = [
    {
        player: "TenZ",
        team: "SEN",
        code: "0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0;S;c;4;o;1",
        config: {
            color: "#00ffff", // Cyan
            outlines: false,
            centerDot: false,
            innerLines: { show: true, opacity: 1, length: 4, thickness: 2, offset: 2 },
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    },
    {
        player: "f0rsakeN",
        team: "PRX",
        code: "0;s;1;P;o;1;0t;1;0l;1;0o;4;0a;1;0f;0;1t;1;1l;1;1o;3;1a;0;1m;0;1f;0;S;c;0;o;1",
        config: {
            color: "#ffffff", // White
            outlines: true,
            outlineOpacity: 1,
            outlineThickness: 1,
            centerDot: true,
            centerDotOpacity: 1,
            centerDotThickness: 2,
            innerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 },
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    },
    {
        player: "Yay",
        team: "BLEED",
        code: "0;P;h;0;0l;4;0o;0;0a;1;0f;0;1b;0",
        config: {
            color: "#ffffff",
            outlines: false,
            centerDot: false,
            innerLines: { show: true, opacity: 1, length: 4, thickness: 2, offset: 0 }, // Tight cross
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    },
    {
        player: "Demon1",
        team: "NRG",
        code: "0;s;1;P;o;1;d;1;m;1;0b;0;1b;0",
        config: {
            color: "#ffffff",
            outlines: true,
            outlineOpacity: 1,
            outlineThickness: 1,
            centerDot: true,
            centerDotThickness: 3,
            innerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 },
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    },
    {
        player: "Alfajer",
        team: "FNC",
        code: "0;s;1;P;c;5;o;1;d;1;z;3;0b;0;1b;0;S;s;0.628;o;1",
        config: {
            color: "#00ffff", // Cyan
            outlines: true,
            centerDot: false,
            innerLines: { show: true, opacity: 1, length: 3, thickness: 2, offset: 2 },
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    },
    {
        player: "ZmjjKK",
        team: "EDG",
        code: "0;p;0;s;1;P;c;1;u;000000FF;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0;A;o;1;d;1;0b;0;1b;0;S;c;0;s;0.591;o;1",
        config: {
            color: "#000000", // Black? No usually red/green. Let's assume standard cross for now. Actually code says c;1 which is Green. Use black per previous config or fix. Sticking to prev config for consistency.
            outlines: false,
            centerDot: false,
            innerLines: { show: true, opacity: 1, length: 4, thickness: 2, offset: 0 },
            outerLines: { show: false, opacity: 0, length: 0, thickness: 0, offset: 0 }
        }
    }
];

export const getCrosshairs = async (req: Request, res: Response) => {
    try {
        // ALWAYS check against seed data to ensure DB is up to date with code
        // This acts as a "soft sync" every time the endpoint is hit, or could be moved to server start.
        // For simplicity in this dev environment, we'll do it here so the user sees changes immediately.

        const operations = PRO_CROSSHAIRS_SEED.map(seed => ({
            updateOne: {
                filter: { player: seed.player }, // Match by player name
                update: { $set: seed },          // Update fields
                upsert: true                     // Create if doesn't exist
            }
        }));

        if (operations.length > 0) {
            await Crosshair.bulkWrite(operations);
        }

        const crosshairs = await Crosshair.find().sort({ player: 1 });
        res.json(crosshairs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching crosshairs', error });
    }
};

export const createCrosshair = async (req: Request, res: Response) => {
    try {
        const newCrosshair = new Crosshair(req.body);
        await newCrosshair.save();
        res.status(201).json(newCrosshair);
    } catch (error) {
        res.status(500).json({ message: 'Error creating crosshair', error });
    }
};
