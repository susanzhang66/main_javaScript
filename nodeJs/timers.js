// timers   全局函数

// 定时器
// Immediate 类
// 	该对象是内部创建的，并从 setImmediate() 返回。 它可以传给 clearImmediate() 以便取消预定的动作。
// Timeout 类
// 	timeout.ref()
// 	timeout.unref()
// 预定定时器
// 	setImmediate(callback[, ...args])

// 	setInterval(callback, delay[, ...args])
// 	setTimeout(callback, delay[, ...args])
// 取消定时器
// 	clearImmediate(immediate)
// 	clearInterval(timeout)
// 	clearTimeout(timeout)

// 注意：
// 不可能取消使用setImmediate()，setTimeout()的promisified变体创建的定时器。


// setImmediate(callback[, ...args])
// 预定立即执行的 callback，它是在 I/O 事件的回调之后被触发。 返回一个用于 clearImmediate() 的 Immediate。
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);

setImmediatePromise('foobar').then((value) => {
  // value === 'foobar' (passing values is optional)
  // This is executed after all I/O callbacks.
});

// or with async function
async function timerExample() {
  console.log('Before I/O callbacks');
  await setImmediatePromise();
  console.log('After I/O callbacks');
}
timerExample()