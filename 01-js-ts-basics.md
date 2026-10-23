# 📘 Phase 1：JavaScript + TypeScript 基础（Week 1-3）

## 🎯 目标
掌握 ES6+ 核心语法 + TypeScript 类型系统，能写类型安全的代码。

---

## 📖 核心资料

| 资源 | 链接 | 用途 |
|------|------|------|
| 现代 JavaScript 教程（中文） | http://zh.javascript.info/ | 主教程，图文多 |
| TypeScript 官方 Handbook | https://www.typescriptlang.org/docs/ | 查类型语法 |
| React TS 官方指南 | https://react.dev/learn/typescript | React 中的 TS |
| TS 入门教程（中文） | https://ts.xcatliu.com/ | 补充阅读 |

---

## 📅 每日任务

### Week 1：JavaScript 核心

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 1 | JS 教程：代码结构与变量 | 写 10 个变量声明，用 `let/const` 对比 `var` |
| Day 2 | JS 教程：数据类型、类型转换 | 写类型判断函数 `getType(value)` 返回类型名 |
| Day 3 | JS 教程：函数（箭头函数、默认参数） | 写 5 个工具函数（debounce, throttle, deepClone） |
| Day 4 | JS 教程：对象、解构、展开 | 写对象合并、深拷贝、解构赋值的 10 个例子 |
| Day 5 | JS 教程：数组方法（map/filter/reduce） | 用 reduce 实现 `groupBy`、`flatten` |
| Day 6 | JS 教程：闭包、作用域 | 写一个计数器闭包 + 模块模式示例 |
| Day 7 | JS 教程：原型链、class | 手写 class 继承链，理解 `__proto__` |

### Week 2：异步 + 模块化

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 8 | JS 教程：Promise 基础 | 手写 `Promise.all` / `Promise.race` 模拟 |
| Day 9 | JS 教程：async/await | 用 async/await 改写回调地狱示例 |
| Day 10 | JS 教程：事件循环 | 写出 5 道事件循环执行顺序题并解释 |
| Day 11 | JS 教程：Error 处理 | 自定义 Error 类 + try/catch 全局捕获 |
| Day 12 | JS 教程：Modules (ESM) | 创建 `math.js` + `main.js`，用 `import/export` |
| Day 13 | Git 进阶：branch/rebase/PR | 在 GitHub 创建仓库，练习分支合并、解决冲突 |
| Day 14 | 复习 + 整理笔记 | 用 Markdown 写本周学习总结 |

### Week 3：TypeScript 入门

| 天 | 看什么 | 敲什么代码 |
|----|--------|------------|
| Day 15 | TS 官方：Basic Types | 声明 `string/number/boolean/array/tuple/enum` |
| Day 16 | TS 官方：Interface & Type | 定义 `User` interface，用 `type` 写联合类型 |
| Day 17 | TS 官方：Generic | 写泛型函数 `identity<T>()` + 泛型接口 |
| Day 18 | TS 官方：Class + Access Modifiers | 用 `public/private/protected/readonly` 写类 |
| Day 19 | TS 官方：Advanced Types | 类型守卫、映射类型、条件类型 |
| Day 20 | TS 官方：tsconfig.json | 初始化项目，`strict: true`，理解各配置项 |
| Day 21 | **项目：Todo App (Vanilla TS)** | 用纯 TS + HTML/CSS 写 Todo（增删改查 + localStorage） |

---

## ✅ 阶段检查清单

- [ ] 能用 JS 闭包解决实际问题
- [ ] 理解 Promise 执行顺序
- [ ] 能用 TS 定义 interface / generic
- [ ] 能配置 tsconfig.json
- [ ] 完成 Todo App 并 push GitHub
