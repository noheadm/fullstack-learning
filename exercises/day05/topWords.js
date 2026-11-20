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
  // 示例：const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean);

  const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  const counter = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(counter).sort((a, b) => {
    if (a[1] !== b[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  
  if (n <= 0) return [];
  return sorted.slice(0, n);
}
