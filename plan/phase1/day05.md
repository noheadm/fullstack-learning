# Day 5 · 数组与数组方法（4h）

> 目标：分清哪些方法改原数组、哪些返回新数组，写出 `groupBy` / `flatten` / `topWords`。
> 代码：`exercises/day05/`，测试：`npm run day5`

---

## 0. 先看一个反直觉的排序

```js
[10, 9, 1].sort();            // → [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b); // → [1, 9, 10]
```

`sort` 默认把元素转成**字符串**再比较，所以 `"10" < "9"`。这条规则每年都有人踩。

---

## 1. 数组其实是对象

```js
const a = [1, 2, 3];
typeof a;              // → "object"
Array.isArray(a);      // → true
Object.keys(a);        // → ["0", "1", "2"]   ← 索引是字符串键
a["0"] === a[0];       // → true
```

`length` 不是"元素个数"，而是"最大索引 + 1"，而且可写：

```js
const b = [1, 2, 3];
b.length = 1;
b; // → [1]        截断

b.length = 3;
b; // → [1, <2 empty items>]   补空洞
```

空洞（empty）和 `undefined` 不一样：

```js
const s = [1, , 3];
s.length;  // → 3
1 in s;    // → false   这个位置根本没键
s[1];      // → undefined  但访问时看起来一样
```

这意味着 `forEach`、`map` 会**跳过空洞**，而 `[1, undefined, 3]` 不会跳过。

---

## 2. 原地修改 vs 返回新数组

| 原地修改 | 返回新数组 |
|---|---|
| `push` `pop` `shift` `unshift` | `slice` `concat` `map` `filter` |
| `splice` `sort` `reverse` `fill` `copyWithin` | `flat` `flatMap` `toSorted` `toReversed` |

两个容易忘的点：

```js
const a = [3, 1, 2];
const r = a.sort();
r === a; // → true   sort 返回同一个引用，不是副本

const b = [3, 1, 2];
const sorted = b.toSorted((x, y) => x - y); // ES2023，不改 b
b;       // → [3, 1, 2]
sorted;  // → [1, 2, 3]
```

**要链式调用又要保留原数组**，就用 `toSorted` / `toReversed` / `slice()` 先复制。

---

## 3. 为什么不能用 `delete` 删数组元素

```js
const a = [1, 2, 3];
delete a[1];
a;        // → [1, <1 empty item>, 3]
a.length; // → 3   ← 长度没变
```

`delete` 只删键，留下空洞。正确做法：

```js
a.splice(1, 1); // 从索引 1 删 1 个 → [1, 3]
```

`splice(start, deleteCount, ...items)` 原地修改并返回被删元素；`slice(start, end)` 返回副本，别混。

---

## 4. 遍历的三种方式

```js
const a = [1, 2, 3];

for (const x of a) console.log(x); // 可 break / continue，推荐
a.forEach((x) => console.log(x));  // 不能 break
for (const i in a) console.log(i); // 拿到的是 "0","1","2" 字符串，不要用
```

`forEach` 想提前退出只能 `throw`，正常做法是换 `some` / `every`：

```js
const found = [1, 2, 3].some((x) => {
  if (x === 2) return true; // true 表示"找到了，停止"
  return false;
});
found; // → true
```

`for...in` 遍历的是键，还会带上原型链上的可枚举属性，**永远不要用于数组**。

---

## 5. `map` / `filter` / `reduce`

```js
[1, 2, 3].map((x) => x * 2);          // → [2, 4, 6]      长度不变
[1, 2, 3].filter((x) => x % 2);       // → [1, 3]         只保留返回真值的
[1, 2, 3].reduce((acc, x) => acc + x, 0); // → 6
```

`reduce` 的签名是 `cb(acc, current, index, array)`，第二个参数是初始值。**空数组不给初始值会抛错**：

```js
[].reduce((a, b) => a + b);      // → TypeError: Reduce of empty array with no initial value
[].reduce((a, b) => a + b, 0);   // → 0
```

更隐蔽的是"累加对象"时忘记给初始值：

```js
// 错：acc 第一次是 "a" 字符串，不是对象
["a", "b", "a"].reduce((acc, w) => {
  acc[w] = (acc[w] ?? 0) + 1;
  return acc;
}); // → 给字符串加属性，结果是个带属性的字符串，不是你要的对象

// 对：给初始值
["a", "b", "a"].reduce((acc, w) => {
  acc[w] = (acc[w] ?? 0) + 1;
  return acc;
}, {}); // → { a: 2, b: 1 }
```

这就是今天的 `groupBy` 必须写 `reduce(..., {})` 的原因。

---

## 6. 查找与判定

```js
const a = [1, 2, 3];

a.indexOf(2);        // → 1
a.includes(2);       // → true
a.find((x) => x > 1);      // → 2
a.findIndex((x) => x > 1); // → 1
a.some((x) => x > 2);      // → true    有一个满足
a.every((x) => x > 0);     // → true    全部满足
[].every((x) => false);    // → true    空数组恒真
```

