# 🖥️ Phase 3：Electron 桌面应用开发（Week 7-8）

## 🎯 目标
掌握 Electron 主进程/渲染进程通信，能将 React 应用打包为跨平台桌面程序。

---

## 📖 核心资料

| 资源 | 链接 |
|------|------|
| Electron 官方文档（中文） | https://www.electronjs.org/zh/docs/latest/ |
| Electron Forge | https://www.electronforge.io/ |
| electron-react-boilerplate | https://github.com/electron-react-boilerplate/electron-react-boilerplate |
| Electron + React 知乎教程 | https://zhuanlan.zhihu.com/p/356798136 |

---

## 📅 每日任务

### Week 7：Electron 基础 + IPC

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 43 | Electron 官方：Quick Start | 跑通官方 Hello World（无框架） |
| Day 44 | 主进程 vs 渲染进程 | 写 main.js + index.html，理解进程模型 |
| Day 45 | IPC 通信基础 | 用 `ipcMain` / `ipcRenderer` 实现双向通信 |
| Day 46 | contextBridge + preload | 安全暴露 API 到渲染进程 |
| Day 47 | Electron Forge 初始化 | `npx create-electron-app my-app --template=vite-typescript` |
| Day 48 | 在 Electron 中加载 React | 配置 Vite，React 作为渲染进程页面 |
| Day 49 | 菜单 + 托盘 + 快捷键 | 自定义应用菜单、系统托盘、全局快捷键 |

### Week 8：桌面项目实战

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 50 | electron-store（本地存储） | 用 JSON 文件存储用户配置 |
| Day 51 | 文件操作（dialog + fs） | 实现"打开文件/保存文件"对话框 |
| Day 52 | 系统通知 + 剪贴板 | 调用系统通知 API + 读写剪贴板 |
| Day 53 | 自动更新（electron-updater） | 配置更新服务器 + 检查更新逻辑 |
| Day 54 | 打包配置 | 配置 `electron-builder`，生成 exe/dmg |
| Day 55 | **项目：桌面 Markdown 编辑器** | 左侧编辑 + 右侧预览 + 本地保存 |
| Day 56 | 部署 + 发布 | 打包发布到 GitHub Releases |

---

## ✅ 阶段检查清单

- [ ] 理解主进程/渲染进程/预加载脚本
- [ ] 能用 IPC 实现进程间通信
- [ ] 能将 React 应用嵌入 Electron
- [ ] 能打包为 exe/dmg 安装包
- [ ] 桌面 Markdown 编辑器完成并发布
