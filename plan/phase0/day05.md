# 0-5 · 函数（2–3h）

> 目标：会定义函数、传参、用 `return` 把结果交回去，能把函数当参数传。
> 代码：`exercises/phase0/day05/`，测试：`npm run p0d5`

---

## 1. 为什么需要函数

同样的计算写三遍，改的时候要改三处，第三处一定会漏。

```js
const a = 3 * 3 * 3;
const b = 5 * 5 * 5;
const c = 7 * 7 * 7;
```

改成函数，只写一次逻辑：

```js
function cube(n) {
  return n * n * n;
}

cube(3); // → 27
cube(5); // → 125
cube(7); // → 343
```

函数解决两件事：**复用**和**给一段逻辑起名字**（名字起得好，读代码就不用猜）。

---

## 2. 定义与调用是两个动作

```js
// 定义：只是"准备好"，不会执行
function cube(n) {
  return n * n * n;
}

// 调用：真的执行，括号必须有
cube(3); // → 27
cube;    // → 打印函数本身，不执行
```

`cube` 是函数本身，`cube(3)` 是调用结果。这是新手第一个大坑。

---

## 3. `return`：把结果交回去

```js
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
console.log(result); // → 5
```

没有 `return` 的函数返回 `undefined`：

```js
function add2(a, b) {
  a + b; // 算完就丢了
}
console.log(add2(2, 3)); // → undefined
```

`return` 一执行，函数立刻结束，后面的代码不会跑：

```js
function test() {
  return 1;
  console.log("这行永远不执行");
}
```

所以 `return` 后面的代码要么删掉，要么说明逻辑写错了。

---

## 4. 参数：形参、实参、缺省

```js
function greet(name) {  // name 是形参（占位）
  return `你好，${name}`;
}

greet("小明"); // "小明" 是实参（真实的值）
```

少传参数时，缺的那个是 `undefined`：

```js
function area(w, h) {
  return w * h;
}
area(3); // → NaN，因为 3 * undefined
```

给默认值可以兜住：

```js
function area2(w, h = 1) {
  return w * h;
}
area2(3); // → 3
```

多传的参数会被忽略（不是报错）：

```js
function one(a) {
  return a;
}
one(1, 2, 3); // → 1
```

---

## 5. 函数里声明的变量，外面看不到

```js
function f() {
  const local = 1;
  return local;
}
f();       // → 1
local;     // → ReferenceError: local is not defined
```

这叫局部变量。它的好处是：函数内部用什么名字，不会和外面冲突。

（完整的"作用域"规则在阶段 1 讲，现在只要知道"在里面定义的只属于里面"。）

---

## 6. 提前返回：先排除不可能的情况

```js
function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
```

比写一堆 `else` 清楚。规则：**能早返回就早返回**，函数末尾只留"正常情况"。

---

## 7. 函数可以当参数传

这是 JS 里最重要的一个用法，先看现象：

```js
function applyTwice(fn, x) {
  return fn(fn(x));
}

applyTwice((n) => n + 1, 5); // → 7
applyTwice((n) => n * 2, 3); // → 12
```

`fn` 就是一个参数，只不过传进来的东西是函数。传进去的函数叫"回调"。

为什么重要？因为 `map`、`filter`、事件监听、定时器，全都是这个模式。0-8 会用到。

---

## 8. 两种写法的区别

```js
// 函数声明
function double(n) {
  return n * 2;
}

// 箭头函数：单个表达式可以省掉 {} 和 return
const double2 = (n) => n * 2;
```

要点：

- 箭头函数只有一个表达式时，可以省略 `{}` 和 `return`，表达式的结果自动成为返回值。
- 一旦加了 `{}`，就必须自己写 `return`：

```js
const wrong = (n) => { n * 2; };  // → undefined
const right = (n) => { return n * 2; };
```

---

## 9. 今天要写的东西

打开 `exercises/phase0/day05/day05.js`：

1. `clamp(n, min, max)`：小于 min 返回 min，大于 max 返回 max，否则返回 n
2. `greetWith(name, greeting = "你好")`：返回 `${greeting}，${name}！`
3. `applyTwice(fn, x)`：把 `fn` 连续调用两次
4. `compose2(f, g, x)`：先算 `g(x)`，再把结果交给 `f`
5. `absolute(n)`：返回绝对值，不许用 `Math.abs`

```bash
npm run p0d5
```

---

## 10. 常见坑

**① 定义完忘了调用**

```js
function sayHi() { return "hi"; }
sayHi;   // 什么都没发生
sayHi(); // 对
```

**② 忘了 `return`**

函数体里算完没交回去，调用方拿到 `undefined`。

**③ 箭头函数加了 `{}` 却忘了 `return`**

见第 8 节。

**④ 参数顺序搞反**

```js
function divide(a, b) { return a / b; }
divide(2, 10); // → 0.2，不是 5
```

**⑤ 以为 `return` 只结束循环**

在函数里，`return` 结束的是整个函数。

**⑥ 函数名重复**

后定义的会覆盖前面的，而且不一定报错。名字要能搜到唯一出处。

---

## 11. 验收线

- `npm run p0d5` 11 条全绿
- 能说出 `fn` 和 `fn()` 的区别
- 能说出没有 `return` 时函数返回什么
- 能写一个接收函数作为参数的函数
