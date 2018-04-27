window.onload = function(argument) {  //别人写的。
	alert(1);
}

var _onload = window.onload || function(){};   //因为都是window,没有发生劫持，假如是 document.getElementById;


window.onload = function(){
	_onload();   //假如是document.getElementById;，这个就获取不到id,因为this变成了window...
	alert(2);  //我们增加的。缺点：中间变量增多 2.this会遇到劫持的问题。
}
// 二。AOP装饰函数。
Function.prototype.after = function( fn ){
	var self = this;
	return function(){
		var ret = self.apply( this, arguments );
		if( ret == false ){
			return fn.apply( this, arguments );
		}

		return ret;
	}
}

Function.prototype.before = function( fn ){
	var self = this;
	return function(){
		fn.apply( this, arguments );

		return self.apply( this, arguments );

	}
}
//应用实例：
// 1.统计上报  2.动态改变函数参数。 （before）3.插件式表单
// 1.插件式表单：将validate和fromSubmit分开。

var fromSubmit = fromSubmit.before( validate );

// 2.动态改变函数参数。 假如在没个ajax中需要加个传token参数。 
var ajax = ajax.before( function( type, url, param ){
	param.Token = getToken();
})

注意：
// 如果在原函数上保存了一些属性，那么这些属性会丢失。
var func = function(){
	alert(1);
};
func.a = 'a';

func = func.after( function(){
	alert(2);
})

alert( func.a )  //undefined





