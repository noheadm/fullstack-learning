/**
 * Day 7 · 原型链与 class
 * 契约见 plan/phase1/day07.md。
 */

/** 手写 new：创建对象、绑原型、执行构造函数、处理返回值。 */
export function myNew(Ctor, ...args) {
  let obj = Object.create(Ctor.prototype);
  let result = Ctor.apply(obj, args);
  return (result !== null && (typeof result === "object" || typeof result === "function")) ? result : obj;
}

/** 手写 instanceof：沿原型链向上找 Ctor.prototype。 */
export function myInstanceOf(obj, Ctor) {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) return false;

  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);   // ← 关键：往上一层，循环才能推进
  }
  return false;
}



/** 原型继承，并把 constructor 修正回 Child。 */
export function inherit(Child, Parent) {
  let proto = Object.create(Parent.prototype);
  proto.constructor = Child;
  Child.prototype = proto;
}

export class Animal {
  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  static kingdom() {
    return "animalia";
  }
}

export class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}
