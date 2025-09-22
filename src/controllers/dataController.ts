
/**
 * @file src/controllers/dataController.ts
 * @description 处理数据请求的控制器。
 */
import { Request, Response } from 'express';
import prisma from '../database/db';

export const getSkills = async (req: Request, res: Response) => {
    try {
        const skills = await prisma.skill.findMany({
            select: { id: true, name: true, provider: true, costPerUnit: true }
        });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const history = await prisma.apiCallLog.findMany({
            where: { userId: req.user!.id },
            orderBy: { timestamp: 'desc' },
            take: 10, // 只返回最近10条记录
            include: { skill: { select: { name: true } } }
        });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

