import { Request, Response } from 'express';
import { Agent, MapModel, Weapon } from '../models';
import { MAP_METADATA } from '../data/mapMetadata';
import { WEAPON_STRATEGIES } from '../data/weaponMetadata';

const BASE_URL = 'https://valorant-api.com/v1';

export const syncData = async (req: Request, res: Response) => {
    try {
        console.log("⚡ Starting Data Sync...");

        // DROP COLLECTIONS to clear old indexes/data
        // Use try-catch because dropping non-existent collection throws error
        try { await Agent.collection.drop(); } catch (e) { console.log('Agents collection not found or already empty'); }
        try { await MapModel.collection.drop(); } catch (e) { console.log('Maps collection not found or already empty'); }
        try { await Weapon.collection.drop(); } catch (e) { console.log('Weapons collection not found or already empty'); }
        console.log("🗑️ Cleared old data and indexes");

        // 1. Sync Agents
        console.log("Fetching Agents...");
        const agentsRes = await fetch(`${BASE_URL}/agents?isPlayableCharacter=true`);
        const agentsData = await agentsRes.json();

        let agentCount = 0;
        for (const agent of agentsData.data) {
            // Filter duplicates if needed, but upsert handles updates
            if (agent.isPlayableCharacter) {
                await Agent.findOneAndUpdate(
                    { uuid: agent.uuid },
                    agent,
                    { upsert: true, new: true }
                );
                agentCount++;
            }
        }
        console.log(`✅ Synced ${agentCount} Agents`);

        // 2. Sync Maps
        console.log("Fetching Maps...");
        const mapsRes = await fetch(`${BASE_URL}/maps`);
        const mapsData = await mapsRes.json();

        let mapCount = 0;
        for (const map of mapsData.data) {
            // Inject custom narrative and release date
            const metadata = MAP_METADATA[map.displayName];
            const narrative = map.narrativeDescription || metadata?.narrative || "Top secret location. No intelligence data available.";
            const releaseDate = metadata?.releaseDate || "2020-06-02"; // Fallback to initial release

            await MapModel.findOneAndUpdate(
                { uuid: map.uuid },
                {
                    ...map,
                    narrativeDescription: narrative,
                    releaseDate: releaseDate
                },
                { upsert: true, new: true }
            );
            mapCount++;
        }
        console.log(`✅ Synced ${mapCount} Maps`);

        // 3. Sync Weapons
        console.log("Fetching Weapons...");
        const weaponsRes = await fetch(`${BASE_URL}/weapons`);
        const weaponsData = await weaponsRes.json();

        let weaponCount = 0;
        for (const weapon of weaponsData.data) {
            await Weapon.findOneAndUpdate(
                { uuid: weapon.uuid },
                {
                    ...weapon,
                    strategyGuide: WEAPON_STRATEGIES[weapon.displayName] || [] // Inject Strategy Guide
                },
                { upsert: true, new: true }
            );
            weaponCount++;
        }
        console.log(`✅ Synced ${weaponCount} Weapons`);

        res.json({
            message: "Data Synchronization Complete",
            stats: {
                agents: agentCount,
                maps: mapCount,
                weapons: weaponCount
            }
        });

    } catch (error) {
        console.error("❌ Sync Error:", error);
        res.status(500).json({ message: "Sync failed", error });
    }
};
