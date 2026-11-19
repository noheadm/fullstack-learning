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

**键的类型**：只能是字符串或 `Symbol`。`Symbol` 是一种原始类型，用来当"永远不重复的标识符"，也可以当对象键。写数字会被自动转成字符串。

```js
const o = {};
o[1] = "a";
o;              // { "1": "a" }   键变成字符串了
```

**`Object.keys(obj)`**：返回对象**自身可枚举**字符串键组成的数组。

```js
Object.keys({ a: 1, b: 2 });   // ["a", "b"]
```

**键的顺序**：整数键升序排在前面，其余按插入顺序。

```js
Object.keys({ 2: "a", 1: "b", x: "c" });   // ["1", "2", "x"]
```

**Symbol 键**：不会出现在 `Object.keys` 里（Symbol 的用法后面单独讲）。

---

## 2. 属性存不存在：`in` 和 `hasOwn`

**`"键" in 对象`**：判断键在对象**自身或原型链**上是否存在，返回布尔值。

**`Object.hasOwn(对象, 键)`**：只判断**自身**是否有这个键。

```js
const o = { a: 1 };
"a" in o;                      // true
"toString" in o;               // true   原型链上的也算
Object.hasOwn(o, "a");         // true
Object.hasOwn(o, "toString");  // false  只看自身
```

拷贝、`pick`、`omit` 这类操作必须用 `Object.hasOwn` 或 `Object.keys`，否则会把原型链上的属性一起复制。

---

## 3. 解构

**解构**：用左边的形状，从右边取值并声明变量。不会修改源对象。

```js
const user = { name: "a", age: 20 };
const { name, age } = user;   // name = "a"，age = 20
```

**简写**：`{ name }` 就是 `{ name: name }` 的缩写。

```js
const { name } = user;        // 等价于 const name = user.name;
```

**改名**：`{ 源键: 新变量 }`，冒号左边是源对象的键，右边是新变量名。

```js
const { name: userName } = user;   // userName = "a"；没有 name 这个变量
```

**默认值**：仅当值为 `undefined` 时生效，`null` 不触发。

```js
const { age = 18 } = { age: undefined };   // 18
const { age = 18 } = { age: null };        // null
const { age = 18 } = { age: 0 };           // 0
```

**嵌套**：内层解构时，外层必须存在，否则要给默认值。

```js
const { addr: { city } } = { addr: undefined };      // TypeError
const { addr: { city } = {} } = { addr: undefined }; // undefined
```

**数组解构**：按位置匹配，与对象无关。

```js
const [a, b] = [10, 20];               // a = 10，b = 20
const [, second] = [10, 20, 30];       // second = 20（逗号占位）
const [x = 1, y = 2] = [5, undefined]; // x = 5，y = 2
const [head, ...tail] = [1, 2, 3, 4];  // head = 1，tail = [2, 3, 4]
```

**对象里取剩余**：rest 收集没被点名的键。

```js
const { name: n, ...rest } = { name: "a", age: 1 };
// n = "a"，rest = { age: 1 }
```

**给已声明的变量解构**：整体要加括号，否则行首 `{` 被当成代码块。

```js
let a;
({ a } = { a: 1 });   // 对：a = 1
{ a } = { a: 1 };      // SyntaxError
```

**解构不是拷贝**：取出来的是新变量，改它不影响源对象。

```js
let { name } = user;
name = "b";            // user.name 仍然是 "a"
```

---

## 4. 展开与剩余

**`...` 有两种用途**：在字面量里是展开（spread），在解构左边是剩余（rest）。

```js
[...[1, 2], 3];                  // [1, 2, 3]         spread
({ ...{ a: 1 }, b: 2 });         // { a: 1, b: 2 }    spread
const [h, ...t] = [1, 2, 3];     // h = 1，t = [2, 3] rest
const { a, ...r } = { a: 1, b: 2 };  // a = 1，r = { b: 2 } rest
```

**覆盖顺序**：后写的赢。

```js
({ ...{ a: 1, b: 1 }, ...{ b: 2 } });   // { a: 1, b: 2 }
```

**只复制自身可枚举属性**：原型链上的不会被复制。

**`Object.create(原型)`**：创建一个新对象，并把它的原型指向参数。

```js
const o = Object.create({ inherited: 1 });   // o 的原型是 { inherited: 1 }
o.own = 2;
({ ...o });   // { own: 2 }   原型上的 inherited 不会被展开进来
```

**`Object.assign(target, ...sources)`**：JS 自带的对象方法，把每个源对象的**自身可枚举属性**复制到 `target` 上，**返回 `target` 本身**。

```js
const target = { a: 1 };
const ret = Object.assign(target, { b: 2 }, { c: 3 });
// target = { a: 1, b: 2, c: 3 }
// ret === target            ← 返回的是同一个对象
```

