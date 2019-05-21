/*
函数名称：$addClass
参数：
ids-domID,多个使用逗号‘,’隔开
cName-要添加的样式名

*/

function $addClass(ids,cName){
	$setClass(ids,cName,"add");	
}

/*
调用示例： 
$addClass('dom','cur');
依赖函数： 
$setClass ,$id, $hasClass
 ==============================================
 */

/*
函数名称：$addSelect
函数描述： 
添加下拉列表选项
参数：
e-select dom元素
t-option选项的展示内容
v-option选项的值
*/
 
function $addSelect(e, t, v) {
	var o = new Option(t, v);  
	e.options[e.options.length] = o;
	return o;
}
/*
调用示例： 
$addSelect($id('select'),'第一项','1');
====================================================
*/

/*
函数名称：$delClass
函数描述： 
删除样式名
参数：
ids-domID,多个使用逗号‘,’隔开
cName-要删除的样式名
*/

function $delClass(ids,cName){	
	$setClass(ids,cName,"remove");
}
/*
调用示例： 
$delClass('dom','cur');
依赖函数： 
$setClass,$id,$hasClass
========================================================
*/

/*
函数名称：$display
函数描述： 
设置dom元素的style的display属性
参数：
ids-domID，多个使用逗号','隔开或数组分开
state-display属性
*/ 
function $display(ids,state){
	var state=state||'';
	if(typeof(ids)=="string"){
		var arr=ids.split(',');		
		for(var i=0,len=arr.length;i<len;i++){
			var o=$id(arr[i]);
			o && (o.style.display=state);
		}	
	}else if(ids.length){
		for(var i=0,len=ids.length;i<len;i++){
			ids[i].style.display=state;
		}			
	}else{
		ids.style.display=state;
	}
}
/*
调用示例： 
$display('dom','none');
依赖函数： 
$id
=============================================================
*/

/*
函数名称：$hasClass
函数描述： 
判断样式字符串里是否包含选择的样式
*/
function $hasClass(old,cur){
	if(!old||!cur) return null;
	var arr=old.split(' ');
	for(var i=0,len=arr.length;i<len;i++){
		if(cur==arr[i]){
			return cur;
		}
	};
	return null;
}
/*
调用示例： 
$hasClass("item now","now");
被依赖函数： 
$setClass,$addClass,$delClass
===========================================================
*/
/*
函数名称：$setClass
函数描述： 
添加或删除元素样式
参数：
ids-domID，多个使用逗号‘，’隔开
cName-样式名
kind-操作类型，add为添加，remove为删除
*/
function $setClass(ids,cName,kind){	
	if(typeof(ids)=="string"){
		var arrDom=ids.split(",");
		for(var i=0,len=arrDom.length;i<len;i++){
			setClass($id(arrDom[i]),cName,kind);
		}
	}
	if(ids instanceof Array){                       //一堆的元素集合  array
		for(var i=0,len=ids.length; (i<len) && ids[i]; i++){
			setClass(ids[i],cName,kind);
		}
	}else{
		setClass(ids,cName,kind);
	};
	
	function setClass(obj,cName,kind){
		if(!obj){//做校验,避免异常
			return;
		}
		var oldName=obj.className,
			arrName=oldName?oldName.split(' '):[];
		if(kind=="add"){
			if(!$hasClass(oldName,cName)){
				arrName.push(cName);
				obj.className=arrName.join(' ');
			}
		}else if(kind=="remove"){
			var newName=[];
			for(var i=0,len=arrName.length;i<len;i++){
				if(cName!=arrName[i]&&' '!=arrName[i]){
					newName.push(arrName[i]);
				}
			};
			obj.className=newName.join(' ');
		}
	}	
}
/*
调用示例： 
$setClass('dom','cur','add');
依赖函数： 
$hasClass$id
被依赖函数： 
$delClass,$addClass
========================================================
*/

/*
函数名称：$setStyles
函数描述： 
给dom元素设置样式

参数：
dom 要设置的dom元素
styles 要设置的样式对象，key-value值
*/ 
function $setStyles(dom,styles){
	for(var key in styles){
		var v=styles[key];
		key=key.replace(/-(\w)/g,function($0,$1){
			return $1.toUpperCase();
		});
		dom.style[key]=v;
	}
}
/*
调用示例： 
//给dom设置fontSize，fontWeight的样式值
$setStyles(dom,{
	'font-size':'12px',
	'font-weight':'bolder'
});
被依赖函数： 
$getCharWidth,$iuni_typeset
============================================================
*/