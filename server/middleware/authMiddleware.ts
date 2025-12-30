import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

        req.userId = decodedData.id;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
