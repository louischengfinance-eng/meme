# 🚀 一键部署指南

## ⚡ 超快部署（30秒）

只需一条命令，自动完成所有配置：

```bash
npm run deploy
```

这个命令会自动：
- ✅ 从 `deploy.config.js` 读取 API 凭证
- ✅ 创建 `backend/.env` 文件
- ✅ 创建 `frontend/.env.local` 文件
- ✅ 安装所有依赖（如果尚未安装）
- ✅ 显示启动指令

---

## 📋 完整部署流程

### 1. 克隆仓库（如果尚未克隆）

```bash
git clone <your-repo-url>
cd meme
```

### 2. 运行部署脚本

```bash
npm run deploy
```

### 3. 启动服务器

**终端 1 - 启动后端:**
```bash
cd backend
npm run dev
```

**终端 2 - 启动前端:**
```bash
cd frontend
npm run dev
```

### 4. 访问应用

打开浏览器: **http://localhost:3000**

🎉 **完成！**

---

## 🔧 配置文件说明

### `deploy.config.js`

这是主配置文件，包含所有环境变量和 API 凭证：

```javascript
module.exports = {
  backend: {
    PORT: 3001,
    BYBIT_API_KEY: 'A2OHqYPBoDV8nBRVms',
    BYBIT_API_SECRET: 'cTpc6j8smrfxpJlfkOq3spx3UDnoJ0kWtEts',
  },
  frontend: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
  },
};
```

### `deploy.js`

自动化部署脚本，会：
1. 读取 `deploy.config.js`
2. 生成 `.env` 文件
3. 安装依赖
4. 显示启动指令

---

## 🌐 生产环境部署

### 方法 1: 使用部署配置

编辑 `deploy.config.js` 中的 `production` 部分：

```javascript
production: {
  backend: {
    PORT: 3001,
    BYBIT_API_KEY: 'your_production_key',
    BYBIT_API_SECRET: 'your_production_secret',
  },
  frontend: {
    NEXT_PUBLIC_API_URL: 'https://api.your-domain.com',
  },
}
```

然后运行：
```bash
npm run deploy:prod
```

### 方法 2: 使用环境变量（更安全）

在生产服务器上设置环境变量：

```bash
export BYBIT_API_KEY=your_key
export BYBIT_API_SECRET=your_secret
export PORT=3001
```

然后直接启动：
```bash
cd backend && npm start
cd frontend && npm start
```

---

## 🔐 安全注意事项

### ⚠️ 重要提醒

1. **私有仓库**: 确保此仓库为 **PRIVATE**
2. **API 权限**: Bybit API 设置为 **只读 (Read-Only)**
3. **IP 白名单**: 在 Bybit 启用 IP 限制
4. **定期检查**: 定期检查 API Key 使用情况

### 🔒 已提交的文件

- ✅ `deploy.config.js` - 包含 API 凭证（已提交）
- ✅ `deploy.js` - 部署脚本（已提交）
- ❌ `backend/.env` - 不会提交（在 .gitignore 中）
- ❌ `frontend/.env.local` - 不会提交（在 .gitignore 中）

### 🚨 如果 API 泄露

立即采取以下步骤：

1. **登录 Bybit**
2. 进入 [API 管理](https://www.bybit.com/app/user/api-management)
3. **删除泄露的 API Key**
4. 创建新的 API Key
5. 更新 `deploy.config.js`
6. 重新运行 `npm run deploy`

---

## 🛠️ 手动配置（不使用部署脚本）

如果您想手动配置：

### 后端配置

创建 `backend/.env`:
```env
PORT=3001

# Bybit API Credentials
BYBIT_API_KEY=A2OHqYPBoDV8nBRVms
BYBIT_API_SECRET=cTpc6j8smrfxpJlfkOq3spx3UDnoJ0kWtEts
```

### 前端配置

创建 `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 安装依赖

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📦 Docker 部署（可选）

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - BYBIT_API_KEY=${BYBIT_API_KEY}
      - BYBIT_API_SECRET=${BYBIT_API_SECRET}
      - PORT=3001

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
```

启动：
```bash
docker-compose up
```

---

## 🔄 更新 API 凭证

### 方法 1: 使用部署脚本

1. 编辑 `deploy.config.js`
2. 更新 API Key 和 Secret
3. 运行 `npm run deploy`
4. 重启服务器

### 方法 2: 手动更新

1. 编辑 `backend/.env`
2. 更新凭证
3. 重启后端服务器

---

## 📊 部署检查清单

部署前确认：

- [ ] API Key 和 Secret 正确
- [ ] API 权限设置为只读
- [ ] 仓库为私有
- [ ] 已运行 `npm run deploy`
- [ ] 后端成功启动（显示 "🔑 Authenticated with Bybit API"）
- [ ] 前端成功连接后端
- [ ] 浏览器可以访问 http://localhost:3000
- [ ] 数据正常加载

---

## 🐛 常见问题

### Q: 运行 `npm run deploy` 报错

**A:** 确保您在项目根目录，并且已经运行过 `npm install`

### Q: 后端显示认证失败

**A:** 检查 `deploy.config.js` 中的 API 凭证是否正确

### Q: 前端无法连接后端

**A:** 确保：
1. 后端正在运行（http://localhost:3001）
2. `frontend/.env.local` 中的 URL 正确

### Q: 想撤销已提交的 API 凭证

**A:**
1. 在 Bybit 删除 API Key
2. 创建新的 API Key
3. 更新 `deploy.config.js`
4. 提交新版本
5. （可选）清理 Git 历史：`git filter-branch` 或 BFG Repo-Cleaner

---

## 📞 需要帮助？

查看其他文档：
- [README.md](./README.md) - 项目概述
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [SETUP.md](./SETUP.md) - 详细设置
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构说明

---

**提示**: 使用 `npm run deploy` 可以在任何时候重新生成配置文件，非常适合：
- 首次部署
- 更换服务器
- 更新 API 凭证
- 重置配置
