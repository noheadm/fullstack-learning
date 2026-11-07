# Day 1 · 变量、作用域、值 vs 引用（2h）

> 目标：能准确预测 `var` / `let` / `const` 的行为，说清"复制的是值还是引用"。
> 代码：`exercises/day01/`，测试：`npm run day1`

---

## 0. 先看两个现象

```js
if (true) {
  var a = 1;
}
console.log(a); // → 1        ← 块外面还能访问
```

```js
if (true) {
  let b = 1;
}
console.log(b); // → ReferenceError: b is not defined
```

同一个块里声明的变量，`var` 漏到外面，`let` 不漏。这是今天所有规则的源头。

---

## 1. 作用域：变量的可见范围

JS 有三种作用域：

| 作用域 | 由谁创建 | 谁能声明 |
|--------|----------|----------|
| 全局 | 脚本/模块最外层 | `var` `let` `const` `function` |
| 函数 | 每调用一次函数创建一个 | 同上 |
| 块 | 任意 `{}`（if / for / while / 裸块） | `let` `const` `class` |

关键在于：**`var` 只认函数，不认块**。所以它在 `if` 里声明，也会提升到整个函数。

```js
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
  }
  console.log(a); // → 1
  console.log(b); // → ReferenceError
}
```

---

## 2. 提升：声明被搬到作用域顶部

```js
console.log(a); // → undefined   ← 不报错
var a = 1;

console.log(b); // → ReferenceError
let b = 1;
```

两者都被"提升"了，但处理方式不同：

- `var` 提升时顺便初始化为 `undefined`，所以访问不报错，只是拿到空值。
- `let` / `const` 也提升，但**不初始化**，处于"暂时性死区（TDZ）"，访问直接抛错。

TDZ 的范围是从块开始，到声明语句执行完为止：

```js
{
  // 从这里开始 tdz 变量处于 TDZ
  typeof tdz; // → ReferenceError（不是 "undefined"！）
  let tdz = 1;
  typeof tdz; // → "number"
}
```

注意最后一条：`typeof` 对**未声明**的变量返回 `"undefined"`，但对 TDZ 中的变量会抛错。这是两者的区别。

为什么要设计 TDZ？为了让"先使用后声明"直接暴露成错误，而不是悄悄拿到 `undefined`。`var` 那种行为在真实项目里制造过太多 bug。

---

## 3. const 锁的是绑定，不是内容

```js
const o = { n: 1 };
o.n = 2;       // → 允许
o = { n: 3 };  // → TypeError: Assignment to constant variable.
```

`const` 保证的是"这个变量名永远指向同一个对象"，不是"这个对象不能改"。想禁止改内容，要冻结（见 Day 4）。

另外 `const` 声明必须立刻初始化，`let` 可以只声明：

```js
let a;     // → 允许，值是 undefined
const b;   // → SyntaxError: Missing initializer in const declaration
```

---

## 4. 值类型 vs 引用类型

原始类型（string / number / boolean / null / undefined / symbol / bigint）赋值时**复制值**：

```js
let x = 1;
let y = x;
y = 2;
x; // → 1   互不影响
```

对象（含数组、函数）赋值时**复制引用**，两个变量指向同一个对象：

```js
const p = { n: 1 };
const q = p;
q.n = 2;
p.n; // → 2   同一块内存
```

想要独立副本，得显式拷贝：

```js
const copy = { ...p }; // 浅拷贝
copy.n = 3;
p.n; // → 2
```

"浅"的意思是：只复制第一层。如果属性值本身是对象，还是共享的（Day 4 详讲）。

### 参数传递

JS 只有一种传参方式：按值传递。传对象时，传的是引用的副本：

```js
function change(num, obj) {
  num = 99;        // 只改局部变量
  obj.n = 99;      // 通过引用改到了原对象
}
const n = 1;
const o = { n: 1 };
change(n, o);
n;   // → 1
o.n; // → 99
```

所以"JS 是值传递还是引用传递"的标准答案是：**按值传递，对象的值是引用**。

