1. `Promise`是基于观察者模式实现的，`then`方法就是观察者模式中的订阅，`resolve`方法就是观察者模式中的发布,当Promise的状态发生改变时，会通知所有的观察者
2. `Promise`涉及到Javascript中的时间循环机制EventLoop、微任务和宏任务
3. [Promise A+规范](https://promisesaplus.com/)
4. 首先 `Promise` 是一个类，它接收一个执行函数 `executor`，它接收两个参数：`resolve` 和 `reject`，这两个参数是 Promise 内部定义的两个函数，用来改变状态并执行对应回调函数。