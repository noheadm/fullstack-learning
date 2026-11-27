/**
 * Day 8 · MyPromise
 * 契约见 plan/phase1/day08.md。
 * 不许用原生 Promise 实现 then 的状态机（可以 queueMicrotask / setTimeout）。
 */

export class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];

    const settle = (state, value) => {
      if (this.state !== "pending") return;   // 只能落定一次
      this.state = state;
      this.value = value;

      const handlers = this.handlers;         // 取出并清空
      this.handlers = [];
      for (const h of handlers) queueMicrotask(h);  // 异步执行
    };

    const resolve = (value) => {
      // 自己等自己 → 永远等不到，规范要求直接 reject
      if (value === this) {
        return settle("rejected", new TypeError("Chaining cycle detected"));
      }

      if (value !== null && (typeof value === "object" || typeof value === "function")) {
        let then;
        try {
          then = value.then;               // 取值也可能抛错
        } catch (e) {
          return settle("rejected", e);
        }

        if (typeof then === "function") {
          let called = false;              // 防止 then 被调用多次
          try {
            then.call(
              value,
              (v) => { if (!called) { called = true; resolve(v); } },
              (r) => { if (!called) { called = true; settle("rejected", r); } },
            );
          } catch (e) {
            if (!called) { called = true; settle("rejected", e); }
          }
          return;                          // 关键：先不 settle，等对方落定
        }
      }

      settle("fulfilled", value);
    };
    const reject = (reason) => settle("rejected", reason);

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);                                // executor 抛错 = reject
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        try {
          if (this.state === "fulfilled") {
            resolve(typeof onFulfilled === "function" ? onFulfilled(this.value) : this.value);
          } else {
            if (typeof onRejected === "function") resolve(onRejected(this.value));
            else reject(this.value);             // 没有 onRejected 就继续往下抛
          }
        } catch (e) {
          reject(e);                             // 回调抛错 → 新 Promise 失败
        }
      };

      if (this.state === "pending") this.handlers.push(run);
      else queueMicrotask(run);                  // 已落定也要异步
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
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      let index = 0;

      for (const promise of iterable) {
        const currentIndex = index++;
        MyPromise.resolve(promise)
          .then((value) => {
            results[currentIndex] = value;
            count++;
            if (count === index) resolve(results);
          })
          .catch(reject);
      }

      if (index === 0) resolve([]); // 空数组直接 resolve
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
      fn.call(this, ...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
