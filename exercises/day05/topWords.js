/**
 * Day 5 · topWords
 * 统计词频前 n 名。
 *
 * 规则：
 * 1. 全部转小写。
 * 2. 去掉所有标点，只保留字母、数字、空格（中文用 \p{L} 一起保留）。
 * 3. 按空白切分，忽略空字符串。
 * 4. 返回 [[单词, 次数], ...]，按次数降序；次数相同按单词字母序升序。
 * 5. 唯一词不足 n 个就全返回；n <= 0 或没有词返回 []。
 *
 * topWords("the cat and the dog and the bird", 2) → [["the",3],["and",2]]
 *
 * @param {string} text
 * @param {number} n
 * @returns {Array<[string, number]>}
 */
export function topWords(text, n) {
  // TODO
  // 提示：先用正则清洗，再 reduce 计数，最后 sort
  // 注意 sort 原地修改，别把内部数组直接暴露出去
  throw new Error("topWords 未实现");
}
