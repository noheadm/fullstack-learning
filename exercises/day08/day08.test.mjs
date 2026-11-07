import { test } from "node:test";
import assert from "node:assert/strict";

import { MyPromise, promisify } from "./mypromise.js";

const flush = () => new Promise((resolve) => setTimeout(resolve, 10));

test("1. executor 同步执行", () => {
  let called = false;
  new MyPromise(() => {
    called = true;
  });
  assert.equal(called, true);
});

test("2. then 回调异步执行", async () => {
  let ran = false;
  MyPromise.resolve(1).then(() => {
    ran = true;
  });
  assert.equal(ran, false, "不应同步执行");
  await flush();
  assert.equal(ran, true);
});

test("3. then 链式传值", async () => {
  const value = await MyPromise.resolve(1)
    .then((x) => x + 1)
    .then((x) => x * 3);
  assert.equal(value, 6);
});

test("4. then 返回 Promise 时吸收其值", async () => {
  const value = await MyPromise.resolve(1).then(() => MyPromise.resolve(2));
  assert.equal(value, 2);

  const thenable = await MyPromise.resolve({ then(res) { res(7); } });
  assert.equal(thenable, 7);
});

test("5. 回调抛错被 catch 接住", async () => {
  const message = await MyPromise.resolve(1)
    .then(() => {
      throw new Error("boom");
    })
    .catch((e) => e.message);
  assert.equal(message, "boom");
});

test("6. catch 之后可以继续 then", async () => {
  const value = await MyPromise.reject(new Error("x"))
    .catch(() => 42)
    .then((v) => v + 1);
  assert.equal(value, 43);
});

test("7. finally 不改变值，抛错会覆盖", async () => {
  const log = [];
  const value = await MyPromise.resolve(1).finally(() => log.push("f"));
  assert.equal(value, 1);
  assert.deepStrictEqual(log, ["f"]);

  await assert.rejects(
    (async () => {
      await MyPromise.resolve(1).finally(() => {
        throw new Error("fin");
      });
    })(),
    /fin/,
  );
});

test("8. static resolve", async () => {
  assert.equal(await MyPromise.resolve(3), 3);
  const inner = MyPromise.resolve(5);
  assert.equal(await MyPromise.resolve(inner), 5);
});

test("9. static reject", async () => {
  const message = await MyPromise.reject(new Error("no")).catch((e) => e.message);
  assert.equal(message, "no");
});

test("10. static all 保序且任一失败即失败", async () => {
  assert.deepStrictEqual(await MyPromise.all([MyPromise.resolve(1), 2, MyPromise.resolve(3)]), [1, 2, 3]);
  assert.deepStrictEqual(await MyPromise.all([]), []);

  await assert.rejects(
    (async () => {
      await MyPromise.all([MyPromise.resolve(1), MyPromise.reject(new Error("bad"))]);
    })(),
    /bad/,
  );
});

test("11. static race 取最快落定", async () => {
  const slow = new MyPromise((resolve) => setTimeout(() => resolve("slow"), 30));
  assert.equal(await MyPromise.race([slow, MyPromise.resolve("fast")]), "fast");
});

test("12. promisify 成功与失败", async () => {
  function nodeStyle(value, callback) {
    setTimeout(() => {
      if (value < 0) callback(new Error("neg"));
      else callback(null, value * 2);
    }, 5);
  }
  const doubled = promisify(nodeStyle);
  assert.equal(await doubled(2), 4);
  await assert.rejects(
    (async () => {
      await doubled(-1);
    })(),
    /neg/,
  );
});
