import { test } from "node:test";
import assert from "node:assert/strict";

import { makeUser, incrementAge, countKeys, hasKey, readValue, formatAddress } from "./day07.js";

test("1. makeUser：返回带 name 和 age 的对象", () => {
  assert.deepStrictEqual(makeUser("小明", 18), { name: "小明", age: 18 });
});

test("2. incrementAge：age 加 1", () => {
  const result = incrementAge({ name: "小明", age: 18 });
  assert.equal(result.age, 19);
  assert.equal(result.name, "小明");
});

test("3. incrementAge：不修改原对象，返回的是新对象", () => {
  const user = { name: "小明", age: 18 };
  const result = incrementAge(user);
  assert.equal(user.age, 18, "原对象不能被改");
  assert.notEqual(result, user, "必须返回新对象");
});

test("4. countKeys：统计键的数量", () => {
  assert.equal(countKeys({}), 0);
  assert.equal(countKeys({ a: 1 }), 1);
  assert.equal(countKeys({ a: 1, b: 2, c: 3 }), 3);
});

test("5. hasKey：判断键是否存在", () => {
  const user = { name: "小明", x: undefined };
  assert.equal(hasKey(user, "name"), true);
  assert.equal(hasKey(user, "age"), false);
});

test("6. hasKey：值是 undefined 的键也算存在", () => {
  assert.equal(hasKey({ x: undefined }, "x"), true);
});

test("7. readValue：读出对应的值", () => {
  const user = { name: "小明", age: 18 };
  assert.equal(readValue(user, "age"), 18);
});

test("8. readValue：键不存在返回 null", () => {
  assert.equal(readValue({ a: 1 }, "zzz"), null);
});

test("9. formatAddress：拼出城市-街道", () => {
  assert.equal(formatAddress({ city: "上海", street: "南京路" }), "上海-南京路");
});

test("10. formatAddress：不同数据也能用", () => {
  assert.equal(formatAddress({ city: "北京", street: "长安街" }), "北京-长安街");
});

test("11. readValue：值为 0 也要正常返回", () => {
  assert.equal(readValue({ count: 0 }, "count"), 0);
});

test("12. readValue：空字符串不等于不存在", () => {
  assert.equal(readValue({ note: "" }, "note"), "");
});
