1. {...o} 只复制第一层，嵌套对象仍共享；structuredClone(o) 递归复制，嵌套也独立，而且 Date 这类类型能保住。但 structuredClone 不能克隆函数和 Symbol 值，会抛 DataCloneError。
2. 解构赋值的默认值只在属性值严格等于 undefined（=== undefined）时才会触发。
3. 因为 Object.freeze() 是“浅冻结”（Shallow Freeze），它只作用于对象的第一层属性。
4. 1️⃣误取原型链上的属性2️⃣无中生有（生成值为 undefined 的键）安全写法：在赋值前，必须使用 Object.hasOwn(obj, key)（或 Object.prototype.hasOwnProperty.call(obj, key)）校验该属性是否真实存在于对象自身上。