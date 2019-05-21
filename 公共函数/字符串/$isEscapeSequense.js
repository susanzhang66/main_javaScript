/*
函数名称：$isEscapeSequense
函数描述： 
判断字符串是否HTML转义字符

参数：
str 要判断的字符串

返回：
如果是转义字符，返回转义字符的unicode编码，否则返回false
*/ 
/**
 * 判断字符串是否HTML转义字符
 */
var $isEscapeSequense = (function() {
	//转义实体
	var entities = {
		'quot' : 34,
		'amp' : 38,
		'lt' : 60,
		'gt' : 62,
		'nbsp' : 160,
		'iexcl' : 161,
		'cent' : 162,
		'pound' : 163,
		'curren' : 164,
		'yen' : 165,
		'brvbar' : 166,
		'sect' : 167,
		'uml' : 168,
		'copy' : 169,
		'ordf' : 170,
		'laquo' : 171,
		'not' : 172,
		'reg' : 174,
		'macr' : 175,
		'deg' : 176,
		'plusmn' : 177,
		'sup2' : 178,
		'sup3' : 179,
		'actue' : 180,
		'micro' : 181,
		'para' : 182,
		'middot' : 183,
		'cedil' : 184,
		'sup1' : 185,
		'ordm' : 186,
		'raquo' : 187,
		'frac14' : 188,
		'frac12' : 189,
		'frac34' : 190,
		'iquest' : 191,
		'Agrave' : 192,
		'Aacute' : 193,
		'Acirc' : 194,
		'Atilde' : 195,
		'Auml' : 196,
		'Aring' : 197,
		'AElig' : 198,
		'Ccedil' : 199,
		'Egrave' : 200,
		'Eacute' : 201,
		'Ecirc' : 202,
		'Euml' : 203,
		'Igrave' : 204,
		'Iacute' : 205,
		'Icirc' : 206,
		'Iuml' : 207,
		'ETH' : 208,
		'Ntilde' : 209,
		'Ograve' : 210,
		'Oactue' : 211,
		'Ocirc' : 212,
		'Otilde' : 213,
		'Ouml' : 214,
		'times' : 215,
		'Oslash' : 216,
		'Ugrave' : 217,
		'Uacute' : 218,
		'Ucirc' : 219,
		'Uuml' : 220,
		'Yacute' : 221,
		'THORN' : 222,
		'szlig' : 223,
		'agrave' : 224,
		'aacute' : 225,
		'acirc' : 226,
		'atilde' : 227,
		'auml' : 228,
		'aring' : 229,
		'aelig' : 230,
		'ccedil' : 231,
		'egrave' : 232,
		'eacute' : 233,
		'ecirc' : 234,
		'euml' : 235,
		'igrave' : 236,
		'iacute' : 237,
		'icirc' : 238,
		'iuml' : 239,
		'eth' : 240,
		'ntilde' : 241,
		'ograve' : 242,
		'oacute' : 243,
		'ocirc' : 244,
		'otilde' : 245,
		'ouml' : 246,
		'divide' : 247,
		'oslash' : 248,
		'ugrave' : 249,
		'uactue' : 250,
		'ucirc' : 251,
		'uuml' : 252,
		'yacute' : 253,
		'thorn' : 254,
		'yuml' : 255
	};
	return function(str) {
		if (str.match(/^&(#(\d+)|([a-z0-9]+));$/i)) {
			var isNum = false, code;
			if (RegExp.$2) {
				code = parseInt(RegExp.$2);
				isNum = true;
			} else {
				code = RegExp.$3;
			}
			if (isNum) {
				return $isAllowedUnicode(code) ? code : false;
			} else {
				return entities[code] || false;
			}
		}
		return false;
	};
})();

/* =================================================
调用示例：  */
//判断&nbsp;是否转义字符，返回空格的unicode编码-160
var code=$isEscapeSequense('&nbsp;');
//判断&#24930;是否允许的转义字符，&#24930;(慢)为允许的转义字符，返回24930
var code=$isEscapeSequense('&#24930;');
依赖函数： 
$isAllowedUnicode
被依赖函数： 
$getCharWidth$iuni_typeset$iuni_typeset