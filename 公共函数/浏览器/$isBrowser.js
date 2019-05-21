/*
函数名称：$isBrowser
函数描述： 
判断是否指定浏览器类型
*/ 
/**
 * 浏览器判断函数
 * @param {String} str
 */
function $isBrowser(str) {
	if(!$isBrowser.att){
		str = str.toLowerCase();
		var b = navigator.userAgent.toLowerCase();
		var att = [];
		att['firefox'] = b.indexOf("firefox") != -1;
		att['opera'] = b.indexOf("opera") != -1;
		att['safari'] = b.indexOf("safari") != -1;
		att['chrome'] = b.indexOf("chrome") != -1;
		att['gecko'] = !att['opera'] && !att['safari'] && b.indexOf("gecko") > -1;
		att['ie'] = !att['opera'] && b.indexOf("msie") != -1;
		att['ie6'] = !att['opera'] && b.indexOf("msie 6") != -1;
		att['ie7'] = !att['opera'] && b.indexOf("msie 7") != -1;
		att['ie8'] = !att['opera'] && b.indexOf("msie 8") != -1;
		att['ie9'] = !att['opera'] && b.indexOf("msie 9") != -1;
		att['ie10'] = !att['opera'] && b.indexOf("msie 10") != -1;
		$isBrowser.att=att;
	}
	return $isBrowser.att[str];
}
/*
调用示例： 
//判断是否IE
var isIE=$isBrowser('ie');
//判断是否IE6
var isIE6=$isBrowser('ie6');
=====================================
*/
//判断是移动端
if( /android|iphone|ipad|ipod|Windows Phone/i.test(navigator.userAgent) ){
    window.location.replace("http://y.qq.com/m/act/56vs_appoint/index.html");
}