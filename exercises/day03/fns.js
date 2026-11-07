/**
 * Day 3 · 函数工具集
 * 规格见 plan/phase1/day03.md，测试见 day03.test.mjs。
 */

/**
 * 防抖：连续调用只执行最后一次。
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function & { cancel: () => void }}
 */
export function debounce(fn, delay = 300) {
  // TODO: 闭包保存 timer；每次调用 clearTimeout 再 setTimeout
  // 注意保留 this 和参数；返回的函数要挂一个 cancel 方法
  throw new Error("debounce 未实现");
}

/**
 * 节流：首次立即执行；间隔内的调用合并，在间隔结束时用最后一次参数补执行一次。
 * @param {Function} fn
 * @param {number} interval
 * @returns {Function}
 */
export function throttle(fn, interval = 300) {
  // TODO: 记录上次执行时间 + 一个定时器
  throw new Error("throttle 未实现");
}

/**
 * 深拷贝：支持循环引用、Date、RegExp、Map、Set、数组、普通对象、原始值。
 * 函数按引用返回。
 * @param {any} value
 * @returns {any}
 */
export function deepClone(value) {
  // TODO: 用 WeakMap 存已拷贝对象；按类型分支处理
  throw new Error("deepClone 未实现");
}

/**
 * 只执行一次，后续调用返回首次结果。
 * @param {Function} fn
 * @returns {Function}
 */
export function once(fn) {
  throw new Error("once 未实现");
}

/**
 * 按 JSON.stringify(args) 缓存结果。
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  throw new Error("memoize 未实现");
}
