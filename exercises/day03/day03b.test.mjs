import { test } from "node:test";
import assert from "node:assert/strict";

import { deepClone } from "./fns.js";

test("1. 普通对象：嵌套属性不共享", () => {
  const source = { a: 1, inner: { b: 2 } };
  const copy = deepClone(source);
  assert.notEqual(copy, source);
  assert.notEqual(copy.inner, source.inner);
  copy.inner.b = 99;
  assert.equal(source.inner.b, 2);
});

test("2. 数组：元素独立", () => {
  const source = [{ x: 1 }, [2, 3]];
  const copy = deepClone(source);
  assert.deepStrictEqual(copy, [{ x: 1 }, [2, 3]]);
  assert.notEqual(copy[0], source[0]);
  copy[0].x = 9;
  assert.equal(source[0].x, 1);
});

test("3. Date 与 RegExp 保留类型", () => {
  const source = { d: new Date("2020-01-01T00:00:00Z"), re: /abc/gi };
  const copy = deepClone(source);
  assert.ok(copy.d instanceof Date);
  assert.equal(copy.d.getTime(), source.d.getTime());
  assert.ok(copy.re instanceof RegExp);
  assert.equal(copy.re.source, "abc");
  assert.equal(copy.re.flags, "gi");
});

test("4. Map 与 Set 也拷贝内容", () => {
  const source = { m: new Map([["k", { v: 1 }]]), s: new Set([1, 2]) };
  const copy = deepClone(source);
  assert.ok(copy.m instanceof Map);
  assert.equal(copy.m.get("k").v, 1);
  assert.notEqual(copy.m.get("k"), source.m.get("k"));
  assert.ok(copy.s instanceof Set);
  assert.deepStrictEqual([...copy.s], [1, 2]);
});

test("5. 循环引用不爆栈，且指向副本自己", () => {
  const source = { name: "a" };
  source.self = source;
  const copy = deepClone(source);
  assert.notEqual(copy, source);
  assert.equal(copy.self, copy);
  assert.equal(copy.name, "a");
});

test("6. 原始值与函数原样返回", () => {
  assert.equal(deepClone(5), 5);
  assert.equal(deepClone(null), null);
  assert.equal(deepClone("s"), "s");
  const fn = () => 1;
  assert.equal(deepClone(fn), fn);
  assert.equal(deepClone({ fn }).fn, fn);
});
