/*
函数名称：$arrAddUniq
函数描述： 
数组添加元素，判断元素在数组中是否存在，如不存在则添加到末尾，否则返回

参数：
arr 要添加的数组，可为空
obj 要添加的元素

返回：返回处理后的数组
*/ 
/**
 * 数组添加元素，判断元素在数组中是否存在，如不存在则添加到末尾，否则返回
 * @param {Object} arr 要添加的数组，可为空
 * @param {Object} obj 要添加的元素
 * 
 * 返回：返回处理后的数组
 */
function $arrAddUniq(arr, obj) {
	if (!arr) {
		arr = [obj];
		return arr;
	}
	for (var i = arr.length; i--; ) {
		if (arr[i] === obj) {
			return arr;
		}
	}
	arr.push(obj);
	return arr;
}
/*
调用示例： 
//向数组中添加4，返回[1,2,3,4]
var arr=$arrAddUniq([1,2,3],4);
//向数组中添加1，数组已经存在1，不做处理，返回[1,2,3,4]
arr=$arrAddUniq(arr,1);
被依赖函数： 
$msg
==================================================================
*/
/*
函数名称：$arrReduce
函数描述： 
数组reduce操作,用于简化或降级（reduce）数组,Javascript 1.8提供Array.prototype.reduce,本函数提供功能与其相同
reduce自左向右遍历数组的每一个元素并调用迭代器,迭代返回操作结果作为下一个迭代的初始值

参数:
arr 需要作reduce操作的数组
iterator 迭代器,支持四个参数,前一个迭代结果值（memo）、当前迭代对象（x）、索引（index）和数组（array）本身
memo 迭代初始值

返回:
迭代结果
*/
/**
 * 数组reduce操作,用于简化或降级（reduce）数组,Javascript 1.8提供Array.prototype.reduce,本函数提供功能与其相同
 * reduce自左向右遍历数组的每一个元素并调用迭代器,迭代返回操作结果作为下一个迭代的初始值
 * @param {Array} arr 需要作reduce操作的数组
 * @param {Function} iterator 迭代器,支持四个参数,前一个迭代结果值（memo）、当前迭代对象（x）、索引（index）和数组（array）本身
 * @param {Any} memo 迭代初始值
 */
function $arrReduce(arr, iterator, memo) {
	if (arr.reduce) {
		return arr.reduce(iterator, memo);
	}
	$each(arr, function(x, i) {
		memo = iterator(memo, x, i, arr);
	});
	return memo;
}

/**
 * 以下操作相当于把数组中的数据进行累加(0+1+2+3+4+5),并返回结果
 * result的值为15
 
var result=$arrReduce([1,2,3,4,5],function(m,x,i,a){return m+x;},0);
依赖函数： 
$each$break
被依赖函数： 
$taskAuto,$getCharWidth,$iuni_typeset
================================================================================
*/

/*
函数名称：$arrRemove
函数描述： 
从数组中移除指定元素，返回移除的数量

参数：
arr 要移除的数组
target 要移除的元素
compFunc 自定义比较函数，可以为空

返回：
已经移除的元素数量
*/
/**
 * 从数组中移除指定元素，返回移除的数量
 * @param {Object} arr 要移除的数组
 * @param {Object} target 要移除的元素
 * @param {Object} compFunc 自定义比较函数，可以为空
 * 
 * 返回移除的数量
 */
