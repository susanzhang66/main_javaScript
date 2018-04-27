// process(进程)
// process 对象是EventEmitter的实例.
// process 对象是一个 global （全局变量），提供有关信息，控制当前 Node.js 进程。作为一个对象，它对于 Node.js 应用程序始终是可用的，故无需使用 require()。

process.pid：当前进程的进程号。
process.version：Node的版本，比如v0.10.18。
process.platform：当前系统平台，比如Linux。
process.title：默认值为“node”，可以自定义该值。
process.argv：当前进程的命令行参数数组。
process.env：指向当前shell的环境变量，比如process.env.HOME。
process.execPath：运行当前进程的可执行文件的绝对路径。
process.stdout：指向标准输出。
process.stdin：指向标准输入。
process.stderr：指向标准错误。

process对象提供以下方法：

process.exit()：退出当前进程。
process.cwd()：返回运行当前脚本的工作目录的路径。_
process.chdir()：改变工作目录。
process.nextTick()：将一个回调函数放在下次事件循环的顶部。

1）exit事件

当前进程退出时，会触发exit事件，可以对该事件指定回调函数。这一个用来定时检查模块的状态的好钩子(hook)(例如单元测试),当主事件循环在执行完’exit’的回调函数后将不再执行,所以在exit事件中定义的定时器可能不会被加入事件列表.
process.on('exit', function () {
  fs.writeFileSync('/tmp/myfile', 'This MUST be saved on exit.');
});
2）uncaughtException事件
当前进程抛出一个没有被捕捉的意外时，会触发uncaughtException事件。
 process.on('uncaughtException', function (err) {
   console.error('An uncaught error occurred!');
   console.error(err.stack);
 });


const NS_PER_SEC = 1e9;
const time = process.hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = process.hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // benchmark took 1000000552 nanoseconds
}, 1000);
－－－－－－－－－ 分割线
Event: 'exit'  //回调函数 只能是同步操作。如下：timeout操作永远不会被执行(因为不是同步操作)

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});

Event: 'rejectionHandled'  //  todo....
如果有Promise被rejected，并且此Promise在Nodje.js事件循环的下次轮询及之后期间，被绑定了一个错误处理器[例如使用promise.catch()][])， 会触发'rejectionHandled'事件。

Event: 'unhandledRejection'
如果在事件循环的一次轮询中，一个Promise被rejected，并且此Promise没有绑定错误处理器，'unhandledRejection事件会被触发。

Event: 'warning'
任何时候Node.js发出进程告警，都会触发'warning'事件。


process.argv
process.argv 属性返回一个数组，例如：
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four

process.config
属性返回一个Javascript对象。此对象描述了用于编译当前Node.js执行程序时涉及的配置项信息。

process.env 属性返回一个包含用户环境信息的对象
在Windows系统下，环境变量是不区分大小写的

process.mainModule
就像require.main一样，如果没有入口脚本，process.mainModule的值是undefined。

process.memoryUsage()  内存使用情况。

process.nextTick(callback[, ...args])
process.nextTick()方法将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在next tick队列中的所有callbacks会被依次调用。
这种方式不是setTimeout(fn, 0)的别名。它更加有效率。事件轮询随后的ticks 调用，会在任何I/O事件（包括定时器）之前运行。
注意： 每次事件轮询后，在额外的I/O执行前，next tick队列都会优先执行。 递归调用nextTick callbacks 会阻塞任何I/O操作，就像一个while(true); 循环一样。

process.title  属性用于获取或设置当前进程在 ps 命令中显示的进程名字

process.version 属性返回Node.js的版本信息。



