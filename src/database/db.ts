
/**
 * @file src/database/db.ts
 * @description 内存数据库模块，用于存储和管理用户、技能配置。
 * 在PoC阶段，我们使用简单的内存对象来模拟数据库，便于快速开发和验证。
 */

import { User, Skill } from '../types';

// 使用Map作为内存数据库，方便通过键快速查找。
const users = new Map<string, User>();
const skills = new Map<string, Skill>();

/**
 * 初始化并填充模拟数据。
 * 在实际应用中，这些数据将从真实的数据库中加载。
 */
function initializeData(): void {
  // 模拟用户数据
  const user1: User = {
    id: 'user-001',
    apiKey: 'nexushub-user-key-12345',
    skillUnits: 1000,
  };
  users.set(user1.apiKey, user1);

  // 模拟技能配置数据
  const gpt3: Skill = {
    provider: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'sk-openai-real-api-key-placeholder', // 这是NexusHub持有的密钥，不暴露给终端用户
    costPerUnit: 10,
  };
  skills.set('gpt-3.5-turbo', gpt3);

  const dalle: Skill = {
    provider: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/images/generations',
    apiKey: 'sk-openai-real-api-key-placeholder', // 实际项目中，每个技能或提供商可能有不同的密钥
    costPerUnit: 50,
  };
  skills.set('dall-e-3', dalle);
}

// 程序启动时执行数据初始化
initializeData();

/**
 * 数据库接口，封装了对内存数据的访问操作。
 */
export const db = {
  users,
  skills,
};
