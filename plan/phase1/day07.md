# Day 7 · 原型链与 class（4h）

> 目标：搞清 `new` 到底干了什么、`instanceof` 在查什么、class 和构造函数到底差在哪。
> 代码：`exercises/day07/`，测试：`npm run day7`

---

## 0. 先看一个现象（3 分钟）

```js
function Cat(name) {
  this.name = name;
  this.meow = function () {
    return `${this.name}: meow`;
  };
}

const a = new Cat("a");
const b = new Cat("b");

a.meow === b.meow; // → false
```

两只猫的 `meow` **不是同一个函数**。每 `new` 一次，就新建一个函数对象。一万只猫 = 一万个完全一样的函数 = 白白多占内存。

修法就是原型：把方法放到 `Cat.prototype` 上，所有实例共用一份。

```js
Cat.prototype.meow = function () {
  return `${this.name}: meow`;
};

a.meow === b.meow; // → true
```

这就是原型存在的全部理由：**共享方法，节省内存**。后面所有概念都是围绕这个诉求长出来的。

---

## 1. 三个容易混淆的东西

```js
function Cat() {}
const c = new Cat();
```

| 表达式 | 指向 | 说明 |
|--------|------|------|
| `Cat.prototype` | 一个对象（原型对象） | **函数才有**，用来给实例共享东西 |
| `Object.getPrototypeOf(c)`（等价 `c.__proto__`） | `Cat.prototype` | **每个对象都有**，是查找的下一站 |
| `Cat.prototype.constructor` | `Cat` | 指回构造函数，可被改写，不可靠 |

```js
Cat.prototype.constructor === Cat;            // → true
Object.getPrototypeOf(c) === Cat.prototype;   // → true
c.constructor === Cat;                        // → true（沿原型链找到的）
```

注意表格第三列的两个"原型"完全不是一个东西：

- `Cat.prototype` 是**函数的一个普通属性**，里面放共享成员。
- `[[Prototype]]`（`__proto__`）是**对象的内部槽**，指向它继承自谁。
- `c.__proto__ === Cat.prototype` 只是 `new` 顺手建立的联系。

---

## 2. 属性查找：一层层往上找

```js
Cat.prototype.sound = "meow";

c.sound;                 // → "meow"
Object.hasOwn(c, "sound"); // → false  不在实例自己身上
c.unknown;               // → undefined  找到链尽头仍然是 undefined
```

查找顺序：实例自身 → `Cat.prototype` → `Object.prototype` → `null`。找到就返回，找不到返回 `undefined`。

赋值是另一回事：`c.sound = "woof"` **不会**改原型，而是在实例上新建一个同名属性，把原型上的遮住。这叫"属性遮蔽"。

---

## 3. `new` 的四步，手写一遍

`new Cat("咪")` 做的事：

1. 创建一个空对象 `{}`
2. 把它的 `[[Prototype]]` 指向 `Cat.prototype`
3. 以它为 `this` 执行 `Cat` 函数体
4. 如果构造函数返回的是**对象**，就用那个对象；否则返回第 1 步创建的对象

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype); // 第 1、2 步
  const result = Ctor.apply(obj, args);      // 第 3 步
  const isObject = result !== null && (typeof result === "object" || typeof result === "function");
  return isObject ? result : obj;            // 第 4 步
}
```

第 4 步是最反直觉的：

```js
function ReturnsObject() { this.a = 1; return { b: 2 }; }
new ReturnsObject(); // → { b: 2 }   ← this.a 白写了

function ReturnsPrimitive() { this.a = 1; return 5; }
new ReturnsPrimitive(); // → { a: 1 }  ← 原始值被忽略
```

---

## 4. `instanceof` 在查什么

它**不是**在问"这个对象是谁创建的"，而是在问：

> `Ctor.prototype` 是否出现在 `obj` 的原型链上？

```js
function myInstanceOf(obj, Ctor) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

所以：

```js
[] instanceof Array;  // → true
[] instanceof Object; // → true   因为 Array.prototype 的上级是 Object.prototype
"abc" instanceof String; // → false  原始值没有原型链可查
```

最后一条是常见误判：`instanceof` 对原始类型永远返回 `false`，判断原始类型用 `typeof`。

