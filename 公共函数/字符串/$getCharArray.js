$getCharArray
函数描述： 
获得字符数组，将字符串转换为数组，会正确处理html转义字符进行处理，如'测试&lt;&gt;'会被转换为['测','试','&lt;','&gt;']

参数：
str 要转换的字符串
enableEscape 支付支持html转义字符(默认true)

返回：
转换后的数组，每一个元素为一个html字符
函数代码： 
/**
 * 获得字符数组，将字符串转换为数组，会正确处理html转义字符进行处理，如'测试&lt;&gt;'会被转换为['测','试','&lt;','&gt;']
 * @param {Object} str 要转换的字符串
 * @param {Object} enableEscape 支付支持html转义字符
 */
function $getCharArray(str,enableEscape) {
	if (!$getCharArray.feature_split_normal) {
		$getCharArray.feature_split_normal = '1,2'.split(/(,)/g).length == 3 ? 1 : -1;     //ie8 length==2['1','2'],  3的情况  ['1',',','2']
	}
	if(typeof enableEscape!=undefined&&!enableEscape){
		var charArr = [];
		for(var i=0,len=str.length;i<len;i++){
			charArr.push(str.charAt(i));
		}
		return charArr;
	}
	//把字符串根据转义字符切分
	var reg = /(&#\d+;|&[a-z0-9]+;)/ig, arr = str.split(reg), escCode;   
	if ($getCharArray.feature_split_normal == -1) {
		//部分浏览器使用正则切分会忽略正则里面的子匹配，在此进行修复
		var __bugfixed0 = 0;
		$each(str.match(reg) || [], function(code, i) {
			if ((typeof arr[i * 2]=='undefined')||(arr[i * 2] != str.substring(__bugfixed0, __bugfixed0 + arr[i * 2].length))) {
				//补齐空缺，bug，空内容会被忽略
				arr.splice(i * 2, 0, '');
			}
			insertIndex = i * 2 + 1;
			__bugfixed0 += arr[i * 2].length + code.length;
			arr.splice(insertIndex, 0, code);
		});
	}
	var charArr = [],escCode;
	$each(arr, function(str, i) {
		if (i % 2 == 1&&(escCode=$isEscapeSequense(str))) {       //字符串被split后,转义字符总是在奇位数。
			//转义字符
			charArr.push('&#'+escCode+';');
		} else {
			for (var j = 0, len = str.length; j < len; j++) {
				var c=str.charAt(j);
				charArr.push(c=='&'?'&#38;':c);
			}
		}
	});
	return charArr;
}
调用示例： 
//result的值为['测','试','&lt;','&gt;']

var result=$getCharArray'测试&lt;&gt;');
依赖函数： 
$isEscapeSequense$isAllowedUnicode$each$break
被依赖函数： 
$getCharWidthwww_iuni_com:$iuni_getArticleItemswww_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articlePage$parseTypesetTextwww_iuni_com:$iuni_typesetwww_iuni_com:$iuni_typeset$parseTypesetText$strFilterUnicode$strHTMLFilter$parseTypesetTextSyncwww_iuni_com:$iuni_getArticleItems