/*
函数名称：$curry
函数描述： 
返回预置参数的柯里化函数

参数:
fn 需要柯里化的函数

返回:
柯里化函数
*/ 
/**
 * 返回预置参数的柯里化函数
 * @param {Object} fn 需要柯里化的函数
 */
function $curry(fn) {
	if (arguments.length < 2) {
		return fn;
	}
	var slice = Array.prototype.slice, args = slice.call(arguments, 1);
	return function() {
		return fn.apply(this, arguments.length ? args.concat(slice.apply(arguments)) : args);
	}
}
调用示例： 
/**
 * 返回预置参数为2的柯里化函数
 */
var fn=$curry(function(a,b){
	console.log('结果为',a+b);
},2);

/**
 * 调用参数3,返回结果为:
 * 结果为5
 */
fn(3);