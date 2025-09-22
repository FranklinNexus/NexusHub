
/**
 * @file src/services/skillService.ts
 * @description 技能服务模块，处理与技能配置相关的业务逻辑。
 */

import { db } from '../database/db';
import { Skill } from '../types';

/**
 * 根据技能名称查找技能配置。
 * @param skillName - 请求中指定的技能名称 (例如 "gpt-3.5-turbo")。
 * @returns 如果找到，返回Skill对象；否则返回undefined。
 */
export function findSkillByName(skillName: string): Skill | undefined {
  return db.skills.get(skillName);
}
