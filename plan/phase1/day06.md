# Day 6 · 闭包与模块模式（4h）

> 目标：搞清闭包为什么能"记住"变量、怎么用它藏私有状态、柯里化和管道怎么从它长出来。
> 代码：`exercises/day06/`，测试：`npm run day6`

---

## 0. 先看一个现象（3 分钟）

```js
function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const next = makeCounter();
next(); // → 1
next(); // → 2
next(); // → 3
```

问题：`makeCounter` 已经执行完了，它的局部变量 `count` 按常理应该被销毁，为什么 `next()` 还能一次次往上加？

答案就是闭包。今天要讲清的就是这个问题。

---

## 1. 闭包：函数背着自己的出生环境

**定义**：闭包 = 函数 + 这个函数定义时能看到的那些变量。函数在哪被调用无所谓，它只认自己**写在哪**。

先证明"只认写在哪"：

```js
const name = "outer";

function show() {
  console.log(name);
}

function run() {
  const name = "inner";
  show();
}

run(); // → "outer"
```

如果 JS 是"谁调用就用谁的变量"（动态作用域），这里会打印 `inner`。实际打印 `outer` —— 因为 `show` 定义在全局，它只看全局的 `name`。这叫**词法作用域**。

再回到计数器：`next` 定义在 `makeCounter` 内部，所以它能访问 `count`。即使 `makeCounter` 已经返回，只要 `next` 还活着，`count` 就被引用着，垃圾回收动不了它。

一句话：**闭包不是一个高级技巧，而是"函数记住了它的出生环境"这个事实的副产品。**

### 反过来看：不用闭包会怎样

```js
let count = 0; // 全局变量

function next() {
  count += 1;
  return count;
}

next(); // → 1
```

功能一样，但 `count` 暴露在全局：任何代码都能 `count = 100`，也能不小心重名覆盖。闭包的第一个实际用途就是**把状态藏起来**。

---

## 2. 每个实例一份状态

关键点：**每调用一次外层函数，就创建一个新的环境**，不是共享一份。

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();

a(); // → 1
a(); // → 2
b(); // → 1   ← b 是另一份 count
```

所以在模块顶层写 `let count = 0` 再导出读写函数，**不是**每个实例独立 —— 所有使用者共享同一份。这是写 store 时最常见的错。

### 内存：闭包会不会泄漏

闭包保住的变量会一直占内存，直到这个函数没人引用。这是特性，不是 bug：

```js
let cache = makeBigCache();
// 用完之后
cache = null; // → 没有任何引用了，整体可以被回收
```

真正会泄漏的情况是：定时器、事件监听、全局数组里一直存着闭包，而你以为它已经不用了。

---

## 3. 三种"私有"的差别

| 写法 | 外部能否访问 | 方法存几份 | 用途 |
|------|--------------|------------|------|
| `this._count` | 能（只是约定） | 每个实例一份 | 别用，纯靠自觉 |
| 闭包里的 `let count` | 不能 | 每个实例一份函数 | 函数式风格、模块 |
| class 的 `#count` | 不能（语法层面） | 原型上一份 | 类风格、省内存 |

```js
// 假私有：下划线只是命名约定
class A {
  constructor() { this._count = 0; }
}
const a = new A();
a._count = 100; // → 改掉了，没人拦你
```

```js
// 真私有：外部根本没有入口
class B {
  #count = 0;
  inc() { return ++this.#count; }
}
const b = new B();
b.inc();      // → 1
b.#count;     // → SyntaxError: Private field '#count' must be declared in an enclosing class
```

闭包方案和 `#` 方案的取舍：闭包每个实例都会新建一套方法（内存 ×N），`#` 的方法在原型上共享（内存 1 份）。状态多、实例多时优先 `#`。

---

## 4. 模块模式：用闭包造一个"只有我能改"的对象

模块模式 = 用函数作用域当容器：里面放私有状态，只 `return` 你想公开的方法。

```js
function createCache() {
  const store = new Map(); // 私有
  let hits = 0;            // 私有

  return {
    get(key) {
      if (store.has(key)) { hits += 1; return store.get(key); }
      return undefined;
    },
    set(key, value) { store.set(key, value); },
    stats() { return { size: store.size, hits }; },
  };
}

const cache = createCache();
cache.set("a", 1);
cache.get("a");      // → 1
cache.get("b");      // → undefined
cache.stats();       // → { size: 1, hits: 1 }
cache.store;         // → undefined  ← 拿不到内部 Map
```

`cache.store` 是 `undefined`，说明外部**没有任何引用**能直接改内部 Map。想改只能走 `set`。这就是封装。

> 这也是 ES Module 之前的做法。现在的 `export` / `import` 自带模块作用域，所以 IIFE 用得少了，但"用闭包藏状态"的思路没变 —— 你今天的 `createStore` 就是这个模式。

---

## 5. 柯里化：把多参数函数拆成一次一个

**动机**：参数可以分多次给，于是能先固定一部分，得到可复用的专用函数。

```js
// 需求：写日志时要固定级别
function log(level, message) {
  console.log(`[${level}] ${message}`);
}

const info = (message) => log("INFO", message);
info("服务启动"); // → [INFO] 服务启动
```

