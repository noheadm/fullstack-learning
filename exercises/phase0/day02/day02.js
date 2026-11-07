/**
 * 0-2 · 数字与字符串
 * 填完运行：npm run p0d2
 */

/** 返回宽 × 高 */
export function area(w, h) {
  return w * h;
}
/** 返回 `你好，小明！` 这种格式（用模板字符串） */
export function greet(name) {
  return `你好，${name}！`;
}

/** 返回 `¥12.50` 这种格式，保留两位小数 */
export function priceTag(yuan) {
  return '¥' + yuan.toFixed(2);
}

/** 去掉首尾空格、转大写、末尾加 ! */
export function shout(text) {
  return text.trim().toUpperCase() + '!';
}
