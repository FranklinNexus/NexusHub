
/**
 * @file src/controllers/skillController.ts
 * @description 技能调用相关的控制器，包含核心业务逻辑。
 */

import { Request, Response } from 'express';
import prisma from '../database/db';

export const invokeSkill = async (req: Request, res: Response) => {
  const { skill_name } = req.params;
  const userId = req.user!.id; // 从 jwtAuth 中间件获取用户ID

  try {
    // 1. 并行获取用户和技能信息
    const [user, skill] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.skill.findUnique({ where: { name: skill_name } }),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (!skill) {
      return res.status(404).json({ error: `Skill '${skill_name}' not found.` });
    }

    // 2. 检查用户余额
    if (user.skillUnits < skill.costPerUnit) {
      return res.status(402).json({
        error: 'Payment Required: Insufficient skill units.',
        currentBalance: user.skillUnits,
        cost: skill.costPerUnit,
      });
    }

    // 3. (模拟) 转发请求到下游API
    console.log(`Forwarding request for skill '${skill_name}' to ${skill.apiUrl} for user ${userId}`);
    const mockProviderResponse = {
      message: `Mock response from ${skill.provider} for skill '${skill_name}'.`,
      requestPayload: req.body,
    };

    // 4. 更新数据库：扣除费用并记录调用历史 (在一个事务中完成)
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { skillUnits: { decrement: skill.costPerUnit } },
      });

      await tx.apiCallLog.create({
        data: {
          cost: skill.costPerUnit,
          statusCode: 200, // 模拟成功
          isSuccess: true,
          userId: userId,
          skillId: skill.id,
        },
      });
    });

    res.status(200).json(mockProviderResponse);

  } catch (error) {
    console.error('Error invoking skill:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