`indexOf` 用 `===`，找不到 `NaN`；`includes` 用 SameValueZero，能找到：

```js
[NaN].indexOf(NaN);  // → -1
[NaN].includes(NaN); // → true
```

---

## 7. 性能：`shift` 是 O(n)

```js
const queue = [1, 2, 3];
queue.shift(); // → 1，但后面所有元素都要往前挪
```

大量头插/头删时，`shift` / `unshift` 会让整体变成 O(n²)。替代方案：用 `push` + 索引指针，或者 `pop` 反向处理。

另外 `sort` 是 O(n log n)，`includes` 是 O(n) —— 循环里套 `includes` 就是 O(n²)，数据量大时改用 `Set`。

---

## 8. 附：最小正则（`topWords` 必用）

`topWords` 要求"去掉标点"，用循环一个个判断很麻烦，正则一行就够：

```js
"cat, cat. dog!".replace(/[^\p{L}\p{N}\s]/gu, " ");
// → "cat  cat  dog "
```

拆开看：

| 片段 | 含义 |
|------|------|
| `/.../` | 正则表达式的写法 |
| `[^...]` | 中括号里是"要匹配的字符集合"，`^` 表示取反 |
| `\p{L}` | 任意语言的字母（`u` 标志下才生效） |
| `\p{N}` | 任意数字 |
| `\s` | 空白字符（空格、换行、tab） |
| `u` | 让 `\p{...}` 生效的标志 |
| `g` | 全局替换，不加只替换第一个 |

合起来就是"把所有**不是**字母、数字、空白字符的字符替换成空格"。

清理完再切词，多出来的连续空格用 `split(/\s+/)` 吸收：

```js
"cat  cat  dog ".split(/\s+/); // → ["cat", "cat", "dog", ""]
```

注意最后那个空字符串，要 `filter(Boolean)` 去掉。

> 正则的完整语法后面单独讲，这里只要看懂这一段能抄着用即可。

## 9. 速查表
- 数组是对象，索引是字符串键，`length` 可写
- 空洞 ≠ `undefined`：`in` 判断为 false，遍历会跳过
- `sort` / `reverse` / `splice` 原地修改且返回原引用
- `toSorted` / `toReversed` 返回新数组（ES2023）
- 删元素用 `splice`，不要 `delete`
- `forEach` 不能 break；`some` 可以提前结束
- `reduce` 空数组不给初始值抛 `TypeError`
- `indexOf` 找不到 `NaN`，`includes` 可以
- `shift` / `unshift` 是 O(n)
- `flat(depth)` 默认 1；`flatMap` = `map` + `flat(1)`

---

## 10. 常见坑（错误 ↔ 正确）

**① 数字排序不传比较函数**

```js
[10, 9, 1].sort();                 // → [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b);  // → [1, 9, 10]
```

**② `reduce` 不给初始值**

见第 5 节。累加对象、数组时必须给 `{}` / `[]`。

**③ `flat` 深度写错**

```js
[1, [2, [3, [4]]]].flat();        // → [1, 2, [3, [4]]]  默认只拍一层
[1, [2, [3, [4]]]].flat(Infinity); // → [1, 2, 3, 4]
```

**④ 用 `map` 做副作用**

`map` 的语义是"返回新数组"，只想要副作用就用 `forEach`，否则会多创建一个没人用的数组。

**⑤ 排序比较函数返回布尔值**

```js
a.sort((x, y) => x > y);   // 错：true/false 会被当 1/0，排序结果不可靠
a.sort((x, y) => x - y);   // 对：返回负数 / 0 / 正数
```

**⑥ 边遍历边改数组**

`forEach` 过程中 `splice` 会导致跳过元素。要删就倒序 `for` 循环，或先 `filter` 出来。

---

## 11. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:50 | 第 1–4 节，手敲原地/非原地对照 | notes.md |
| 0:50–1:10 | 实现 `groupBy` | 测试 1–2 绿 |
| 1:10–1:40 | 实现 `flatten(depth)`（禁用 `arr.flat`） | 测试 3–6 绿 |
| 1:40–2:30 | 实现 `topWords` | 测试 7–9 绿 |
| 2:30–3:00 | 第 5–7 节复习 | notes.md |
| 3:00–3:30 | 边界：空数组、深度 0、全标点 | 全绿 |
| 3:30–4:00 | commit | hash |

---

## 12. 程序框架 & 验收线

```js
export function groupBy(items, keyFn)        // 用 reduce 实现
export function flatten(arr, depth = 1)      // 禁止 arr.flat
export function topWords(text, n)            // 降序，同频按字母序
```

9 条测试全绿，且能回答：

1. `[10, 9, 1].sort()` 为什么不是 `[1, 9, 10]`？
2. `delete arr[0]` 之后 `length` 为什么不变？
3. `reduce` 的初始值在什么情况下是必须的？
4. 哪些方法会改原数组？说出至少 5 个。
5. `forEach` 里想 break 应该换什么？
