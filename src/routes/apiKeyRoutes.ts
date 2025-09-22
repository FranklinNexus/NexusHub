
/**
 * @file src/routes/apiKeyRoutes.ts
 * @description 定义与API密钥管理相关的路由。
 */
import { Router } from 'express';
import { listApiKeys, createApiKey, deleteApiKey } from '../controllers/apiKeyController';
import { jwtAuth } from '../middleware/auth';

const router = Router();

// 所有API密钥管理操作都需要用户先登录 (JWT认证)
router.use(jwtAuth);

// @route   GET /v1/keys
// @desc    获取当前用户的所有API密钥
router.get('/', listApiKeys);

// @route   POST /v1/keys
// @desc    为当前用户创建一个新的API密钥
router.post('/', createApiKey);

// @route   DELETE /v1/keys/:id
// @desc    删除一个指定的API密钥
router.delete('/:id', deleteApiKey);

export default router;

