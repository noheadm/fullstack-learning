# Day 3 · 函数、this、闭包（2h）

> **2026-11-17 拆分**：这一项原来是"this + 防抖节流 + 深拷贝"打包，难度跨了两档。现已拆成两个内容项：
>
> - **1-3a**：`debounce` / `throttle` / `once` / `memoize`（6 条断言，`npm run day3a`）
> - **1-3b**：`deepClone` 分步实现（6 条断言，`npm run day3b`）
>
> 先过 1-3a，再做 1-3b。下面的讲解两段都覆盖，按顺序读。

> 目标：说清 `this` 到底指向谁、写出带 `cancel` 的 `debounce`、能处理循环引用的 `deepClone`。
> 代码：`exercises/day03/`，测试：`npm run day3a` / `npm run day3b`

---

## 0. 先看一个必踩的坑

```js
const user = {
  name: "a",
  hi() { return `hi ${this.name}`; },
};

user.hi();      // → "hi a"
const f = user.hi;
f();            // → TypeError: Cannot read properties of undefined (reading 'name')
```

同一个函数，`user.hi()` 能用，`f()` 就崩。区别不是函数，而是**调用方式**。`this` 不由定义位置决定，而由调用时的形式决定 —— 这是今天的主线。

---

## 1. 三种函数写法

```js
// ① 函数声明：整体提升，可以在定义前调用
sayHi(); // → "hi"
function sayHi() { return "hi"; }

// ② 函数表达式：赋值不提升
sayBye(); // → ReferenceError
const sayBye = function () { return "bye"; };

// ③ 箭头函数：没有自己的 this / arguments / prototype，不能 new
const add = (a, b) => a + b;
```

箭头函数是唯一"不参与 this 规则"的写法。它的 `this` 在定义时就固定成外层作用域的值，谁也改不了：

```js
const obj = {
  name: "a",
  hi: () => this.name, // 这里的 this 是模块顶层（undefined），不是 obj
};
obj.hi(); // → TypeError（模块里顶层 this 是 undefined）
```

**判断标准**：需要动态 `this`（方法、事件回调里要用调用者的上下文）→ 普通函数；不需要 → 箭头函数。

---

## 2. 参数机制

```js
function f(a, b = a * 2) {
  return [a, b];
}

f(3);        // → [3, 6]     默认值可以引用前面的参数
f(3, null);  // → [3, null]  默认值只在 undefined 时生效
f(3, 0);     // → [3, 0]
```

`rest` 收集成**真数组**，`arguments` 是类数组：

```js
function rest(...args) { return Array.isArray(args); }
rest(1, 2, 3); // → true

function args() { return Array.isArray(arguments); }
args(1, 2, 3); // → false   arguments 没有数组方法
```

`fn.length` 是形参个数，但**默认参数之后的不算**：

```js
function a(x, y) {}
function b(x, y = 1) {}
function c(x, y = 1, z) {}
a.length; // → 2
b.length; // → 1
c.length; // → 1
```

这个特性直接决定了 Day 6 柯里化能走多远，先记住。

---

## 3. `this` 的五条规则

按优先级从高到低：

**① `new` 绑定**

```js
function Person(name) { this.name = name; }
const p = new Person("a");
p.name; // → "a"
```

**② 显式绑定（call / apply / bind）**

```js
function who() { return this.name; }
who.call({ name: "call" });   // → "call"
who.apply({ name: "apply" }); // → "apply"
const bound = who.bind({ name: "bind" });
bound();                      // → "bind"
```

`call` / `apply` 只影响这一次调用（区别是参数形式），`bind` 返回新函数、永久绑定：

```js
bound.call({ name: "other" }); // → "bind"   bind 之后 call 无效
```

**③ 隐式绑定（obj.method()）**

```js
const o = { name: "o", who() { return this.name; } };
o.who(); // → "o"
```

只有"点号调用"这一刻才算。一旦把函数取出来单独调用，就丢了：

```js
const w = o.who;
w(); // → TypeError / undefined（严格模式）
```

**④ 默认绑定**

```js
function f() { return this; }
f(); // 严格模式 → undefined；非严格 → 全局对象
```

ESM 默认是严格模式，所以你看到的几乎永远是 `undefined`。

**⑤ 箭头函数：跳过以上全部**

```js
const arrow = () => this;
arrow.call({ name: "x" }); // → 仍然是外层 this，call 无效
```

---

## 4. 闭包：`this` 之外的"记忆"

```js
function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
add5(3); // → 8
```

`add5` 记得 `x` 是 5，因为箭头函数捕获了 `makeAdder` 的词法环境。`debounce` / `throttle` 能各自独立计时，靠的就是这个：每调一次工厂，就新建一份 `timer`。

（完整机制在 Day 6 展开，今天只需要能用。）

---

## 5. 防抖与节流的区别

用"搜索框输入"和"页面滚动"两个场景理解：

|               | 触发时机                      | 典型场景              | 结果                       |
| ------------- | ----------------------------- | --------------------- | -------------------------- |
| 防抖 debounce | 停止触发 `delay` 后才执行一次 | 搜索输入、窗口 resize | 连续 10 次输入只查 1 次    |
| 节流 throttle | 每 `interval` 最多执行一次    | 滚动监听、拖拽        | 连续滚动每 100ms 更新 1 次 |

