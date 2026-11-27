/**
 * 1-8a · Promise 的用法（先用熟，再自己实现）
 * 填完运行：npm run day8a
 *
 * 这一项只要求会用原生 Promise 的组合方法，不要求实现。
 */

/** 等所有 Promise 成功，按顺序返回结果（用 Promise.all） */
export function waitAll(items) {
  return Promise.all(items);
}

/** 返回第一个成功的结果；全部失败时把错误抛出去（用 Promise.any） */
export async function firstSuccess(promises) {
  return Promise.any(promises);
}

/** 等全部落定，返回 ["ok", "fail", ...]（用 Promise.allSettled） */
export async function allStatuses(promises) {
  return Promise.allSettled(promises).then((results) =>
    results.map((result) => (result.status === "fulfilled" ? "ok" : "fail"))
  );
}

/** node 风格回调 (err, data) 转成 Promise */
export function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
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

