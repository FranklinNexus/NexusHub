
/**
 * @file src/routes/dataRoutes.ts
 * @description 定义提供通用数据的路由 (技能列表, 历史记录)。
 */
import { Router } from 'express';
import { getSkills, getHistory } from '../controllers/dataController';
import { jwtAuth } from '../middleware/auth';

const router = Router();

// @route   GET /v1/data/skills
// @desc    获取所有可用的技能列表
// @access  Private
router.get('/skills', jwtAuth, getSkills);

// @route   GET /v1/data/history
// @desc    获取当前用户的API调用历史
// @access  Private
router.get('/history', jwtAuth, getHistory);

export default router;

