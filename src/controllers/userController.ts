
/**
 * @file src/controllers/userController.ts
 * @description 处理用户数据相关请求的控制器。
 */
import { Request, Response } from 'express';
import prisma from '../database/db';

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                email: true,
                skillUnits: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const addCredits = async (req: Request, res: Response) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount specified.' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                skillUnits: {
                    increment: amount,
                },
            },
            select: {
                skillUnits: true, // 只返回更新后的余额
            },
        });

        res.status(200).json({
            message: `Successfully added ${amount} credits.`,
            newBalance: updatedUser.skillUnits,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add credits.' });
    }
};
