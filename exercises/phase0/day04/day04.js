/**
 * 0-4 · 循环
 * 填完运行：npm run p0d4
 */

/** 1 + 2 + ... + n；n 为 0 时返回 0 */
export function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
/** n 的阶乘；0 的阶乘是 1 */
export function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

/** 统计 ch 在 text 里出现了几次 */
export function countChar(text, ch) {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ch) {
      count++;
    }
  }
  return count;
}

/** 质数返回 true；小于 2 都返回 false */
export function isPrime(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
    console.count("isPrime");
  }
  return true;
}

/** 返回 word 重复 times 次的结果；不许用 String.repeat */
export function repeatWord(word, times) {
  let result = "";
  for (let i = 0; i < times; i++) {
    result += word;
  }
  return result;
}
