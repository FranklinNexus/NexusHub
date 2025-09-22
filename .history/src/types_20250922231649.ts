
/**
 * @file src/types.ts
 * @description 定义项目中所使用的核心数据结构。
 */

/**
 * 代表一个用户账户。
 */
export interface User {
  id: string;          // 用户唯一标识
  apiKey: string;      // 用于API认证的密钥
  skillUnits: number;  // 用户拥有的技能单元余额
}

/**
 * 代表一个可用的AI技能及其配置。
 */
export interface Skill {
  provider: string;      // 技能提供商 (例如: "openai")
  apiUrl: string;        // 技能提供商的API地址
  apiKey: string;        // 访问技能提供商API所需的密钥 (由NexusHub管理)
  costPerUnit: number; // 调用此技能一次所需消耗的技能单元
}
