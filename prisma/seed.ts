
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 创建一个通用的演示账户
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@nexushub.com' },
    update: {},
    create: {
      email: 'demo@nexushub.com',
      password: hashedPassword,
      skillUnits: 99999, // 为演示账户提供充足的余额
    },
  });

  // 创建两个默认的技能
  const skill1 = await prisma.skill.upsert({
    where: { name: 'gpt-3.5-turbo' },
    update: {},
    create: {
      name: 'gpt-3.5-turbo',
      provider: 'OpenAI',
      apiUrl: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_KEY_HERE', // 从环境变量获取
      costPerUnit: 10,
    },
  });

  const skill2 = await prisma.skill.upsert({
    where: { name: 'dall-e-3' },
    update: {},
    create: {
      name: 'dall-e-3',
      provider: 'OpenAI',
      apiUrl: 'https://api.openai.com/v1/images/generations',
      apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_KEY_HERE',
      costPerUnit: 50,
    },
  });
  
  console.log({ demoUser, skill1, skill2 });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
