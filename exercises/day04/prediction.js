/**
 * Day 4 · 预测题
 * 先写答案，再跑 npm run day4。
 */

export const answers = {
  // Q1: const { a = 1 } = { a: undefined }; a
  q1: 1,
  // Q2: const { b = 1 } = { b: null }; b
  q2: null,
  // Q3: ({...{a:1,b:1}, ...{b:2}}).b
  q3: 2,
  // Q4: const o={n:{v:1}}; const s={...o}; s.n.v=2; o.n.v
  q4: 2,
  // Q5: const {a, ...rest} = {a:1,b:2}; rest
  q5: { b: 2 },
  // Q6: typeof (function(){ return this; }).call(null)  （ESM 严格模式）
  q6: "object",
  // Q7: JSON.stringify({ d: new Date(0), m: new Map([["k",1]]), u: undefined })
  q7: '{"d":"1970-01-01T00:00:00.000Z","m":{}}',
  // Q8: Object.keys({ 2: "a", 1: "b", x: "c" })
  q8: ["1", "2", "x"],
};
