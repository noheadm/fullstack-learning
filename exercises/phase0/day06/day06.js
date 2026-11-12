/**
 * 0-6 · 数组基础
 * 填完运行：npm run p0d6
 */

/** 求和；空数组返回 0 */
export function sumArray(nums) {
  if (nums.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
  }
  return total;
}

/** 最大值；空数组返回 null */
export function maxInArray(nums) {
  if (nums.length === 0) return null;
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) {
      max = nums[i];
    }
  }
  return max;
}

/** 返回倒序的新数组，不能修改原数组 */
export function reverseArray(arr) {
  const reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

/** 统计 value 在 arr 里出现了几次 */
export function countValue(arr, value) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      count++;
    }
  }
  return count;
}

/** 用 ", " 连接；空数组返回 "" */
export function joinWords(words) {
  if (words.length === 0) return "";
  let result = words[0];
  for (let i = 1; i < words.length; i++) {
    result += ", " + words[i];
  }
  return result;
}
