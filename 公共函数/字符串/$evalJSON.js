/*
函数名称：$evalJSON
函数描述： 
转换json字符串为js对象
参数：
str-要转换的json字符串
*/ 
function $evalJSON(str) {
	var json = str.replace(/^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1'), cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	if (cx.test(json)) {
		json = json.replace(cx, function(a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}
	try {
		if ($isJSON(json))
			return eval('(' + json + ')');
	} catch (e) {
	}
	throw new SyntaxError('Badly formed JSON string: ' + json);
}
调用示例： 
var obj=$evalJSON('{"a":1,"b":false}');
依赖函数： 
$isJSON