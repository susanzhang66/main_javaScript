util (实用工具)
	util.callbackify(original)
	util.debuglog(section)
	util.deprecate(function, string)
	util.format(format[, ...args])
	util.inherits(constructor, superConstructor)    
	util.inspect(object[, options])
		自定义 util.inspect 颜色
		自定义对象的查看函数
		util.inspect.custom
		util.inspect.defaultOptions
	util.promisify(original)
		Custom promisified functions
		util.promisify.custom
	Class: util.TextDecoder
		WHATWG Supported Encodings
			Encodings Supported Without ICU
			Encodings Supported by Default (With ICU)
			Encodings Requiring Full ICU Data
		new TextDecoder([encoding[, options]])
		textDecoder.decode([input[, options]])
		textDecoder.encoding
		textDecoder.fatal
		textDecoder.ignoreBOM
	Class: util.TextEncoder
		textEncoder.encode([input])
		textDecoder.encoding


util.inherits 这个建议用es6.  class 和 extends：

util.inspect() 方法返回 object 的字符串表示，主要用于调试。 附加的 options 可用于改变格式化字符串的某些方面。

自定义 util.inspect 颜色


util.promisify(original)
	让一个遵循通常的 Node.js 回调风格的函数， 即 (err, value) => ... 回调函数是最后一个参数, 返回一个返回值是一个 promise 版本的函数。
	
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
