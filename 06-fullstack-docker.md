# 🐳 Phase 6：全栈整合 + Docker 部署（Week 14-16）

## 🎯 目标
将前端 + Electron + 后端 + 数据库全部容器化，实现一键部署。

---

## 📖 核心资料

| 资源 | 链接 |
|------|------|
| Docker 官方 Node.js 指南 | https://docs.docker.com/language/nodejs/ |
| Node.js + Docker 图文 | https://www.w3reference.com/blog/how-to-build-a-node-js-application-with-docker/ |
| Railway 文档 | https://docs.railway.app/ |
| Vercel 文档 | https://vercel.com/docs |

---

## 📅 每日任务

### Week 14：Docker 基础 + 容器化

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 92 | Docker 官方：Get Started | 安装 Docker，跑 hello-world |
| Day 93 | Dockerfile 编写 | 为 Node.js 后端写 Dockerfile |
| Day 94 | docker-compose 基础 | 写 compose：Node + PostgreSQL |
| Day 95 | 多阶段构建 | 优化镜像大小（production build） |
| Day 96 | 前端 Docker 化 | 为 React 应用写 Dockerfile |
| Day 97 | 全栈 docker-compose | 一个文件启动全部服务 |
| Day 98 | 数据卷 + 网络 | 配置 volume 持久化 + 容器间通信 |

### Week 15：部署上线

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 99 | Vercel 部署前端 | 配置 vercel.json，自动部署 |
| Day 100 | Railway 部署后端 | 连接 Railway PostgreSQL |
| Day 101 | 环境变量管理 | 生产/开发环境区分 |
| Day 102 | 域名 + HTTPS | 配置自定义域名 + SSL |
| Day 103 | GitHub Actions CI | 配置 lint + test + build 自动运行 |
| Day 104 | 自动部署 | push 自动触发部署 |
| Day 105 | 健康检查 + 日志 | 添加 /health 端点 + 日志收集 |

### Week 16：项目收尾 + 第三个项目

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 106 | 实时通信（Socket.io） | 实现简单聊天室 |
| Day 107 | 项目③：实时看板 | Trello-lite（拖拽 + 实时同步） |
| Day 108 | 项目③ 后端 | Socket.io + Express 整合 |
| Day 109 | 项目③ 前端 | react-beautiful-dnd 拖拽 |
| Day 110 | 项目③ 部署 | 全栈部署上线 |
| Day 111 | 整理 GitHub | 3 个项目全部有英文 README + Live Demo |
| Day 112 | 写技术博客 | 发布第一篇 Dev.to 文章 |

---

## ✅ 阶段检查清单

- [ ] 能写 Dockerfile + docker-compose
- [ ] 全栈项目部署上线（前端 + 后端 + DB）
- [ ] 配置 CI/CD 自动部署
- [ ] 3 个项目全部有 Live Demo + 英文 README
- [ ] 发布至少 1 篇技术博客
