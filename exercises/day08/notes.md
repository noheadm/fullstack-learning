1.  • Promise.all：全部成功才算成功，只要有一个失败就立刻失败。
    • Promise.allSettled：等所有 Promise 都结束（无论成败），把每个的结果打包返回。
    • Promise.any：只要有一个成功就算成功，全部失败才抛出 AggregateError。
    • Promise.race：谁最先 settle（无论成功还是失败），整个结果就跟着谁定。
2.  • 失败的触发条件不同：all 是“一票否决”，依赖所有子任务都成立，有一个挂了后面就算赢了也没意义；any 是“只要有一个能跑通就行”，前面的失败只是“这条路不通”，只有所有路都堵死才算彻底失败。
    • 失败信息的形态不同：all 遇到第一个错误直接抛单个 error，因为失败点很明确；any 走到最后说明尝试过的所有分支都失败了，所以把所有错误收集进 AggregateError.errors 数组里一起抛出来，方便排查哪几个/全部都挂了
3.  这是 Node.js 早期 Error-First Callback（错误优先回调） 约定的延续，主要原因有：
    先判错，尽早返回：在回调函数里，处理错误通常是第一步（if (err) return ...）。把 err 放第一位，阅读和编写时的防守逻辑更顺手，也更不容易漏掉错误检查。
    成功时的参数数量不固定：很多异步操作成功时可能返回多个值（比如 fs.read 或某些事件/回调），或者压根没有数据（比如删除文件成功只有 err 是 null）。把固定的 err 放第一个位置，后面的参数可以灵活扩展或省略，解析起来更统一。
4.  Promise.allSettled 最终 resolve 一个数组，数组里每个元素都是一个结果对象，只有两种结构：
    • 成功时：js
{ status: 'fulfilled', value: /* 成功的值 */ }
    • 失败时：js
{ status: 'rejected', reason: /* 失败的原因（通常是 Error 或 reject 的值） */ }
5. • 状态迁移路径：Promise 只有三种状态：pending（待定）、fulfilled（已兑现）、rejected（已拒绝）。合法的状态迁移只有两条单向路径：
	• pending → fulfilled（同时绑定一个不可变的终值 value）
	• pending → rejected（同时绑定一个不可变的拒因 reason）
• 为什么 resolve 之后 reject 无效：
	1. 状态锁机制：在 resolve 和 reject 函数内部，第一行代码必须是状态守卫（if (this.state !== 'pending') return;）。一旦状态从 pending 变为 fulfilled 或 rejected，状态就被永久锁定，后续任何改变状态的调用都会被直接忽略。
	2. 设计初衷（确定性与可靠性）：Promise 代表一个异步操作的最终结果。如果结果已经确定了还能被后续代码篡改，下游所有依赖 .then 的回调都会陷入状态不一致的混乱中（例如同一个 Promise 的成功和失败回调都被触发）。
6.  then 的回调必须异步执行，不能同步调用。否则同一个函数有时同步、有时异步，调用方写不出稳定的顺序（Zalgo）。
实现上就是用 queueMicrotask 排队，等当前同步代码跑完再执行。
7.  当 resolve(x) 接收到一个 thenable（即带有 .then 方法的对象或函数，比如另一个 Promise）时，当前 Promise 的命运必须完全交由这个 thenable 决定（即“状态吸收”或“展开”）。
8.  两个防御机制：called 标志防止不规范的 thenable 把回调调两次（否则状态会被改两遍）；自引用检测（p.then(() => p)）直接 reject TypeError，否则会无限递归到爆栈。
