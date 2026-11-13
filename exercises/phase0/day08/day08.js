/**
 * 0-8 · 常用数组方法
 * 填完运行：npm run p0d8
 */

/** 每个数乘 2（用 map） */
export function doubleAll(nums) {
  return nums.map((num) => num * 2);
}

/** 只保留偶数（用 filter） */
export function evensOnly(nums) {
  return nums.filter((num) => num % 2 === 0);
}

/** 求和，空数组返回 0（用 reduce） */
export function sumAll(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, num) => acc + num, 0);
}

/** 取出所有 name（用 map） */
export function namesOf(users) {
  return users.map((user) => user.name);
}

/** 第一个大于 limit 的数，没有返回 null（用 find） */
export function firstOver(nums, limit) {
  const found = nums.find((num) => num > limit);
  return found === undefined ? null : found;
}

/** 按 age 升序，返回新数组，不改原数组 */
export function sortByAge(users) {
  return [...users].sort((a, b) => a.age - b.age);
}
