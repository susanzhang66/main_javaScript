/*
函数名称：$getWindowHeight
函数描述： 
获取浏览器窗口高度
*/ 
function $getWindowHeight() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientHeight;
}
调用示例： 
var height=$getWindowHeight();
被依赖函数： 
$domFixedwww_iuni_com:$iuni_dialogManager