import { test } from "node:test";
import assert from "node:assert/strict";

import { answers } from "./prediction.js";
import { varInLoop, letInLoop } from "./scope.js";

test("Q1. var 提升后 typeof", () => {
  const actual = (function () {
    return typeof a;
    var a = 1;
  })();
  assert.equal(answers.q1, actual);
});

test("Q2. let 的 TDZ 错误名", () => {
  const actual = (function () {
    try {
      a;
      let a = 1;
      return "ok";
    } catch (e) {
      return e.name;
    }
  })();
  assert.equal(answers.q2, actual);
});

test("Q3. for(var) 闭包共享变量", () => {
  const fns = [];
  for (var i = 0; i < 3; i++) fns.push(() => i);
  assert.deepStrictEqual(answers.q3, fns.map((f) => f()));
});

test("Q4. for(let) 闭包各自捕获", () => {
  const fns = [];
  for (let i = 0; i < 3; i++) fns.push(() => i);
  assert.deepStrictEqual(answers.q4, fns.map((f) => f()));
});

test("Q5. typeof null", () => {
  assert.equal(answers.q5, typeof null);
});

test("Q6. [] + {}", () => {
  assert.equal(answers.q6, [] + {});
});

test("Q7. null == 0", () => {
  assert.equal(answers.q7, null == 0);
});

test("Q8. 0.1 + 0.2 === 0.3", () => {
  assert.equal(answers.q8, 0.1 + 0.2 === 0.3);
});

test("Q9. varInLoop() === [3,3,3]", () => {
  assert.deepStrictEqual(varInLoop(), [3, 3, 3]);
});

test("Q10. letInLoop() === [0,1,2]", () => {
  assert.deepStrictEqual(letInLoop(), [0, 1, 2]);
});
