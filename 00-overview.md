# 🌍 Remote 全栈学习路线 — 总览

> **技术栈**：React + TypeScript + Electron + Node.js + PostgreSQL  
> **目标**：Junior → Middle Full Stack → International Remote  
> **每日投入**：3-4 小时（全职）/ 2 小时（兼职）

---

## 📅 21 周学习路线总览

| 阶段 | 文件 | 周期 | 核心内容 | 产出 |
|------|------|------|----------|------|
| Phase 1 | `01-js-ts-basics.md` | W1-3 | JS 基础 + TypeScript | Todo App (Vanilla JS + TS) |
| Phase 2 | `02-react-ts.md` | W4-6 | React + Hooks + TS | Portfolio SPA |
| Phase 3 | `03-electron.md` | W7-8 | Electron + React | 桌面 Markdown 编辑器 |
| Phase 4 | `04-nodejs-backend.md` | W9-10 | Node.js + Express API | Blog CMS 后端 |
| Phase 5 | `05-postgresql-prisma.md` | W11-13 | PostgreSQL + Prisma | 完整 Blog CMS 全栈 |
| Phase 6 | `06-fullstack-docker.md` | W14-16 | Docker + 部署 + CI/CD | 3 个项目上线 |
| Phase 7 | `07-remote-job-prep.md` | W17-21 | 英文简历 + GitHub + 投递 | 开始面试 |

---

## ⚠️ 避坑指南

1. **CRA 已弃用** → 用 Vite `create vite@latest my-app -- --template react-ts`
2. **Electron 用脚手架** → `npx create-electron-app my-app --template=vite-typescript`
3. **TS 不用先啃完** → 写项目时遇到报错再查
4. **SQL 必须动手练** → 光看不练等于没学
5. **Remote 看 GitHub 活跃度** → 每天 commit 比看 10 小时视频有用

---

## 🛠 开发环境准备（Day 1 完成）

- [ ] 安装 Node.js 18+ (https://nodejs.org/)
- [ ] 安装 VS Code + 插件：ESLint, Prettier, Error Lens, GitLens
- [ ] 安装 Git + 配置 SSH Key (GitHub)
- [ ] 安装 Docker Desktop
- [ ] 安装 PostgreSQL 本地 / 注册 Neon 免费云数据库
- [ ] 注册 GitHub / Vercel / Railway 账号
- [ ] 配置 npm 镜像：`npm config set registry https://registry.npmmirror.com`

---

## 📊 技术栈速查

| 类别 | 选择 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 桌面端 | Electron + React |
| 后端框架 | Express → NestJS (后期) |
| 数据库 | PostgreSQL |
| ORM | Prisma |
| 样式 | Tailwind CSS |
| 状态 | Zustand + TanStack Query |
| 部署 | Vercel + Railway + Docker |
