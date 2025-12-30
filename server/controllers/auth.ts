import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ username, email, password: hashedPassword });
        await user.populate('savedSkins');

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.status(201).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email }).populate('savedSkins');
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password as string);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;

        if (newPassword && currentPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password as string);
            if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid current password' });

            user.password = await bcrypt.hash(newPassword, 12);
        }

        await user.save();

        const { password: _password, ...userResponse } = user.toObject();

        res.status(200).json({ result: userResponse, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
