/*
函数名称：$delay
函数描述： 
延迟一个函数执行时间,在一定时间后执行

参数:
fn 要执行的函数
timeout 延迟的时间,单位毫秒

返回:
延时的定时器,如果需要中途取消延时,可操作该定时器

注:如执行函数需要参数,直接添加到timeout参数后面即可
*/ 
/**
 * 延迟一个函数执行时间,在一定时间后执行
 * @param {Object} fn 要执行的函数
 * @param {Object} timeout 延迟的时间,单位毫秒
 * 
 * 返回延时的定时器,如果需要中途取消延时,可操作该定时器
 * 注:如执行函数需要参数,直接添加到timeout参数后面即可
 */
function $delay(fn, timeout) {
	var args = Array.prototype.slice.call(arguments, 2);
	return setTimeout(function() {
		return fn.apply(fn, args);
	}, timeout);
}
调用示例： 
/**
 * 延迟3秒执行函数,并传入函数参数53
 * 输出结果为:program reached here and data is 53 
 */
$delay(function(data) {
	console.log('program reached here and data is', data);
}, 3000, 53);