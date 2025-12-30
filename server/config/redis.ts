import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});


redisClient.on('error', (err) => {
    if ((err as any).code === 'ECONNREFUSED') {
    } else {
        console.log('Redis Client Error', err);
    }
});

redisClient.on('connect', () => console.log('✅ Redis Client Connected'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.log('⚠️  Redis connection failed. Caching will be disabled.');
    }
})();

export default redisClient;