手动模拟一下（可直接运行）：

```js
const calls = [];
const d = debounce((v) => calls.push(v), 50);
d(1); d(2); d(3);
// 立刻看：calls 是 []
// 60ms 后：calls 是 [3]
```

要点：`debounce` 每次调用都要 `clearTimeout` 再重设；`throttle` 首次立即执行，间隔内的调用合并成末尾一次（否则最后一次操作会被吞掉）。

`cancel` 为什么必要？组件卸载或被新请求取代时，必须能取消，否则会更新已经销毁的状态。

---

## 6. 深拷贝：为什么不能 JSON 一把梭

```js
const o = {
  date: new Date(0),
  map: new Map([["k", 1]]),
  u: undefined,
  fn() {},
};
JSON.parse(JSON.stringify(o));
// → { date: "1970-01-01T00:00:00.000Z", map: {} }
```

四个问题：`Date` 变字符串、`Map`/`Set` 变 `{}`、`undefined` 和函数直接丢、遇到循环引用抛 `TypeError`。

正确做法是用 `WeakMap` 记录"已经拷过的原对象"，关键是**先登记，再递归**：

```js
function clone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value); // 遇到环，直接返回已建的副本

  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy); // 必须先登记，再往里填

  for (const key of Object.keys(value)) {
    copy[key] = clone(value[key], seen);
  }
  return copy;
}
```

上面这段只处理普通对象和数组。Day 3 的测试还要求 `Date` / `RegExp` / `Map` / `Set`，你要在自己的实现里加分支 —— 顺序同样重要：先判 `instanceof`，再走通用对象分支。

---

## 7. 速查表

- `this` 优先级：`new` > `bind` > `obj.method()` > 默认；箭头函数全跳过
- `call` / `apply` 一次性，`bind` 永久；`bind` 后 `new` 仍能覆盖
- 默认参数只在 `undefined` 时生效；不计入 `fn.length`
- `rest` 是真数组，`arguments` 是类数组
- 防抖 = 停止后执行；节流 = 限频执行（首次立刻 + 末尾补）
- `JSON` 深拷贝丢类型、丢 `undefined`、遇环报错
- 深拷贝用 `WeakMap` 记录已拷贝对象，且**先登记再递归**

---

## 8. 常见坑（错误 ↔ 正确）

**① 用箭头函数写需要动态 this 的方法**

```js
// 错
const obj = { n: 1, get() { return (() => this.n)(); } }; // 这里其实没问题
const o = { n: 1, get: () => this.n }; // 错：this 是外层
// 对
const o2 = { n: 1, get() { return this.n; } };
```

**② debounce 里忘了 `clearTimeout`**

每次调用都新建定时器 → 等于没防抖。

**③ throttle 只写 leading**

最后一次调用被丢弃，用户最后一步操作不生效。要么加 trailing，要么明确接受这个语义（并在文档里写清）。

**④ 深拷贝先递归再登记**

```js
seen.set(value, copy); // 必须放在遍历子属性之前
```

放反了，循环引用仍然会无限递归。

**⑤ 只处理对象，忘了 `Date`**

```js
deepClone(new Date()); // 若走通用分支 → {}，时间信息全丢
```

---

## 9. 时间表（2h）

| 时间      | 内容                                  | 产出        |
| --------- | ------------------------------------- | ----------- |
| 0:00–0:30 | 第 1–4 节，五条 this 规则各写一个例子 | notes.md    |
| 0:30–1:00 | `debounce` + `throttle`               | 测试 1–4 绿 |
| 1:00–1:40 | `deepClone`                           | 测试 5–7 绿 |
| 1:40–1:50 | `once` + `memoize`                    | 测试 8–9 绿 |
| 1:50–2:00 | commit                                | hash        |

---

## 10. 程序框架 & 验收线

```js
export function debounce(fn, delay = 300)     // 返回函数带 .cancel()
export function throttle(fn, interval = 300)  // leading + trailing
export function deepClone(value)              // 循环引用 / Date / RegExp / Map / Set / 数组
export function once(fn)
export function memoize(fn)
```

9 条测试全绿，且能回答：

1. `user.hi` 取出来单独调用为什么崩？`this` 变成了什么？
2. `bind` 之后用 `call` 还能改 `this` 吗？用 `new` 呢？
3. 防抖和节流分别在什么场景用？各举一个真实例子。
4. `JSON.parse(JSON.stringify(o))` 有哪些类型会被破坏？
5. 深拷贝里 `seen.set` 为什么必须放在递归之前？

---

## 11. 4h 版的额外 2h

1. **手写 `bind2`（45 min）**：实现 `bind2(fn, ctx, ...preset)`，要求支持后续传参，并处理和原生 `bind` 的差异（`new` 场景可以先跳过）。
2. **`partial`（30 min）**：实现 `partial(fn, ...preset)`，说明它和柯里化的区别。
3. **量化对比（30 min）**：用 `performance.now()` 和计数器，测出连续 10 次调用下 debounce / throttle 各执行了几次，把数字写进 notes.md。
4. **补 deepClone（15 min）**：加上 Symbol 键和不可枚举属性的处理，并补两条自测。
