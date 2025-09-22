
/**
 * @file src/services/userService.ts
 * @description 用户服务模块，处理与用户账户相关的业务逻辑。
 */

import { db } from '../database/db';
import { User } from '../types';

/**
 * 根据API Key查找用户。
 * @param apiKey - 从请求头中获取的用户API Key。
 * @returns 如果找到，返回User对象；否则返回undefined。
 */
export function findUserByApiKey(apiKey: string): User | undefined {
  return db.users.get(apiKey);
}

/**
 * 检查用户是否有足够的技能单元。
 * @param userId - 用户的唯一标识 (此处我们使用apiKey作为标识)。
 * @param cost - 本次调用需要花费的技能单元。
 * @returns 如果余额充足，返回true；否则返回false。
 */
export function hasSufficientBalance(apiKey: string, cost: number): boolean {
  const user = findUserByApiKey(apiKey);
  if (!user) {
    return false;
  }
  return user.skillUnits >= cost;
}

/**
 * 从用户账户中扣除技能单元。
 * @param userId - 用户的唯一标识 (此处我们使用apiKey作为标识)。
 * @param cost - 需要扣除的技能单元数量。
 * @returns 如果扣除成功，返回true；如果用户不存在，返回false。
 */
export function deductBalance(apiKey: string, cost: number): boolean {
  const user = findUserByApiKey(apiKey);
  if (user) {
    user.skillUnits -= cost;
    // 在真实应用中，这里会有数据库更新操作
    console.log(`Deducted ${cost} units from ${user.id}. New balance: ${user.skillUnits}`);
    return true;
  }
  return false;
}
