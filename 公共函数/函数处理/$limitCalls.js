/*
函数名称：$limitCalls
函数描述： 
封装函数,限制函数的执行次数,返回一个只允许被调用有限次数的函数,超过次数的调用会报出异常

参数:
fn 需要被封装的函数
lim 限制的次数,默认为1次

返回:
限定执行次数的函数
*/ 
/**
 * 封装函数,限制函数的执行次数,返回一个只允许被调用有限次数的函数,超过次数的调用会报出异常
 * @param {Function} fn 需要被封装的函数
 * @param {Number} lim 限制的次数,默认为1次
 */
function $limitCalls(fn,lim) {
	var lim = lim||1;
	return function() {
		if (lim<=0)
			throw new Error("function was already called for limited times.");
		lim--;
		fn.apply(this, arguments);
	}
}

调用示例： 
//生成一个限定执行一次的函数
var fn=$limitCalls(function(){
    console.log('program reach here first time!');
});
//第一次调用,输出program reach here first time!
fn();
//第二次执行,抛出异常
fn();
被依赖函数： 
$asyncEach$taskParallel$asyncMap$asyncEachSeries$iuni_typeset$taskSeries$taskSeries$asyncMapSeries$taskAuto