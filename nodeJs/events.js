// events事件  目录：

// 给监听器传入参数与 this
// 异步与同步
// 只处理事件一次
// 错误事件
// EventEmitter 类

// 所有能触发事件的对象都是 EventEmitter 类的实例。 这些对象开放了一个 eventEmitter.on() 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

// const myEmitter = new MyEmitter();

// myEmitter.on('event', () => {
// 	//this如果是非 箭头函数，指向 EventEmitter
// 	console.log('触发了一个事件');
// })

// myEmitter.emit('event');

//--------------------------
// setImmediate() 或 process.nextTick()

// 可以使用 setImmediate() 或 process.nextTick() 方法切换到异步操作模式：

// const myEmitter = new MyEmitter();
// myEmitter.on('event', (a, b) => {
//   setImmediate(() => {
//     console.log('这个是异步发生的');
//   });
//   console.log('ceshiceshiceshi')
// });
// myEmitter.emit('event', 'a', 'b');

//------------newListener-------------removeListener-------------

// 当新的监听器被添加时，所有的 EventEmitter 会触发 'newListener' 事件；当移除已存在的监听器时，则触发 'removeListener'。

const myEmitter = new MyEmitter();
// 只处理一次，所以不会无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在开头插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
  console.log('ceshice');
});
myEmitter.on('event', () => {  //监听一次 就会触发一次  newListener
  console.log('A');
});
// myEmitter.emit('event');



