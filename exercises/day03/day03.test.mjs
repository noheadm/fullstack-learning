import { test } from "node:test";
import assert from "node:assert/strict";

import { debounce, throttle, deepClone, once, memoize } from "./fns.js";

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

test("5. deepClone 处理循环引用", () => {
  const source = { name: "a" };
  source.self = source;
  const copy = deepClone(source);
  assert.notEqual(copy, source);
  assert.equal(copy.self, copy);
  assert.equal(copy.name, "a");
});

test("6. deepClone 处理 Date / Map / Set / 嵌套数组", () => {
  const source = {
    date: new Date("2020-01-01T00:00:00Z"),
    map: new Map([["k", { v: 1 }]]),
    set: new Set([1, 2]),
    arr: [{ x: 1 }],
    re: /abc/gi,
  };
  const copy = deepClone(source);

  assert.ok(copy.date instanceof Date);
  assert.equal(copy.date.getTime(), source.date.getTime());

  assert.ok(copy.map instanceof Map);
  assert.equal(copy.map.get("k").v, 1);
  assert.notEqual(copy.map.get("k"), source.map.get("k"));

  assert.ok(copy.set instanceof Set);
  assert.deepStrictEqual([...copy.set], [1, 2]);

  assert.deepStrictEqual(copy.arr, [{ x: 1 }]);
  assert.notEqual(copy.arr, source.arr);
  assert.notEqual(copy.arr[0], source.arr[0]);

  assert.ok(copy.re instanceof RegExp);
  assert.equal(copy.re.source, "abc");
  assert.equal(copy.re.flags, "gi");

  copy.arr[0].x = 99;
  assert.equal(source.arr[0].x, 1, "改副本不应影响原对象");
});

test("7. deepClone 原始值与函数", () => {
  assert.equal(deepClone(5), 5);
  assert.equal(deepClone(null), null);
  assert.equal(deepClone("s"), "s");
  const fn = () => 1;
  assert.equal(deepClone(fn), fn, "函数按引用返回");
  assert.equal(deepClone({ fn }).fn, fn);
});

test("8. once 只执行一次", () => {
  let count = 0;
  const f = once((v) => {
    count += 1;
    return v * 2;
  });
  assert.equal(f(2), 4);
  assert.equal(f(10), 4, "后续调用返回首次结果");
  assert.equal(count, 1);
});

test("9. memoize 命中缓存", () => {
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
