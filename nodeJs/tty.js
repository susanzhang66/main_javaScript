// tty - 终端   文本终端？
// 	tty.ReadStream 类
// 		readStream.isRaw
// 		readStream.setRawMode(mode)
// 	tty.WriteStream 类
// 		'resize' 事件
// 		writeStream.columns
// 		writeStream.rows
// 	tty.isatty(fd)

tty 模块提供了 tty.ReadStream 类和 tty.WriteStream 类。


// 判断 Node.js 是否运行在一个 TTY 上下文的首选方法是检查 process.stdout.isTTY 属性的值是否为 true：

$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false



// tty.ReadStream 类是 net.Socket 的一个子类，表示 TTY 的可读部分。 正常情况下，process.stdin 是 Node.js 进程中唯一的 tty.ReadStream 实例，无需创建更多的实例。

// 'resize' 事件
// 	当 writeStream.columns 属性（列）或 writeStream.rows 属性（行）发生变化时触发 'resize' 事件。
process.stdout.on('resize', () => {
  console.log('窗口大小发生变化！');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});

// tty.isatty(fd)   －fd <number> 数值类型的文件描述符。
// 如果给定的 fd 有关联 TTY，则返回 true，否则返回 false。



