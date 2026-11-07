# 0-1 · 环境与第一行代码（2h）

> 目标：能运行一个 `.js` 文件、能看懂报错、会用变量存东西。
> 代码：`exercises/phase0/day01/`，测试：`npm run p0d1`

---

## 1. 程序是什么

一句话：**把数据存起来 → 处理 → 输出结果**。

```js
const price = 10;        // 存
const total = price * 3; // 处理
console.log(total);      // 输出 → 30
```

今天要学的三件事，就是这三行。

---

## 2. 先确认你能运行代码

打开终端（macOS 是"终端"App），输入：

```bash
node -v
```

如果显示类似 `v24.12.0`，说明装好了。如果提示 `command not found`，先去 https://nodejs.org 下载 LTS 版本安装，装完关掉终端重开再测。

有版本号之后，试这一行：

```bash
node -e 'console.log("你好")'
```

终端会打印 `你好`。`-e` 的意思是"直接执行引号里的代码"。

---

## 3. 第一个文件

新建一个文件 `hello.js`，内容只有一行：

```js
console.log("你好");
```

在终端里进入文件所在目录，运行：

```bash
node hello.js
```

输出：

```
你好
```

`console.log(...)` 的意思是"把括号里的东西打印到终端"。它是你后面调试最主要的工具，会一直用到最后一天。

---

## 4. 注释：写给人看，机器会跳过

```js
// 单行注释，斜杠后面到行尾都不执行
console.log("这行会打印"); // 行尾也可以写注释

/*
  多行注释
  写多少行都不执行
*/
console.log("但这一行会打印");
```

注释的用途是解释"为什么这么写"，不是复述代码。

---

## 5. 变量：给数据起名字

```js
const name = "小明";
let age = 18;

console.log(name); // → 小明
console.log(age);  // → 18
```

两条规则先记住，其他今天不管：

1. **`const` 用在不打算变的值上**（名字、单价、配置），默认用它。
2. **`let` 用在后面要改的值上**（计数器、累加结果）。

```js
let count = 0;
count = count + 1;
console.log(count); // → 1
```

```js
const name = "小明";
name = "小红"; // → TypeError: Assignment to constant variable.
```

`=` 不是"等于"，是"把右边的值放进左边"。真正的"等于"是比较，0-3 会讲。

### 三种基本的值

```js
const a = 42;        // 数字 number，不带引号
const b = "42";      // 字符串 string，带引号
const c = true;      // 布尔 boolean
console.log(a === b); // → false  一个是数字，一个是文字
```

看到一个值，先问：有引号吗？有就是字符串。

---

## 6. 拼接字符串

```js
const name = "小明";
const age = 18;

console.log(name + " 今年 " + age + " 岁");
// → 小明 今年 18 岁
```

`+` 遇到字符串就是"接起来"，不是在算数学。数字和字符串混着加，结果一定是字符串：

```js
console.log("1" + 2); // → "12"
console.log(1 + 2);   // → 3
```

这个坑 0-2 会专门练。

---

## 7. 报错怎么读

报错不是"你完了"，是"第几行出了什么事"。三段一定看：

```js
console.log(userName); // ReferenceError: userName is not defined
```

```
ReferenceError: userName is not defined
    at Object.<anonymous> (/路径/hello.js:1:13)
```

- **第一行**：错误类型 + 原因。`ReferenceError` = 用了一个不存在的名字（通常是拼错或忘了声明）。
- **`at` 那行**：文件路径 + `行号:列号`。直奔那一行。
- 其他堆栈对你现在没用，先忽略。

最常见的三个：

| 报错 | 意思 | 怎么修 |
|------|------|--------|
| `ReferenceError: x is not defined` | 名字不存在 | 检查拼写、检查有没有 `const`/`let` |
| `SyntaxError: Unexpected token` | 少括号、少引号、中文标点 | 看报错行附近 |
| `TypeError: Assignment to constant variable` | 给 `const` 重新赋值 | 改成 `let` |

**90% 的初学者报错是中文标点**：`；` `“”` `（` 这些在代码里一律不合法，必须是英文半角。

---

## 8. 你现在要做的事

打开 `exercises/phase0/day01/day01.js`，把三个 `TODO` 填掉：

1. `myName`：你的名字（字符串）
2. `myAge`：你的年龄（数字，不要加引号）
3. `introduce()`：返回一句 `"名字 今年 N 岁"`，用 `+` 拼接

然后跑：

```bash
npm run p0d1
```

6 条全绿就算过。

---

## 9. 常见坑

**① 数字加了引号**

```js
const age = "18";  // 这是字符串
const age2 = 18;   // 这才是数字
```

**② 用了中文引号**

```js
const a = “你好”; // SyntaxError
const a2 = "你好"; // 对
```

**③ 变量没声明直接用**

```js
count = 1;         // 不报错但这是全局污染，别这么写
const count2 = 1;  // 对
```

**④ 文件名写错**

`node hello.js` 中 `hello.js` 必须和真实文件名完全一致，且终端要在同一目录下。用 `ls` 看当前目录有什么文件。

**⑤ 改完文件忘了保存**

编辑器里没保存的文件，运行的是旧内容。看到"改了没生效"，第一件事是 Ctrl/Cmd + S。

---

## 10. 验收线

- `npm run p0d1` 6 条全绿
- 能不看资料写出：声明一个常量、声明一个可变量并修改、打印拼接字符串
- 遇到 `ReferenceError` 能说出先看哪里
