import { test } from "node:test";
import assert from "node:assert/strict";

import { waitAll, firstSuccess, allStatuses, promisify } from "./promise-usage.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("1. waitAll 返回全部结果", async () => {
  assert.deepStrictEqual(await waitAll([Promise.resolve(1), 2]), [1, 2]);
});

test("2. waitAll 保持顺序，不受完成时间影响", async () => {
  const slow = sleep(30).then(() => "slow");
  const fast = sleep(5).then(() => "fast");
  assert.deepStrictEqual(await waitAll([slow, fast]), ["slow", "fast"]);
});

test("3. waitAll 任一失败就失败", async () => {
  await assert.rejects(
    (async () => {
      await waitAll([Promise.resolve(1), Promise.reject(new Error("bad"))]);
    })(),
    /bad/,
  );
});

test("4. firstSuccess 取第一个成功的", async () => {
  const fail = Promise.reject(new Error("no"));
  const ok = sleep(10).then(() => "b");
  assert.equal(await firstSuccess([fail, ok]), "b");
});

test("5. firstSuccess 全部失败时抛 AggregateError", async () => {
  await assert.rejects(
    (async () => {
      await firstSuccess([Promise.reject(new Error("a")), Promise.reject(new Error("b"))]);
    })(),
    (err) => err.name === "AggregateError",
  );
});

test("6. allStatuses 不抛错，按位置给出结果", async () => {
  const result = await allStatuses([Promise.resolve(1), Promise.reject(new Error("x")), 3]);
  assert.deepStrictEqual(result, ["ok", "fail", "ok"]);
});

test("7. promisify 成功路径", async () => {
  function nodeStyle(value, callback) {
    setTimeout(() => callback(null, value * 2), 5);
  }
  assert.equal(await promisify(nodeStyle)(2), 4);
});

test("8. promisify 失败路径", async () => {
  function nodeStyle(value, callback) {
    setTimeout(() => callback(new Error("neg")), 5);
  }
  await assert.rejects(
    (async () => {
      await promisify(nodeStyle)(-1);
    })(),
    /neg/,
  );
});
