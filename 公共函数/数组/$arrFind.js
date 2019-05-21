函数名称：$arrFind
函数描述： 
顺序查找数组，返回查找结果

参数：
arr 要查找的数组
fn 查找判断函数
num 要查找的数量，负数表示不限制数量，默认为不限制数量

返回:如果要查找的数量为1，返回当前查找到对对象，否则返回查找到的对象列表
函数代码： 
/**
 * 查找数组，返回查找结果
 * @param {Object} arr 要查找的数组
 * @param {Object} fn 查找判断函数
 * @param {Object} num 要查找的数量，负数表示不限制数量，默认为不限制数量
 * 
 * 返回，如果要查找的数量为1，返回当前查找到对对象，否则返回查找到的对象列表
 */
function $arrFind(arr,fn,num){
	num=num||-1;
	if(!arr||arr.length==0){
		return num==1?null:[];
	}
	var result=[],l=0;
	for(var i=0,len=arr.length;i<len;i++){
		if(fn(arr[i])){
			result.push(arr[i]);
			if(++l==num){
				return num==1?result[0]:result;
			}
		}
	}
	return num==1?null:result;
}
调用示例： 
//查找数组中第一个小于3的数字，结果为1
var result=$arrFind([1,4,3,5,2],function(i){
	return i<3;
},1);
被依赖函数： 
www_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articlePagewww_iuni_com:$iuni_getArticleItems