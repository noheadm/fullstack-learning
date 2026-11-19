/**
 * Day 4 · 对象工具集
 * 契约见 plan/phase1/day04.md，测试见 day04.test.mjs。
 * 四个函数都不许修改入参。
 */

/** 只保留 keys 里存在且属于 obj 自身的键。 */
export function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/** 去掉 keys 里的键，其余保留。 */
export function omit(obj, keys) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/** 浅合并；options 中值为 undefined 的键用 defaults 的值（null 保留）。 */
export function mergeDefaults(defaults, options) {
  const result = { ...defaults };
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      if (options[key] !== undefined) {
        result[key] = options[key];
      }
    }
  }
  return result;
}

/** 嵌套对象拍平成 "a.b.c" 键；数组按值保留，不展开。 */
export function flattenObject(obj, prefix = "") {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(obj[key])) {
        result[newKey] = obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}
