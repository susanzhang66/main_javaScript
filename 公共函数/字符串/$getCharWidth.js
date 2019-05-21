/*
函数名称：$getCharWidth
函数描述： 
获取字符串中每个字符在网页中的显示宽度

参数：
str 要判断的字符串
opt 选项

选项值：
fontStyles:文字的样式
domTag:字符所放的标签，默认pre
callback:回调，返回包含每个字符显示宽度的对象
chaWidth:用于提高效率，缓存之前获取的宽度。

callback回调返回：
chaWidth对象，字符-宽度 属性对
*/ 
/**
 * 获取字符串中每个字符的显示宽度
 * @param {String} str 字符串
 * @param {Object} opt 选项
 *
 * 选项值：
 * fontStyles:文字的样式
 * domTag:字符所放的标签，默认pre
 * callback:回调，返回包含每个字符显示宽度的对象
 * chaWidth:用于提高效率，缓存之前获取的宽度。
 */
function $getCharWidth(str, opt) {
	if(!$getCharWidth.feature_split_normal){
		$getCharWidth.feature_split_normal='1,2'.split(/(,)/g).length==3;
	}
	opt = $extend({
		fontStyles : {

		},
		callback : null,
		chaWidth : {},
		domTag : 'pre'
	}, opt);
	if (!opt.callback) {
		return;
	}
	if (!str) {
		opt.callback(opt.chaWidth);
		return;
	}
	//需要判断的字符
	var fontStyles = opt.fontStyles || {}, callback = opt.callback, chaWidth = opt.chaWidth || {}, domTag = opt.domTag;
	//处理字符串转义字符
	var reg=/(&#\d+;|&[a-z0-9]+;)/ig,arr = str.split(reg), escCode, newChaWidth = {};
	//IE7及以下版本 String.prototype.split 正则bug
	if(!$getCharWidth.feature_split_normal){
		var __bugfixed0=0;
		$each(str.match(reg)||[],function(code,i){
			if(arr[i*2]!=str.substring(__bugfixed0,__bugfixed0+arr[i*2].length)){
				//补齐空缺，bug，空内容会被忽略
				arr.splice(i*2,0,'');
			}
			insertIndex=i*2+1;
			__bugfixed0+=arr[i*2].length+code.length;
			arr.splice(insertIndex,0,code);
		});
	}
	//遍历需要计算宽度的字符
	$arrReduce(arr, function(memo, x) {
		if ( escCode = $isEscapeSequense(x)) {
			var c = '&#' + escCode + ';';
			if (!chaWidth[c] && !newChaWidth[c]) {
				chaWidth[c] = newChaWidth[c] = 0;
			}
		} else {
			var strLen = x.length;
			for (var i = strLen; i--; ) {
				var c = x.charAt(i);
				if (!chaWidth[c] && !newChaWidth[c]) {
					if ($isAllowedUnicode(c.charCodeAt(0))) {
						chaWidth[c] = newChaWidth[c] = -1;
					}
				}
			}
		}
		return chaWidth;
	}, chaWidth);
	//处理数组，要计算宽度的字符。采用分批计算方式
	var chars = $keys(newChaWidth), charLen = chars.length;
	if (!charLen) {
		callback(opt.chaWidth);
		return;
	}
	//初始化dom节点，用于计算宽度
	var arrLen = charLen > 512 ? 256 : charLen, arr = new Array(arrLen);
	for (var i = 0; i < arrLen; i++) {
		arr[i] = 0;
	}
	var range = document.createDocumentFragment();
	var doms = $map(arr, function(x, i, arr) {
		var dom = document.createElement(domTag);
		$setStyles(dom, fontStyles);
		$setStyles(dom, {
			position : 'absolute',
			left : 0,
			top : 0,
			visibility : 'hidden',
			zIndex : i
		});
		range.appendChild(dom);
		return dom;
	});
	var node = document.createElement('div');
	$setStyles(node, {
		position : 'absolute',
		left : 0,
		top : 0,
		visibility : 'hidden',
		zIndex : 9999
	});
	node.appendChild(range);
	document.body.appendChild(node);
	//遍历字符，获取宽度
	var c = 0;
	$whilst(function() {
		return c < charLen;
	}, function(cb) {
		var i = 0;
		node.style.display = 'none';
		var chs = $map(doms, function(dom) {
			if (c < charLen) {
				var ch = chars[c];
				dom.innerHTML = ch;
				c++;
				i++;
				return ch;
			}
		});
		node.style.display = '';
		setTimeout(function() {
			$each(chs, function(ch, i) {
				if (ch) {
					var dom = doms[i];
					var cw = dom.clientWidth;
					if (cw > 0) {
						chaWidth[ch] = cw;
					}
				}
			});
			cb();
		});
	}, function(success) {
		document.body.removeChild(node);
		callback(chaWidth);
	});
}

/*==============================================
调用示例：  */
/**
 * 获取字符宽度数据
 */
$getCharWidth('这是一串测试字符串，this is a test string!', {
	fontStyles : {
		fontFamily : 'arial,\u5FAE\u8F6F\u96C5\u9ED1',
		fontSize : "12px",
		lineHeight : '1.5',
		fontStyle : 'normal',
		fontVariant : 'normal',
		fontWeight : 'normal'
	},
	callback : function(cwData) {
		console.log(cwData);
	}
});
依赖函数： 
$whilst$setStyles$map$break$each$keys$isAllowedUnicode$isEscapeSequense$isAllowedUnicode$arrReduce$each$each$extend
被依赖函数： 
$iuni_typeset