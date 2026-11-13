# 0-9 · 小项目：待办清单（3–4h）

> 目标：把前面 8 项拼成一个能跑、有测试的功能模块。
> 代码：`exercises/phase0/day09/`，测试：`npm run p0d9`

这是阶段 0 的收尾项目。不是新知识，而是把 `数组 + 对象 + 函数 + map/filter/reduce` 组装起来。

---

## 1. 数据结构

一条待办长这样：

```js
{ id: 1, title: "买菜", done: false }
```

整个清单是一个数组：

```js
[
  { id: 1, title: "买菜", done: false },
  { id: 2, title: "写代码", done: true },
]
```

为什么用 `id` 而不是数组下标？因为删除之后下标会变，`id` 不会。这是实际项目的通用做法。

---

## 2. 六个函数

| 函数 | 输入 | 输出 | 要求 |
|------|------|------|------|
| `createList()` | — | `[]` | 空清单 |
| `addTodo(list, title)` | 清单、标题 | 新清单 | 新项 `done: false`，`id` = 现有最大 id + 1；不修改原清单 |
| `completeTodo(list, id)` | 清单、id | 新清单 | 对应项 `done: true`；找不到 id 原样返回 |
| `removeTodo(list, id)` | 清单、id | 新清单 | 删掉对应项；找不到原样 |
| `countDone(list)` | 清单 | 数字 | 已完成数量 |
| `formatList(list)` | 清单 | 字符串 | 每行 `1. [ ] 买菜` / `2. [x] 写代码` |

所有函数都**不许修改入参**，返回新数组。这是这一项最重要的约束。

---

## 3. 关键实现点

**① `id` 怎么算**

```js
const maxId = list.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
const newTodo = { id: maxId + 1, title, done: false };
```

**② 怎么"改一项"而不改原数组**

用 `map`，遇到目标项返回新对象，其余原样：

```js
list.map((todo) => (todo.id === id ? { ...todo, done: true } : todo));
```

**③ 怎么"删一项"**

用 `filter`：

```js
list.filter((todo) => todo.id !== id);
```

**④ `formatList` 的序号**

```js
list.map((todo, index) => `${index + 1}. ${todo.done ? "[x]" : "[ ]"} ${todo.title}`).join("\n");
```

**⑤ `countDone`**

用 `filter` 筛出已完成的，取 `length`；或者用 `reduce` 累加。两种都行。

---

## 4. 运行演示

写完之后跑：

```bash
npm run p0d9
```

除了 12 条断言，还有一条人眼检查：`node exercises/phase0/day09/demo.js` 会打印一份清单，你自己看一眼格式对不对。

---

## 5. 常见坑

**① 直接 `list.push(...)`**

改了原数组，测试 3、5 会挂。先用 `slice()` 或 `[...list]` 复制。

**② `id` 用 `list.length + 1`**

删过一项之后，id 会重复。要用"最大 id + 1"。

**③ 用 `map` 改对象时直接改原对象**

```js
list.map((t) => { t.done = true; return t; }); // 改了原对象
```

要给目标项返回**新对象** `{ ...t, done: true }`。

**④ `formatList` 忘了 `join("\n")`**

`map` 返回的是字符串数组，要拼成多行文本。

**⑤ `countDone` 数的是全部**

`filter((t) => t.done).length`，别写成 `list.length`。

---

## 6. 验收线

- `npm run p0d9` 12 条全绿
- 六个函数都不修改入参（测试里专门查了）
- `node exercises/phase0/day09/demo.js` 打印的清单格式正确
- 能口述：为什么用 `id` 而不是下标；`addTodo` 的 id 怎么算
