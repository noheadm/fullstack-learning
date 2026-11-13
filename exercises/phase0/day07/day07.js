/**
 * 0-7 · 对象基础
 * 填完运行：npm run p0d7
 */

/** 返回 { name, age } */
export function makeUser(name, age) {
  return { name, age };
}

/** 返回 age 加 1 的新对象，不修改入参 */
export function incrementAge(user) {
  return { ...user, age: user.age + 1 };
}

/** 返回键的数量 */
export function countKeys(obj) {
  return Object.keys(obj).length;
}

/** 键存在返回 true */
export function hasKey(obj, key) {
  return key in obj;
}

/** 返回 obj[key]；键不存在返回 null */
export function readValue(obj, key) {
  if (key in obj) {
    return obj[key];
  }
  return null;
}

/** { city, street } → "城市-街道" */
export function formatAddress(addr) {
  return `${addr.city}-${addr.street}`;
}
