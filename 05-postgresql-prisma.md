# 🐘 Phase 5：PostgreSQL + Prisma ORM（Week 11-13）

## 🎯 目标
掌握 PostgreSQL 数据库设计 + Prisma ORM 操作，将 Blog API 接入真实数据库。

---

## 📖 核心资料

| 资源 | 链接 |
|------|------|
| PostgreSQL Tutorial | http://postgresqltutorial.com |
| SQLZoo 练习 | https://www.sqlzoo.net/ |
| Prisma 官方文档 | https://www.prisma.io/docs |
| Node.js 连 PG 实战 | https://www.elydb.com/docs/connect/nodejs |

---

## 📅 每日任务

### Week 11：PostgreSQL 基础

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 71 | PG Tutorial：安装 + psql | 本地安装 PG，创建数据库，用 psql 连接 |
| Day 72 | PG Tutorial：CREATE TABLE | 设计 users/articles/comments 表 |
| Day 73 | PG Tutorial：INSERT/SELECT | 插入测试数据，写 10 种查询 |
| Day 74 | PG Tutorial：UPDATE/DELETE | 写更新/删除 + 软删除设计 |
| Day 75 | PG Tutorial：JOIN | INNER/LEFT JOIN 查询文章+作者 |
| Day 76 | PG Tutorial：GROUP BY + 聚合 | 统计每用户文章数 |
| Day 77 | SQLZoo 练习 | 完成 SQLZoo 前 6 节 |

### Week 12：Prisma ORM

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 78 | Prisma 官方：Getting Started | 初始化 Prisma，连接 PostgreSQL |
| Day 79 | Prisma Schema | 定义 User/Article/Comment model + relation |
| Day 80 | Prisma Client CRUD | 用 Prisma Client 替换内存数组 |
| Day 81 | Prisma 迁移 | `migrate dev` 创建表，`migrate reset` 重置 |
| Day 82 | Prisma 关系查询 | include/select 嵌套查询 |
| Day 83 | Prisma 事务 | 用 `$transaction` 实现批量操作 |
| Day 84 | **项目：Blog API + PG** | 将 Phase 4 的 API 全部接入数据库 |

### Week 13：优化 + 进阶

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 85 | PG Tutorial：索引 + EXPLAIN | 为常用查询字段加索引 |
| Day 86 | PG Tutorial：事务 + 锁 | 理解 ACID，写并发安全操作 |
| Day 87 | Prisma 种子数据 | 写 seed.ts 自动填充测试数据 |
| Day 88 | 分页 + 过滤 + 搜索 | 实现文章列表分页/标签过滤/关键词搜索 |
| Day 89 | 单元测试（Jest + Supertest） | 为 API 写测试用例 |
| Day 90 | 项目完善 | 添加 Swagger API 文档 |
| Day 91 | **Blog CMS 全栈完成** | Web 前端 + Electron 桌面 + Node API + PG 全部联调 |

---

## ✅ 阶段检查清单

- [ ] 能独立设计 PostgreSQL 表结构
- [ ] 能用 SQL 写 JOIN/子查询/聚合
- [ ] 能用 Prisma 完成 CRUD + 关系查询
- [ ] Blog CMS 全栈项目完成并部署
- [ ] 写英文 README + API 文档
