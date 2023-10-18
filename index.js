// 第三版：实现 promise 的异步链式调用
// const p1 = new MyPromise((resolved, rejected) => {
//   resolved('我 resolved 了');
// });

// p1.then((res) => {
//   console.log(res);
//   return new MyPromise((resolved, rejected) => {
//     setTimeout(() => {
//       resolved('then1');
//     }, 1000)
//   });
// })
// .then((res) => {
//   console.log(res);
//   return new MyPromise((resolved, rejected) => {
//     setTimeout(() => {
//       resolved('then2');
//     }, 1000)
//   });
// })
// .then((res) => {
//   console.log(res);
//   return 'then3';
// })

class MyPromise {
	static PENDING = "pending"
	static RESOLVED = "resolved"
	static REJECTED = "rejected"

	constructor(executor) {
		// pending, resolve, reject
		this.status = MyPromise.PENDING
		this.value = null
		this.reason = null

		// this.onFulfilled = null
		// this.onRejected = null

		this.resolveQueues = []
		this.rejectQueues = []

		let resolve = (value) => {
			if (this.status == MyPromise.PENDING) {
				this.status = MyPromise.RESOLVED
				this.value = value
				// this.onFulfilled && this.onFulfilled(this.value)
				this.resolveQueues && this.resolveQueues.forEach((fn) => fn(this.value))
			}
		}

		let reject = (error) => {
			if (this.status == MyPromise.PENDING) {
				this.status = MyPromise.REJECTED
				this.reason = error
				// this.onRejected && this.onRejected(this.reason)
				this.rejectQueues && this.rejectQueues.forEach((fn) => fn(this.reason))
			}
		}

		if (typeof executor == "function") {
			try {
				executor(resolve, reject)
			} catch (err) {
				reject(err)
			}
		} else {
			reject(err)
		}
	}

	// then函数，传入onFulFilled和onRejected方法
	then(onFulfilled, onRejected) {
		// this.onFulfilled = onFulfilled
		// this.onRejected - onRejected

		// 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
		// 当参数不是函数类型时，需要创建一个函数赋值给对应的参数
		// 这也就实现了 透传
		onFulfilled =
			typeof onFulfilled === "function" ? onFulfilled : (value) => value
		onRejected =
			typeof onRejected === "function"
				? onRejected
				: (reason) => {
						throw reason
				  }

		let p1 = null
		p1 = new MyPromise((resolve, reject) => {
			// 当状态是等待态的时候，需要将两个参数塞入到对应的回调数组中
			// 当状态改变之后，在执行回调函数中的函数
			if (this.status === MyPromise.PENDING) {
				this.resolveQueues.push((value) => {
					let x = onFulfilled(value)
					// resolve(x);
					resolvePromise(p1, x, resolve, reject)
				})
				this.rejectQueues.push((reason) => {
					let x = onRejected(reason)
					// resolve(x);
					resolvePromise(p1, x, resolve, reject)
				})
			}

			// 状态是成功态，直接就调用 onFulfilled 函数
			if (this.status === MyPromise.RESOLVED) {
				let x = onFulfilled(this.value)
				// resolve(x);
				resolvePromise(p1, x, resolve, reject)
			}

			// 状态是成功态，直接就调用 onRejected 函数
			if (this.status === MyPromise.REJECTED) {
				let x = onRejected(this.reason)
				// reject && reject(x);
				resolvePromise(p1, x, resolve, reject)
			}
		})
		return p1
	}
}

const resolvePromise = (promise, x, resolve, reject) => {
	debugger
	if (x instanceof MyPromise) {
		const then = x.then
		if (x.status == MyPromise.PENDING) {
			then.call(
				x,
				(y) => resolvePromise(promise, y, resolve, reject),
				(err) => reject(err)
			)
		} else {
			x.then(resolve, reject)
		}
	} else {
		resolve(x)
	}
}

// let p1 = new MyPromise((resolve, reject) => {
// 	resolve("test")
// })
// p1.then((res) => {
// 	console.log(res)
// 	return "t1"
// }).then((res) => {
// 	console.log(res)
// 	return "t2"
// })

// let p2 = new MyPromise((resolve, reject) => {
// 	resolve("test")
// })
// p2.then(12).then((res) => {
// 	console.log(res)
// 	return "t2"
// })


const p1 = new MyPromise((resolved, rejected) => {
  resolved('我 resolved 了');
});

p1.then((res) => {
  console.log(res);
  return new MyPromise((resolved, rejected) => {
    setTimeout(() => {
      resolved('then1');
    }, 1000)
  });
})
.then((res) => {
  console.log(res);
  return new MyPromise((resolved, rejected) => {
    setTimeout(() => {
      rejected('then2');
    }, 1000)
  });
})
.then((res) => {
  console.log(res);
  return 'then3';
})