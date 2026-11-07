import { test } from "node:test";
import assert from "node:assert/strict";

import { answers } from "./prediction.js";
import { getType } from "./types.js";

test("Q1. Number('')", () => {
  assert.equal(answers.q1, Number(""));
});

test("Q2. Number(' 12 ')", () => {
  assert.equal(answers.q2, Number(" 12 "));
});

test("Q3. Number(null)", () => {
  assert.equal(answers.q3, Number(null));
});

test("Q4. Number(undefined) 是 NaN", () => {
  assert.ok(Number.isNaN(answers.q4));
  assert.ok(Number.isNaN(Number(undefined)));
});

test("Q5. +[]", () => {
  assert.equal(answers.q5, +[]);
});

test("Q6. +{} 是 NaN", () => {
  assert.ok(Number.isNaN(answers.q6));
  assert.ok(Number.isNaN(+{}));
});

test("Q7. '5' + 3", () => {
  assert.equal(answers.q7, "5" + 3);
});

test("Q8. '5' - 3", () => {
  assert.equal(answers.q8, "5" - 3);
});

test("Q9. Number.isNaN('abc')", () => {
  assert.equal(answers.q9, Number.isNaN("abc"));
});

test("Q10. Number.isNaN(NaN)", () => {
  assert.equal(answers.q10, Number.isNaN(NaN));
});

test("getType: 原始类型", () => {
  assert.equal(getType(undefined), "undefined");
  assert.equal(getType(null), "null");
  assert.equal(getType(true), "boolean");
  assert.equal(getType(1), "number");
  assert.equal(getType(NaN), "number");
  assert.equal(getType(10n), "bigint");
  assert.equal(getType("s"), "string");
  assert.equal(getType(Symbol("s")), "symbol");
});

test("getType: 函数类", () => {
  assert.equal(getType(function named() {}), "function");
  assert.equal(getType(() => {}), "function");
  assert.equal(getType(async () => {}), "function");
});

test("getType: 内置对象", () => {
  assert.equal(getType([]), "array");
  assert.equal(getType([1, 2]), "array");
  assert.equal(getType(new Date()), "date");
  assert.equal(getType(/x/), "regexp");
  assert.equal(getType(new Map()), "map");
  assert.equal(getType(new Set()), "set");
  assert.equal(getType(new WeakMap()), "weakmap");
  assert.equal(getType(new Error("x")), "error");
});

test("getType: 普通对象（含无原型对象）", () => {
  assert.equal(getType({}), "object");
  assert.equal(getType(Object.create(null)), "object");
});
