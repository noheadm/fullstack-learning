# Day 4 · 对象、解构、展开（2h）

> 目标：分清"赋值 / 浅拷贝 / 深拷贝"三档差别，写出 `pick` / `omit` / `mergeDefaults` / `flattenObject`。
> 代码：`exercises/day04/`，测试：`npm run day4`

---

## 0. 先看一个能把你坑一晚上的现象

```js
const source = { n: { v: 1 } };
const copy = { ...source };
copy.n.v = 2;

source.n.v; // → 2   ← 原对象被改了
```

你说"我拷贝了啊"，但 `{...source}` 只复制第一层：`copy.n` 和 `source.n` 指向同一个对象。想真正隔离必须深拷贝。这三档差别是今天的主线。

---

## 1. 对象的键与顺序

键只能是字符串或 Symbol。写数字会自动转字符串：

```js
const o = {};
o[1] = "a";
Object.keys(o); // → ["1"]
```

键的顺序有三条规则（面试常问）：

```js
Object.keys({ 2: "a", 1: "b", x: "c" });
// → ["1", "2", "x"]   ← 整数键自动升序排在前面，其余按插入顺序
```

1. 整数索引键（`"0"`、`"1"`、`"42"`）升序排最前
2. 其他字符串键按插入顺序
3. Symbol 键不进 `Object.keys`，单独用 `Object.getOwnPropertySymbols`

---

## 2. 属性存不存在：`in` 和 `hasOwn` 不一样

```js
const o = { a: 1 };
"a" in o;              // → true
"toString" in o;       // → true   ← 原型链上的也算
Object.hasOwn(o, "a");       // → true
Object.hasOwn(o, "toString"); // → false  只看自己
```

拷贝、`pick`、`omit` 这类操作必须用 `Object.hasOwn` 或 `Object.keys`（它也只返回自身键），否则会把原型链上的东西一起复制。

---

## 3. 解构：取值、改名、兜底

```js
const user = { name: "a", age: undefined };

const { name, age = 18 } = user;
name; // → "a"
age;  // → 18   只在 undefined 时兜底

const { name: userName } = user;
userName; // → "a"   改名

const { addr: { city } = {} } = { addr: undefined };
city; // → undefined  嵌套解构要给外层兜底，否则报错
```

关键规则：**默认值只处理 `undefined`，不处理 `null`**。

```js
const { b = 1 } = { b: null };
b; // → null
```

数组解构按位置，可以跳过、收集剩余、交换：

```js
const [first, , third] = [1, 2, 3];
const [head, ...tail] = [1, 2, 3]; // head=1, tail=[2,3]
let x = 1, y = 2;
[x, y] = [y, x]; // 交换
```

给**已声明**的变量解构对象时，必须加括号：

```js
let a;
({ a } = { a: 1 }); // 对
// { a } = { a: 1 };   // 错：被当成代码块，SyntaxError
```

---

## 4. 展开：浅拷贝 + 覆盖顺序

```js
const merged = { ...{ a: 1, b: 1 }, ...{ b: 2 } };
merged; // → { a: 1, b: 2 }   后写的覆盖前面的
```

展开只复制**自身可枚举**属性：

```js
const proto = { inherited: 1 };
const obj = Object.create(proto);
obj.own = 2;
({ ...obj }); // → { own: 2 }   继承来的没有复制
```

`Object.assign` 和展开效果相近，但有两个差别：`assign` 会触发目标对象的 setter，展开不会；`assign` 返回目标对象本身，展开返回新对象。浅拷贝场景下优先用展开。

---

## 5. 三档拷贝：赋值 / 浅拷贝 / 深拷贝

| 方式 | 第一层 | 嵌套对象 | 适用 |
|------|--------|----------|------|
| `const b = a` | 共享 | 共享 | 只传引用，不拷贝 |
| `{...a}`、`Object.assign`、`Array.slice` | 独立 | **共享** | 只有一层数据 |
| 深拷贝 | 独立 | 独立 | 嵌套结构 |

```js
const a = { list: [1, 2] };
const shallow = { ...a };
shallow.list.push(3);
a.list; // → [1, 2, 3]   共享
```

原生深拷贝用 `structuredClone`：

```js
const deep = structuredClone({ d: new Date(0), m: new Map([["k", 1]]) });
deep.d instanceof Date; // → true
deep.m.get("k");        // → 1
```

它的限制：**不能克隆函数和 Symbol 值**，会抛 `DataCloneError`；也不能克隆 DOM 节点、类实例会丢原型。

