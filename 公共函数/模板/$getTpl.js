/*
函数名称：$getTpl
函数描述： 
获取模版
模版定义为特定格式的html注释内容，模版容器id为tpl_xxx形式，可以为一个模版容器内设置多个模版片段
如下:
<div id="tpl_page">
<!--list/*这里是模版的说明注释内容*/
...这里面为模版内容
list-->
<!--list1/*这里是模版的说明注释内容*/
...这里面为模版内容
list1-->
</div>
*/ 
var $getTpl = (function() {
	function a(h, g) {
		h = h.replace(/[\n\r]/g, "");
		var d = h.match(/<!--(.*?)\/\*(.*?)\*\/(.*?)\1-->/gi);
		var c = {};
		if (!d) {
			return [];
		}
		for (var f = 0; f < d.length; f++) {
			var e = d[f].match(/^<!--(.*?)\/\*(.*?)\*\/(.*?)\1-->$/i);
			c[e[1]] = e[3].replace(/^\s*/, "").replace(/\d*$/, "");
		}
		return c;
	}
	return function(d) {
		var b = $id("tpl_" + d);
		var c = a( b ? b.innerHTML : "", true);
		return c;
	};
})();

调用示例： 
var tpls=$getTpl('page');
//输出list的模版片段
console.log(tpls['list']);
//输出list1的模版片段
console.log(tpls['list1']);
依赖函数： 
$id