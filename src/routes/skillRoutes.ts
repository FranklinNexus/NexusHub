
/**
 * @file src/routes/skillRoutes.ts
 * @description 定义与技能调用相关的API路由。
 */

import { Router } from 'express';
import { invokeSkill } from '../controllers/skillController';
import { flexibleAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /v1/skill_invoke/:skill_name
 * @desc    调用一个指定的AI技能
 * @access  Private (需要 JWT 或 API Key)
 */
router.post('/:skill_name', flexibleAuth, invokeSkill);

export default router;
