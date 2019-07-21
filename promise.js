class Promise2 {
  constructor(fn) {
    this.state = 'pending'
    this.success_callback = []
    this.fail_callback = []
    this.fn = fn
    this.fn(this.resolve.bind(this), this.reject.bind(this))
  }

  static resolve(value) {
    return new Promise2((resolve, reject) => {
      resolve(value)
    })
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'

      setImmediate(() => {
        this.value = value
        this.success_callback.forEach(cb => {
          this.value = cb(this.value)
        })
      })

      return this
    }
  }

  reject(value) {
    if (this.state === 'pending') {
      this.state = 'rejected'

      setImmediate(() => {
        this.value = value
        this.fail_callback.forEach(cb => cb(this.value))
      }) 
    }
  }

  then(callback) {
    this.success_callback.push(callback)
    return this
  }

  catch(callback) {
    this.fail_callback.push(callback)
  }

  static all(promises = []) {
    let result = []
    let index = 0
    return new Promise2((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(res => {
          index++
          result[i] = res
          if (index === promises.length) {
            resolve(result)            
          }
        })
      }
    })
  }

  static race(promises = []) {
    return new Promise2(resolve => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(res => {
          resolve(res)
        })
      }
    })
  }
}
