/*
函数名称：$getPageHeight
函数描述： 
获得页面高度
*/
function $getPageHeight() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollHeight 是网页内容实际高度，可以小于 clientHeight，NS、FF 认为 scrollHeight 是网页内容高度，不过最小值是 clientHeight，改为统一FF标准
	return Math.max(doeCath .scrollHeight,doeCath .clientHeight);
}
调用示例： 
var height=$getPageHeight();
被依赖函数： 
$domFixed