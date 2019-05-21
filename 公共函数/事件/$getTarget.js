/*
函数名称：$getTarget
函数描述： 
获取事件目标
函数代码： 
*/
function $getTarget(e, parent, tag) {
	var e = e || window.event, tar = e.srcElement || e.target;
	if (parent && tag && tar.nodeName.toLowerCase() != tag) {
		while ( tar = tar.parentNode) {
			if (tar == parent || tar == document.body || tar == document) {
				return null;
			} else if (tar.nodeName.toLowerCase() == tag) {
				break;
			}
		}
	};
	return tar;
}



调用示例： 
$bindEvent(document,function(e){
    var target=$getTarget(e);
    console.log("点击了元素",target);
});
被依赖函数： 
$page