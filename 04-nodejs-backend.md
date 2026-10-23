# 🟢 Phase 4：Node.js + Express 后端（Week 9-10）

## 🎯 目标
能独立搭建 RESTful API 服务，实现认证、鉴权、文件上传。

---

## 📖 核心资料

| 资源 | 链接 |
|------|------|
| 菜鸟教程 Node.js/Express | https://m.runoob.com/nodejs/nodejs-express-framework.html |
| Node.js 官方 Learn | https://nodejs.org/en/learn |
| Express 官方 | https://expressjs.com/ |
| JWT 实战 | https://jwt.io/ |

---

## 📅 每日任务

### Week 9：Node.js 基础 + Express

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 57 | Node.js：模块系统 + path/fs | 写文件读写脚本，理解 ESM vs CommonJS |
| Day 58 | Node.js：Event Loop + Stream | 用 Stream 处理大文件复制 |
| Day 59 | Express：路由 + 中间件 | 写 5 个路由 + 自定义日志中间件 |
| Day 60 | Express：请求/响应对象 | 解析 query/params/body，返回 JSON |
| Day 61 | Express：错误处理 | 全局错误处理中间件 + 自定义 Error 类 |
| Day 62 | 环境变量 + dotenv | 配置 `.env` + `.env.example` |
| Day 63 | 项目结构组织 | 按 controllers/routes/middlewares 拆分 |

### Week 10：认证 + 安全 + API 设计

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 64 | bcrypt 密码哈希 | 注册接口：密码加密存储 |
| Day 65 | JWT 生成与验证 | 登录返回 token + 鉴权中间件 |
| Day 66 | Refresh Token 机制 | 实现 token 刷新接口 |
| Day 67 | 输入校验（Zod） | 为每个接口添加请求体验证 |
| Day 68 | 文件上传（Multer） | 实现头像/图片上传接口 |
| Day 69 | CORS + Helmet + Rate Limit | 安全配置全套 |
| Day 70 | **项目：Blog API v1** | 用户/文章/评论 CRUD（无数据库，用内存数组） |

---

## ✅ 阶段检查清单

- [ ] 能用 Express 写 RESTful 路由
- [ ] 理解中间件机制
- [ ] 能用 JWT 实现登录鉴权
- [ ] 能处理文件上传
- [ ] Blog API 完成（内存版）
