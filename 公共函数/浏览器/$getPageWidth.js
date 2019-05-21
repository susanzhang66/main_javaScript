/*
函数名称：$getPageWidth
函数描述： 
获得页面宽度
*/ 
function $getPageWidth() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollWidth 是网页内容实际宽度，可以小于 clientWidth，NS、FF 认为 scrollWidth 是网页内容宽度，不过最小值是 clientWidth，改为统一FF标准
	return Math.max(doeCath.scrollWidth,doeCath.clientWidth);
}
调用示例： 
var width=$getPageWidth();
被依赖函数： 
$domFixed