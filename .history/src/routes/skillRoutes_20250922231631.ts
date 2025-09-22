
/**
 * @file src/routes/skillRoutes.ts
 * @description 定义与技能调用相关的API路由。
 */

import { Router } from 'express';
import { invokeSkill } from '../controllers/skillController';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /v1/skill_invoke/:skill_name
 * @desc    调用一个指定的AI技能
 * @access  Private (需要有效的 API Key)
 * 
 * 此路由首先通过 `apiKeyAuth` 中间件进行身份验证。
 * 如果验证成功，请求将被传递给 `invokeSkill` 控制器进行处理。
 */
router.post('/:skill_name', apiKeyAuth, invokeSkill);

export default router;
