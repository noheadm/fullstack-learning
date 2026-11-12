import { test } from "node:test";
import assert from "node:assert/strict";

import { sumArray, maxInArray, reverseArray, countValue, joinWords } from "./day06.js";

test("1. sumArray：空数组是 0", () => {
  assert.equal(sumArray([]), 0);
});

test("2. sumArray：求和", () => {
  assert.equal(sumArray([1, 2, 3]), 6);
  assert.equal(sumArray([-1, 1]), 0);
});

test("3. maxInArray：找出最大值", () => {
  assert.equal(maxInArray([3, 9, 2]), 9);
  assert.equal(maxInArray([-5, -2]), -2);
});

test("4. maxInArray：空数组返回 null", () => {
  assert.equal(maxInArray([]), null);
});

test("5. reverseArray：返回倒序数组", () => {
  assert.deepStrictEqual(reverseArray([1, 2, 3]), [3, 2, 1]);
  assert.deepStrictEqual(reverseArray(["a"]), ["a"]);
});

test("6. reverseArray：不修改原数组", () => {
  const source = [1, 2, 3];
  reverseArray(source);
  assert.deepStrictEqual(source, [1, 2, 3]);
});

test("7. countValue：统计出现次数", () => {
  assert.equal(countValue(["a", "b", "a"], "a"), 2);
  assert.equal(countValue([1, 2, 1, 1], 1), 3);
});

test("8. countValue：没出现过返回 0", () => {
  assert.equal(countValue([1, 2], 9), 0);
});

test("9. joinWords：用逗号加空格连接", () => {
  assert.equal(joinWords(["a", "b", "c"]), "a, b, c");
});

test("10. joinWords：单个和空数组", () => {
  assert.equal(joinWords(["only"]), "only");
  assert.equal(joinWords([]), "");
});

test("11. 数值参数不会被这些函数改掉", () => {
  const source = [1, 2, 3];
  sumArray(source);
  maxInArray(source);
  countValue(source, 1);
  assert.deepStrictEqual(source, [1, 2, 3]);
});
