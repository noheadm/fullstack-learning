1. 写出 new Dog("Rex") 的完整原型链（实例 → Dog.prototype → Animal.prototype → Object.prototype → null）
2. new 的四步，以及你的 myNew 里哪一行对应哪一步
3. Child.prototype = Parent.prototype 为什么是错的
4. "abc" instanceof String 为什么是 false
5. 死循环那次的教训：循环条件里用到的变量，必须在循环体内被改变
1. rex（实例对象） \(\rightarrow \) Dog.prototype \(\rightarrow \) Animal.prototype \(\rightarrow \) Object.prototype \(\rightarrow \) null
2. function myNew(Constructor, ...args) {
  // 第 1 步：创建一个全新的空对象
  const obj = {};

  // 第 2 步：将新对象的原型（[[Prototype]]）指向构造函数的 prototype 属性
  Object.setPrototypeOf(obj, Constructor.prototype); // 等价于 obj.__proto__ = Constructor.prototype

  // 第 3 步：将构造函数内部的 this 绑定到这个新对象上，并执行构造函数
  const result = Constructor.apply(obj, args);

  // 第 4 步：判断构造函数的返回值。如果是引用类型（对象或函数），则返回该返回值；否则默认返回新创建的 obj
  return (result !== null && (typeof result === 'object' || typeof result === 'function')) 
    ? result 
    : obj;
}
3. 原型污染（共享同一块内存）：
Child.prototype 和 Parent.prototype 指向了完全相同的对象。一旦你在子类原型上添加方法（例如 Child.prototype.fly = function() {}），父类的原型也会被修改，导致所有父类实例（甚至其他无关的兄弟子类）都莫名其妙拥有了 fly 方法。
constructor 指向混乱：
因为共用同一个原型对象，Child.prototype.constructor 会指向 Parent。如果你强行把 Child.prototype.constructor = Child 改回来，又会导致父类实例的 constructor 也变成 Child。
• ✅ 正确做法：使用 Child.prototype = Object.create(Parent.prototype)，创建一个中间空对象来隔离两者的修改，再修正 Child.prototype.constructor = Child。
4. 因为 instanceof 运算符只适用于对象（引用类型），对于原始类型（Primitive）一律返回 false。
5. 核心原则：循环条件里用到的变量，必须在循环体内被改变，且这种改变必须朝着“使条件最终为 false（收敛）”的方向推进。

