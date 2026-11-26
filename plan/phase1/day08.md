# Day 8 · Promise（2h）

> **2026-11-17 拆分**：原来 12 条断言全是"手写 Promise"，属于一次跨两档。现拆成：
>
> - **1-8a**：Promise 的**用法**（`all` / `any` / `allSettled` / `promisify`），8 条断言 → `npm run day8a`
> - **1-8b**：**手写** `MyPromise` 状态机，12 条断言 → `npm run day8b`
>
> 先做 1-8a。1-8b 是阶段 1 最难的一项，慢慢来。

> 目标：先会用 Promise，再理解它的状态机。
> 代码：`exercises/day08/`（`promise-usage.js` 对应 8a，`mypromise.js` 对应 8b）

---

## 0. 问题从哪来

回调写法一旦嵌套三层，就无法正常处理错误：

```js
// 示意（不可直接运行）：每层都要判 err，还要重复写
getUser(1, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handle(err);
    getItems(orders[0].id, (err, items) => {
      if (err) return handle(err);
      render(items);
    });
  });
});
```

Promise 要解决三件事：错误只写一次、能链式串联、能从"值"升级成"未来才有的值"。

---

## 1. 状态机：只有三个状态，只能迁一次

```
pending ──resolve(value)──→ fulfilled
   │
   └──reject(reason)──→ rejected
```

```js
const p = new Promise((resolve, reject) => {
  console.log("executor 同步执行");
  resolve(1);
  reject(new Error("无效")); // 被忽略，状态已经定了
  console.log("这行还会执行");
});
// → "executor 同步执行"
// → "这行还会执行"
```

两个关键事实：

1. **executor 是同步执行的**，不是"等一会儿再跑"。
2. 状态一旦确定（settled），后续 `resolve` / `reject` 全部无效。

---

## 2. `then` 到底做了什么

先明确一个词：**thenable** 指任何带有 `then` 方法的对象（Promise 本身就是 thenable）。下面第三条会用到这个概念。

`then` 有三条规则，缺一条实现就不对：

**① 返回一个新的 Promise**

```js
const a = Promise.resolve(1);
const b = a.then((v) => v);
a === b; // → false
```

**② 回调的返回值成为新 Promise 的值；回调返回 Promise 会被"吸收"**

```js
Promise.resolve(1)
  .then((v) => v + 1)          // 返回 2
  .then((v) => Promise.resolve(v * 10)) // 返回 Promise，被展开
  .then((v) => console.log(v)); // → 20
```

**③ 回调抛错 → 新 Promise 变成 rejected**

```js
Promise.resolve(1)
  .then(() => { throw new Error("boom"); })
  .then(() => console.log("不会执行"))
  .catch((e) => console.log("catch:", e.message));
// → "catch: boom"
```

还有一个容易忽略的行为叫"值穿透"：`then` 传了非函数，值原样往后传。

```js
Promise.resolve(1).then(null).then((v) => v + 1); // → 2
```

---

## 3. 为什么回调必须异步

```js
console.log("1");
Promise.resolve().then(() => console.log("3"));
console.log("2");
// → 1 2 3
```

如果 Promise 已经 fulfilled 就同步执行回调，会导致同一个函数有时同步、有时异步（业界叫 Zalgo，指"同一个函数有时同步、有时异步"导致的不确定行为）。调用方无法写出稳定顺序，bug 会间歇出现。

所以规范强制：`then` 的回调一律放到**微任务**队列。微任务在每轮宏任务结束后清空，所以顺序是：

**`queueMicrotask(fn)`**：把一个函数排进"微任务队列"，当前同步代码跑完后立刻执行。

```js
queueMicrotask(() => console.log("微任务"));
console.log("同步");

// 输出顺序：同步 → 微任务
```

顺序总结：

```
同步代码 → 微任务（Promise.then / queueMicrotask）→ 宏任务（setTimeout）
```

`await` 的本质也是微任务（Day 9 详讲）。

---

## 4. 手写实现的结构（不是答案，是骨架）

你的 `MyPromise` 需要四个部分：

```js
class MyPromise {
  #state = "pending";   // pending | fulfilled | rejected
  #value;               // 值或拒绝原因
  #handlers = [];       // pending 期间挂起的回调

  constructor(executor) {
    // 1. resolve / reject 各是一个函数，内部调用 this.#settle
    // 2. executor 同步执行，用 try/catch 包住（executor 抛错 = reject）
  }

  #settle(state, value) {
    // 3. 只有 pending 才能落定；落定后清空 handlers
    //    handlers 里的回调要通过 queueMicrotask 排队
  }

  then(onFulfilled, onRejected) {
    // 4. 返回 new MyPromise
    //    在内部：根据当前状态决定是立即排队执行，还是 push 进 handlers
    //    执行时 try/catch，成功 resolve(返回值)，失败 reject(错误)
    //    返回值是 thenable 时要递归吸收；返回自身要 reject TypeError
  }
}
```

三个必须处理的边界，写的时候逐条对照：

1. **executor 抛错** → 转成 reject，不能让异常冒出去。
2. **回调返回 thenable** → 不能直接当值，要等它落定（值吸收）。注意 thenable 可能调多次，用一个 `called` 标志防重。
3. **`then` 返回自己**（`const p = ...; p.then(() => p)`）→ 死循环，规范要求 reject 一个 `TypeError`。

`race` 的边界也记一下：空数组传入会**永远 pending**，这是规范行为，不是 bug。

---

## 5. 四个组合器，区别只用一张表

