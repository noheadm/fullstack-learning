# Day 5 · 数组与数组方法（4h）

> 目标：分清哪些方法改原数组、哪些返回新数组，写出 `groupBy` / `flatten` / `topWords`。
> 代码：`exercises/day05/`，测试：`npm run day5`

---

## 1. 数组是什么

**数组**：一串**有顺序**的值，用方括号创建。

```js
const a = ["苹果", "香蕉", "橙子"];
a.length;   // 3
a[0];       // "苹果"      索引从 0 开始
a[9];       // undefined   越界不报错
```

**`Array.isArray(x)`**：判断 x 是不是数组，返回布尔值。

```js
Array.isArray([]);   // true
Array.isArray({});   // false
typeof [];           // "object"   ← typeof 分不出数组
```

**`length`**：等于"最大索引 + 1"，不是元素个数，而且可以写。

```js
const b = [1, 2, 3];
b.length = 1;   // → [1]          截断
b.length = 3;   // → [1, <2 empty>]  补空洞
```

**稀疏数组**：空洞（empty）和 `undefined` 不是一回事。

```js
const s = [1, , 3];
s.length;   // 3
1 in s;     // false   这个位置没有键
s[1];       // undefined  看起来一样，但遍历时会被跳过
```

---

## 2. 读和改

**按下标读**：`a[i]`。**按下标写**：`a[i] = 值`，不会修改其他元素。

```js
const a = [10, 20, 30];
a[1];       // 20
a[1] = 99;  // [10, 99, 30]
a[4] = 5;   // [10, 99, 30, <empty>, 5]   长度变 5
```

---

## 3. 增删：四个方法（都会改原数组）

**`push(x)`**：尾部添加，返回新长度。
**`pop()`**：尾部删除，返回被删的元素。
**`unshift(x)`**：头部添加，返回新长度。
**`shift()`**：头部删除，返回被删的元素。

```js
const a = [1, 2, 3];
a.push(4);     // 返回 4，a → [1,2,3,4]
a.pop();       // 返回 4，a → [1,2,3]
a.unshift(0);  // 返回 4，a → [0,1,2,3]
a.shift();     // 返回 0，a → [1,2,3]
```

记忆：`push/pop` 在尾部，`unshift/shift` 在头部。`shift`/`unshift` 要挪动全部元素，是 O(n)。

---

## 4. 遍历

**`for (let i = 0; i < a.length; i++)`**：能拿到下标，最灵活。

```js
for (let i = 0; i < a.length; i++) console.log(i, a[i]);
```

**`for...of`**：只拿值，能 `break`。

```js
for (const v of a) {
  if (v > 2) break;
  console.log(v);
}
```

**`forEach(fn)`**：遍历，无返回值，**不能 `break`**。

```js
a.forEach((v, i) => console.log(v, i));
```

**`for...in` 不要用于数组**：它给的是字符串下标 `"0" "1"`，还会带上原型链上的属性。

---

## 5. 三个高阶函数

**`map(fn)`**：一对一转换，返回**新数组**，长度不变。

```js
[1, 2, 3].map((n) => n * 2);   // [2, 4, 6]
[1, 2].map((n) => { n * 2; }); // [undefined, undefined]  忘了 return
```

**`filter(fn)`**：按条件筛选，返回**新数组**，长度可能变短。

```js
[1, 2, 3, 4].filter((n) => n % 2 === 0);   // [2, 4]
[1, 2, 3].filter((n) => n);                // [1, 2, 3]  返回的是值不是判断
```

**`reduce(fn, init)`**：把数组压成一个值。`fn(acc, cur)` 的返回值成为下一轮的 `acc`。

```js
[1, 2, 3].reduce((acc, n) => acc + n, 0);   // 6
[].reduce((acc, n) => acc + n);             // TypeError: 没给初始值
[].reduce((acc, n) => acc + n, 0);          // 0
```

**累加对象的写法**（`groupBy` 要用）：

```js
["a", "b", "a"].reduce((acc, w) => {
  acc[w] = (acc[w] ?? 0) + 1;
  return acc;
}, {});   // { a: 2, b: 1 }
```

---

## 6. 查找与判定

**`includes(v)`**：是否包含，返回布尔。
**`indexOf(v)`**：第一次出现的下标，找不到返回 `-1`。
**`find(fn)`**：第一个满足条件的元素，找不到返回 `undefined`。
**`findIndex(fn)`**：第一个满足条件的下标，找不到返回 `-1`。
**`some(fn)`**：有一个满足就 `true`。
**`every(fn)`**：全部满足才 `true`；空数组返回 `true`。

