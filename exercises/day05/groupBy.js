/**
 * Day 5 · groupBy
 * 按 keyFn 的返回值分组，返回一个新对象。
 * 不许修改 items，不许用 Object.groupBy（自己用 reduce 写）。
 *
 * @param {Array} items
 * @param {(item: any, index: number) => string|number} keyFn
 * @returns {Record<string, any[]>}
 */
export function groupBy(items, keyFn) {
  // TODO: 用 reduce 实现
  // 提示：Object.create(null) 可以避免 __proto__ 之类的键污染
  return items.reduce((acc, item, index) => {
    const key = keyFn(item, index)
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, Object.create(null))
}
