# 0-7 · 对象基础（2–3h）

> 目标：会用键值对存数据、读嵌套属性、遍历对象，并且知道对象也是引用。
> 代码：`exercises/phase0/day07/`，测试：`npm run p0d7`

---

## 1. 对象是什么

一组**有名字的数据**，用花括号创建：

```js
const user = {
  name: "小明",
  age: 18,
  city: "上海",
};

console.log(user.name); // → "小明"
console.log(user.age);  // → 18
```

左边叫**键**（key），右边叫**值**（value）。数组用位置找东西，对象用名字找。

---

## 2. 两种读法：点号和方括号

```js
user.name;      // 点号：键名是固定的
user["name"];   // 方括号：里面是字符串

const field = "age";
user[field];    // → 18   方括号里可以放变量
user.field;     // → undefined   点号后面写变量名 = 找名叫 "field" 的键
```

规则：

- 键名是固定的、合法的（字母数字下划线）→ 用点号
- 键名存在变量里、或带空格/短横线 → 用方括号

```js
const config = { "max-size": 10 };
config["max-size"]; // → 10
config.max-size;    // 会被理解成 config.max 减 size
```

---

## 3. 改、增、删

```js
const user = { name: "小明" };

user.age = 18;        // 新增
user.name = "小红";    // 修改
delete user.age;      // 删除
console.log(user);    // → { name: "小红" }
```

`const` 只锁定变量名，不锁内容，所以改属性完全合法。

---

## 4. 嵌套对象

值也可以是对象：

```js
const order = {
  id: 1,
  customer: {
    name: "小明",
    address: { city: "上海", street: "南京路" },
  },
};

order.customer.name;            // → "小明"
order.customer.address.city;    // → "上海"
```

一层层往下点。中间任何一层是 `undefined` 就会报错：

```js
order.customer.phone.number; // → TypeError: Cannot read properties of undefined
```

读之前先确认存在，或者留到阶段 1 学可选链。

---

## 5. 对象里的函数（方法）

```js
const counter = {
  count: 0,
  increase() {
    return 1;
  },
};

counter.increase(); // → 1
```

对象里的函数叫方法，调用方式一样。注意：方法里想用 `this.count` 涉及 `this` 规则，那属于阶段 1，现在先不要在方法里用 `this`。

---

## 6. 拿键、拿值、拿键值对

```js
const user = { name: "小明", age: 18 };

Object.keys(user);    // → ["name", "age"]
Object.values(user);  // → ["小明", 18]
Object.entries(user); // → [["name", "小明"], ["age", 18]]
```

`Object.keys()` 只返回**自身**的键，顺序按插入顺序（数字键会排前面）。

---

## 7. 判断有没有某个键

```js
const user = { name: "小明" };

"name" in user;      // → true
"age" in user;       // → false
user.age;            // → undefined
```

区别：`in` 返回布尔值，读属性返回 `undefined`。两者的区别在"值本来就是 undefined"时会显现：

```js
const a = { x: undefined };
a.x;        // → undefined，看不出来有没有
"x" in a;   // → true  确实有
"y" in a;   // → false
```

---

## 8. 遍历对象

```js
const user = { name: "小明", age: 18 };

for (const key in user) {
  console.log(key, user[key]);
}
// → name 小明
// → age 18
```

`for...in` 给的是**键**，要取值必须写 `user[key]`（不能写 `user.key`，那会去找名字叫 `key` 的属性）。

用 `Object.keys` + 普通 `for...of` 更安全，后面推荐这种。

---

## 9. 对象也是引用

```js
const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n); // → 2   同一个对象
```

要独立副本，得逐层复制：

```js
function copyUser(user) {
  const copy = {};
  for (const key of Object.keys(user)) {
    copy[key] = user[key];
  }
  return copy;
}
```

这种复制只复制第一层，嵌套对象仍然共享。（更省事的写法 `{ ...user }` 在阶段 1 讲。）

---

## 10. 今天要写的东西

打开 `exercises/phase0/day07/day07.js`：

1. `makeUser(name, age)`：返回 `{ name, age }`
2. `incrementAge(user)`：返回**新对象**，`age` 加 1，不修改原对象
3. `countKeys(obj)`：返回键的数量
4. `hasKey(obj, key)`：判断键是否存在，返回布尔值
5. `readValue(obj, key)`：返回对应值，不存在返回 `null`
6. `formatAddress(addr)`：`{ city, street }` → `"上海-南京路"`

```bash
npm run p0d7
```

---

## 11. 常见坑

**① 点号后面写变量**

```js
const key = "age";
user.key;   // → undefined
user[key];  // → 18
```

**② 改副本改到了原对象**

```js
const copy = user;        // 不是复制
copy.age = 99;            // 原对象也变了
```

**③ 读不存在的嵌套属性**

```js
order.customer.phone; // customer 存在但 phone 不存在 → undefined
order.customer.phone.number; // → TypeError
```

**④ 用 `for...in` 遍历数组**

数组用 `for...of`，`for...in` 只用于对象。

**⑤ 键名忘了加引号（带特殊字符时）**

```js
const a = { max-size: 10 };   // SyntaxError
const b = { "max-size": 10 }; // 对
```

**⑥ 以为 `delete` 能删干净嵌套**

`delete` 只删你点的那个键，嵌套里的东西要自己再删。

---

## 12. 验收线

- `npm run p0d7` 12 条全绿
- 能说出 `user.name` 和 `user[key]` 各自什么时候用
- 能解释 `const` 对象为什么能改属性
- 能写出"复制对象但不影响原对象"的函数
