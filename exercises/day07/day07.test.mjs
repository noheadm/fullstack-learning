import { test } from "node:test";
import assert from "node:assert/strict";

import { myNew, myInstanceOf, inherit, Animal, Dog } from "./proto.js";

function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.sum = function () {
  return this.x + this.y;
};

test("1. myNew 设置属性并绑定原型", () => {
  const p = myNew(Point, 1, 2);
  assert.equal(p.x, 1);
  assert.equal(p.y, 2);
  assert.ok(p instanceof Point);
  assert.equal(p.sum(), 3);
});

test("2. 构造函数返回对象时用该对象", () => {
  function Factory() {
    this.a = 1;
    return { b: 2 };
  }
  const result = myNew(Factory);
  assert.equal(result.b, 2);
  assert.equal(result.a, undefined);
});

test("3. 构造函数返回原始值时忽略", () => {
  function Primitive() {
    this.a = 1;
    return 5;
  }
  assert.equal(myNew(Primitive).a, 1);
});

test("4. 方法在原型上，不在实例自身", () => {
  const p = myNew(Point, 1, 2);
  assert.equal(Object.hasOwn(p, "sum"), false);
  assert.equal(Object.hasOwn(p, "x"), true);
});

test("5. myInstanceOf 判断多级原型链", () => {
  const p = myNew(Point, 1, 2);
  assert.equal(myInstanceOf(p, Point), true);
  assert.equal(myInstanceOf(p, Object), true);
  assert.equal(myInstanceOf({}, Point), false);
});

test("6. myInstanceOf 对无原型对象和 null 的处理", () => {
  assert.equal(myInstanceOf(Object.create(null), Object), false);
  assert.equal(myInstanceOf(null, Object), false);
});

// ES5 风格的原型继承夹具，放在函数里，避免未实现时在 import 阶段就炸掉整个测试文件
function makeNodes() {
  function Parent(name) {
    this.name = name;
  }
  Parent.prototype.hi = function () {
    return `hi ${this.name}`;
  };

  function Child(name) {
    Parent.call(this, name);
  }
  inherit(Child, Parent);

  return { Parent, Child };
}

test("7. inherit 后子类实例能调父类方法", () => {
  const { Child } = makeNodes();
  assert.equal(new Child("a").hi(), "hi a");
});

test("8. inherit 后 constructor 指向子类", () => {
  const { Child } = makeNodes();
  assert.equal(new Child("a").constructor, Child);
});

test("9. inherit 后 instanceof 父类为 true", () => {
  const { Parent, Child } = makeNodes();
  assert.ok(new Child("a") instanceof Parent);
});

test("10. Animal 的 getter 与 speak", () => {
  const a = new Animal("Rex");
  assert.equal(a.name, "Rex");
  assert.equal(a.speak(), "Rex makes a sound");
});

test("11. #name 真私有", () => {
  const a = new Animal("Rex");
  assert.deepStrictEqual(Object.keys(a), []);
  assert.equal(Object.hasOwn(a, "name"), false);
});

test("12. Animal.kingdom 静态方法", () => {
  assert.equal(Animal.kingdom(), "animalia");
});

test("13. Dog 覆写 speak 并继承静态方法", () => {
  const d = new Dog("Rex");
  assert.equal(d.speak(), "Rex barks");
  assert.equal(d.name, "Rex");
  assert.equal(Dog.kingdom(), "animalia");
});

test("14. extends 建立的双链", () => {
  assert.equal(Object.getPrototypeOf(Dog.prototype), Animal.prototype);
  assert.equal(Object.getPrototypeOf(Dog), Animal);
  assert.ok(new Dog("Rex") instanceof Animal);
});
