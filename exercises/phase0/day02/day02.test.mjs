import { test } from "node:test";
import assert from "node:assert/strict";

import { area, greet, priceTag, shout } from "./day02.js";

test("1. area 返回乘积", () => {
  assert.equal(area(3, 4), 12);
  assert.equal(area(2.5, 4), 10);
});

test("2. area 返回的是数字，不是字符串", () => {
  assert.equal(typeof area(3, 4), "number");
});

test("3. greet 用模板字符串拼接", () => {
  assert.equal(greet("小明"), "你好，小明！");
});

test("4. greet 支持任意名字", () => {
  assert.equal(greet("Lucy"), "你好，Lucy！");
});

test("5. priceTag 保留两位小数", () => {
  assert.equal(priceTag(12), "¥12.00");
  assert.equal(priceTag(12.5), "¥12.50");
});

test("6. shout 去空格并转大写", () => {
  assert.equal(shout("  hi  "), "HI!");
  assert.equal(shout("Hi There"), "HI THERE!");
});

test("7. shout 不修改原字符串", () => {
  const input = " hi ";
  shout(input);
  assert.equal(input, " hi ");
});
