import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/valohub';

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
        console.log(`🔌 Connected to: ${maskedURI}`);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        // Retry logic could go here
    });

// Routes
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ValoHub API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
