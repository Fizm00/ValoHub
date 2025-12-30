import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

export const cache = (duration: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return next();
        }

        if (!redisClient.isOpen) {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await redisClient.get(key);

            if (cachedResponse) {
                console.log(`⚡ Cache Hit: ${key}`);
                res.send(JSON.parse(cachedResponse));
                return;
            } else {
                console.log(`🐢 Cache Miss: ${key}`);
                const originalSend = res.send;

                res.send = (body: any): Response => {
                    try {
                        const bodyString = typeof body === 'string' ? body : JSON.stringify(body);

                        redisClient.set(key, bodyString, {
                            EX: duration
                        });
                    } catch (err) {
                        console.error('Redis Cache Set Error:', err);
                    }

                    return originalSend.call(res, body);
                };

                next();
            }
        } catch (err) {
            console.error('Redis Cache Middleware Error:', err);
            next();
        }
    };
};
