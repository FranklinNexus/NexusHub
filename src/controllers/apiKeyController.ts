
/**
 * @file src/controllers/apiKeyController.ts
 * @description 处理API密钥相关请求的控制器。
 */
import { Request, Response } from 'express';
import prisma from '../database/db';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// 生成一个安全、随机的API密钥
const generateApiKey = () => {
    const key = `nh_${uuidv4().replace(/-/g, '')}`; // nh_ prefix for NexusHub
    const hash = createHash('sha256').update(key).digest('hex');
    return { key, hash };
};

export const listApiKeys = async (req: Request, res: Response) => {
    try {
        const apiKeys = await prisma.apiKey.findMany({
            where: { userId: req.user!.id },
            select: { id: true, note: true, lastUsedAt: true, createdAt: true }
        });
        res.status(200).json(apiKeys);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const createApiKey = async (req: Request, res: Response) => {
    const { note } = req.body;
    const { key, hash } = generateApiKey();

    try {
        await prisma.apiKey.create({
            data: {
                key: hash, // 存储哈希值，而不是原始密钥
                note,
                userId: req.user!.id,
            }
        });
        // 重要: 原始密钥只在这里返回一次！
        res.status(201).json({ newKey: key, note });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create API key.' });
    }
};

export const deleteApiKey = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 确保用户只能删除自己的密钥
        await prisma.apiKey.deleteMany({
            where: {
                id: id,
                userId: req.user!.id,
            }
        });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete API key.' });
    }
};

