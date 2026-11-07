# 0-3 · 布尔、比较、if（2h）

> 目标：会写"如果……就……"，会组合条件。
> 代码：`exercises/phase0/day03/`，测试：`npm run p0d3`

---

## 1. 布尔值从比较里来

```js
console.log(3 > 2);    // → true
console.log(3 < 2);    // → false
console.log(3 === 3);  // → true
console.log(3 !== 3);  // → false
console.log(3 >= 3);   // → true
console.log(3 <= 2);   // → false
```

只有 `true` 和 `false` 两个值。

---

## 2. 为什么用 `===` 而不是 `==`

```js
console.log(1 == "1");   // → true    == 会先转换类型
console.log(1 === "1");  // → false   类型不同直接 false
```

`==` 有一套转换规则，经常给出你意想不到的结果：

```js
console.log("" == 0);    // → true
console.log("0" == false); // → true
```

**规则：一律用 `===` 和 `!==`。** 唯一例外是 `x == null`（同时判断 null 和 undefined），现在还用不到。

`=` 是赋值，`===` 是比较，写错一个就是 bug：

```js
let a = 1;    // 赋值
a === 1;      // 比较，返回 true
```

---

## 3. 逻辑运算：`&&`、`||`、`!`

```js
const age = 20;
const hasId = true;

age >= 18 && hasId;  // → true    两个都满足
age >= 18 || hasId;  // → true    满足一个就行
!hasId;              // → false   取反
```

它们会"短路"：`&&` 左边是 false 就不看右边了；`||` 左边是 true 就不看右边了。这常用于防御：

```js
const user = null;
user && user.name; // → null，不会因为 user 是 null 而报错
```

---

## 4. 哪些值算"假"

`if` 的条件不要求是 `true` / `false`，任何值都会被转成真假。下面这些是**假值**，其余全是真值：

```js
false
0
-0
""          // 空字符串
null
undefined
NaN
```

容易踩的两个：

```js
if (0) console.log("会打印吗");      // 不会，0 是假值
if ("0") console.log("会打印吗");    // 会！非空字符串是真值
if ([]) console.log("会打印吗");     // 会！空数组也是真值
```

---

## 5. `if` / `else if` / `else`

```js
const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 60) {
  console.log("D");
} else {
  console.log("不及格");
}
// → B
```

执行顺序是从上到下，**第一个满足的分支执行完就结束**，后面的不再判断。所以条件要从"更严格"往"更宽松"写。

不加 `{}` 也能跑，但只对下一行生效，容易出错 —— 一律加。

---

## 6. 三元表达式：简单二选一时用

```js
const age = 20;
const label = age >= 18 ? "成年" : "未成年";
console.log(label); // → 成年
```

`条件 ? 满足时的值 : 不满足时的值`。只有一个简单判断时用，多个分支还是用 `if`。

---

## 7. 函数里的提前返回

```js
function canVote(age) {
  if (age < 18) {
    return false;   // 不满足就先返回，后面不用再看
  }
  return true;
}
```

这种写法比套一层 `else` 更清楚。后面写复杂逻辑时，优先"先排除不可能的情况"。

---

## 8. 今天要写的东西

打开 `exercises/phase0/day03/day03.js`：

1. `canVote(age)`：满 18 返回 `true`
2. `grade(score)`：90+ → `"A"`，80+ → `"B"`，70+ → `"C"`，60+ → `"D"`，其余 `"F"`
3. `isEven(n)`：偶数返回 `true`（提示：`%`）
4. `max3(a, b, c)`：返回三个数里最大的

```bash
npm run p0d3
```

---

## 9. 常见坑

**① 把 `===` 写成 `=`**

```js
if (score = 90) { }   // 这是赋值，条件变成 90（真值），而且 score 被改了
if (score === 90) { } // 对
```

**② 条件顺序写反**

```js
if (score >= 60) return "D";
else if (score >= 90) return "A"; // 永远到不了这里
```

从上往下判断，先写宽松条件会把严格条件"挡住"。

**③ 用 `==`**

见第 2 节。

**④ 忘了 `return`**

```js
function canVote(age) {
  age >= 18;        // 算完就丢了
}
canVote(20); // → undefined
```

**⑤ 拿小数做 `===` 比较**

```js
0.1 + 0.2 === 0.3; // → false
```

---

## 10. 验收线

- `npm run p0d3` 10 条全绿
- 能说出 `==` 和 `===` 的区别
- 能说出至少 5 个假值
- 能写一个三段式 `if / else if / else`
