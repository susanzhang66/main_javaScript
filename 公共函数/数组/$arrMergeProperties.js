函数名称：$arrMergeProperties
函数描述： 
将多个数组按照属性值合并对象，组成一个数组并返回，如{a:[1,2],b:[1.1,2.2]}合并后返回的内容是[{a:1,b:1.1},{a:2,b:2.2}]

参数：
obj 不同属性对应的数组

返回：
合并后的数组
函数代码： 
/**
 * 将多个数组按照属性值合并对象，组成一个数组并返回，如{a:[1,2],b:[1.1,2.2]}合并后返回的内容是[{a:1,b:1.1},{a:2,b:2.2}]
 * @param {Object} obj 不同属性对应的数组
 */
function $arrMergeProperties(obj){
	var keys=$keys(obj),arr=[];
	var maxLen=$arrNear(keys,function(k){
		return obj[k].length;
	});
	for(var i=0;i<maxLen;i++){
		var item={};
		$each(keys,function(k){
			item[k]=obj[k][i];
		});
		arr.push(item);
	}
	return arr;
}
调用示例： 
/**
 * 合并两组独立数据，分别用a和b做属性名
 */
//返回内容为[{a:1,b:'one'},{a:2,b:'two'},{a:3,b:'three'},{a:4,b:undefined}]
var result=$arrMergeProperties({
    a:[1,2,3,4],
    b:['one','two','three']
});
依赖函数： 
$each$break$arrNear$each$keys
被依赖函数： 
www_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articlePage