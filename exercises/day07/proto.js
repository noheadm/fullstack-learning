/**
 * Day 7 · 原型链与 class
 * 契约见 plan/phase1/day07.md。
 */

/** 手写 new：创建对象、绑原型、执行构造函数、处理返回值。 */
export function myNew(Ctor, ...args) {
  throw new Error("myNew 未实现");
}

/** 手写 instanceof：沿原型链向上找 Ctor.prototype。 */
export function myInstanceOf(obj, Ctor) {
  throw new Error("myInstanceOf 未实现");
}

/** 原型继承，并把 constructor 修正回 Child。 */
export function inherit(Child, Parent) {
  throw new Error("inherit 未实现");
}

export class Animal {
  #name;

  constructor(name) {
    throw new Error("Animal 未实现");
  }

  get name() {
    throw new Error("Animal#name getter 未实现");
  }

  speak() {
    throw new Error("Animal#speak 未实现");
  }

  static kingdom() {
    throw new Error("Animal.kingdom 未实现");
  }
}

export class Dog extends Animal {
  speak() {
    throw new Error("Dog#speak 未实现");
  }
}
