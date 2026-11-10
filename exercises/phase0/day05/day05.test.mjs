import { test } from "node:test";
import assert from "node:assert/strict";

import { clamp, greetWith, applyTwice, compose2, absolute } from "./day05.js";

test("1. clamp：在区间内原样返回", () => {
  assert.equal(clamp(5, 1, 10), 5);
});

test("2. clamp：小于下限取下限", () => {
  assert.equal(clamp(-5, 0, 10), 0);
});

test("3. clamp：大于上限取上限", () => {
  assert.equal(clamp(50, 0, 10), 10);
});

test("4. greetWith：默认问候语", () => {
  assert.equal(greetWith("小明"), "你好，小明！");
});

test("5. greetWith：自定义问候语", () => {
  assert.equal(greetWith("小明", "Hi"), "Hi，小明！");
});

test("6. applyTwice：连续调用两次", () => {
  assert.equal(applyTwice((n) => n + 1, 5), 7);
  assert.equal(applyTwice((n) => n * 2, 3), 12);
});

test("7. applyTwice：参数是函数本身，不是调用结果", () => {
  assert.equal(applyTwice((n) => n - 3, 10), 4);
});

test("8. compose2：先 g 后 f", () => {
  assert.equal(compose2((x) => x + 1, (x) => x * 2, 5), 11);
  assert.equal(compose2((x) => x * 3, (x) => x - 1, 4), 9);
});

test("9. absolute：负数变正数", () => {
  assert.equal(absolute(-3), 3);
  assert.equal(absolute(-0.5), 0.5);
});

test("10. absolute：零和正数不变", () => {
  assert.equal(absolute(0), 0);
  assert.equal(absolute(3), 3);
});

test("11. absolute：返回值是数字", () => {
  assert.equal(typeof absolute(-7), "number");
});
