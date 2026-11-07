/**
 * Day 4 · 对象工具集
 * 契约见 plan/phase1/day04.md，测试见 day04.test.mjs。
 * 四个函数都不许修改入参。
 */

/** 只保留 keys 里存在且属于 obj 自身的键。 */
export function pick(obj, keys) {
  throw new Error("pick 未实现");
}

/** 去掉 keys 里的键，其余保留。 */
export function omit(obj, keys) {
  throw new Error("omit 未实现");
}

/** 浅合并；options 中值为 undefined 的键用 defaults 的值（null 保留）。 */
export function mergeDefaults(defaults, options) {
  throw new Error("mergeDefaults 未实现");
}

/** 嵌套对象拍平成 "a.b.c" 键；数组按值保留，不展开。 */
export function flattenObject(obj, prefix = "") {
  throw new Error("flattenObject 未实现");
}
