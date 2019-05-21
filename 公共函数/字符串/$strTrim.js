/*
函数名称：$strTrim
函数描述： 
过滤字符串两边的空白

参数：
str 要过滤的字符串

返回：
过滤后的字符串
*/ 
/**
 * 过滤字符串两边的空白
 * @param {Object} str
 */
function $strTrim(str){
	if(!str){
		return str;
	}
	return str.replace(/(^\s+)|(\s+$)/g,'');
}


调用示例： 
//把字符串两边的空格，换行等空字符去掉
var str=$strTrim('\t   dsafdaew444   fdsg   gfds34  \t\n\t    ');
被依赖函数： 
$iuni_parseBBcode