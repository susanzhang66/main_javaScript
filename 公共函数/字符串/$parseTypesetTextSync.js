函数名称：$parseTypesetTextSync
函数描述： 
/**
 * 解析排版文字，将文字按照宽度排版分解成行并返回
 * 注：因排版计算随浏览器区别比较大，目前该函数只支持以下样式控制下的展示计算:
 * white-space:pre-wrap(IE8以下使用pre代替)，word-wrap:break-word，word-break:break-all，word-spacing:0
 * 即：不合并空格，自动换行，中断所有词组，空格默认宽度展示。
 * @param {String} text 文字
 * @param {Object} conf 配置，包括宽度设置，是否使用<br/>强制换行选项
 * @param {Object} chaWidth 文字宽度
 */
函数代码： 
/**
 * 解析排版文字，将文字按照宽度排版分解成行并返回
 * 注：因排版计算随浏览器区别比较大，目前该函数只支持以下样式控制下的展示计算:
 * white-space:pre-wrap(IE8以下使用pre代替)，word-wrap:break-word，word-break:break-all，word-spacing:0
 * 即：不合并空格，自动换行，中断所有词组，空格默认宽度展示。
 * @param {String} text 文字
 * @param {Object} conf 配置，包括宽度设置，是否使用<br/>强制换行选项
 * @param {Object} chaWidth 文字宽度
 */
function $parseTypesetTextSync(text, conf, chaWidth) {
	conf = $extend({
		width : 0, //宽度
		useBr : false//使用<br/>断行，默认不使用
	}, conf);
	
	var lines = [], curW = 0, curLine = [];
	//遍历文字，输出行
	$each($getCharArray(text), function(c) {
		if (c == '\n') {
			curLine.push(c);
			//换行
			newLine();
		} else if (chaWidth[c] > 0) {
			var width = chaWidth[c];
			if (width > 0) {
				if ((curW + width) > conf.width) {
					newLine();
				}
				curLine.push(c);
				curW += width;
			}
		}
	});
	if(curLine.length>0){
		newLine();
	}
	//返回
	return lines;
	//新行
	function newLine() {
		if (conf.useBr) {
			if (curLine.length == 0) {
				curLine.push(' ');
			}
			curLine.push('<br/>');
		}
		lines.push(curLine.join(''));
		curW = 0;
		curLine.length = 0;
	}
}
调用示例： 
//参考$parseTypesetText
依赖函数： 
$getCharArray$break$each$isAllowedUnicode$isEscapeSequense$each$extend
被依赖函数： 
www_iuni_com:$iuni_getArticleItems