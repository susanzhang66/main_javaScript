querystring - 查询字符串

querystring 模块提供了一些实用函数，用于解析与格式化 URL 查询字符串。

querystring.escape(str) 
-- 对给定的 str 进行 URL 编码。
querystring.parse(str[, sep[, eq[, options]]])  
--   该方法会把一个 URL 查询字符串 str 解析成一个键值对的集合。
'foo=bar&abc=xyz&abc=123' ==>
{
  foo: 'bar',
  abc: ['xyz', '123']
}
querystring.stringify(obj[, sep[, eq[, options]]])
-->
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// 返回 'foo=bar&baz=qux&baz=quux&corge='

querystring.unescape(str)

// unescape 默认使用 JavaScript 内置的 decodeURIComponent() 方法来解码。


