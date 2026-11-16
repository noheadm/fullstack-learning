/**
 * Day 1 · 预测题
 *
 * 规则：先写答案，再跑 npm run day1。不许先运行代码再抄结果。
 * 题目内容在 plan/phase1/day01.md 和 day01.test.mjs 里，一题一个键。
 */

export const answers = {
  // Q1: (function(){ return typeof a; var a = 1; })()
  q1: "undefined",

  // Q2: let 的 TDZ，try/catch 捕获到的 e.name
  q2: "ReferenceError",

  // Q3: for (var i...) 配合闭包，fns.map(f => f()) 的结果
  q3: [3, 3, 3],

  // Q4: for (let i...) 配合闭包，fns.map(f => f()) 的结果
  q4: [0, 1, 2],
  // Q5: typeof null
  q5: "object",

  // Q6: [] + {}
  q6: "[object Object]",

  // Q7: null == 0
  q7: false,

  // Q8: 0.1 + 0.2 === 0.3
  q8: false,
};
