/**
 * 0-5 · 函数
 * 填完运行：npm run p0d5
 */

/** 小于 min 返回 min，大于 max 返回 max，否则返回 n */
export function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/** 返回 `${greeting}，${name}！`；greeting 默认是 "你好" */
export function greetWith(name, greeting = "你好") {
  return `${greeting}，${name}！`;
}

/** 把 fn 连续调用两次：fn(fn(x)) */
export function applyTwice(fn, x) {
  return fn(fn(x));
}

/** 先算 g(x)，再把结果交给 f */
export function compose2(f, g, x) {
  return f(g(x));
}

/** 绝对值，不许用 Math.abs */
export function absolute(n) {
  return n < 0 ? -n : n;
}
