/**
 * Day 5 · flatten
 * 把嵌套数组拍平到指定深度，返回新数组。
 * 禁止使用 arr.flat / arr.flatMap，禁止修改入参。
 *
 * flatten([1, [2, [3, [4]]]])        → [1, 2, [3, [4]]]
 * flatten([1, [2, [3, [4]]]], 2)     → [1, 2, 3, [4]]
 * flatten([1, [2, [3, [4]]]], Infinity) → [1, 2, 3, 4]
 *
 * @param {Array} arr
 * @param {number} depth 默认 1
 * @returns {Array}
 */
export function flatten(arr, depth = 1) {
  // TODO
  // 提示：depth <= 0 时元素原样保留；Array.isArray 判断要不要继续拆
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
