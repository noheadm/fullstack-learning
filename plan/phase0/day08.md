# 0-8 · 常用数组方法（3h）

> 目标：用 `map` / `filter` / `reduce` 代替手写循环，能读懂链式调用。
> 代码：`exercises/phase0/day08/`，测试：`npm run p0d8`

---

## 1. 为什么需要它们

0-6 里你写过这种循环：

```js
const nums = [1, 2, 3];
const doubled = [];
for (let i = 0; i < nums.length; i++) {
  doubled.push(nums[i] * 2);
}
```

模式是固定的："遍历 + 对每个元素做一件事 + 收集结果"。这种模式每天都要写，于是有了 `map`。

---

## 2. `map`：一对一转换

```js
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
doubled; // → [2, 4, 6]
nums;    // → [1, 2, 3]   原数组不变
```

规则：

- 返回**新数组**，长度和原来一样
- 回调返回什么，新数组里就是什么
- 别忘了 `return`（用 `{}` 时必须写）

```js
[1, 2].map((n) => { n * 2; });   // → [undefined, undefined]  错
[1, 2].map((n) => { return n * 2; }); // → [2, 4]
```

---

## 3. `filter`：按条件筛选

```js
const nums = [1, 2, 3, 4];
const evens = nums.filter((n) => n % 2 === 0);
evens; // → [2, 4]
```

回调返回真值就保留，返回假值就丢掉。长度可能变化。

常见错误是返回了"值"而不是"判断"：

```js
[1, 2, 3].filter((n) => n);     // → [1, 2, 3]   因为 1、2、3 都是真值
[1, 2, 3].filter((n) => n > 1); // → [2, 3]      这才是筛选
```

---

## 4. `reduce`：把数组压成一个值

```js
const nums = [1, 2, 3, 4];
const total = nums.reduce((acc, n) => acc + n, 0);
total; // → 10
```

两个参数：

- `acc`：累积值，一开始是初始值（这里是 `0`）
- `n`：当前元素
- 返回值成为下一轮的 `acc`

三种常见用法：

```js
// 求和
[1, 2, 3].reduce((acc, n) => acc + n, 0); // → 6

// 求最大值
[3, 9, 2].reduce((acc, n) => (n > acc ? n : acc), -Infinity); // → 9

// 计数（结果是一个对象）
["a", "b", "a"].reduce((acc, w) => {
  acc[w] = (acc[w] || 0) + 1;
  return acc;
}, {}); // → { a: 2, b: 1 }
```

**空数组 + 不给初始值会报错**：`[].reduce((a, b) => a + b)` → `TypeError`。

---

## 5. 查找与判断

```js
const nums = [1, 2, 3, 4];

nums.find((n) => n > 2);      // → 3        返回第一个满足的元素
nums.findIndex((n) => n > 2); // → 2        返回下标，找不到 -1
nums.some((n) => n > 3);      // → true     有一个满足
nums.every((n) => n > 0);     // → true     全部满足
```

`find` 找不到返回 `undefined`；`some`/`every` 返回布尔值。

---

## 6. `forEach` 与 `map` 的区别

```js
// 只要副作用，不需要结果
[1, 2, 3].forEach((n) => console.log(n));

// 需要结果
const doubled = [1, 2, 3].map((n) => n * 2);
```

`forEach` 永远返回 `undefined`，所以不能链式接下去。需要"新数组"就用 `map`。

---

## 7. `sort`：唯一会改原数组的常用方法

```js
const nums = [10, 9, 1];
nums.sort();                 // → [1, 10, 9]   按字符串比
nums.sort((a, b) => a - b);  // → [1, 9, 10]   数字升序
nums;                        // 原数组被改了
```

比较函数的返回值决定顺序：负数表示 a 在前，正数表示 b 在前。

要"排序但保留原数组"：

```js
const sorted = nums.slice().sort((a, b) => a - b);
```

（阶段 1 会讲更简洁的 `toSorted`。）

---

## 8. 链式调用

```js
const users = [
  { name: "小明", age: 17 },
  { name: "小红", age: 22 },
  { name: "小刚", age: 19 },
];

const adultNames = users
  .filter((u) => u.age >= 18)
  .map((u) => u.name);

adultNames; // → ["小红", "小刚"]
```

每一步都返回新数组，所以可以一路点下去。这是实际项目里最常见的写法。

---

## 9. 今天要写的东西

打开 `exercises/phase0/day08/day08.js`：

1. `doubleAll(nums)`：每个数乘 2（用 `map`）
2. `evensOnly(nums)`：只保留偶数（用 `filter`）
3. `sumAll(nums)`：求和（用 `reduce`，空数组返回 0）
4. `namesOf(users)`：取出所有 `name`（用 `map`）
5. `firstOver(nums, limit)`：第一个大于 limit 的数，没有返回 `null`（用 `find`）
6. `sortByAge(users)`：按 age 升序，**返回新数组不改原数组**

```bash
npm run p0d8
```

---

## 10. 常见坑

**① 箭头函数加了 `{}` 忘了 `return`**

`map` 里最常犯，结果是 `[undefined, undefined]`。

**② `filter` 返回的不是判断**

`filter((n) => n * 2)` 会保留所有非零数，不是"筛选出什么"。

**③ `reduce` 忘了初始值**

空数组会抛 `TypeError`，累加对象时会拿第一个元素当 `acc`。

**④ `sort` 改了原数组**

要么接受，要么先 `slice()`。

**⑤ 数字排序不传比较函数**

`[10, 9, 1].sort()` 得到 `[1, 10, 9]`。

**⑥ 用 `forEach` 收集结果**

`forEach` 返回 `undefined`，链式调用直接崩。

---

## 11. 验收线

- `npm run p0d8` 12 条全绿
- 能说出 `map` / `filter` / `reduce` 各自"返回什么"
- 能解释 `[10, 9, 1].sort()` 为什么不是 `[1, 9, 10]`
- 能读出一条 `.filter().map()` 链在做什么
