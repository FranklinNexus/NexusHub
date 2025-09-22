
/*
 * =====================================================================================
 *
 *       Filename:  server.ts
 *
 *    Description:  NexusHub (智联核) - AI代理的统一技能网关 PoC
 *
 * =====================================================================================
 *
 *  README: 如何运行此项目
 *
 *  1. 安装依赖:
 *     $ npm install
 *
 *  2. 运行开发服务器:
 *     $ npm run dev
 *
 *  3. 如何测试 (使用图形化界面):
 *     直接用浏览器打开 http://localhost:3000
 *
 * =====================================================================================
 */

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import skillRoutes from './routes/skillRoutes';
import authRoutes from './routes/authRoutes'; // 1. 引入新的认证路由
import userRoutes from './routes/userRoutes'; // 1. 引入新的用户路由
import dataRoutes from './routes/dataRoutes'; // 1. 引入新的数据路由
import apiKeyRoutes from './routes/apiKeyRoutes'; // 1. 引入新的API密钥路由
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// API 路由
app.use('/v1/auth', authRoutes); // 2. 挂载认证路由
app.use('/v1/users', userRoutes); // 2. 挂载用户路由
app.use('/v1/data', dataRoutes); // 2. 挂载数据路由
app.use('/v1/keys', apiKeyRoutes); // 2. 挂载API密钥路由
app.use('/v1/skill_invoke', skillRoutes);

app.get('/api-status', (req: Request, res: Response) => {
  res.json({ status: 'NexusHub Skill Gateway is running!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`NexusHub server is listening on port ${PORT}`);
  console.log(`Frontend UI available at http://localhost:${PORT}`);
});
