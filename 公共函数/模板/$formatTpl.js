/*
$formatTpl
函数描述： 
模版渲染引擎，提供模版编译并套用数据输出最终结果。

参数：
tpl:模版内容，字符串
data 模版渲染数据，对象格式

注：如果不传入模版渲染数据，模版渲染引擎会返回编译后的模版代码函数，程序可调用缓存该函数，并在之后调用该函数并传入模版数据来获取渲染结果。
*/ 
/**
 * 模版渲染引擎
 * @param {String} tpl 模版字符串
 * @param {Object} data 模版渲染数据，对象格式，如果不传入该值，模版渲染引擎会返回编译后的模版代码函数，程序可调用该函数并传入模版数据来获取渲染结果
 */
function $formatTpl(tpl, data) {
	var code = "var p=[];with(obj){p.push(" + tpl.replace(/[\r\t\n]/g, " ").replace(/<%/g, '\t').replace(/%>/g, '\r').replace(/(^|\r)([^\t]*)(\t|$)/g, function($0, $1, $2, $3) {
		return $1 + $toJSON($2) + $3;
	}).replace(/\t\s*\=([^\r]*)\r/g, ');p.push($1);p.push(').replace(/\t([^\r]*)\r/g, ');$1\rp.push(') + ");}return p.join('');";
	var func = new Function("obj", code);
	return data ? func(data) : func;
}

调用示例： 
//直接输出模版渲染结果
var str=$formatTpl('<span>{%=username%}</span>',{username:'wubocao'});
//result为true
var result=str=='<span>wubocao</span>';

//输出模版编译函数
var func=$formatTpl('<span>{%=username%}</span>');
var str=func({username:'wubocao'});
//result为true
var result=str=='<span>wubocao</span>';
依赖函数： 
$toJSON
被依赖函数： 
$page