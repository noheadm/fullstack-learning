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
  let count = start;
  return {
    inc() {
      return ++count;
    },
    dec() {
      return --count;
    },
    value() {
      return count;
    },
    reset() {
      count = start;
      return count;
    }
  };
}

/**
 * 极简 store，状态必须私有。
 * get() 返回拷贝；set(patch) 浅合并，值无变化不通知；subscribe 返回取消订阅函数。
 * @param {object} initial
 * @returns {{ get: () => object, set: (patch: object) => object, subscribe: (fn: Function) => Function }}
 */
export function createStore(initial = {}) {
  let state = { ...initial };
  const listeners = new Set();

  return {
    get() {
      return { ...state };
    },
    set(patch) {
      const changedKeys = Object.keys(patch).filter((key) => state[key] !== patch[key]);
      if (changedKeys.length === 0) {
        return { ...state };
      }
      if (changedKeys.length > 0) {
        state = { ...state, ...patch };
        listeners.forEach((fn) => fn({ ...state }));
      }
      return { ...state };
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    }
  };
}

/**
 * 柯里化，支持一次传多个参数。
 * @param {Function} fn
 * @returns {Function}
 */
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function (...nextArgs) {
        return curried(...args, ...nextArgs);
      };
    }
  };
}

/**
 * 从左到右组合，第一个函数可接收多个参数。
 * @param {...Function} fns
 * @returns {Function}
 */
export function pipe(...fns) {
  return (...args) => {
    if (fns.length === 0) {
      return args[0];
    }
    return fns.reduce((acc, fn, index) => {
      if (index === 0) {
        return fn(...acc);
      } else {
        return fn(acc);
      }
    }, args);
  }
}

/**
 * 从右到左组合。
 * @param {...Function} fns
 * @returns {Function}
 */
export function compose(...fns) {
  return function (arg) {
    return fns.reduceRight((acc, fn) => fn(acc), arg);
  }
}
