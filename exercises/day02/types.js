/**
 * Day 2 · getType
 *
 * 返回精确类型名（全小写字符串），契约见 plan/phase1/day02.md。
 * 不许用任何第三方库。
 *
 * @param {unknown} value
 * @returns {"undefined"|"null"|"boolean"|"number"|"bigint"|"string"|"symbol"|"function"|"array"|"date"|"regexp"|"map"|"set"|"weakmap"|"error"|"object"}
 */
export function getType(value) {
  // TODO:
  // 1. null / undefined 单独处理（undefined 用 typeof，null 用 === null）
  // 2. typeof 结果不是 "object" 的直接返回（注意 function）
  // 3. 剩下的用 Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const type = typeof value;
  if (type !== "object") return type;
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