function $arrRemove(arr, target, compFunc) {
	var num = 0, len = arr.length;
	for (var c = 0; c < len; c++) {
		if ( compFunc ? compFunc(arr[c],target) : (arr[c] === target)) {
			arr.splice(c--, 1);
			num++;
		}
	}
	return num;
}
/*
调用示例： 
var arr=[1,2,3,4,5,1,2];
//移除数组中的所有1，返回2,数组arr变为[2,3,4,5,2]
var removed=$arrRemove(arr,1);

//移除所有大于等于3的数字，返回3，数组arr变为[2,2]
removed=$arrRemove(arr,3,function(src,dest){return src>=dest;});
被依赖函数： 
$msg,$iuni_parseBBcode
========================================================================
*/
/*
函数名称：$break
函数描述： 
遍历函数中断标志，如在$each函数中需要退出遍历的时候，throw $break;即刻
*/ 
$break = (function() {
	return 'undefined' === typeof $break ? function(t) {
		return t === $break;
	} : $break;
})();
/*
调用示例： 
$each([1,2,3,4],function(data){
	if(data==3){
		throw $break;
	}
});
被依赖函数： 
$each$iuni_typeset$iuni_parseBBcode$getCharWidth$msg$taskAuto$taskAuto$getCharWidth$arrReduce$asyncMap$asyncEach$asyncMap$taskParallel$asyncMapSeries$taskSeries$getCharWidth$iuni_typeset$iuni_parseBBcode$map$iuni_typeset
=================================================================

*/
/*
函数名称：$each
函数描述： 
遍历数组或对象，将内容设置为参数依次调用设置的函数；
*/
function $each(jn, fn) {
	var len = jn.length;
	if ("number" === typeof len) {
		for (var i = 0; i < len; i++) {
			try {
				fn(jn[i], i,jn);
			} catch(e) {
				if ($break(e)) {
					break;
				} else {
					throw e;
				};
			}
		}
	} else {
		for (var k in jn) {
			try {
				fn(jn[k], k,jn);
			} catch(e) {
				if ($break(e)) {
					break;
				} else {
					throw e;
				};
			}
		}
	}
}
/*
调用示例： 
//遍历对象并输出内容
$each({a:1,b:2},function(item,key){
	console.log(key+':',item);
});
依赖函数： 
$break
被依赖函数： 
$map$iuni_parseBBcode$iuni_typeset$getCharWidth$taskSeries$asyncMapSeries$taskParallel$asyncMap$asyncEach$asyncMap$arrReduce$getCharWidth$taskAuto$taskAuto$msg$getCharWidth$iuni_parseBBcode$iuni_typeset

=======================================================
*/

/*
函数名称：$inArray
函数描述： 
元素在数组内的位置索引，从0起始，未找到返回-1,多个相同的返回最后一个的位置
参数：
t-元素
arr-数组
*/ 
function $inArray(t, arr) {
	for (var i = arr.length; i--; ) {
		if (arr[i] === t) {
			return i * 1;
		}
	};
	return -1;
}
/*
调用示例： 
var index=$inArray(1,[1,2,3,4]);
============================================
*/

/*
函数名称：$isArray
函数描述： 
判断是否数组
参数：
value-要判断的对象
*/ 
/**
 *判断是否数组 
 * @param {Object} value
 */
function $isArray(value){
	return Object.prototype.toString.call(value) == '[object Array]';
}
/*
调用示例： 
var result=$isArray([1,2,3,4]);
被依赖函数： 
$clone$addParams$jsonp$taskWaterfall$taskSeries$taskAuto
===================================================================
*/

/*
函数名称：$map
函数描述： 
遍历数组调用迭代器,保存迭代器调用结果到数组,最后返回结果

参数:
arr 需要遍历的数组
iterator 迭代器,传入三个参数,当前遍历到的元素,元素索引,原数组

返回:
每次调用迭代器的结果压栈到数组,在遍历完所有数组后将其返回
*/ 
/**
 * 遍历数组调用迭代器,保存迭代器调用结果到数组,最后返回结果
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代器,传入三个参数,当前遍历到的元素,元素索引,原数组
 */
function $map(arr, iterator) {
	if (arr.map) {
		return arr.map(iterator);
	}
	var results = [];
	$each(arr, function(x, i) {
		results.push(iterator(x, i, arr));
	});
	return results;
}
 
/**
 * 下面示例展示将数组中的每个元素作乘方运算,并返回最终结果
 * 结果:[1,4,9,16,25]

var result=$map([1,2,3,4,5],function(x,i,arr){
    return x*x;
});
依赖函数： 
$each$break
被依赖函数： 
$asyncMap$taskParallel$asyncMapSeries$taskSeries$getCharWidth$iuni_typeset$iuni_parseBBcode
 
 */





