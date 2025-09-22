
/**
 * @file src/database/db.ts
 * @description Prisma 客户端单例。
 * 这是与数据库交互的推荐方式，确保应用中只有一个Prisma Client实例。
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma; 