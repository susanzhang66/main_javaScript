/*
函数名称：$isJSON
函数描述： 
判断字符串是否标准json格式
参数：
str-要判断的字符串
*/
function $isJSON(str) {
	if (/^\s*$/.test(str)){
		return false;
	}
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
	str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
	str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(str);
}


调用示例： 
var result=$isJSON('{"a":1,"b":false}');
被依赖函数： 
$evalJSON