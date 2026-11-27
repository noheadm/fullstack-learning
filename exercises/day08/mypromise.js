/**
 * Day 8 · MyPromise
 * 契约见 plan/phase1/day08.md。
 * 不许用原生 Promise 实现 then 的状态机（可以 queueMicrotask / setTimeout）。
 */

export class MyPromise {
  constructor(executor) {
    // TODO: 保存 state / value / handlers
    // TODO: 同步执行 executor(resolve, reject)，executor 抛错要转成 reject
    state = "pending";
    this.value = undefined;
    this.handlers = [];
    this.executor = executor;
    this.state = "pending";
    this.handlers = [];
    this.executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    // TODO: 返回新的 MyPromise；回调异步执行；回调抛错 → reject
    // TODO: 回调返回 Promise/thenable 要吸收；返回自身要 reject TypeError
    return new MyPromise((resolve, reject) => {
      this.handlers.push({ onFulfilled, onRejected, resolve, reject });
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let completed = 0;
      const total = iterable.length;

      if (total === 0) {
        resolve(results);
        return;
      }

      iterable.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then((value) => {
            results[index] = value;
            completed += 1;
            if (completed === total) {
              resolve(results);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      iterable.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve).catch(reject);
      });
    });
  }
}

/** node 风格回调转 MyPromise。 */
export function promisify(fn) {
  return function (...args) {
    return new MyPromise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
