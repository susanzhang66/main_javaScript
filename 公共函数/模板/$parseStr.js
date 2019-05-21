/*
函数名称：$parseStr
函数描述： 
简易字符串解析替换，将字符串中的{#seg#}替换为data数据中seg对应的属性值,seg字段规范内容为字母，数字，下划线

参数：
str 要解析的字符串
data 替换数据
unReplaceIfNotDefine 是否不替换未定义属性的{#seg#}段为空

注：如果设置了unReplaceIfNotDefine为true，那么对于未定义值的{#seg#}段将不会被处理
*/
/**
 * 简易字符串解析替换，将字符串中的{#seg#}替换为data数据中seg对应的属性值,seg字段规范内容为字母，数字，下划线
 * @param {Object} str 要解析的字符串
 * @param {Object} data 替换数据
 * @param {Object} unReplaceIfNotDefine 是否不替换未定义属性的{#seg#}段为空
 */
function $parseStr(str,data,unReplaceIfNotDefine){
	return str.replace(/{#\s*([\w\d_]+)\s*#}/g,function($0,$1){
		var d=data[$1],t=typeof d=='undefined';
		if(t&&unReplaceIfNotDefine){
			return $0;
		}
		return t?'':d;
	});
}

/*
调用示例： 
//str结果为my name is wubocao
var str=$parseStr('my name is {#username#}!',{username:'wubocao'});

//str结果为my name is wubocao,and i have  old now!
var str=$parseStr('my name is {#username#},and i have {#years#} old now!',{username:'wubocao'});

//str结果为my name is wubocao,and i have {#years#} old now!
var str=$parseStr('my name is {#username#},and i have {#years#} old now!',{username:'wubocao'},true);
被依赖函数： 
$iuni_parseBBcode$iuni_typeset

*/