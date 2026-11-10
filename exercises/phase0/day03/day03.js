/**
 * 0-3 · 条件判断
 * 填完运行：npm run p0d3
 */

/** 满 18 岁返回 true */
export function canVote(age) {
  return age >= 18;
}

/** 90+ → "A"，80+ → "B"，70+ → "C"，60+ → "D"，其余 → "F" */
export function grade(score) {
  if (score >= 90) {
    return "A";
  }
  if (score >= 80) {
    return "B";
  }
  if (score >= 70) {
    return "C";
  }
  if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}
/** 偶数返回 true */
export function isEven(n) {
  return n % 2 === 0;
}

/** 返回三个数里最大的 */
export function max3(a, b, c) {
  return a >= b && a >= c ? a : b >= a && b >= c ? b : c;
}
