/*
函数名称：$namespace
函数描述： 
命名空间配置函数
*/ 
/**
 * 命名空间定义函数，多个命名空间用逗号‘,’隔开
 */
function $namespace(name) {
	for (var arr = name.split(','), r = 0, len = arr.length; r < len; r++) {
		for (var i = 0, k, name = arr[r].split('.'), parent = {}; k = name[i]; i++) {
			i === 0 ? eval('(typeof ' + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : ( parent = parent[k] = parent[k] || {});
		}
	}
}
/*
调用示例： 
//定义ls.main,ls.common.header,ls.common.footer三个命名空间
$namespace('ls.main,ls.common.header,ls.common.footer');
=============================================================
*/
/*
函数名称：$incNum
函数描述： 
获取自增数字，每次调用加1
函数代码： 
/**
 * 获取自增数字
 */
function $incNum(acc){
	acc=acc||$incNum;
	acc.num=acc.num||0;
	return acc.num++;
}
调用示例： 
var num=$incNum();
被依赖函数： 
$bindEvent$iuni_pagination$page$unbindEvent$page