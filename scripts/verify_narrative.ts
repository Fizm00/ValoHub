import mongoose from 'mongoose';
import { MapModel } from '../server/models';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/valohub');
    const map = await MapModel.findOne({ displayName: 'Ascent' });
    console.log("Map: Ascent");
    if (map) {
        console.log("Narrative Length:", map.narrativeDescription?.length);
        console.log("Narrative Content:", map.narrativeDescription);
    } else {
        console.log("Map not found");
    }
    await mongoose.disconnect();
};
run();
