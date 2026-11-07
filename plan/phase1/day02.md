# Day 2 · 数据类型与类型转换（2h）

> 目标：写一个 `getType` 把所有内置类型分对，并说清 `+` / `Number()` 背后走的转换链。
> 代码：`exercises/day02/`，测试：`npm run day2`

---

## 0. 先看三个反直觉的结果

```js
typeof null;   // → "object"
typeof [];     // → "object"
0.1 + 0.2 === 0.3; // → false
```

这三个结果分别代表三类问题：`typeof` 的表达能力不足、类型标签的判定方式、浮点数的二进制表示。今天逐个拆开。

---

## 1. 类型体系：7 种原始值 + 1 种对象

| 类别 | 成员 |
|------|------|
| 原始值 | `string` `number` `boolean` `null` `undefined` `symbol` `bigint` |
| 对象 | 其余所有：`Object` `Array` `Function` `Date` `RegExp` `Map` `Set` … |

区别的核心：原始值不可变、按值比较；对象可变、按引用比较。

```js
"abc" === "abc";        // → true   逐字符比较
{} === {};              // → false  两个不同的对象
```

原始值看起来能调方法，是因为 JS 会临时把它包装成对象：

```js
"abc".toUpperCase(); // → "ABC"
// 内部近似于 new String("abc").toUpperCase()，用完即弃
```

---

## 2. `typeof` 能给你什么，不能给你什么

```js
typeof undefined;  // "undefined"
typeof true;       // "boolean"
typeof 1;          // "number"
typeof 1n;         // "bigint"
typeof "s";        // "string"
typeof Symbol();   // "symbol"
typeof function(){}; // "function"
typeof {};         // "object"
typeof null;       // "object"   ← 历史 bug，官方承认无法修复
typeof [];         // "object"
typeof new Map();  // "object"
```

所以 `typeof` 只能可靠区分那 8 种字符串，**分不出具体的对象类型**。

补充两个细节：

```js
typeof notDeclared; // → "undefined"（不抛错）
typeof 未初始化let;  // → ReferenceError（TDZ，见 Day 1）
```

---

## 3. 精确类型：`Object.prototype.toString`

这个方法的返回值长这样：

```js
Object.prototype.toString.call([]);       // → "[object Array]"
Object.prototype.toString.call(null);     // → "[object Null]"
Object.prototype.toString.call(new Map()); // → "[object Map]"
Object.prototype.toString.call(/x/);      // → "[object RegExp]"
```

为什么必须用 `.call`，不能直接 `v.toString()`？因为对象可以覆盖自己的 `toString`：

```js
const fake = { toString() { return "哈哈"; } };
fake.toString();                              // → "哈哈"
Object.prototype.toString.call(fake);         // → "[object Object]"
```

`call` 强制使用原始实现，绕开覆盖。

取 `[object Xxx]` 中间的部分，就能得到精确类型名。你的 `getType` 就是干这个，但要先处理两个特例：`null` 和函数（`typeof` 能给答案的先给）。

---

## 4. 隐式转换：对象怎么变成原始值

当你写 `obj + 1`，JS 不会直接用对象做加法，而是先把它转成原始值。顺序是：

1. 有 `Symbol.toPrimitive` 就用它
2. 否则按"提示类型"走：默认/数字 → `valueOf` 再 `toString`；字符串 → `toString` 再 `valueOf`

```js
const obj = {
  valueOf() { return 42; },
  toString() { return "str"; },
};

obj + 1;      // → 43     默认提示走 valueOf
+obj;         // → 42     数字提示走 valueOf
String(obj);  // → "str"  字符串提示走 toString
`${obj}`;     // → "str"
```

这就解释了一大票"玄学"结果：

```js
[] + 1;   // → "1"   [] 转成 ""，"" + 1 是字符串拼接
[] + [];  // → ""    "" + ""
+[];      // → 0     "" 转数字是 0
+[5];     // → 5     "5" 转数字
+[1,2];   // → NaN   "1,2" 转数字失败
+{};      // → NaN   "[object Object]"
```

---

## 5. `Number()` 的完整转换表

| 输入 | 结果 | 原因 |
|------|------|------|
| `Number("")` | `0` | 空字符串按 0 处理 |
| `Number("  12  ")` | `12` | 去首尾空白 |
| `Number("12px")` | `NaN` | 有非数字字符 |
| `Number(null)` | `0` | 特例 |
| `Number(undefined)` | `NaN` | 特例 |
| `Number(true)` | `1` | |
| `Number(false)` | `0` | |
| `Number([])` | `0` | 先转 `""` |
| `Number([5])` | `5` | 先转 `"5"` |
| `Number([1,2])` | `NaN` | 先转 `"1,2"` |
| `Number({})` | `NaN` | 先转 `"[object Object]"` |

`+x` 和 `Number(x)` 完全等价。

解析型函数的行为不一样：它们是"能读多少读多少"。

```js
Number("12px");      // → NaN
parseInt("12px", 10); // → 12
parseFloat("12.5px"); // → 12.5
parseInt("0x10", 16); // → 16
```

