1-3a 
1. debounce是在动作条件满足一定时间后执行，throttle是在固定时间内判断有一次条件满足就执行，debounce常用于按钮点击，throttle常用于屏幕滚动
2. debounce把上一次还没到时间、正在倒计时的任务取消掉。cancel清除定时器
3. 为了确保在冷却时间结束后触发的“尾调用”（trailing call）能够使用最新、最准确的状态和上下文执行
4. 我现在的理解是为了快速触发节流时间赋值
1-3b
1. 浅拷贝只复制原始值，对象属性内容，修改对象值会影响原拷贝：
const original = {
  name: 'Alice',
  info: { age: 25 } 
};
const shallowCopy = { ...original };
shallowCopy.name = 'Bob';
shallowCopy.info.age = 30;
console.log(original.name);     
console.log(original.info.age); 
   深拷贝在内存中新开辟一片区域把复制内容全copy了一份，修改这份内容不影响原值
const original = {
  name: 'Alice',
  info: { age: 25 }
};
const deepCopy = structuredClone(original);
deepCopy.info.age = 30;
console.log(original.info.age);
console.log(deepCopy.info.age);
2. WeakMap 充当一个“备忘录”或“缓存表”，用来记录已经拷贝过的对象。
3. 如果对象内部存在直接或间接引用自身的情况（循环引用），不提前登记就会导致无限递归，最终触发栈溢出
4. 普通 Map 的强引用问题：Map 对键名是强引用。即使外部代码在深拷贝完成后把原对象置为 null，只要这个 Map 实例还存在，原对象和克隆对象就会一直被 Map 死死拽住，垃圾回收机制（GC）无法释放它们的内存。
WeakMap 的弱引用优势：WeakMap 对键名（即原对象）是弱引用，不计入垃圾回收的引用计数。一旦外部不再引用原对象，垃圾回收器会自动回收原对象的内存，同时 WeakMap 中对应的键值对也会自动消失，无需手动清理。
