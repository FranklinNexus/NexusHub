
/**
 * @file src/controllers/authController.ts
 * @description 处理用户注册和登录的控制器。
 */

import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await authService.registerUser(email, password);
        res.status(201).json({ message: 'User registered successfully.', userId: user.id });
    } catch (error) {
        // @ts-ignore
        res.status(409).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const tokens = await authService.loginUser(email, password);
        res.status(200).json(tokens);
    } catch (error) {
         // @ts-ignore
        res.status(401).json({ error: error.message });
    }
};

