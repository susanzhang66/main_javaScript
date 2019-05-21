/*
函数名称：$bindContext
函数描述： 
返回一个封装函数,该封装函数绑定函数fn的this对象,如果context参数后面带有更多的参数,那么更多的那些参数将成为函数fn的前几个预置参数,封装函数的参数会跟在预置函数后面

参数:
fn 需要绑定的函数
context 需要绑定的this对象

返回:
封装的函数
*/
/**
 * 返回一个封装函数,该封装函数绑定函数fn的this对象,如果context参数后面带有更多的参数,那么更多的那些参数将成为函数fn的前几个预置参数,封装函数的参数会跟在预置函数后面
 * @param {Object} fn 需要绑定的函数
 * @param {Object} context 需要绑定的this对象
 */
function $bindContext(fn,context) {
	if (arguments.length < 3 && !context){
		return this;
	}
	var slice=Array.prototype.slice;
	var args = slice.call(arguments, 2);
	var bound = function() {
		return fn.apply(context, arguments.length?args.concat(slice.apply(arguments)):args);   //arguments:2和3；谁正在执行，则argument就是哪个的；
	};
	return bound;
}

/**
 * 绑定{id:11}为函数的this对象,并且预置2为函数的第一个参数,获得封装函数
 */
var fn=$bindContext(function(a,b){
	console.log('this.id=',this.id);
	console.log('结果为',a+b);
},{id:11},2);

/**
 * 调用封装函数,传入参数3,结果输出以下
 * this.id=11
 * 结果为5
 */
fn(3);