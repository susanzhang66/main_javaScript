// fs 文件系统

// 线程池的使用
// WHATWG URL object support
// Buffer API
// fs.FSWatcher 类
// fs.ReadStream 类
// fs.Stats 类
// fs.WriteStream 类
// fs 常量
// 文件访问常量
// 文件打开常量
// 文件类型常量
// 文件模式常量

// 文件 I/O 是对标准 POSIX 函数的简单封装。 通过 require('fs') 使用该模块。 所有的方法都有异步和同步的形式。

// 异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

// 当使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。

// 线程池的使用
// 在所有的文件系统 API 中，除了 fs.FSWatcher() 和那些显式同步之外都可以使用 libuv 的线程池，这对于某些应用程序可能会产生出乎意料问题和负面的性能影响

// 异步的操作
const fs = require('fs');

// fs.unlink('/tmp/hello', (err) => {

//   if (err) throw err;
//   console.log('成功删除 /tmp/hello');

// });

//这个是同步的操作
// fs.unlinkSync('/tmp/hello');

// ？？？？？   fs.readdirSync('c:\\') 可能返回与 fs.readdirSync('c:') 不同的结果。 详见 MSDN 路径文档。


// 例子，处理 fs.watch 监听器
fs.watch('./temp', { encoding: 'utf-8' }, (eventType, filename) => {
  if (filename) {
    console.log(eventType,filename);
    // eventType :  change,
    // filename:文件名
    // 输出: <Buffer ...>
  }
});

fs.lchown(path, uid, gid, callback)
方法说明：
更改文件所有权（不解析符号链接）。

接收参数：
path          目录路径
uid            用户ID
gid            群体身份 (指共享资源系统使用者的身份)
callback    回调 ，传递异常参数 err
源码：
fs.lchown = function(path, uid, gid, callback) {
    callback = maybeCallback(callback);
    fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, function(err, fd) {
      if (err) {
        callback(err);
        return;
      }
      fs.fchown(fd, uid, gid, callback);
    });
};

fs.readlink(path[, options], callback)
	方法说明：
	以异步的方式读取链接。
	源码：
	fs.readlink = function(path, callback) {
	  callback = makeCallback(callback);
	  if (!nullCheck(path, callback)) return;
	  binding.readlink(pathModule._makeLong(path), callback);
	};


 fs.createReadStream(path[, options])
 const defaults = {
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 0o666,
  autoClose: true
};
fs.createReadStream('sample.txt', { start: 90, end: 99 });











