//url.parse() 方法会解析一个 URL 字符串并返回一个 URL 对象。
  var parsed = url.parse(urlString);


url.resolve() 方法会以一种 Web 浏览器解析超链接的方式把一个目标 URL 解析成相对于一个基础 URL。
from <string> 解析时相对的基本 URL。
to <string> 要解析的超链接 URL。
  url.resolve(from, to)
  例子：
const url = require('url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'


URL <URL> 一个WHATWG URL对象
options <Object>
auth <boolean> 如果序列化的URL字符串应该包含用户名和密码为true，否则为false。默认为true。
fragment <boolean> 如果序列化的URL字符串应该包含分段为true，否则为false。默认为true。
search <boolean> 如果序列化的URL字符串应该包含搜索查询为true，否则为false。默认为true。
unicode <boolean> true 如果出现在URL字符串主机元素里的Unicode字符应该被直接编码而不是使用Punycode编码为true，默认为false。

url.format(URL[, options])
返回一个WHATWG URL对象的可自定义序列化的URL字符串表达。 比如：
console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
  // 输出 'https://你好你好/?abc'
