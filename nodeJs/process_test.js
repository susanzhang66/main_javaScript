// Event: 'uncaughtException'
// 正确使用'uncaughtException'事件的方式，是用它在进程结束前执行一些已分配资源(比如文件描述符，句柄等等)的同步清理操作。 触发'uncaughtException'事件后，用它来尝试恢复应用正常运行的操作是不安全的

// 想让一个已经崩溃的应用正常运行，更可靠的方式应该是启动另外一个进程来监测/探测应用是否出错， 无论uncaughtException事件是否被触发，如果监测到应用出错，则恢复或重启应用。

// const fs = require('fs');

// process.on('uncaughtException', (err) => {
//   fs.writeSync(1, `Caught exception: ${err}\n`);
// });

// setTimeout(() => {
//   console.log('This will still run.');  //输出了这个。PS:正常情况，报错了，这里是不会输出的。但监听uncaughtException是可以输出的。
// }, 500);

// // 故意调用一个不存在的函数，应用会抛出未捕获的异常
// nonexistentFunc();
// console.log('This will not run.');

//---------此刻分割－－－－  warning－－－－－－－


// process.on('warning', (warning) => {
//   console.warn(warning.name);    // Print the warning name
//   console.warn(warning.message); // Print the warning message
//   console.warn(warning.stack);   // Print the stack trace
// });
// const events = require('events');

// const p = process.on('warning', (warning) => console.warn('Do not do that!'));
// events.defaultMaxListeners = 1;
// process.on('foo', () => {});    //正常提示会检测到2个内存泄漏。
// process.on('foo', () => {});

// －－－－－－－－－－－－－－－－－－－－－

// Signal Events

// Begin reading from stdin so the process does not exit.
// process.stdin.resume();

// process.on('SIGINT', () => {
//   console.log('Received SIGINT.  Press Control-D to exit.');
// });

// console.log(`Version: ${process.version}`);
//---------------------------
/*1:声明变量*/
var num1, num2;
/*2：向屏幕输出，提示信息，要求输入num1*/
process.stdout.write('请输入num1的值：');
/*3：监听用户的输入*/
process.stdin.on('data', function (chunk) {
    if (!num1) {
        num1 = Number(chunk);
        /*4：向屏幕输出，提示信息，要求输入num2*/
        process.stdout.write('请输入num2的值');
    } else {
        num2 = Number(chunk);
        process.stdout.write('结果是：' + (num1 + num2));
    }
});




