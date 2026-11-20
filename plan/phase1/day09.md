# Day 9 · async/await 与异步控制（4h）

> 目标：写出 `sleep` / `withTimeout` / `retry` / `mapLimit`，并能一眼认出串行陷阱。
> 代码：`exercises/day09/`，测试：`npm run day9`

---

## 0. 先看一段"看起来没问题"的代码

```js
const t = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

console.time("serial");
await t(50, 1);
await t(50, 2);
console.timeEnd("serial"); // → serial: ~100ms
```

两个任务互不依赖，却花了 100ms。这就是串行陷阱：`await` 一次只等一件事。改一行就减半：

```js
console.time("parallel");
const [a, b] = await Promise.all([t(50, 1), t(50, 2)]);
console.timeEnd("parallel"); // → parallel: ~50ms
```

今天要把"什么时候会自动串行"认干净。

---

## 1. `async` 函数就是"返回 Promise 的函数"

```js
async function f() {
  return 1;
}
f() instanceof Promise; // → true
f().then((v) => v);     // → 1
```

`throw` 等价于返回 rejected：

```js
async function g() {
  throw new Error("boom");
}
g().catch((e) => e.message); // → "boom"
```

也就是说：**`async` 只做两件事** —— 把返回值包成 Promise、把异常包成 rejection。它本身不制造异步。

---

## 2. `await` 做了什么

```js
async function main() {
  console.log("A");
  await null;      // 即使是 null 也会让出
  console.log("B");
}
main();
console.log("C");
// → A
// → C
// → B
```

执行过程：

1. 跑到 `await`，暂停 `main`，把后面的代码登记成微任务
2. 控制权交回调用者，继续执行 `C`
3. 当前同步代码跑完，清空微任务队列，`B` 才打印

所以 `await` 不阻塞线程，只暂停**这个函数**。`await null` 也会让出一次，因为规范要求 `await` 后面统一包一层 `Promise.resolve`。

---

## 3. 什么时候并行，什么时候串行

**必须串行**：后一步依赖前一步的结果。

```js
const user = await getUser(1);
const orders = await getOrders(user.id); // 依赖 user.id
```

**可以并行**：互不依赖。

```js
// 串行，慢
const user = await getUser(1);
const config = await getConfig();

// 并行，快
const [user, config] = await Promise.all([getUser(1), getConfig()]);
```

判断方法很简单：**看第二个 await 有没有用到第一个的返回值。** 没有就并行。

---

## 4. 循环里的 `await` 一定是串行

```js
// 串行：N 个请求依次发
for (const id of ids) {
  results.push(await fetchItem(id));
}

// 并行：全部同时发
const results = await Promise.all(ids.map((id) => fetchItem(id)));
```

第二种写法注意 `map` 的回调要返回 Promise —— 不要写成 `ids.map(async (id) => ...)` 然后忘记 `await Promise.all(...)`，那样拿到的是 Promise 数组，不是结果数组。

还有一种情况两个都不能用：请求太多（比如 500 个）全部并发会把连接打满。这时要并发控制（第 8 节）。

---

## 5. 错误处理的两个细节

```js
try {
  const data = await load();
} catch (e) {
  console.error(e);
}
```

`try/catch` 只能捕获 `await` 到的拒绝。以下写法捕获不到：

```js
// 错：没有 await，catch 捕不到
try {
  return load();
} catch (e) {
  return "handled";
}
```

所以 `return await` 不是废话：

```js
async function f() {
  try {
    return await load(); // 有 await，拒绝会被下面的 catch 接住
  } catch (e) {
    return "handled";
  }
}
```

另一个细节：`catch` 里 `return` 会让后续 `then` 走成功分支，别把错误吞掉却不记录。

---

## 6. 超时：`race` + `finally` 清理

```js
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
```

为什么必须 `clearTimeout`：请求赢了之后定时器还在跑，Node 进程会被它拖住不退出；浏览器里则是白白多一次回调。

`finally` 在这里正好合适：无论成功、失败、超时都会执行清理。

### 真取消：`AbortController`

```js
// 示意（需要真实 URL 才能跑）
const controller = new AbortController();
fetch("/api/slow", { signal: controller.signal });
controller.abort(); // → fetch 以 AbortError 拒绝
```

超时只是"我不等了"，请求本身还在跑并占用资源；`AbortController` 才是真取消。生产代码两者要一起用。

---

## 7. 重试：只重试该重试的

```js
async function retry(fn, { times = 3, base = 50 } = {}) {
  let lastError;
  for (let i = 0; i < times; i += 1) {
    try {
      return await fn(i);
    } catch (e) {
      lastError = e;
      if (i === times - 1) break;
      await sleep(base * 2 ** i); // 指数退避：50, 100, 200…
    }
  }
  throw lastError; // 关键：抛最后一次的真实错误
}
```