```js
structuredClone({ fn() {} }); // → DataCloneError
```

---

## 6. 冻结：`Object.freeze` 是浅的

```js
const config = Object.freeze({ debug: true, db: { host: "x" } });
config.debug = false;   // 静默失败（严格模式下抛 TypeError）
config.db.host = "y";   // → 成功！嵌套对象没被冻结
```

要深冻结必须递归。这和浅拷贝是同一个坑的两面。

---

## 7. 可选链与空值合并

```js
const cfg = { a: { b: 0 }, list: [] };

cfg?.a?.b;         // → 0
cfg?.x?.y;         // → undefined  安全
cfg?.list?.[0];    // → undefined  数组用 ?.[]
cfg?.fn?.();       // → undefined  函数调用加 ?.

cfg?.a?.b ?? "默认"; // → 0   ?? 只在 null / undefined 时兜底
cfg?.x?.y ?? "默认"; // → "默认"
```

`??` 和 `||` 的区别：`||` 会把 `0`、`""`、`false` 也当成空值。

```js
0 || 5;   // → 5
0 ?? 5;   // → 0
```

---

## 8. 速查表

- 键是字符串或 Symbol；整数键自动升序排最前
- `in` 查原型链，`Object.hasOwn` 只查自身
- 解构默认值只对 `undefined` 生效；对象解构赋值给已声明变量要加括号
- 展开是浅拷贝，只复制自身可枚举属性，后者覆盖前者
- 三档拷贝：赋值（全共享）、浅拷贝（第一层独立）、深拷贝（全独立）
- `structuredClone` 不能克隆函数 / Symbol 值
- `Object.freeze` 浅冻结
- `??` 只兜 `null` / `undefined`，`||` 兜所有假值

---

## 9. 常见坑（错误 ↔ 正确）

**① 用展开当深拷贝**

```js
const copy = { ...source };        // 嵌套共享
const copy2 = structuredClone(source); // 真隔离
```

**② 解构默认值想兜 null**

```js
const { a = 1 } = { a: null }; // → null，不生效
```

**③ `pick` 不判存在性**

```js
// 错：不存在的键会塞一个 undefined 进去
out[key] = obj[key];
// 对
if (Object.hasOwn(obj, key)) out[key] = obj[key];
```

**④ 用 `Object.assign` 合并默认值**

```js
Object.assign({}, { a: 1 }, { a: undefined }); // → { a: undefined }  默认值被覆盖
```

**⑤ `flattenObject` 把 null 当对象递归**

```js
typeof null; // → "object"
// 必须先判 value !== null && typeof value === "object"
```

**⑥ `for...in` 做拷贝**

会带上原型链上的可枚举属性，用 `Object.keys`。

---

## 10. 时间表（2h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:30 | 第 1–3 节，手敲解构的各种写法 | notes.md |
| 0:30–0:50 | `prediction.js` 8 个预测（先不跑） | 预测 |
| 0:50–1:35 | 实现 `pick` / `omit` / `mergeDefaults` / `flattenObject` | 测试 9–13 绿 |
| 1:35–1:50 | 第 4–7 节 + 订正预测 | 错题记录 |
| 1:50–2:00 | commit | hash |

---

## 11. 程序框架 & 验收线

```js
export function pick(obj, keys)                 // 只保留存在的键，返回新对象
export function omit(obj, keys)                 // 去掉 keys
export function mergeDefaults(defaults, options)// undefined 用默认值，null 保留
export function flattenObject(obj, prefix = "") // 嵌套拍平成 "a.b.c"
```

13 条测试全绿，且能回答：

1. `{...o}` 和 `structuredClone(o)` 的区别是什么？
2. 为什么 `{ a = 1 } = { a: null }` 得到 `null`？
3. `Object.freeze` 之后嵌套对象为什么还能改？
4. `pick` 用 `obj[key]` 直接取会引入什么问题？

---

## 12. 4h 版的额外 2h

1. **`deepFreeze`（30 min）**：递归冻结，处理数组和循环引用。
2. **`deepEqual`（45 min）**：比较嵌套对象/数组，`NaN` 和自身相等，`Date` 按时间比。
3. **路径取值（30 min）**：实现 `get(obj, "a.b.0.c", fallback)`，支持数组下标和缺失路径。
4. **描述符对比（15 min）**：用 `Object.getOwnPropertyDescriptor` 看 `Object.assign` 和展开在 getter/setter 上的差别，写结论。
