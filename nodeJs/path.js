// path(路径)
// path 模块提供了一些工具函数，用于处理文件与目录的路径。
// path 模块的默认操作会根据 Node.js 应用程序运行的操作系统的不同而变化。


// path.extname(path)
// path.extname() 方法返回 path 的扩展名

// path.format() 方法会从一个对象返回一个路径字符串。 与 path.parse() 相反。
// POSIX:
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'
// windows:
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt'
});
// 返回: 'C:\\path\\dir\\file.txt'


var path = require('path')
function resolve (dir) {  //  .. 这个意思是 返回上一个路径的意思。
  return path.join(__dirname, '..', dir)
}

console.log( resolve('src') )

//这个因为最后一个是 .. 返回了上一个，所以 去掉了quux...
console.log( path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') )
//    /foo/bar/baz/asdf

path.resolve([...paths])
path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径。