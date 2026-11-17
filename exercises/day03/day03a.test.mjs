import { test } from "node:test";
import assert from "node:assert/strict";

import { debounce, throttle, once, memoize } from "./fns.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("1. debounce 只执行最后一次", async () => {
  const calls = [];
  const d = debounce((v) => calls.push(v), 30);
  d(1);
  d(2);
  d(3);
  assert.deepStrictEqual(calls, [], "延时未到前不应执行");
  await sleep(70);
  assert.deepStrictEqual(calls, [3]);
});

test("2. debounce.cancel 取消后不执行", async () => {
  const calls = [];
  const d = debounce((v) => calls.push(v), 30);
  d(1);
  d.cancel();
  await sleep(70);
  assert.deepStrictEqual(calls, []);
});

test("3. debounce 保留 this", async () => {
  let seen;
  const ctx = { v: 7 };
  const d = debounce(function () {
    seen = this.v;
  }, 20);
  d.call(ctx);
  await sleep(60);
  assert.equal(seen, 7);
});

test("4. throttle 首次立即执行 + 末尾补一次", async () => {
  const calls = [];
  const t = throttle((v) => calls.push(v), 40);
  t(1);
  assert.deepStrictEqual(calls, [1], "首次应同步执行");
  t(2);
  t(3);
  assert.deepStrictEqual(calls, [1], "间隔内不应立即执行");
  await sleep(100);
  assert.deepStrictEqual(calls, [1, 3], "末尾应补执行最后一次参数");
});

test("5. once 只执行一次", () => {
  let count = 0;
  const f = once((v) => {
    count += 1;
    return v * 2;
  });
  assert.equal(f(2), 4);
  assert.equal(f(10), 4, "后续调用返回首次结果");
  assert.equal(count, 1);
});

test("6. memoize 命中缓存", () => {
  let count = 0;
  const slow = memoize((a, b) => {
    count += 1;
    return a + b;
  });
  assert.equal(slow(1, 2), 3);
  assert.equal(slow(1, 2), 3);
  assert.equal(count, 1, "相同参数应命中缓存");
  assert.equal(slow(2, 3), 5);
  assert.equal(count, 2, "不同参数应重新计算");
});
