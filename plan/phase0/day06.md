# 0-6 · 数组基础（2–3h）

> 目标：会存取、增删、遍历数组，不踩"复制引用"的坑。
> 代码：`exercises/phase0/day06/`，测试：`npm run p0d6`

---

## 1. 数组是什么

一串**有顺序**的值，用方括号创建：

```js
const fruits = ["苹果", "香蕉", "橙子"];
console.log(fruits.length); // → 3
console.log(fruits[0]);     // → "苹果"
console.log(fruits[2]);     // → "橙子"
console.log(fruits[3]);     // → undefined   越界不报错
```

索引从 **0** 开始，最后一个的下标是 `length - 1`。

数组可以装不同类型，但实际项目里尽量装同一种，读起来才不累。

---

## 2. 读和改

```js
const nums = [10, 20, 30];
nums[1];      // → 20
nums[1] = 99; // 改
nums;         // → [10, 99, 30]
```

给一个不存在的下标赋值，会在那个位置创建元素，中间的补 `empty`：

```js
const a = [1, 2];
a[4] = 5;
console.log(a);        // → [1, 2, <2 empty items>, 5]
console.log(a.length); // → 5
```

所以别跳着赋值，容易把 `length` 搞乱。

---

## 3. 增删：四个方法

```js
const a = [1, 2, 3];

a.push(4);     // 尾部加 → [1,2,3,4]，返回新长度 4
a.pop();       // 尾部删 → 返回被删的 4

a.unshift(0);  // 头部加 → [0,1,2,3]
a.shift();     // 头部删 → 返回被删的 0
```

记忆：`push/pop` 在尾部，`unshift/shift` 在头部。**四个都会改原数组。**

---

## 4. 遍历

```js
const nums = [10, 20, 30];

// 方式一：for + 索引（需要下标时用）
for (let i = 0; i < nums.length; i++) {
  console.log(i, nums[i]);
}

// 方式二：for...of（只要值，更简洁）
for (const n of nums) {
  console.log(n);
}
```

不要用 `for...in` 遍历数组 —— 它给你的是字符串下标 `"0" "1" "2"`，不是值。

---

## 5. 查找

```js
const a = [1, 2, 3];

a.includes(2);    // → true      有没有
a.indexOf(2);     // → 1         下标，找不到是 -1
a.indexOf(99);    // → -1
```

判断"在不在"用 `includes`，需要位置用 `indexOf`。

---

## 6. 常用小工具

```js
[1, 2, 3].join("-");        // → "1-2-3"
["a", "b"].join("");        // → "ab"
[1, 2, 3].slice(0, 2);      // → [1, 2]      截取 [0,2)，不改原数组
[1, 2].concat([3, 4]);      // → [1, 2, 3, 4] 拼接，不改原数组
```

`join` 经常用来把数组变成一句可读的文本。

---

## 7. 最大的坑：数组是引用

```js
const a = [1, 2, 3];
const b = a;      // 不是复制，是两个名字指向同一个数组

b.push(4);
console.log(a);   // → [1, 2, 3, 4]
```

要真正独立，必须显式复制：

```js
const c = a.slice(); // 或 [...a]，这里先用 slice
c.push(5);
console.log(a);      // → [1, 2, 3, 4]  没变
```

同样的道理：**把数组传给函数，函数里改了，外面也会变。**

```js
function addItem(list, item) {
  list.push(item); // 改的是外面那个数组
}
const my = [1];
addItem(my, 2);
console.log(my); // → [1, 2]
```

想要"改了但不影响外面"，就在函数里先 `slice()` 复制一份。

---

## 8. 今天要写的东西

打开 `exercises/phase0/day06/day06.js`：

1. `sumArray(nums)`：求和，空数组返回 0
2. `maxInArray(nums)`：最大值，空数组返回 `null`
3. `reverseArray(arr)`：返回**倒序的新数组**，不许改原数组
4. `countValue(arr, value)`：统计某个值出现几次
5. `joinWords(words)`：用 `", "` 连接，空数组返回 `""`

```bash
npm run p0d6
```

---

## 9. 常见坑

**① 赋值当复制**

见第 7 节，用 `slice()`。

**② 越界不报错**

```js
[1, 2][5]; // → undefined
```

拿到 `undefined` 先想"是不是下标写错了"。

**③ `length` 当成最大下标**

```js
const a = [1, 2, 3];
a[a.length];     // → undefined
a[a.length - 1]; // → 3
```

**④ 边遍历边删**

`for` 循环里 `splice` 会跳元素。要筛选用 0-8 的 `filter`，或用倒序循环。

**⑤ `join` 和 `concat` 搞混**

`join` 返回字符串，`concat` 返回新数组。

**⑥ 以为 `pop()` 返回新数组**

它返回**被删掉的那个元素**。

---

## 10. 验收线

- `npm run p0d6` 11 条全绿
- 能说出 `push/pop` 和 `unshift/shift` 的区别
- 能解释为什么 `const b = a` 之后改 `b` 会影响到 `a`
- 能写出"返回新数组、不改原数组"的函数
