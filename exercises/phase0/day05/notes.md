1. fn 是函数本身（函数的引用）；fn() 是调用它并拿到返回值。
2. 没有return返回undefined
3.  function g(a, b) { return a + b; }
    function f(n) { return n + 1; }
    const numberplus = f(g(2, 1));
    console.log(numberplus); // → 4