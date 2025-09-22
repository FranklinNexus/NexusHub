
/**
 * @file src/middleware/auth.ts
 * @description API Key认证中间件。
 */

import { Request, Response, NextFunction } from 'express';
import { findUserByApiKey } from '../services/userService';
import { User } from '../types';

// 为Express的Request对象扩展一个自定义属性'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Express中间件，用于验证请求头中的 'x-api-key'。
 * 
 * 1. 从请求头 'x-api-key' 中提取 API Key。
 * 2. 使用 userService 查找对应的用户。
 * 3. 如果用户存在，则将其信息附加到`req.user`对象上，并传递给下一个中间件或处理器。
 * 4. 如果API Key无效或用户不存在，则返回 401 Unauthorized 错误。
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: API Key is missing.' });
  }

  const user = findUserByApiKey(apiKey);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key.' });
  }

  // 将用户信息附加到请求对象上，供后续的路由处理器使用
  req.user = user;

  next();
};