**它和 `{ ...src }` 的关系**：做的是同一件事（浅拷贝合并），区别只在"改不改原对象、返回哪个对象"。

```js
const a1 = { x: 1 };
const s = { ...a1, y: 2 };   // 新对象
a1;                          // { x: 1 }      没变
s;                           // { x: 1, y: 2 }

const a2 = { x: 1 };
const r = Object.assign(a2, { y: 2 });
a2;                          // { x: 1, y: 2 } 被改了
r === a2;                    // true
```

**选择建议**：想要"不修改原对象"，用 `{ ... }`；想"就地修改某个对象"，用 `Object.assign`。

> 另一个差别是「`assign` 会触发 setter，展开不会」。`setter` 属于访问器属性，1-7 讲 `class` 的 `get` / `set` 时再讲，这一节先不用管。

**它是浅拷贝**：嵌套对象仍然共享。

```js
const s = { n: { v: 1 } };
const c = { ...s };
c.n.v = 2;      // s.n.v 也变成 2
```

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

**`structuredClone(值)`**：原生深拷贝函数（Node 17+ 与现代浏览器自带），递归复制嵌套对象和数组，也能处理循环引用。

```js
const source = { d: new Date(0), list: [{ n: 1 }] };
const deep = structuredClone(source);

deep.d instanceof Date;            // true   日期类型保住了
deep.list[0] === source.list[0];   // false  不是同一个对象
```

**限制**：不能克隆函数和 `Symbol` 值，会抛 `DataCloneError`；也不能克隆 DOM 节点。

```js
structuredClone({ fn() {} });   // DataCloneError
```

---

## 6. 冻结：`Object.freeze` 是浅的

**`Object.freeze(obj)`**：把 `obj` 的**自身属性**全部设成"不可写、不可配置"，并禁止新增/删除属性；返回 `obj` 本身。它**不会递归**处理嵌套对象。

```js
const config = Object.freeze({ debug: true, db: { host: "x" } });
```

它到底改了什么？看属性描述符：

```js
Object.getOwnPropertyDescriptor(config, "debug");
// → { value: true, writable: false, enumerable: true, configurable: false }
```

`writable: false` 就是"不能改值"的底层原因。

**为什么嵌套还能改**：`config.db` 存的是一个**引用**。冻结只保证"这个引用不能再换"，它指向的那个对象没被冻结。

```js
Object.isFrozen(config);      // true    外层被冻
Object.isFrozen(config.db);   // false   内层没被冻

config.debug = false;   // TypeError: Cannot assign to read only property
config.db = {};         // TypeError: 引用也不许换
config.db.host = "y";   // 成功！改的是另一个对象
config.newKey = 1;      // TypeError: 不许新增
delete config.debug;    // TypeError: 不许删除

config.db.host;   // "y"
```

> `TypeError` 只在严格模式下抛出；非严格模式是静默失败。ESM 模块默认严格模式，所以你看到的是报错。

**想要真冻结必须递归**：

```js
function deepFreeze(obj) {
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (v !== null && typeof v === "object") deepFreeze(v);
  }
  return Object.freeze(obj);
}
```

**和 `const` 的区别**：

| 写法 | 锁住什么 | 没锁住什么 |
|------|----------|------------|
| `const obj = {}` | 变量 `obj` 不能重新赋值 | 对象内容随便改 |
| `Object.freeze(obj)` | 对象的自身属性不能增删改 | 嵌套对象；变量本身仍可重新赋值（`let` 时） |

---

## 7. 可选链与空值合并

**`?.`**：左边是 `null` / `undefined` 时，整个表达式返回 `undefined`，不继续读。

```js
const cfg = { a: { b: 0 } };
cfg.a.b;       // 0
cfg.x.y;       // TypeError: Cannot read properties of undefined
cfg?.x?.y;     // undefined
```

**三种形态**：属性 `?.`、下标 `?.[]`、调用 `?.()`。

```js
cfg?.a?.b;         // 0
cfg?.list?.[0];    // undefined
cfg?.fn?.();       // undefined
```

**`??`**：左侧是 `null` / `undefined` 时取右侧，其他值一律保留。

```js
null ?? "默认";       // "默认"
undefined ?? "默认";  // "默认"
0 ?? "默认";          // 0
"" ?? "默认";         // ""
false ?? "默认";      // false
```

**`??` vs `||`**：`||` 把所有假值都当成空。

```js
0 || 5;     // 5
0 ?? 5;     // 0
"" || "x";  // "x"
"" ?? "x";  // ""
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
4. **描述符对比（15 min）**：用 `Object.getOwnPropertyDescriptor` 看 `Object.freeze` 之后 `writable` 变成什么，再对比冻结前后的赋值结果。

---
