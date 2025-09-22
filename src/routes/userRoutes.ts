
/**
 * @file src/routes/userRoutes.ts
 * @description 定义与用户数据相关的路由。
 */
import { Router } from 'express';
import { getCurrentUser, addCredits } from '../controllers/userController';
import { jwtAuth } from '../middleware/auth';

const router = Router();
router.use(jwtAuth);

// @route   GET /v1/users/me
// @desc    获取当前登录用户的信息
// @access  Private
router.get('/me', getCurrentUser);

// @route   POST /v1/users/me/add-credits
// @desc    为当前用户增加技能单元 (模拟充值)
// @access  Private
router.post('/me/add-credits', addCredits);

export default router;
