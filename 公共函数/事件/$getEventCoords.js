/*
函数名称：$getEventCoords
函数描述： 
获取事件相对页面坐标

参数：
e 鼠标事件

返回：
坐标系对象：{x:0,y:0}
函数代码： 
*/
/**
 * 获取事件相对页面坐标
 * @param {Object} e 鼠标事件
 */
function $getEventCoords(e) {
	e=e||window.event;
	if (e.pageX || e.pageY) {
		return {
			x : e.pageX,
			y : e.pageY
		};
	}
	return {
		x : e.clientX||0 + document.body.scrollLeft - document.body.clientLeft,
		y : e.clientY||0 + document.body.scrollTop - document.body.clientTop
	};
}


调用示例： 
document.onmousemove=function(e){
	//鼠标移动时输出鼠标坐标
	console.log($getEventCoords(e));
}
被依赖函数： 
$sliderBar