上面是手动固定。柯里化让这件事自动化：

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

const add3 = curry((a, b, c) => a + b + c);
add3(1)(2)(3); // → 6
add3(1, 2)(3); // → 6
add3(1)(2, 3); // → 6
add3(1, 2, 3); // → 6
```

为什么能判断"参数够了"？因为 `fn.length` 是形参个数。**这里有个坑**：

```js
function f(a, b = 1, c) {}
f.length; // → 1
```

默认参数之后的形参**不计入 `length`**。所以 `curry(f)(1)` 会以为参数够了，立刻执行，结果 `c` 是 `undefined`。生产代码里要处理这种函数，就得改用"显式指定参数个数"或"以最后一次调用没有新参数为结束"的写法。

---

## 6. 管道：把函数串成流水线

**动机**：多个小函数串起来处理数据时，嵌套写法从里往外读，反人类：

```js
const result = round(toFixed(parse(multiply(input, 100)))); // 从右往左读
```

`pipe` 让它变成从左往右读：

```js
function pipe(...fns) {
  return (...args) => {
    if (fns.length === 0) return args[0];
    return fns.reduce((acc, fn, i) => (i === 0 ? fn(...args) : fn(acc)), undefined);
  };
}

const clean = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const dash = (s) => s.replace(/\s+/g, "-");

pipe(clean, lower, dash)("  Hello World  "); // → "hello-world"
```

`compose` 就是反方向，实现上把数组 `reverse` 一下即可：

```js
const compose = (...fns) => pipe(...fns.slice().reverse());
compose(dash, lower, clean)("  Hello World  "); // → "hello-world"
```

为什么要处理 0 个函数？因为 `pipe()` 返回的函数被调用时应该原样返回输入，而不是 `undefined`。这种边界不写，测试就会挂。

---

## 7. 速查表

- 闭包 = 函数 + 定义时的词法环境；只认写在哪，不认谁调用
- 每调一次外层函数 = 一份新环境；实例状态天然隔离
- 私有状态三种做法：`_x`（假）< 闭包（每个实例一份函数）< `#x`（语法私有 + 原型共享）
- 模块模式：函数作用域当容器，只 return 公开方法
- 柯里化靠 `fn.length` 判断参数够不够；默认参数会破坏 `fn.length`
- `pipe` 左→右，`compose` 右→左；都要处理 0 个函数

---

## 8. 常见坑（错误 ↔ 正确）

**① 在模块顶层存状态，以为每个实例独立**

```js
// 错
let state = {};
export const get = () => state;
export const set = (p) => { state = { ...state, ...p }; };
```

```js
// 对：把状态放进工厂函数
export function createStore(initial = {}) {
  let state = { ...initial };
  return { get: () => ({ ...state }), set: (p) => { state = { ...state, ...p }; } };
}
```

**② `get()` 直接返回内部对象，外部一改就穿透**

```js
// 错
get: () => state;
// 对
get: () => ({ ...state });
```

**③ 取消订阅时生成了新数组，却没更新内部引用**

```js
// 错
let listeners = [];
const unsubscribe = (fn) => { listeners = listeners.filter((f) => f !== fn); };
// 若把 unsubscribe 存进一个旧闭包，它捕获的是旧数组
```

```js
// 对：用 Set 或对象包一层
const listeners = new Set();
return () => listeners.delete(fn);
```

**④ 用 `fn.length` 判断参数，遇到默认参数就提前执行**

见第 5 节。至少要意识到这个边界。

---

## 9. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:50 | 第 0–2 节，手敲一遍词法作用域例子 | notes.md 记录"打印 outer 的原因" |
| 0:50–1:30 | 第 3–4 节 + 实现 `makeCounter`、`createStore` | 测试 1–5 绿 |
| 1:30–2:20 | 第 5 节 + 实现 `curry` | 测试 6–8 绿 |
| 2:20–3:10 | 第 6 节 + 实现 `pipe`、`compose` | 测试 9–11 绿 |
| 3:10–3:40 | 第 7–8 节复习，口述每个坑 | notes.md |
| 3:40–4:00 | commit | hash |

---

## 10. 程序框架

```js
export function makeCounter(start = 0)      // 返回 { inc, dec, value, reset }，状态私有
export function createStore(initial = {})   // 返回 { get, set, subscribe }，状态私有
export function curry(fn)                   // 支持 f(a)(b)(c) 和 f(a,b)(c)
export function pipe(...fns)                // 从左到右组合，第一个函数可接收多参数
export function compose(...fns)             // 从右到左组合
```

`createStore` 契约：

- `get()` 返回当前状态的**浅拷贝**
- `set(patch)` 浅合并；值没有变化时**不通知**订阅者
- `subscribe(fn)` 返回取消订阅函数

---

## 11. 验收线

11 条测试全绿，且能不查资料回答：

1. 为什么 `run()` 里的 `show()` 打印的是 outer？
2. 两个 `createStore()` 实例为什么不会共享状态？
3. `#x` 和闭包藏状态，哪个更省内存，为什么？
4. `curry` 遇到带默认参数的函数会出什么问题？
