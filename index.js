class MyPromise {
	constructor(executor) {
		// pending, resolve, reject
		this.status = "pending"
		this.value = null
		this.reason = null

		this.onFulfilled = null
		this.onRejected = null

		let resolve = (value) => {
			this.value = value
			this.onFulfilled && this.onFulfilled(this.value)
		}

		let reject = (error) => {
			this.reason = error
			this.onRejected && this.onRejected(this.reason)
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
		this.onFulfilled = onFulfilled
		this.onRejected - onRejected
	}
}

let p1 = new MyPromise((resolve, reject) => {
	resolve("test")
	setTimeout(() => {}, 0)
})
p1.then((res) => {
	console.log(res)
}).then((res) => {
	console.log(res)
})
