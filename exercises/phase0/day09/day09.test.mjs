import { test } from "node:test";
import assert from "node:assert/strict";

import { createList, addTodo, completeTodo, removeTodo, countDone, formatList } from "./todo.js";

test("1. createList 返回空数组", () => {
  assert.deepStrictEqual(createList(), []);
});

test("2. addTodo 新增一条，默认未完成", () => {
  const list = addTodo([], "买菜");
  assert.equal(list.length, 1);
  assert.equal(list[0].title, "买菜");
  assert.equal(list[0].done, false);
  assert.equal(list[0].id, 1);
});

test("3. addTodo 不修改原清单", () => {
  const original = [];
  addTodo(original, "买菜");
  assert.deepStrictEqual(original, []);
});

test("4. addTodo 的 id 递增", () => {
  let list = createList();
  list = addTodo(list, "a");
  list = addTodo(list, "b");
  list = addTodo(list, "c");
  assert.deepStrictEqual(list.map((t) => t.id), [1, 2, 3]);
});

test("5. 删除后新增，id 不重复", () => {
  let list = createList();
  list = addTodo(list, "a");
  list = addTodo(list, "b");
  list = removeTodo(list, 1);
  list = addTodo(list, "c");
  const ids = list.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "id 不能重复");
  assert.equal(ids.includes(1), false, "不能用已删除的 id");
});

test("6. completeTodo 标记完成", () => {
  let list = addTodo([], "写代码");
  const done = completeTodo(list, list[0].id);
  assert.equal(done[0].done, true);
});

test("7. completeTodo 不修改原清单", () => {
  const list = addTodo([], "写代码");
  completeTodo(list, list[0].id);
  assert.equal(list[0].done, false);
});

test("8. completeTodo 找不到 id 时原样返回", () => {
  const list = addTodo([], "写代码");
  assert.deepStrictEqual(completeTodo(list, 999), list);
});

test("9. removeTodo 删除指定项", () => {
  let list = addTodo([], "a");
  list = addTodo(list, "b");
  const result = removeTodo(list, list[0].id);
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "b");
});

test("10. removeTodo 不修改原清单", () => {
  const list = addTodo([], "a");
  removeTodo(list, list[0].id);
  assert.equal(list.length, 1);
});

test("11. countDone 统计已完成", () => {
  let list = addTodo([], "a");
  list = addTodo(list, "b");
  list = completeTodo(list, list[0].id);
  assert.equal(countDone(list), 1);
  assert.equal(countDone([]), 0);
});

test("12. formatList 输出格式", () => {
  let list = addTodo([], "买菜");
  list = addTodo(list, "写代码");
  list = completeTodo(list, list[1].id);
  assert.equal(formatList(list), "1. [ ] 买菜\n2. [x] 写代码");
});