| 方法 | 何时成功 | 何时失败 | 结果 |
|------|----------|----------|------|
| `all` | 全部成功 | 任一失败（立刻） | 值数组，保序 |
| `allSettled` | 永不失败 | 永不失败 | `{status, value/reason}` 数组 |
| `race` | 第一个落定 | 第一个落定（失败也算） | 那个值 / 错误 |
| `any` | 第一个成功 | 全部失败 | 那个值 / `AggregateError` |

```js
await Promise.all([Promise.resolve(1), 2]);            // → [1, 2]
await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("x"))]);
// → [{status:"fulfilled",value:1}, {status:"rejected",reason:Error}]
await Promise.race([Promise.resolve("fast")]);          // → "fast"
await Promise.any([Promise.reject(new Error("a")), Promise.resolve("b")]); // → "b"
```

**`AggregateError`**：一种把多个错误打包进一个对象的错误类型，`Promise.any` 在全部失败时抛出它。

```js
await Promise.any([Promise.reject(new Error("a")), Promise.reject(new Error("b"))])
  .catch((e) => e.name);   // "AggregateError"
```

`all` 的"立刻失败"不代表其他任务停了 —— 其他请求还在跑，只是结果被丢弃。要真取消，需要 **`AbortController`**：它提供一个 `signal` 交给请求，调用 `controller.abort()` 会让请求以 `AbortError` 失败。

---

## 6. `promisify`：回调风格转 Promise

Node 的回调约定是 `(err, data)`：

```js
function nodeStyle(value, callback) {
  setTimeout(() => {
    if (value < 0) callback(new Error("neg"));
    else callback(null, value * 2);
  }, 5);
}
```

`promisify` 做的就是包一层：`err` 有值就 reject，否则 resolve `data`。

```js
const doubled = promisify(nodeStyle);
await doubled(2);  // → 4
await doubled(-1); // → reject(Error("neg"))
```

真实场景里 `node:util` 已经提供了：

```js
import { promisify } from "node:util";
import { readFile } from "node:fs";
const read = promisify(readFile); // 业务里直接用这个
```

---

## 7. 速查表

- 三状态：pending / fulfilled / rejected，只能迁一次
- executor 同步执行；抛错 = reject
- `then` 返回新 Promise；返回值成为新值；返回 Promise 被吸收
- `then` 回调永远在微任务里；同步执行会导致 Zalgo
- 非函数参数会值穿透
- `all` 全成才成、快速失败；`allSettled` 永不失败；`race` 先落定；`any` 先成功
- `race([])` 永远 pending
- 手写时必须用 `WeakMap` 之外的两个小工具：`called` 标志防重复、自引用检测防死循环

---

## 8. 常见坑（错误 ↔ 正确）

**① 回调同步执行**

```js
// 错：已 fulfilled 时直接调用 onFulfilled
// 对：一律 queueMicrotask / setTimeout 排到微任务
```

**② 忘记吸收 thenable**

```js
// 错
resolve(onFulfilled(value)); // 返回 Promise 时，外层拿到的是 Promise 对象
// 对
const result = onFulfilled(value);
// 如果 result 是 thenable，等它落定后再 resolve
```

**③ `all` 用 push 收集结果**

异步完成顺序不定，会导致结果乱序。必须 `out[index] = value`。

**④ executor 抛错没接住**

```js
new Promise(() => { throw new Error("x"); }); // 必须变成 rejected，而不是抛出到外面
```

**⑤ `catch` 放在链中间导致后续丢失上下文**

`catch` 之后返回的是新 Promise，原错误不会被"记住"。要保留就重新 `throw`。

**⑥ 用 `Promise.reject()` 同步抛错代替返回 rejected**

`Promise.reject` 必须返回一个 rejected 的 Promise，不是抛异常。

---

## 9. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:50 | 第 1–3 节，画状态机 + 写 3 个顺序题 | notes.md |
| 0:50–1:50 | 构造函数 + `then`（值吸收、错误捕获） | 测试 1–5 绿 |
| 1:50–2:30 | `catch` + `finally` | 测试 6–7 绿 |
| 2:30–3:20 | `resolve` / `reject` / `all` / `race` | 测试 8–11 绿 |
| 3:20–3:45 | `promisify` | 测试 12 绿 |
| 3:45–4:00 | commit | hash |

---

## 10. 程序框架 & 验收线

```js
export class MyPromise {
  constructor(executor)
  then(onFulfilled, onRejected)
  catch(onRejected)
  finally(onFinally)
  static resolve(value)
  static reject(reason)
  static all(iterable)
  static race(iterable)
}
export function promisify(fn)
```

12 条测试全绿，且能回答：

1. 三个状态怎么迁移？为什么落定后 `resolve` 无效？
2. `then` 为什么必须异步？同步会引发什么问题？
3. 回调返回 Promise 时，为什么不能直接当值用？
4. `all` 和 `allSettled` 分别在什么场景用？
5. `race([])` 会发生什么？

---

---

## 11. 真实项目里用在哪

**并行请求 → 页面首屏一次拿齐数据**

```js
const [user, orders, notices] = await Promise.all([
  getUser(), getOrders(), getNotices(),
]);   // 三个请求同时发，总耗时取最慢的那个，而不是三者相加
```

**`allSettled` → 部分失败也能展示**

```js
const results = await Promise.allSettled([getA(), getB()]);
// A 挂了不影响 B 的结果，页面上可以只把 A 的位置显示成"加载失败"
```

**`race` → 超时**

```js
await Promise.race([fetchData(), timeout(5000)]);
```

**没有 Promise 会怎样**：三层回调嵌套、每层都要写一遍 `if (err)`，错误漏一层就静默失败。
