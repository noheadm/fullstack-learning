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
  let timer;
  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
  debounced.cancel = function () {
    clearTimeout(timer);
  };
  return debounced;
}

/**
 * 节流：首次立即执行；间隔内的调用合并，在间隔结束时用最后一次参数补执行一次。
 * @param {Function} fn
 * @param {number} interval
 * @returns {Function}
 */
export function throttle(fn, interval = 300) {
  let timer = null;
  let lastTime = 0;      // 0 让第一次调用时 remaining 必为负数 → 立刻执行
  let lastArgs = null;
  let lastThis = null;

  function throttled(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastTime);

    // 先记住这次调用的参数和 this
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0) {
      // 冷却结束：取消可能存在的补执行，避免执行两次
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      // 冷却中且还没安排：等到冷却结束，用最后一次的参数补执行
      timer = setTimeout(() => {
        timer = null;
        lastTime = Date.now();
        fn.apply(lastThis, lastArgs);
      }, remaining);
    }
  }

  return throttled;   // ← 你漏的就是这一行
}

/**
 * 深拷贝：支持循环引用、Date、RegExp、Map、Set、数组、普通对象、原始值。
 * 函数按引用返回。
 * @param {any} value
 * @returns {any}
 */
export function deepClone(value) {
  const seen = new WeakMap();

  function clone(v) {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) return seen.get(v);

    let copy;
    if (v instanceof Date) copy = new Date(v.getTime());
    else if (v instanceof RegExp) copy = new RegExp(v.source, v.flags);
    else if (v instanceof Map) copy = new Map();
    else if (v instanceof Set) copy = new Set();
    else if (Array.isArray(v)) copy = [];
    else copy = Object.create(Object.getPrototypeOf(v));

    seen.set(v, copy);

    if (v instanceof Map) for (const [k, val] of v) copy.set(k, clone(val));
    else if (v instanceof Set) for (const val of v) copy.add(clone(val));
    else if (Array.isArray(v)) for (const val of v) copy.push(clone(val));
    else for (const k of Object.keys(v)) copy[k] = clone(v[k]);

    return copy;
  }

  return clone(value);
}

/**
 * 只执行一次，后续调用返回首次结果。
 * @param {Function} fn
 * @returns {Function}
 */
export function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

/**
 * 按 JSON.stringify(args) 缓存结果。
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  }
}