---

## 5. 循环 + 闭包：var 和 let 的分水岭

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
fns.map((f) => f()); // → [3, 3, 3]
```

```js
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
fns.map((f) => f()); // → [0, 1, 2]
```

原因：`var` 的 `i` 只有一个，循环结束后是 3，三个箭头函数都读同一个变量；`let` 每轮迭代创建一个新绑定，三个函数各自捕获自己那份。

这是"作用域"和"闭包"结合后的第一个实战结论，Day 6 会继续用它。

---

## 6. 速查表

- `var`：函数作用域，提升并初始化为 `undefined`，可重复声明
- `let` / `const`：块级作用域，提升但 TDZ，访问未初始化 → `ReferenceError`
- `const` 锁绑定不锁内容；必须初始化
- 函数声明整体提升；函数表达式赋值不提升
- 原始类型复制值，对象复制引用
- 传参一律按值；对象的"值"是引用
- `for (var i)` 闭包共享，`for (let i)` 每轮独立
- `typeof 未声明变量` → `"undefined"`；`typeof TDZ变量` → 抛错

---

## 7. 常见坑（错误 ↔ 正确）

**① 以为 `let` 不提升**

```js
// 错的理解：let 就是"没有提升"
// 实际：提升了，但访问在 TDZ 里，抛错
```
真正要记的是：`let` 的提升不会给你 `undefined`，只会给你一个 `ReferenceError`。

**② 以为 `const` 对象不可变**

```js
const config = { debug: true };
config.debug = false; // → 合法
Object.freeze(config); // 想真冻结要显式做，而且是浅冻结
```

**③ 用 `typeof` 判数组 / null**

```js
typeof [];    // → "object"
typeof null;  // → "object"
Array.isArray([]); // → true
x === null;        // 判 null 只能这样
```

**④ 在 for 里用 var 创建回调**

```js
// 错：所有回调拿到同一个 i
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // → 3 3 3
// 对：改成 let
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // → 0 1 2
```

**⑤ 同一作用域里 var 和 let 重名**

```js
var a = 1;
let a = 2; // → SyntaxError: Identifier 'a' has already been declared
```

---

## 8. 时间表（2h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:40 | 第 0–4 节，每个现象手敲一遍 | notes.md 记录 TDZ 和引用赋值 |
| 0:40–1:00 | `prediction.js` 先写 8 个答案，**不许运行** | 8 个预测 |
| 1:00–1:20 | 运行 `npm run day1`，订正错题 | 错题记录 |
| 1:20–1:50 | 实现 `varInLoop` / `letInLoop` | `scope.js` |
| 1:50–2:00 | commit | hash |

---

## 9. 程序框架

```js
export const answers = { q1: "TODO", ... }  // exercises/day01/prediction.js
export function varInLoop()                 // 返回 [3,3,3]
export function letInLoop()                 // 返回 [0,1,2]
```

## 10. 验收线

10 条测试全绿，且能不查资料回答：

1. `var` 和 `let` 都提升了，为什么一个访问到 `undefined`，一个抛错？
2. `const o = {}` 之后为什么 `o.a = 1` 合法？
3. 函数里改了参数对象的属性，外面为什么能看到？改了参数本身为什么看不到？
4. `for (var i)` 的三个回调为什么打印 3 3 3？

---

## 11. 4h 版的额外 2h

Day 1 的核心内容 2h 就能过完，多出来的 2h 用在这四件事上：

1. **单步看作用域（30 min）**：用 `node --inspect-brk` 或浏览器断点，在 TDZ 例子前后各停一次，记录 Scope 面板里变量的状态（`<uninitialized>` 长什么样）。
2. **自己出题（45 min）**：写 10 道作用域判读题（含 IIFE、`catch` 参数、块内函数声明），附答案，隔天自测。
3. **改造练习（30 min）**：把"全局变量计数器"改成闭包版，写一段两版对比说明（各 3 行）。
4. **整理笔记（15 min）**：把 notes.md 整理成一篇能直接发布的学习笔记。
