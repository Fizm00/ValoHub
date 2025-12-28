
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        console.log('Attempting to connect to MongoDB...');
        console.log(`URI: ${process.env.MONGODB_URI.split('@')[1]}`); // Log only host part for security

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');

        await mongoose.disconnect();
        console.log('Disconnected.');

    } catch (error: any) {
        console.error('❌ CONNECTION FAILED:');
        console.error(error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('\nPOSSIBLE CAUSE: IP Address not whitelisted in MongoDB Atlas.');
            console.error('Please go to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP Address.');
        }
    }
};

testConnection();