---

## 5. ES5 时代的继承，以及为什么不能偷懒

```js
function Parent(name) { this.name = name; }
Parent.prototype.hi = function () { return `hi ${this.name}`; };

function Child(name) { Parent.call(this, name); } // 继承实例属性

inherit(Child, Parent);

const c = new Child("a");
c.hi();                        // → "hi a"
c instanceof Parent;           // → true
c.constructor === Child;       // → true
```

`inherit` 的正确实现：

```js
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype); // 新建一个对象，原型指向父原型
  Child.prototype.constructor = Child;               // 补回被覆盖的 constructor
}
```

最常见的偷懒写法是错的：

```js
// 错：父子共用同一个原型对象
Child.prototype = Parent.prototype;
Child.prototype.own = function () {};
new Parent().own; // → 子类的方法污染了父类
```

`Object.create(Parent.prototype)` 会**新建一个空对象**，它自己的 `[[Prototype]]` 指向 `Parent.prototype`。这样在子类原型上加东西，只影响子类。

---

## 6. class 只是语法糖，但有三个差别

同一段逻辑，两种写法：

```js
// 构造函数风格
function A(x) { this.x = x; }
A.prototype.get = function () { return this.x; };
```

```js
// class 风格
class A {
  constructor(x) { this.x = x; }
  get() { return this.x; }
}
```

看起来一样，实际有三点不同：

**① 方法不可枚举**

```js
class B { m() {} }
Object.keys(B.prototype); // → []

function C() {}
C.prototype.m = function () {};
Object.keys(C.prototype); // → ["m"]
```

这影响 `for...in` 和 `Object.keys` 的结果 —— class 的写法更干净。

**② 类内部默认严格模式**

```js
class D { f() { return this; } }
const f = new D().f;
f(); // → undefined（严格模式下 this 是 undefined，不是 window）
```

**③ 必须用 `new` 调用**

```js
class E {}
E(); // → TypeError: Class constructor E cannot be invoked without 'new'
```

---

## 7. `extends` 与 `super`

```js
class Animal {
  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() { return this.#name; }

  speak() { return `${this.#name} makes a sound`; }

  static kingdom() { return "animalia"; }
}

class Dog extends Animal {
  speak() { return `${this.name} barks`; } // this.name 走 getter
}

const d = new Dog("Rex");
d.speak();     // → "Rex barks"
Dog.kingdom(); // → "animalia"
```

`extends` 建立了**两条链**：

```js
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // → true  实例方法继承
Object.getPrototypeOf(Dog) === Animal;                     // → true  静态方法继承
```

`super` 规则：

- 派生类构造函数里必须先 `super()` 才能用 `this`
- `super.method()` 调用父类原型上的同名方法
- `super(...)` 调用父类构造函数

```js
class Puppy extends Dog {
  constructor(name) {
    this.name = name; // 错：ReferenceError，还没 super()
    super(name);
  }
}
```

`#name` 的三条性质：外部访问是语法错误、`Object.keys` 看不到、子类也访问不到（要访问只能通过父类提供的 getter）。

---

## 7.5 `get` / `set`：访问器属性

**数据属性**：普通的"键 = 值"，存一个值。

```js
const obj = { n: 1 };   // n 是数据属性
```

**访问器属性**：不直接存值，读取时执行 `get` 函数，赋值时执行 `set` 函数。

```js
const obj = {
  _n: 0,
  get n() { return this._n; },        // 读 obj.n 时执行
  set n(v) { this._n = v * 2; },      // 写 obj.n = x 时执行
};

obj.n = 5;    // 走 setter → _n = 10
obj.n;        // 走 getter → 10
```

**在 class 里就是普通的 `get` / `set` 方法**，定义在 `prototype` 上：

```js
class User {
  #name;
  constructor(name) { this.#name = name; }
  get name() { return this.#name; }
  set name(v) { this.#name = v.trim(); }
}
```

**用 `Object.defineProperty` 也能造**：

```js
const o = {};
Object.defineProperty(o, "x", {
  get() { return 1; },
  set(v) { console.log("写入", v); },
  enumerable: true,
});
```