两个原则：

1. **4xx 不重试**（参数错了，重试一百次也一样），只重试网络错误和 5xx。
2. **退避**，不要立刻连环重试，否则等于打自己的服务。

---

## 8. 并发控制：固定数量的 worker

需求：100 个请求，同时最多 3 个。

错误做法是按批切片：`[0..3]` 跑完再跑 `[4..7]`，每批都要等最慢的那个，实际并发只有 3 但批次之间空转。

正确做法是共享一个游标，谁空了谁去取下一条：

```
worker1: 取 0 → 跑 → 取 3 → 跑 → 取 6 …
worker2: 取 1 → 跑 → 取 4 → 跑 …
worker3: 取 2 → 跑 → 取 5 → …
```

**`Array.from({ length: n }, fn)`**：生成一个长度 n 的数组，`fn(元素, 下标)` 的返回值作为每一项。

```js
Array.from({ length: 3 }, (_, i) => i * 10);   // [0, 10, 20]
```

用它起 n 个 worker：

```js
let next = 0;

async function worker() {
  while (true) {
    const index = next++;
    if (index >= items.length) return;
    results[index] = await fn(items[index], index); // 按索引写，结果自动保序
  }
}
await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
```

两个细节：用 `results[index] =` 而不是 `push`（否则结果按完成顺序排），`limit` 要兜住 `<= 0` 的情况。

---

## 9. 速查表

- `async` 只做两件事：包 Promise、包 rejection
- `await` 让出一次微任务，不阻塞线程
- 判断并行：第二个 await 是否用到第一个的返回值
- `for` 里 await 是串行；`map` 后要 `Promise.all`
- `return await` 只在 `try/catch` / `finally` 里有意义
- 超时用 `race` + `finally` 清定时器；真取消用 `AbortController`
- 重试要区分错误类型、要退避、要抛最后一次的真实错误
- 并发控制用共享游标，不要分批

---

## 10. 常见坑（错误 ↔ 正确）

**① 忘记 `Promise.all`**

```js
const results = ids.map(async (id) => fetchItem(id)); // Promise 数组
const results2 = await Promise.all(ids.map((id) => fetchItem(id))); // 结果数组
```

**② 循环里串行**

见第 4 节。

**③ 超时不清理定时器**

见第 6 节。测试跑完进程不退出，就是这个原因。

**④ 重试吞掉最后的错误**

```js
catch (e) { /* 什么都不做 */ } // 最后抛出 undefined，排查无从下手
```

**⑤ `mapLimit` 用 `push`**

结果顺序变成"谁先完成谁在前"，和输入对不上。

**⑥ 在 `catch` 里不 `throw` 也不记录**

错误被静默吞掉，线上表现为"接口没反应"。

---

## 11. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:50 | 第 1–4 节，写 3 个顺序判断题 | notes.md |
| 0:50–1:30 | `sleep` + `withTimeout` | 测试 1–4 绿 |
| 1:30–2:30 | `retry` | 测试 5–7 绿 |
| 2:30–3:30 | `mapLimit` | 测试 8–9 绿 |
| 3:30–3:50 | 第 5–8 节复述 | notes.md |
| 3:50–4:00 | commit | hash |

---

## 12. 程序框架 & 验收线

```js
export function sleep(ms)
export function withTimeout(promise, ms, message = "timeout")
export async function retry(fn, { times = 3, delay = 10 })
export async function mapLimit(items, limit, fn)
```

9 条测试全绿，且能回答：

1. `await null` 为什么也会让出？
2. 两个独立请求写成两个 `await` 会多花多少时间？
3. `return await` 什么时候不能省？
4. `withTimeout` 为什么必须清定时器？
5. 分批 + `Promise.all` 和共享游标，差在哪？

---

---

## 13. 真实项目里用在哪

**加载 / 失败 / 成功三态**（每个联网页面都要写）

```js
setLoading(true);
try {
  const data = await api.getUsers();
  setUsers(data);
} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}
```

**并发控制 → 批量上传**

```js
// 100 张图，同时最多传 3 张，避免把浏览器连接数打满
await mapLimit(files, 3, uploadOne);
```

**重试 → 网络抖动**

```js
const data = await retry(() => api.getUsers(), { times: 3 });
```

**超时 + 取消 → 用户切换页面别再等**

```js
await withTimeout(api.getUsers(), 5000);
```

**没有它会怎样**：页面上只能显示"白屏"或"报错"，没有中间态；批量请求把接口打挂；一次网络抖动就要用户手动刷新。
