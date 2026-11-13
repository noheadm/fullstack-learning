/**
 * 0-9 · 小项目：待办清单
 * 填完运行：npm run p0d9
 *
 * 约束：所有函数都不许修改入参 list，一律返回新数组。
 */

/** 返回空清单 */
export function createList() {
  throw new Error("createList 未实现");
}

/** 新增一条待办；id = 现有最大 id + 1 */
export function addTodo(list, title) {
  throw new Error("addTodo 未实现");
}

/** 把指定 id 标记为完成；找不到就原样返回 */
export function completeTodo(list, id) {
  throw new Error("completeTodo 未实现");
}

/** 删除指定 id；找不到就原样返回 */
export function removeTodo(list, id) {
  throw new Error("removeTodo 未实现");
}

/** 已完成的数量 */
export function countDone(list) {
  throw new Error("countDone 未实现");
}

/** 每行格式：`1. [ ] 买菜` */
export function formatList(list) {
  throw new Error("formatList 未实现");
}
