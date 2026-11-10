import { test } from "node:test";
import assert from "node:assert/strict";

import { sumTo, factorial, countChar, isPrime, repeatWord } from "./day04.js";

test("1. sumTo：0 和 1 的边界", () => {
  assert.equal(sumTo(0), 0);
  assert.equal(sumTo(1), 1);
});

test("2. sumTo：累加到 5", () => {
  assert.equal(sumTo(5), 15);
  assert.equal(sumTo(10), 55);
});

test("3. factorial：0 和 1 都是 1", () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(1), 1);
});

test("4. factorial：5 的阶乘", () => {
  assert.equal(factorial(5), 120);
  assert.equal(factorial(6), 720);
});

test("5. countChar：统计字符", () => {
  assert.equal(countChar("hello", "l"), 2);
  assert.equal(countChar("banana", "a"), 3);
  assert.equal(countChar("hello", "z"), 0);
});

test("6. countChar：空字符串返回 0", () => {
  assert.equal(countChar("", "a"), 0);
});

test("7. isPrime：质数判断", () => {
  assert.equal(isPrime(2), true);
  assert.equal(isPrime(7), true);
  assert.equal(isPrime(13), true);
});

test("8. isPrime：合数与小于 2 的数", () => {
  assert.equal(isPrime(9), false);
  assert.equal(isPrime(15), false);
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(0), false);
});

test("9. repeatWord：重复拼接", () => {
  assert.equal(repeatWord("ab", 3), "ababab");
  assert.equal(repeatWord("x", 0), "");
  assert.equal(repeatWord("hi", 1), "hi");
});
