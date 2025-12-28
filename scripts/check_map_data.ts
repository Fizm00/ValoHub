import mongoose from 'mongoose';
import { MapModel } from '../server/models';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/valohub');
    const map = await MapModel.findOne({ displayName: 'Ascent' });
    console.log("Map: Ascent");
    if (map) {
        console.log("Callouts count:", map.callouts?.length);
        console.log("Multipliers present:", {
            xM: map.xMultiplier,
            yM: map.yMultiplier,
            xS: map.xScalarToAdd,
            yS: map.yScalarToAdd
        });
        console.log("First Callout:", map.callouts?.[0]);
    } else {
        console.log("Map not found");
    }
    await mongoose.disconnect();
};
run();