**和 1-4 的联系**：`Object.assign(target, src)` 在 `target` 上遇到同名的访问器属性时，会**调用它的 setter**；而 `{ ...src }` 是直接定义属性，不调用 setter。这就是 1-4 里"两个差别"中的第二个，现在能理解了。

**查描述符**：

```js
Object.getOwnPropertyDescriptor({ get a() { return 1; } }, "a");
// → { get: [Function], set: undefined, enumerable: true, configurable: true }
```

---

## 8. 速查表

- 原型的作用：共享方法、省内存
- `Ctor.prototype`（函数属性）≠ `obj.__proto__`（对象内部槽）；`new` 把它们连起来
- 属性查找：自身 → 原型 → … → `Object.prototype` → `null`
- 赋值不穿透原型，只会在自身创建遮蔽属性
- `new` 四步：建对象 → 连原型 → 执行构造函数 → 返回值规则（对象优先，原始值忽略）
- `instanceof` 查的是 `Ctor.prototype` 在不在原型链上，对原始值恒为 false
- `Child.prototype = Parent.prototype` 是错的，要用 `Object.create(Parent.prototype)`
- class vs 构造函数：方法不可枚举、内部严格模式、必须 `new`
- `extends` 建两条链（实例 + 静态），`super()` 之前不能用 `this`
- `#field` 是真私有，`_field` 只是约定

---

## 9. 常见坑（错误 ↔ 正确）

**① 共享父类原型**

```js
Child.prototype = Parent.prototype;                    // 错
Child.prototype = Object.create(Parent.prototype);     // 对
```

**② 忘了补 `constructor`**

```js
const c = new Child();
c.constructor === Parent; // 错：指向父类了
```

**③ 在类字段里写箭头函数，实例各一份**

```js
class A {
  handle = () => {}; // 每个实例一份
  handle2() {}       // 原型共享，正确
}
```

箭头函数只有在需要"自动绑定 this"时才用，比如作为事件回调传给别处。

**④ 把 `__proto__` 当属性名**

```js
const o = { __proto__: null }; // 这是设置原型，不是创建名为 __proto__ 的属性
Object.keys(o); // → []
```

要真正建一个名为 `__proto__` 的键，用 `Object.defineProperty`，或者干脆别用这个名字。

**⑤ 用 `instanceof` 判断原始类型**

```js
"abc" instanceof String; // → false
typeof "abc" === "string"; // → true
```

---

## 10. 时间表（4h）

| 时间 | 内容 | 产出 |
|------|------|------|
| 0:00–0:45 | 第 0–2 节，画一张原型链图 | notes.md 里的图 |
| 0:45–1:30 | 第 3–4 节 + 实现 `myNew`、`myInstanceOf` | 测试 1–6 绿 |
| 1:30–2:10 | 第 5 节 + 实现 `inherit` | 测试 7–9 绿 |
| 2:10–3:10 | 第 6–7 节 + 完成 `Animal` / `Dog` | 测试 10–14 绿 |
| 3:10–3:40 | 第 8–9 节复述 | notes.md |
| 3:40–4:00 | commit | hash |

---

## 11. 程序框架

```js
export function myNew(Ctor, ...args)          // 手写 new
export function myInstanceOf(obj, Ctor)       // 手写 instanceof
export function inherit(Child, Parent)        // 原型继承，并修正 constructor
export class Animal { ... }                   // #name、get name、speak、static kingdom
export class Dog extends Animal { ... }       // speak 覆写
```

`Animal` 契约：

- `new Animal("Rex").name` → `"Rex"`
- `speak()` → `"Rex makes a sound"`
- `Animal.kingdom()` → `"animalia"`
- `Object.keys(instance)` 不含 `name`

`Dog` 契约：

- `new Dog("Rex").speak()` → `"Rex barks"`
- `Dog.kingdom()` 继承可用

---

## 12. 验收线

14 条测试全绿，且能白板画出并解释这条链：

```
new Dog("Rex")
  └─ 实例 ──[[Prototype]]──→ Dog.prototype ──→ Animal.prototype ──→ Object.prototype ──→ null
```

外加回答：`Child.prototype = Parent.prototype` 为什么是错的？`instanceof` 对 `"abc"` 为什么是 false？

---
