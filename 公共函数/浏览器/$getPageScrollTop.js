/*
函数名称：$getPageScrollTop
函数描述： 
获得浏览器页面滚动上边距
函数代码： 
*/
function $getPageScrollTop() {
	var docCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.scrollTop;
}
调用示例： 
var scrollHeight=$getPageScrollTop();
被依赖函数： 
$domFixedwww_iuni_com:$iuni_dialogManager