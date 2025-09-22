# NexusHub - AI 统一技能网关

**统一、简化、赋能您的 AI 工作流。**

NexusHub 是一个为 AI 代理设计的中间层服务，它充当了 AI 代理与各种异构 AI 技能提供商（如 OpenAI, Midjourney 等）之间的统一接入层。我们的目标是处理复杂的流量分发、密钥管理和计费，让开发者可以专注于构建下一代 AI 应用，而无需关心底层接口的差异。

## ✨ 核心功能

- **统一的用户认证**：基于 JWT 的现代化用户注册与登录系统。
- **灵活的 API 密钥**：为程序化访问生成、管理和撤销 API 密钥。
- **技能点数计费**：用户账户拥有“技能点数”，每次调用技能都会根据成本进行扣费。
- **模拟充值**：可在用户仪表盘轻松为账户增加技能点数。
- **技能代理调用**：通过统一的 `POST /v1/skill_invoke/{skill_name}` 端点调用下游 AI 服务。
- **持久化存储**：使用 Prisma 和 SQLite 存储用户信息、技能配置和调用历史。
- **清晰的前端仪表盘**：一个简单的 Vue.js 前端，用于账户管理、API 密钥操作和查看调用历史。

## 🛠️ 技术栈

- **后端**: Node.js, Express, TypeScript
- **数据库**: SQLite
- **ORM**: Prisma
- **认证**: JSON Web Tokens (JWT), Bcrypt.js
- **前端**: HTML, CSS, JavaScript (无框架)

## 🚀 快速开始

请确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (v16+)。

**1. 克隆仓库**
```bash
git clone <your-repo-url>
cd nexushub
```

**2. 安装依赖**
```bash
npm install
```

**3. 设置环境变量**
在项目根目录下创建一个 `.env` 文件，并填入以下内容。`JWT_SECRET` 可以是任何你喜欢的随机字符串。
```env
# .env

# 数据库连接地址，对于 SQLite，这通常是一个文件路径
DATABASE_URL="file:./prisma/dev.db"

# 用于签发和验证 JWT 的密钥
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"

# (可选) 如果你想真实调用 OpenAI，请填入你的密钥
OPENAI_API_KEY="sk-..."
```

**4. 运行数据库迁移**
此命令会根据 `prisma/schema.prisma` 文件创建或更新您的 SQLite 数据库。
```bash
npx prisma migrate dev
```

**5. (可选) 填充种子数据**
我们提供了一个种子脚本，可以为您创建一个演示用户和一些预设的 AI 技能。
```bash
npx prisma db seed
```

**6. 启动开发服务器**
```bash
npm run dev
```
服务启动后，您可以在浏览器中访问 `http://localhost:3000` 查看前端界面。

## 🔑 演示账号

如果您运行了 `db seed` 命令，可以直接使用以下账号登录：

- **邮箱**: `demo@nexushub.com`
- **密码**: `password123`

##  API 端点简介

所有 API 均以 `/v1` 为前缀。

- `POST /auth/register`: 用户注册
- `POST /auth/login`: 用户登录
- `GET /users/me`: 获取当前用户信息 (需 JWT 认证)
- `POST /users/me/add-credits`: 为当前用户充值 (需 JWT 认证)
- `POST /skill_invoke/:skill_name`: 调用一个 AI 技能 (需 JWT 或 API 密钥认证)
- `GET /keys`: 列出当前用户的所有 API 密钥 (需 JWT 认证)
- `POST /keys`: 为当前用户创建一个新的 API 密钥 (需 JWT 认证)
- `DELETE /keys/:id`: 删除一个指定的 API 密钥 (需 JWT 认证)
- `GET /data/skills`: 获取所有可用的技能列表 (需 JWT 认证)
- `GET /data/history`: 获取当前用户的 API 调用历史 (需 JWT 认证)

---
*Happy Coding!*
