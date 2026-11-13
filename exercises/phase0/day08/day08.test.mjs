import { test } from "node:test";
import assert from "node:assert/strict";

import { doubleAll, evensOnly, sumAll, namesOf, firstOver, sortByAge } from "./day08.js";

test("1. doubleAll：每个数乘 2", () => {
  assert.deepStrictEqual(doubleAll([1, 2, 3]), [2, 4, 6]);
});

test("2. doubleAll：空数组和原数组不变", () => {
  const source = [1, 2];
  assert.deepStrictEqual(doubleAll([]), []);
  doubleAll(source);
  assert.deepStrictEqual(source, [1, 2]);
});

test("3. evensOnly：只留偶数", () => {
  assert.deepStrictEqual(evensOnly([1, 2, 3, 4, 5]), [2, 4]);
});

test("4. evensOnly：全是奇数时返回空数组", () => {
  assert.deepStrictEqual(evensOnly([1, 3]), []);
});

test("5. sumAll：求和", () => {
  assert.equal(sumAll([1, 2, 3]), 6);
  assert.equal(sumAll([-1, 1]), 0);
});

test("6. sumAll：空数组返回 0", () => {
  assert.equal(sumAll([]), 0);
});

test("7. namesOf：取出所有名字", () => {
  const users = [
    { name: "小明", age: 18 },
    { name: "小红", age: 20 },
  ];
  assert.deepStrictEqual(namesOf(users), ["小明", "小红"]);
});

test("8. namesOf：空数组", () => {
  assert.deepStrictEqual(namesOf([]), []);
});

test("9. firstOver：找到第一个", () => {
  assert.equal(firstOver([1, 5, 9], 4), 5);
});

test("10. firstOver：没有满足的返回 null", () => {
  assert.equal(firstOver([1, 2], 10), null);
});

test("11. sortByAge：按年龄升序", () => {
  const users = [
    { name: "a", age: 30 },
    { name: "b", age: 18 },
    { name: "c", age: 25 },
  ];
  assert.deepStrictEqual(sortByAge(users).map((u) => u.age), [18, 25, 30]);
});

test("12. sortByAge：不修改原数组", () => {
  const users = [
    { name: "a", age: 30 },
    { name: "b", age: 18 },
  ];
  sortByAge(users);
  assert.deepStrictEqual(users.map((u) => u.age), [30, 18]);
});
