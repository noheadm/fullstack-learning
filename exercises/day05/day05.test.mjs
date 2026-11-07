import { test } from "node:test";
import assert from "node:assert/strict";

import { groupBy } from "./groupBy.js";
import { flatten } from "./flatten.js";
import { topWords } from "./topWords.js";

// 允许实现返回 Object.create(null)，统一转成普通对象再比较
const plain = (obj) => Object.assign({}, obj);

test("1. groupBy 按奇偶分组", () => {
  assert.deepStrictEqual(plain(groupBy([1, 2, 3, 4], (x) => x % 2)), {
    0: [2, 4],
    1: [1, 3],
  });
});

test("2. groupBy 不修改原数组", () => {
  const items = [1, 2, 3, 4];
  groupBy(items, (x) => (x > 2 ? "big" : "small"));
  assert.deepStrictEqual(items, [1, 2, 3, 4]);
});

test("3. flatten 默认深度 1", () => {
  assert.deepStrictEqual(flatten([1, [2, [3, [4]]]]), [1, 2, [3, [4]]]);
});

test("4. flatten 深度 2", () => {
  assert.deepStrictEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
});

test("5. flatten 深度 Infinity 全拍平", () => {
  assert.deepStrictEqual(flatten([1, [2, [3, [4]]]], Infinity), [1, 2, 3, 4]);
});

test("6. flatten 不修改原数组", () => {
  const source = [1, [2, [3]]];
  const copy = structuredClone(source);
  flatten(source, Infinity);
  assert.deepStrictEqual(source, copy);
});

test("7. topWords 基础词频", () => {
  assert.deepStrictEqual(topWords("the cat and the dog and the bird", 2), [
    ["the", 3],
    ["and", 2],
  ]);
});

test("8. topWords 不区分大小写", () => {
  assert.deepStrictEqual(topWords("The the THE", 1), [["the", 3]]);
});

test("9. topWords 去标点", () => {
  assert.deepStrictEqual(topWords("cat, cat. dog!", 2), [
    ["cat", 2],
    ["dog", 1],
  ]);
});
