
/*
 * =====================================================================================
 *
 *       Filename:  server.ts
 *
 *    Description:  NexusHub (智联核) - AI代理的统一技能网关 PoC
 *
 *        Version:  1.0
 *        Created:  2023-10-27 10:00:00
 *       Revision:  none
 *       Compiler:  tsc
 *
 *         Author:  AI Assistant (Gemini)
 *   Organization:  Cursor
 *
 * =====================================================================================
 *
 *  README: 如何运行此项目
 *
 *  1. 安装依赖:
 *     确保你已经安装了 Node.js 和 npm。在项目根目录下运行以下命令：
 *     $ npm install
 *
 *  2. 运行开发服务器:
 *     此命令将启动一个开发服务器，该服务器会在文件更改时自动重启。
 *     $ npm run dev
 *
 *     服务器将运行在 http://localhost:3000
 *
 *  3. 如何测试:
 *     使用 Postman, curl, 或者任何 API 测试工具, 发送一个 POST 请求到:
 *     URL: http://localhost:3000/v1/skill_invoke/{skill_name}
 *     
 *     其中 {skill_name} 可以是 'gpt-3.5-turbo' 或 'dall-e-3'。
 *
 *     必须在请求头 (Headers) 中包含你的 API Key:
 *     x-api-key: nexushub-user-key-12345
 *
 *     在请求体 (Body) 中, 使用 raw JSON 格式发送技能所需的参数, 例如:
 *     {
 *         "prompt": "你好，世界!",
 *         "max_tokens": 50
 *     }
 *
 * =====================================================================================
 */

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import skillRoutes from './routes/skillRoutes';

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json()); // 解析 application/json 格式的请求体

// API 路由
app.use('/v1/skill_invoke', skillRoutes); // 挂载技能调用路由

// 根路由，用于健康检查
app.get('/', (req: Request, res: Response) => {
  res.send('NexusHub Skill Gateway is running!');
});

// 全局错误处理中间件 (一个简单的示例)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`NexusHub server is listening on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/v1/skill_invoke/{skill_name}`);
});
