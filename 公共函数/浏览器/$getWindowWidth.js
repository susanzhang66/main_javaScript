/*
函数名称：$getWindowWidth
函数描述： 
获得浏览器窗口宽度
*/ 
function $getWindowWidth() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientWidth;
}
调用示例： 
var width=$getWindowWidth();
被依赖函数： 
$domFixedwww_iuni_com:$iuni_dialogManager