```js
const a = [1, 2, 3, 4];
a.includes(2);        // true
a.indexOf(2);         // 1
a.find((n) => n > 2); // 3
a.findIndex((n) => n > 2); // 2
a.some((n) => n > 3); // true
a.every((n) => n > 0); // true
```

**`indexOf` 找不到 `NaN`，`includes` 能找到**：

```js
[NaN].indexOf(NaN);   // -1
[NaN].includes(NaN);  // true
```

---

## 7. 排序

**`sort(fn)`**：原地排序，**返回同一个数组**（不是副本）。

```js
const a = [3, 1, 2];
a.sort() === a;   // true
```

**默认按字符串比较**，所以数字排序会翻车：

```js
[10, 9, 1].sort();                  // [1, 10, 9]   "10" < "9"
[10, 9, 1].sort((x, y) => x - y);   // [1, 9, 10]
```

比较函数返回负数 → x 在前；正数 → y 在前。

**`toSorted(fn)`**：ES2023 新增，排序但**返回新数组**。

```js
const b = [3, 1, 2];
b.toSorted((x, y) => x - y);   // [1, 2, 3]
b;                             // [3, 1, 2]  没变
```

---

## 8. 截取、拼接、拍平

**`slice(a, b)`**：截取 `[a, b)`，返回**新数组**，不改原数组。
**`splice(i, n, ...items)`**：从下标 `i` 删 `n` 个，可插入新元素，**改原数组**，返回被删元素数组。
**`concat(x)`**：拼接，返回新数组。
**`join(sep)`**：拼成字符串，空数组得 `""`。
**`flat(depth)`**：拍平嵌套数组，默认深度 1。
**`flatMap(fn)`**：等价于 `map` 再 `flat(1)`。

```js
[1, 2, 3].slice(0, 2);        // [1, 2]
[1, 2, 3].splice(1, 1);       // 返回 [2]，原数组变 [1, 3]
[1, 2].concat([3]);           // [1, 2, 3]
[1, 2, 3].join("-");          // "1-2-3"
[1, [2, [3]]].flat();         // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]
```

**删元素不要用 `delete`**：它只删键、留下空洞，`length` 不变。用 `splice`。

```js
const a = [1, 2, 3];
delete a[1];
a;        // [1, <1 empty>, 3]
a.length; // 3
```

---

## 9. 正则的最小知识（`topWords` 要用）

**正则**：描述"什么样的字符串"的模式，写在两个斜杠之间。

```js
"cat, cat. dog!".replace(/[^\p{L}\p{N}\s]/gu, " ");
// → "cat  cat  dog "
```

| 片段 | 含义 |
|------|------|
| `/.../` | 正则的写法 |
| `[^...]` | 字符集合取反 |
| `\p{L}` | 任意字母（需要 `u` 标志） |
| `\p{N}` | 任意数字 |
| `\s` | 空白字符 |
| `u` | 让 `\p{...}` 生效 |
| `g` | 全局替换，否则只换第一个 |

**`split(/\s+/)`**：按一个或多个空白切分。

```js
"cat  cat  dog ".split(/\s+/);   // ["cat","cat","dog",""]
```

最后那个空串用 `filter(Boolean)` 去掉。

---

## 10. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:50 | 第 1–4 节，手敲原地/非原地对照 | notes.md |
| 0:50–1:10 | 实现 `groupBy` | 测试 1–2 绿 |
| 1:10–1:40 | 实现 `flatten(depth)`（禁用 `arr.flat`） | 测试 3–6 绿 |
| 1:40–2:30 | 实现 `topWords` | 测试 7–9 绿 |
| 2:30–3:00 | 第 5–9 节复习 | notes.md |
| 3:00–3:30 | 边界：空数组、深度 0、全标点 | 全绿 |
| 3:30–4:00 | commit | hash |

---

## 11. 程序框架 & 验收线

```js
export function groupBy(items, keyFn)        // 用 reduce 实现
export function flatten(arr, depth = 1)      // 禁止 arr.flat
export function topWords(text, n)            // 降序，同频按字母序
```

9 条测试全绿，且能回答：

1. `[10, 9, 1].sort()` 为什么不是 `[1, 9, 10]`？
2. `delete arr[0]` 之后 `length` 为什么不变？
3. `reduce` 的初始值什么时候是必须的？
4. 哪些方法会改原数组？至少说出 5 个。
5. `forEach` 里想 break 应该换什么？