所以处理用户输入时，`parseInt` 更适合"带单位"的字符串，`Number` 更适合"必须是纯数字"的校验。

---

## 6. 加减法：一个拼接，一个算数

```js
"5" + 3;   // → "53"   只要有一边是字符串，就拼接
3 + "5";   // → "35"
"5" - 3;   // → 2      减号只做数学运算
"5" * "2"; // → 10
"5" / "2"; // → 2.5
```

记忆方式：**加号是唯一的"兼职"运算符**，其他数学运算符都强制转数字。

---

## 7. `NaN` 的正确判断

```js
NaN === NaN;              // → false  它不等于自己
Number.isNaN(NaN);        // → true
Number.isNaN("abc");      // → false  只看是不是真的 NaN
isNaN("abc");             // → true   先转数字再判断，所以"abc"变 NaN 后返回 true
```

生产代码一律用 `Number.isNaN`。`Object.is(x, NaN)` 也可以，还能区分 `-0` 和 `0`：

```js
Object.is(NaN, NaN); // → true
Object.is(0, -0);    // → false
0 === -0;            // → true
```

---

## 8. `==` 的转换规则（知道就好，别用）

`==` 在类型不同时会转换，主要规则：

| 比较 | 结果 | 说明 |
|------|------|------|
| `null == undefined` | `true` | 特例，只互相相等 |
| `null == 0` | `false` | null 不转数字 |
| `0 == ""` | `true` | `""` 转 0 |
| `0 == "0"` | `true` | `"0"` 转 0 |
| `false == "0"` | `true` | 两边都转 0 |
| `[] == false` | `true` | `[]` → `""` → 0 |
| `NaN == NaN` | `false` | |

结论：除了 `x == null` 用来同时判 `null` / `undefined` 这个惯用法，其他场合一律 `===`。

---

## 9. 速查表

- 7 种原始值 + 对象；原始值不可变、按值比较
- `typeof` 只有 8 种结果，分不出数组/Date/Map，`typeof null` 是 `"object"`
- 精确类型用 `Object.prototype.toString.call(v)` 取标签
- 对象转原始值：`Symbol.toPrimitive` → `valueOf` → `toString`（按提示类型）
- `+` 遇字符串就拼接；`-` `*` `/` 强制转数字
- `Number("")` / `Number(null)` / `Number([])` 都是 0；`Number(undefined)` 是 `NaN`
- 判 NaN 用 `Number.isNaN`，不要用全局 `isNaN`
- `==` 有转换表，除 `== null` 外一律用 `===`
- BigInt 不能和 Number 混算；Symbol 不能隐式转字符串

---

## 10. 常见坑（错误 ↔ 正确）

**① 用 `typeof` 判数组**

```js
typeof []; // → "object"
Array.isArray([]); // → true
```

**② 以为 `Number(undefined)` 是 0**

```js
Number(null);      // → 0
Number(undefined); // → NaN
```

**③ 用 `isNaN` 校验输入**

```js
isNaN("");    // → false（"" 转成 0，是"合法数字"）
isNaN("abc"); // → true
Number.isNaN(""); // → false  ← 这个才是"是不是 NaN"
```

**④ 直接 `v.toString()` 取类型**

对象可以覆盖 `toString`，必须 `Object.prototype.toString.call(v)`。

**⑤ BigInt 混算**

```js
1n + 1; // → TypeError: Cannot mix BigInt and other types
1n + 1n; // → 2n
```

**⑥ Symbol 拼字符串**

```js
"" + Symbol("s");        // → TypeError
String(Symbol("s"));     // → "Symbol(s)"
```

---

## 11. 时间表（2h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:35 | 第 1–5 节 | notes.md 的转换表 |
| 0:35–0:55 | `prediction.js` 写 10 个答案（先不跑） | 10 个预测 |
| 0:55–1:35 | 实现 `getType` | 测试绿 |
| 1:35–1:50 | 第 6–8 节 + 订正 | 错题记录 |
| 1:50–2:00 | commit | hash |

---

## 12. 程序框架 & 验收线

```js
export function getType(value) // 覆盖 16 种输入，见 day02.md 契约表（测试里有全量断言）
```

14 条测试全绿，且能解释：`typeof null` 为什么是 `"object"`、`+[]` 为什么是 0、`+{}` 为什么是 `NaN`、`Number("12px")` 和 `parseInt("12px")` 为什么不一样。

---

## 13. 4h 版的额外 2h

1. **自测表（30 min）**：给 `getType` 准备 20 个输入（含 `Object.create(null)`、`async function`、`new WeakMap()`），列成表格手写预期值，再跑一遍对照。
2. **`Symbol.toPrimitive`（30 min）**：写一个类，实现 `[Symbol.toPrimitive](hint)`，验证 `+x`、`String(x)`、`x + ""` 三种场景的 `hint` 分别是什么。
3. **严格解析（30 min）**：实现 `safeInt(str)`：只接受可选负号 + 纯数字，其他返回 `null`，写 10 个用例（含 `""`、`" 12 "`、`"0x10"`）。
4. **`==` 自测（30 min）**：把第 8 节的表格扩到 20 条，先写答案再运行，错一条记录一次原因。
