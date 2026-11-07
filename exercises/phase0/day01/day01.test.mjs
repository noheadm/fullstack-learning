import { test } from "node:test";
import assert from "node:assert/strict";

import { myName, myAge, introduce } from "./day01.js";

test("1. myName 是字符串，且已经改成你的名字", () => {
  assert.equal(typeof myName, "string");
  assert.notEqual(myName, "你的名字", "别留着占位符");
  assert.ok(myName.length >= 1);
});

test("2. myAge 是数字（不是带引号的字符串）", () => {
  assert.equal(typeof myAge, "number");
  assert.ok(Number.isInteger(myAge), "年龄应该是整数");
});

test("3. myAge 已经改成真实年龄", () => {
  assert.ok(myAge > 0 && myAge < 120, "年龄应该在合理范围");
});

test("4. introduce() 返回字符串", () => {
  assert.equal(typeof introduce(), "string");
});

test("5. introduce() 里包含名字", () => {
  assert.ok(introduce().includes(myName));
});

test("6. introduce() 里包含年龄，并且以「岁」结尾", () => {
  const text = introduce();
  assert.ok(text.includes(String(myAge)), "要包含年龄数字");
  assert.ok(text.trim().endsWith("岁"), "格式是「名字 今年 N 岁」");
});
