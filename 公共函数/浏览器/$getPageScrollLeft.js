/*
函数名称：$getPageScrollLeft
函数描述： 
获得浏览器页面滚动左边距
函数代码： 
*/
function $getPageScrollLeft() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return doeCath.scrollLeft;
}
调用示例： 
var scrollWidth=$getPageScrollLeft();
被依赖函数： 
$domFixedwww_iuni_com:$iuni_dialogManager