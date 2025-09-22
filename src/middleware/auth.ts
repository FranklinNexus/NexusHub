
/**
 * @file src/middleware/auth.ts
 * @description 认证中间件。
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../database/db';
import { createHash } from 'crypto';

// 为 Express Request 对象扩展自定义属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }
  // @ts-ignore
  jwt.verify(token, process.env.JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
    }
    
    try {
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      req.user = { id: user.id, email: user.email };
      next();
    } catch (dbError) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  });
};

/**
 * 灵活的认证中间件:
 * 优先检查JWT (用于仪表盘)。
 * 如果JWT不存在，则检查 x-api-key (用于程序化调用)。
 */
export const flexibleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const apiKeyHeader = req.headers['x-api-key'] as string;

    // 优先JWT认证
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return jwtAuth(req, res, next);
    }

    // 如果没有JWT，则回退到API Key认证
    if (apiKeyHeader) {
        try {
            const hashedKey = createHash('sha256').update(apiKeyHeader).digest('hex');
            const apiKey = await prisma.apiKey.findUnique({
                where: { key: hashedKey, isActive: true },
                include: { user: { select: { id: true, email: true } } }
            });

            if (!apiKey) {
                return res.status(401).json({ error: 'Unauthorized: Invalid API Key.' });
            }

            // 更新密钥的最后使用时间
            await prisma.apiKey.update({
                where: { id: apiKey.id },
                data: { lastUsedAt: new Date() }
            });
            
            req.user = { id: apiKey.user.id, email: apiKey.user.email };
            return next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    
    // 如果两种认证方式都失败
    return res.status(401).json({ error: 'Unauthorized: No credentials provided.' });
};
