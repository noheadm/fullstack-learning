# 0-4 · 循环（2–3h）

> 目标：会写 `for` 和 `while`，能用"累加/累乘"模式解决重复计算。
> 代码：`exercises/phase0/day04/`，测试：`npm run p0d4`

---

## 1. 为什么需要循环

打一万次 `console.log` 不现实。循环就是"把同一段代码重复执行"。

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// → 1 2 3 4 5（每个一行）
```

---

## 2. `for` 的三个部分

```js
for (起点; 继续条件; 每轮结束后做什么) {
  // 循环体
}
```

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// → 0 1 2
```

拆开看：

| 部分 | 代码 | 作用 |
|------|------|------|
| 起点 | `let i = 0` | 只在开始执行一次 |
| 条件 | `i < 3` | 每轮开始前检查，false 就停 |
| 步进 | `i++` | 每轮结束后执行 |

`i++` 等于 `i = i + 1`。三段的顺序是：**起点 → 条件 → 循环体 → 步进 → 条件 → …**

---

## 3. `while`：只知道"什么时候停"时用

```js
let n = 3;
while (n > 0) {
  console.log(n);
  n--; // 千万别忘
}
// → 3 2 1
```

`while` 和 `for` 能互相改写。区别是：循环次数确定用 `for`，次数不确定（等某个条件）用 `while`。

`do...while` 至少执行一次，再用得很少，认识即可：

```js
let x = 10;
do {
  console.log("至少执行一次");
} while (x < 5);
// → 至少执行一次
```

---

## 4. 两个万能模式

**累加**：准备一个变量，循环里往上加。

```js
let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum = sum + i; // 或 sum += i
}
console.log(sum); // → 15
```

**累乘**：

```js
let product = 1; // 注意初始值是 1，不是 0
for (let i = 1; i <= 5; i++) {
  product = product * i;
}
console.log(product); // → 120
```

初始值是这两类题最容易错的地方：累加从 0 开始，累乘从 1 开始。

---

## 5. `break` 和 `continue`

```js
for (let i = 1; i <= 10; i++) {
  if (i === 4) break;      // 直接结束整个循环
  console.log(i);
}
// → 1 2 3
```

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;   // 跳过这一轮，继续下一轮
  console.log(i);
}
// → 1 2 4 5
```

`break` 常用在"找到了就不用再找"的场景，能省很多时间。

---

## 6. 嵌套循环

```js
for (let i = 1; i <= 3; i++) {
  let line = "";
  for (let j = 1; j <= i; j++) {
    line += "*";
  }
  console.log(line);
}
// → *
// → **
// → ***
```

外层控制"第几行"，内层控制"这一行有几个"。`line` 必须在外层循环里重置，否则会一直累加。

---

## 7. 用循环处理字符串

```js
const s = "hello";
for (let i = 0; i < s.length; i++) {
  console.log(s[i]);
}
// → h e l l o（每个一行）
```

`i < s.length` 不是 `i <= s.length` —— 用 `<=` 会多跑一次，拿到 `undefined`。

---

## 8. 今天要写的东西

打开 `exercises/phase0/day04/day04.js`：

1. `sumTo(n)`：1 + 2 + … + n（n 是 0 时返回 0）
2. `factorial(n)`：n 的阶乘（0 的阶乘是 1）
3. `countChar(text, ch)`：统计字符出现的次数
4. `isPrime(n)`：判断质数（小于 2 都不是质数；能被 2 到 n-1 整除就不是）
5. `repeatWord(word, times)`：返回重复拼接的结果，如 `"ab"` 3 次 → `"ababab"`（不许用 `repeat`）

```bash
npm run p0d4
```

---

## 9. 常见坑

**① 死循环**

```js
for (let i = 0; i < 5; ) { }   // 忘了 i++，永远循环
while (true) { }               // 没有 break
```

终端卡住不动就是它，`Ctrl + C` 结束。

**② 差一错误**

```js
for (let i = 0; i <= 3; i++) console.log(i); // → 0 1 2 3 跑了 4 次
for (let i = 0; i < 3; i++) console.log(i);  // → 0 1 2  跑了 3 次
```

先问自己"要跑几次"，再决定用 `<` 还是 `<=`。

**③ 累乘初始值写成 0**

```js
let p = 0;
p = p * 2; // → 0，后面永远是 0
```

**④ 内层变量没重置**

嵌套循环里 `line` 如果写在外层外面，会一轮比一轮长。

**⑤ 循环里 `return` 的位置错了**

在函数里，`return` 会直接结束整个函数，不只是结束循环。要"只跳过这一轮"用 `continue`。

---

## 10. 验收线

- `npm run p0d4` 9 条全绿
- 能不看资料写出 1 到 n 的累加
- 能说出 `break` 和 `continue` 的区别
- 能说出 `i < n` 和 `i <= n` 各跑几次
