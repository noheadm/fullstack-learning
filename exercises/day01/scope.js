/**
 * Day 1 · 循环 + 闭包
 *
 * 两个函数都返回 3 个函数调用后的结果数组，用来证明 var / let 的作用域差异。
 * 不许直接 return [3,3,3] 或 [0,1,2]，必须真的用循环 + 箭头函数收集。
 */

/** @returns {number[]} 期望 [3, 3, 3] */
export function varInLoop() {
  const fns = [];
  for (var i = 0; i < 3; i++) {
    fns.push(() => i);
  }
  return fns.map(f => f());
}

/** @returns {number[]} 期望 [0, 1, 2] */
export function letInLoop() {
  const fns = [];
  for (let i = 0; i < 3; i++) {
    fns.push(() => i);
  }
  return fns.map(f => f());
}
