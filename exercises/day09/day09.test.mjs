import { test } from "node:test";
import assert from "node:assert/strict";

import { sleep, withTimeout, retry, mapLimit } from "./async-utils.js";

test("1. sleep 至少等待指定时间", async () => {
  const start = Date.now();
  await sleep(30);
  assert.ok(Date.now() - start >= 25, "sleep 时间不足");
});

test("2. withTimeout 正常返回", async () => {
  assert.equal(await withTimeout(Promise.resolve(7), 50), 7);
});

test("3. withTimeout 超时", async () => {
  const slow = new Promise((resolve) => setTimeout(() => resolve("late"), 100));
  await assert.rejects(
    (async () => {
      await withTimeout(slow, 20);
    })(),
    /timeout/,
  );
});

test("4. withTimeout 透传原错误", async () => {
  await assert.rejects(
    (async () => {
      await withTimeout(Promise.reject(new Error("origin")), 50);
    })(),
    /origin/,
  );
});

test("5. retry 首次成功只调用一次", async () => {
  let calls = 0;
  const result = await retry(async () => {
    calls += 1;
    return "ok";
  });
  assert.equal(result, "ok");
  assert.equal(calls, 1);
});

test("6. retry 失败两次后成功", async () => {
  let calls = 0;
  const result = await retry(async () => {
    calls += 1;
    if (calls < 3) throw new Error("flaky");
    return calls;
  });
  assert.equal(result, 3);
  assert.equal(calls, 3);
});

test("7. retry 用尽次数后抛最后一次错误", async () => {
  let calls = 0;
  await assert.rejects(
    (async () => {
      await retry(
        async () => {
          calls += 1;
          throw new Error(`fail-${calls}`);
        },
        { times: 3, delay: 5 },
      );
    })(),
    /fail-3/,
  );
  assert.equal(calls, 3);
});

test("8. mapLimit 并发不超过上限", async () => {
  let active = 0;
  let peak = 0;
  const items = [1, 2, 3, 4, 5];
  const result = await mapLimit(items, 2, async (n) => {
    active += 1;
    peak = Math.max(peak, active);
    await sleep(10);
    active -= 1;
    return n * 2;
  });
  assert.deepStrictEqual(result, [2, 4, 6, 8, 10]);
  assert.ok(peak <= 2, `并发峰值 ${peak} 超过上限`);
});

test("9. mapLimit 空数组", async () => {
  assert.deepStrictEqual(await mapLimit([], 3, async (x) => x), []);
});
