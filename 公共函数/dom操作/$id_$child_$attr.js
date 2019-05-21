/*
函数名称：$attr
函数描述： 
根据指定属性参数查找节点的所有子节点
参数：
attr-匹配子节点的属性名，
val-匹配子节点的属性值
node-父节点
*/
function $attr(attr,val,node){
	var results=[],
		node=node||document.body;
	walk(node,function(n){
		var actual=n.nodeType===1&&(attr==="class"?n.className:n.getAttribute(attr));
		if(typeof actual === 'string' && (actual === val || typeof val !== 'string')){
				results.push(n);
		}
	});
	return results;
	function walk(n,func){
		func(n);
		n=n.firstChild;
		while(n){
			walk(n,func);
			n=n.nextSibling;
		}
	}
}
/*
调用示例： 
var allListTags=$attr('tag','list',$id('dom'));
被依赖函数： 
$page
==============================================================
*/
/*
函数名称：$child
函数描述： 
查找dom节点的子节点列表。
参数：
node-父dom节点
val-匹配子节点的tagName （可选）
fn-遍历过程调用函数，对匹配节点执行fn(node)。（可选）
*/
function $child(node, val, fn) {
	var results = [], node = node || document.body;
	walk(node.firstChild, function(n) {
		if (!n) {
			return;
		}
		var actual = n.nodeType === 1 && n.nodeName.toLowerCase();
		if ( typeof actual === 'string' && (actual === val || typeof val !== 'string')) {
			results.push(n);
			fn && fn(n);
		}
	});
	return results;
	function walk(n, func) {
		func(n);
		while (n && ( n = n.nextSibling)) {
			func(n, func);
		}
	}
}
//  上一个是经理写的，有点出错，下一个我重新写的。
iuni.help.aftersales.$child = function(node,val){
    var firschlid = node.firstChild,result = [];
    while(firschlid){
        if(firschlid.nodeType == 1 && firschlid.nodeName.toLowerCase() == val){
            result.push(firschlid);
        }
       firschlid = firschlid.nextSibling; 
    }
    return result;
}
/*
调用示例： 
var divList=$child(document.body,'div');
=====================================================================
*/
/*
函数名称：$id
函数描述： 
根据ID获取dom节点。
*/
function $id(id) {
	return typeof (id) == "string" ? document.getElementById(id) : id;
}
/*
调用示例： 
//获取ID为node1的dom节点
var dom=$id("node1");
被依赖函数： 
$getTpl,$setClass,$addClass,$delClass,$display

*/