import { test } from "node:test";
import assert from "node:assert/strict";

import { answers } from "./prediction.js";
import { pick, omit, mergeDefaults, flattenObject } from "./objects.js";

test("Q1. 解构默认值只在 undefined 时生效", () => {
  const { a = 1 } = { a: undefined };
  assert.equal(answers.q1, a);
});

test("Q2. null 不触发默认值", () => {
  const { b = 1 } = { b: null };
  assert.equal(answers.q2, b);
});

test("Q3. 展开后者覆盖前者", () => {
  assert.equal(answers.q3, { ...{ a: 1, b: 1 }, ...{ b: 2 } }.b);
});

test("Q4. 浅拷贝嵌套仍共享", () => {
  const o = { n: { v: 1 } };
  const s = { ...o };
  s.n.v = 2;
  assert.equal(answers.q4, o.n.v);
});

test("Q5. rest 解构收集剩余键", () => {
  const { a, ...rest } = { a: 1, b: 2 };
  void a;
  assert.deepStrictEqual(answers.q5, rest);
});

test("Q6. call(null) 在严格模式下的 this", () => {
  const actual = typeof (function () {
    return this;
  }).call(null);
  assert.equal(answers.q6, actual);
});

test("Q7. JSON.stringify 的转换结果", () => {
  const actual = JSON.stringify({ d: new Date(0), m: new Map([["k", 1]]), u: undefined });
  assert.equal(answers.q7, actual);
});

test("Q8. 数字键会被自动排序", () => {
  assert.deepStrictEqual(answers.q8, Object.keys({ 2: "a", 1: "b", x: "c" }));
});

test("9. pick 只保留存在的键且不改入参", () => {
  const source = { a: 1, b: 2, c: 3 };
  const result = pick(source, ["a", "c", "zzz"]);
  assert.deepStrictEqual(result, { a: 1, c: 3 });
  assert.deepStrictEqual(source, { a: 1, b: 2, c: 3 });
});

test("10. omit 去掉指定键且不改入参", () => {
  const source = { a: 1, b: 2 };
  const result = omit(source, ["b"]);
  assert.deepStrictEqual(result, { a: 1 });
  assert.deepStrictEqual(source, { a: 1, b: 2 });
});

test("11. mergeDefaults 只对 undefined 兜默认值", () => {
  const defaults = { a: 1, b: 2, c: 3 };
  const result = mergeDefaults(defaults, { a: undefined, b: null });
  assert.deepStrictEqual(result, { a: 1, b: null, c: 3 });
  assert.deepStrictEqual(defaults, { a: 1, b: 2, c: 3 }, "defaults 不能被修改");
});

test("12. flattenObject 拍平嵌套", () => {
  assert.deepStrictEqual(flattenObject({ a: { b: { c: 1 } }, d: [1, 2], e: "x" }), {
    "a.b.c": 1,
    d: [1, 2],
    e: "x",
  });
});

test("13. flattenObject 支持前缀与空对象", () => {
  assert.deepStrictEqual(flattenObject({ a: { b: 1 } }, "root"), { "root.a.b": 1 });
  assert.deepStrictEqual(flattenObject({}), {});
});
