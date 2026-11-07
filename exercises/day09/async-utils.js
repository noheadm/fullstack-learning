/**
 * Day 9 · async/await
 * 契约见 plan/phase1/day09.md。
 */

/** 等待 ms 毫秒。 */
export function sleep(ms) {
  throw new Error("sleep 未实现");
}

/**
 * 超时包装：promise 先落定就透传结果/错误；ms 毫秒内没落定就 reject。
 * 必须清理定时器。
 */
export function withTimeout(promise, ms, message = "timeout") {
  throw new Error("withTimeout 未实现");
}

/**
 * 失败重试。
 * @param {() => Promise<any>} fn
 * @param {{ times?: number, delay?: number }} options
 */
export async function retry(fn, { times = 3, delay = 10 } = {}) {
  throw new Error("retry 未实现");
}

/**
 * 并发受限的 map，结果保序。
 * @param {Array} items
 * @param {number} limit
 * @param {(item: any, index: number) => Promise<any>} fn
 */
export async function mapLimit(items, limit, fn) {
  throw new Error("mapLimit 未实现");
}
