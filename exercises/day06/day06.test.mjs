import { test } from "node:test";
import assert from "node:assert/strict";

import { makeCounter, createStore, curry, pipe, compose } from "./closures.js";

test("1. 两个 counter 实例互不影响", () => {
  const a = makeCounter();
  const b = makeCounter(10);
  a.inc();
  a.inc();
  assert.equal(a.value(), 2);
  assert.equal(b.value(), 10);
});

test("2. counter 状态不能从外部直接读写", () => {
  const c = makeCounter();
  c.inc();
  assert.equal(c.count, undefined);
  c.count = 999;
  assert.equal(c.value(), 1);
});

test("3. reset 回到初始值", () => {
  const c = makeCounter(5);
  c.inc();
  c.dec();
  c.dec();
  assert.equal(c.value(), 4);
  assert.equal(c.reset(), 5);
  assert.equal(c.value(), 5);
});

test("4. store.get 返回拷贝，改它不影响内部", () => {
  const store = createStore({ n: 1 });
  const snapshot = store.get();
  snapshot.n = 999;
  assert.equal(store.get().n, 1);
});

test("5. subscribe 收到变化，取消后不再收到，值不变不通知", () => {
  const store = createStore({ n: 1 });
  const seen = [];
  const unsubscribe = store.subscribe((state) => seen.push(state.n));

  store.set({ n: 2 });
  store.set({ n: 2 });
  unsubscribe();
  store.set({ n: 3 });

  assert.deepStrictEqual(seen, [2]);
  assert.deepStrictEqual(store.get(), { n: 3 });
});

test("6. curry 逐个传参", () => {
  assert.equal(curry((a, b, c) => a + b + c)(1)(2)(3), 6);
});

test("7. curry 一次传多个", () => {
  assert.equal(curry((a, b, c) => a + b + c)(1, 2)(3), 6);
});

test("8. curry 一次传完", () => {
  assert.equal(curry((a, b, c) => a + b + c)(1, 2, 3), 6);
});

test("9. pipe 从左到右", () => {
  const order = [];
  const f = (x) => {
    order.push("f");
    return x + 1;
  };
  const g = (x) => {
    order.push("g");
    return x * 2;
  };
  assert.equal(pipe(f, g)(3), 8);
  assert.deepStrictEqual(order, ["f", "g"]);
});

test("10. pipe 第一个函数接收多参数", () => {
  assert.equal(pipe((a, b) => a + b, (x) => x * 2)(1, 2), 6);
});

test("11. compose 从右到左，空 pipe 返回原值", () => {
  assert.equal(compose((x) => x + 1, (x) => x * 2)(3), 7);
  assert.equal(pipe()(42), 42);
});
