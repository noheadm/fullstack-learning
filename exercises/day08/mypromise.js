/**
 * Day 8 · MyPromise
 * 契约见 plan/phase1/day08.md。
 * 不许用原生 Promise 实现 then 的状态机（可以 queueMicrotask / setTimeout）。
 */

export class MyPromise {
  constructor(executor) {
    // TODO: 保存 state / value / handlers
    // TODO: 同步执行 executor(resolve, reject)，executor 抛错要转成 reject
    throw new Error("MyPromise 未实现");
  }

  then(onFulfilled, onRejected) {
    // TODO: 返回新的 MyPromise；回调异步执行；回调抛错 → reject
    // TODO: 回调返回 Promise/thenable 要吸收；返回自身要 reject TypeError
    throw new Error("MyPromise#then 未实现");
  }

  catch(onRejected) {
    throw new Error("MyPromise#catch 未实现");
  }

  finally(onFinally) {
    throw new Error("MyPromise#finally 未实现");
  }

  static resolve(value) {
    throw new Error("MyPromise.resolve 未实现");
  }

  static reject(reason) {
    throw new Error("MyPromise.reject 未实现");
  }

  static all(iterable) {
    throw new Error("MyPromise.all 未实现");
  }

  static race(iterable) {
    throw new Error("MyPromise.race 未实现");
  }
}

/** node 风格回调转 MyPromise。 */
export function promisify(fn) {
  throw new Error("promisify 未实现");
}
