
/**
 * @file src/controllers/skillController.ts
 * @description 技能调用相关的控制器，包含核心业务逻辑。
 */

import { Request, Response } from 'express';
import { findSkillByName } from '../services/skillService';
import { hasSufficientBalance, deductBalance } from '../services/userService';

/**
 * 处理技能调用请求的控制器函数。
 * 
 * 业务流程:
 * 1. 从URL参数中获取 `skill_name`。
 * 2. 从请求对象中获取已认证的 `user` 信息 (由 apiKeyAuth 中间件添加)。
 * 3. 查找请求的技能是否存在于配置中。
 * 4. 检查用户是否有足够的 "技能单元" 来支付本次调用。
 * 5. (模拟) 准备并将请求转发给下游的技能提供商API。
 * 6. (模拟) 收到响应后，从用户余额中扣除费用。
 * 7. 将下游API的响应原样返回给调用方。
 */
export const invokeSkill = async (req: Request, res: Response) => {
  const { skill_name } = req.params;
  const user = req.user!; // 感叹号表示我们确信user对象必然存在，因为apiKeyAuth中间件已经验证过

  // 1. 查找技能配置
  const skill = findSkillByName(skill_name);
  if (!skill) {
    return res.status(404).json({ error: `Skill '${skill_name}' not found.` });
  }

  // 2. 验证用户余额
  if (!hasSufficientBalance(user.apiKey, skill.costPerUnit)) {
    return res.status(402).json({ 
      error: 'Payment Required: Insufficient skill units.',
      currentBalance: user.skillUnits,
      cost: skill.costPerUnit,
    });
  }

  try {
    // 3. (模拟) 转发请求到真正的技能提供商
    console.log(`Forwarding request for skill '${skill_name}' to ${skill.apiUrl}`);
    console.log('User request body:', req.body);

    // 在真实应用中，这里会使用如 axios 或 fetch 来发起一个HTTP POST请求
    // const response = await axios.post(skill.apiUrl, req.body, {
    //   headers: {
    //     'Authorization': `Bearer ${skill.apiKey}`, // 使用NexusHub管理的密钥
    //     'Content-Type': 'application/json'
    //   }
    // });

    // --- PoC 模拟响应 ---
    const mockProviderResponse = {
      message: `This is a mocked response from ${skill.provider} for skill '${skill_name}'.`,
      requestPayload: req.body,
    };
    // --- 模拟结束 ---
    
    // 4. 从用户余额中扣费
    deductBalance(user.apiKey, skill.costPerUnit);
    
    // 5. 将提供商的响应返回给AI代理
    res.status(200).json(mockProviderResponse);

  } catch (error) {
    console.error('Error forwarding request to skill provider:', error);
    res.status(502).json({ error: 'Bad Gateway: Failed to get a response from the skill provider.' });
  }
};
