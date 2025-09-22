
/**
 * @file src/routes/authRoutes.ts
 * @description 定义用户认证相关的路由 (注册, 登录)。
 */

import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;

