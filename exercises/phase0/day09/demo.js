/**
 * 0-9 · 演示脚本（人眼检查用）
 * 运行：node exercises/phase0/day09/demo.js
 */
import { createList, addTodo, completeTodo, removeTodo, countDone, formatList } from "./todo.js";

let list = createList();
list = addTodo(list, "买菜");
list = addTodo(list, "写代码");
list = addTodo(list, "健身");

list = completeTodo(list, 2);
list = removeTodo(list, 3);

console.log("=== 待办清单 ===");
console.log(formatList(list));
console.log(`=== 已完成 ${countDone(list)} / ${list.length} ===`);
