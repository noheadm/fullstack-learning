/**
 * Day 6 · 闭包与模块模式
 * 契约见 plan/phase1/day06.md。
 */

/**
 * 计数器，状态必须私有。
 * @param {number} start
 * @returns {{ inc: () => number, dec: () => number, value: () => number, reset: () => number }}
 */
export function makeCounter(start = 0) {
  throw new Error("makeCounter 未实现");
}

/**
 * 极简 store，状态必须私有。
 * get() 返回拷贝；set(patch) 浅合并，值无变化不通知；subscribe 返回取消订阅函数。
 * @param {object} initial
 * @returns {{ get: () => object, set: (patch: object) => object, subscribe: (fn: Function) => Function }}
 */
export function createStore(initial = {}) {
  throw new Error("createStore 未实现");
}

/**
 * 柯里化，支持一次传多个参数。
 * @param {Function} fn
 * @returns {Function}
 */
export function curry(fn) {
  throw new Error("curry 未实现");
}

/**
 * 从左到右组合，第一个函数可接收多个参数。
 * @param {...Function} fns
 * @returns {Function}
 */
export function pipe(...fns) {
  throw new Error("pipe 未实现");
}

/**
 * 从右到左组合。
 * @param {...Function} fns
 * @returns {Function}
 */
export function compose(...fns) {
  throw new Error("compose 未实现");
}
