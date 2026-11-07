# 0-2 · 数字、字符串、模板字符串（2h）

> 目标：会做基本运算、会拼接和格式化字符串。
> 代码：`exercises/phase0/day02/`，测试：`npm run p0d2`

---

## 1. 数字与四则运算

```js
console.log(2 + 3);   // → 5
console.log(10 - 4);  // → 6
console.log(3 * 4);   // → 12
console.log(10 / 4);  // → 2.5    除法会得到小数
console.log(10 % 3);  // → 1      余数（取模）
console.log(2 ** 10); // → 1024   乘方
```

`%` 读作"取余"，用途是判断"能不能整除"：

```js
console.log(10 % 2); // → 0   能被 2 整除
console.log(10 % 3); // → 1   不能
```

---

## 2. 运算顺序与括号

```js
console.log(2 + 3 * 4);      // → 14   先乘除后加减
console.log((2 + 3) * 4);    // → 20   括号优先
```

不确定就加括号。括号不花钱，读错顺序要花半小时。

---

## 3. 两个"奇怪"的数字

```js
console.log(1 / 0);    // → Infinity
console.log(0 / 0);    // → NaN   （Not a Number）
console.log(10 / 3);   // → 3.3333333333333335
```

小数计算会出现"看起来不对"的结果，这是计算机存小数的固有问题：

```js
console.log(0.1 + 0.2);        // → 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // → false
```

现在只需要知道"不要用 `===` 直接比较小数"，处理方式后面讲。

---

## 4. 字符串的三种写法

```js
const a = "双引号";
const b = '单引号';
const c = `反引号（模板字符串）`;
```

三种都能用。区别：反引号可以用 `${}` 插值，还能换行。

```js
const name = "小明";
const age = 18;

// 拼接
console.log(name + " 今年 " + age + " 岁");

// 模板字符串：同样结果，但更清楚
console.log(`${name} 今年 ${age} 岁`);
```

**以后默认用模板字符串。** 拼接多了很容易漏空格、漏加号。

双引号里想放双引号要转义：

```js
console.log("他说：\"你好\""); // → 他说："你好"
console.log('他说："你好"');   // 外层用单引号就不用转义
```

---

## 5. 字符串也是"有长度、能取字符"的

```js
const s = "JavaScript";
console.log(s.length);      // → 10
console.log(s[0]);          // → "J"
console.log(s[4]);          // → "S"
console.log(s[100]);        // → undefined
```

索引从 **0** 开始，不是 1。

---

## 6. 常用字符串方法

```js
const s = "  Hello World  ";

s.trim();            // → "Hello World"    去掉首尾空格
s.toUpperCase();     // → "  HELLO WORLD  " 转大写
s.toLowerCase();     // → "  hello world  " 转小写
s.includes("World"); // → true              包含吗
s.slice(2, 7);       // → "Hello"           截取 [2, 7)，不含 7
s.split(" ");        // → ["", "", "Hello", "World", "", ""]
```

方法都是"返回值"，不会改原字符串：

```js
const t = "abc";
t.toUpperCase();
console.log(t); // → "abc"   原字符串没变
console.log(t.toUpperCase()); // → "ABC"   要接住返回值
```

这是初学者最常见的困惑：**调了方法却没接返回值。**

---

## 7. 数字和字符串的互转

```js
const n = 12.5;

n.toFixed(2);      // → "12.50"   四舍五入到 2 位，返回字符串
String(n);         // → "12.5"
n.toString();      // → "12.5"

Number("12.5");    // → 12.5     字符串转数字
Number("abc");     // → NaN      转不了
parseInt("12px");  // → 12       能读多少读多少
```

`toFixed` 返回的是**字符串**，因为它要保留末尾的 0（数字 `12.50` 和 `12.5` 是同一个数，存不住末尾的 0）。

---

## 8. 今天要写的东西

打开 `exercises/phase0/day02/day02.js`：

1. `area(w, h)`：返回宽 × 高
2. `greet(name)`：返回 `你好，{name}！`（用模板字符串）
3. `priceTag(yuan)`：返回 `¥12.50` 这种格式（`toFixed(2)`）
4. `shout(text)`：去掉首尾空格、转大写、末尾加 `!`

```bash
npm run p0d2
```

---

## 9. 常见坑

**① 数字和字符串相加**

```js
console.log("1" + 2);   // → "12"
console.log(Number("1") + 2); // → 3
```

**② 调了方法没接返回值**

```js
let name = " 小明 ";
name.trim();        // 没效果
name = name.trim(); // 对
```

**③ 用 `length()`**

`length` 是属性不是方法：`s.length` 对，`s.length()` 报错。

**④ 索引从 1 开始数**

`s[0]` 才是第一个字符。

**⑤ `toFixed` 之后当数字继续算**

```js
const price = (12).toFixed(2); // "12.00" 是字符串
price + 1; // → "12.001"   字符串拼接
```

---

## 10. 验收线

- `npm run p0d2` 7 条全绿
- 不看资料能写出：两个数相乘、用模板字符串输出一句话、把数字格式化成两位小数
