/**
 * 0-9 · 小项目：待办清单
 * 填完运行：npm run p0d9
 *
 * 约束：所有函数都不许修改入参 list，一律返回新数组。
 */

/** 返回空清单 */
export function createList() {
  return [];
}

/** 新增一条待办；id = 现有最大 id + 1 */
export function addTodo(list, title) {
  const maxId = list.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
  const newTodo = { id: maxId + 1, title, done: false };
  return [...list, newTodo];
}

/** 把指定 id 标记为完成；找不到就原样返回 */
export function completeTodo(list, id) {
  const index = list.findIndex((todo) => todo.id === id);
  if (index === -1) return [...list];
  const newList = [...list];
  newList[index] = { ...newList[index], done: true };
  return newList;
}

/** 删除指定 id；找不到就原样返回 */
export function removeTodo(list, id) {
  const index = list.findIndex((todo) => todo.id === id);
  if (index === -1) return [...list];
  const newList = [...list];
  newList.splice(index, 1);
  return newList;
}

/** 已完成的数量 */
export function countDone(list) {
  return list.filter((todo) => todo.done).length;
}

/** 每行格式：`1. [ ] 买菜` */
export function formatList(list) {
  return list.map((todo, index) => `${index + 1}. [${todo.done ? 'x' : ' '}] ${todo.title}`).join('\n');
}
