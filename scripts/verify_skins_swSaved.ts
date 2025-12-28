
import mongoose from 'mongoose';
import { Weapon } from '../server/models'; // Adjust path as needed
import dotenv from 'dotenv';

dotenv.config();

const verifySkins = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check specifically for the Vandal or Phantom to see their skins
        const weapon = await Weapon.findOne({ displayName: 'Vandal' });

        if (!weapon) {
            console.log('No Vandal found. Data might not be synced yet.');
        } else {
            console.log(`\nWeapon Found: ${weapon.displayName}`);
            console.log(`Total Skins stored: ${weapon.skins?.length || 0}`);

            if (weapon.skins && weapon.skins.length > 0) {
                console.log('\nSample Skins:');
                weapon.skins.slice(0, 5).forEach(skin => {
                    console.log(`- [${skin.contentTierUuid ? 'Has Tier' : 'No Tier'}] ${skin.displayName}`);
                    if (skin.chromas && skin.chromas.length > 0) {
                        console.log(`  -> Chromas: ${skin.chromas.length}`);
                    }
                });
            }

            // Check Strategy Guide injection
            console.log(`\nStrategy Guide Tips: ${weapon.strategyGuide?.length || 0}`);
            if (weapon.strategyGuide) {
                weapon.strategyGuide.forEach(tip => console.log(`* "${tip}"`));
            }
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected.');
    }
};

verifySkins();
