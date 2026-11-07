import { test } from "node:test";
import assert from "node:assert/strict";

import { canVote, grade, isEven, max3 } from "./day03.js";

test("1. canVote：17 岁不能投票", () => {
  assert.equal(canVote(17), false);
});

test("2. canVote：18 岁可以投票", () => {
  assert.equal(canVote(18), true);
});

test("3. grade：90 分及以上是 A", () => {
  assert.equal(grade(95), "A");
  assert.equal(grade(90), "A");
});

test("4. grade：80 分段是 B", () => {
  assert.equal(grade(85), "B");
  assert.equal(grade(80), "B");
});

test("5. grade：70 分段是 C", () => {
  assert.equal(grade(75), "C");
});

test("6. grade：60 分段是 D", () => {
  assert.equal(grade(60), "D");
});

test("7. grade：60 以下是 F", () => {
  assert.equal(grade(59), "F");
  assert.equal(grade(0), "F");
});

test("8. isEven：偶数返回 true", () => {
  assert.equal(isEven(4), true);
  assert.equal(isEven(0), true);
});

test("9. isEven：奇数返回 false", () => {
  assert.equal(isEven(7), false);
});

test("10. max3：返回最大值", () => {
  assert.equal(max3(1, 5, 3), 5);
  assert.equal(max3(9, 2, 3), 9);
  assert.equal(max3(-1, -5, -3), -1);
});
