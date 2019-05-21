/*
函数名称：$isAllowedUnicode
函数描述： 
判断是否系统允许的unicode字符

参数：
code 字符的unicode编码，目前系统只允许部分编码字符输出显示，并非所有字符都可输出。

返回 允许/不允许 T/F
*/
/**
 * 判断是否系统允许的unicode字符
 */
var $isAllowedUnicode=(function (){
		//entity code范围，控制在主要编码范围内
	var entitiesRange=[
//--		0x0000,0x007F,//C0控制符及基本拉丁文 (C0 Control and Basic Latin)
		0x0020,0x007E,

//--		0x0080,0x00FF,//C1控制符及拉丁文补充-1 (C1 Control and Latin 1 Supplement)
		0x00A1,0x00AC,
		0x00AE,0x00FF,

		0x0100,0x017F,//拉丁文扩展-A (Latin Extended-A)
		0x0180,0x024F,//拉丁文扩展-B (Latin Extended-B)
//		0x0250,0x02AF,//国际音标扩展 (IPA Extensions)
//		0x02B0,0x02FF,//空白修饰字母 (Spacing Modifiers)
//		0x0300,0x036F,//结合用读音符号 (Combining Diacritics Marks)
//		0x0370,0x03FF,//希腊文及科普特文 (Greek and Coptic)
//		0x0400,0x04FF,//西里尔字母(Cyrillic)
//		0x0500,0x052F,//西里尔字母补充 (Cyrillic Supplement)
//		0x0530,0x058F,//亚美尼亚语 (Armenian)
//		0x0590,0x05FF,//希伯来文 (Hebrew)
//		0x0600,0x06FF,//阿拉伯文 (Arabic)
//		0x0700,0x074F,//叙利亚文 (Syriac)
//		0x0750,0x077F,//阿拉伯文补充 (Arabic Supplement)
//		0x0780,0x07BF,//马尔代夫语 (Thaana)
//		0x07C0,0x077F,//西非书面语言 (N'Ko)
//		0x0800,0x085F,//阿维斯塔语及巴列维语(Avestan and Pahlavi)
//		0x0860,0x087F,//Mandaic
//		0x0880,0x08AF,//撒马利亚语 (Samaritan)
//		0x0900,0x097F,//天城文书 (Devanagari)
//		0x0980,0x09FF,//孟加拉语 (Bengali)
//		0x0A00,0x0A7F,//锡克教文 (Gurmukhi)
//		0x0A80,0x0AFF,//古吉拉特文 (Gujarati)
//		0x0B00,0x0B7F,//奥里亚文 (Oriya)
//		0x0B80,0x0BFF,//泰米尔文 (Tamil)
//		0x0C00,0x0C7F,//泰卢固文 (Telugu)
//		0x0C80,0x0CFF,//卡纳达文 (Kannada)
//		0x0D00,0x0D7F,//德拉维族语 (Malayalam)
//		0x0D80,0x0DFF,//僧伽罗语 (Sinhala)
//		0x0E00,0x0E7F,//泰文 (Thai)
//		0x0E80,0x0EFF,//老挝文 (Lao)
//		0x0F00,0x0FFF,//藏文 (Tibetan)
//		0x1000,0x109F,//缅甸语 (Myanmar)
//		0x10A0,0x10FF,//格鲁吉亚语(Georgian)
//		0x1100,0x11FF,//朝鲜文 (Hangul Jamo)
//		0x1200,0x137F,//埃塞俄比亚语 (Ethiopic)
//		0x1380,0x139F,//埃塞俄比亚语补充 (Ethiopic Supplement)
//		0x13A0,0x13FF,//切罗基语 (Cherokee)
//		0x1400,0x167F,//统一加拿大土著语音节 (Unified Canadian Aboriginal Syllabics)
//		0x1680,0x169F,//欧甘字母 (Ogham)
//		0x16A0,0x16FF,//如尼文(Runic)
//		0x1700,0x171F,//塔加拉语 (Tagalog)
//		0x1720,0x173F,//Hanunóo
//		0x1740,0x175F,//Buhid
//		0x1760,0x177F,//Tagbanwa
//		0x1780,0x17FF,//高棉语 (Khmer)
//		0x1800,0x18AF,//蒙古文 (Mongolian)
//		0x18B0,0x18FF,//Cham
//		0x1900,0x194F,//Limbu
//		0x1950,0x197F,//德宏泰语 (Tai Le)
//		0x1980,0x19DF,//新傣仂语 (New Tai Lue)
//		0x19E0,0x19FF,//高棉语记号 (Kmer Symbols)
//		0x1A00,0x1A1F,//Buginese
//		0x1A20,0x1A5F,//Batak
//		0x1A80,0x1AEF,//Lanna
//		0x1B00,0x1B7F,//巴厘语 (Balinese)
//		0x1B80,0x1BB0,//巽他语 (Sundanese)
//		0x1BC0,0x1BFF,//Pahawh Hmong
//		0x1C00,0x1C4F,//雷布查语(Lepcha)
//		0x1C50,0x1C7F,//Ol Chiki
//		0x1C80,0x1CDF,//曼尼普尔语(Meithei/Manipuri)
//		0x1D00,0x1D7F,//语音学扩展 (Phonetic Extensions)
//		0x1D80,0x1DBF,//语音学扩展补充 (Phonetic Extensions Supplem
//		0x1DC0,0x1DFF,//结合用读音符号补充 (Combining Diacritics Marks Supplement)
//		0x1E00,0x1EFF,//拉丁文扩充附加 (Latin Extended Additional)
//		0x1F00,0x1FFF,//希腊语扩充 (Greek Extended)
//--		0x2000,0x206F,//常用标点(General Punctuation)
		0x2010,0x2010,
		0x2012,0x2027,
		0x2030,0x205E,

//		0x2070,0x209F,//上标及下标 (Superscripts and Subscripts)
//		0x20A0,0x20CF,//货币符号 (Currency Symbols)
//		0x20D0,0x20FF,//组合用记号 (Combining Diacritics Marks for Symbols)
//		0x2100,0x214F,//字母式符号 (Letterlike Symbols)
//		0x2150,0x218F,//数字形式 (Number Form)
//		0x2190,0x21FF,//箭头 (Arrows)
//		0x2200,0x22FF,//数学运算符 (Mathematical Operator)
//		0x2300,0x23FF,//杂项工业符号 (Miscellaneous Technical)
//		0x2400,0x243F,//控制图片 (Control Pictures)
//		0x2440,0x245F,//光学识别符 (Optical Character Recognition)
//		0x2460,0x24FF,//封闭式字母数字 (Enclosed Alphanumerics)
//		0x2500,0x257F,//制表符 (Box Drawing)
//		0x2580,0x259F,//方块元素 (Block Element)
//		0x25A0,0x25FF,//几何图形 (Geometric Shapes)
//		0x2600,0x26FF,//杂项符号 (Miscellaneous Symbols)
//		0x2700,0x27BF,//印刷符号 (Dingbats)
//		0x27C0,0x27EF,//杂项数学符号-A (Miscellaneous Mathematical Symbols-A)
//		0x27F0,0x27FF,//追加箭头-A (Supplemental Arrows-A)
//		0x2800,0x28FF,//盲文点字模型 (Braille Patterns)
//		0x2900,0x297F,//追加箭头-B (Supplemental Arrows-B)
//		0x2980,0x29FF,//杂项数学符号-B (Miscellaneous Mathematical Symbols-B)
//		0x2A00,0x2AFF,//追加数学运算符 (Supplemental Mathematical Operator)
//		0x2B00,0x2BFF,//杂项符号和箭头 (Miscellaneous Symbols and Arrows)
//		0x2C00,0x2C5F,//格拉哥里字母(Glagolitic)
//		0x2C60,0x2C7F,//拉丁文扩展-C (Latin Extended-C)
//		0x2C80,0x2CFF,//古埃及语 (Coptic)
//		0x2D00,0x2D2F,//格鲁吉亚语补充 (Georgian Supplement)
//		0x2D30,0x2D7F,//提非纳文 (Tifinagh)
//		0x2D80,0x2DDF,//埃塞俄比亚语扩展 (Ethiopic Extended)
//		0x2E00,0x2E7F,//追加标点 (Supplemental Punctuation)
		0x2E80,0x2EFF,//CJK 部首补充 (CJK Radicals Supplement)
		0x2F00,0x2FDF,//康熙字典部首 (Kangxi Radicals)
		0x2FF0,0x2FFF,//表意文字描述符 (Ideographic Description Characters)
		0x3000,0x303F,//CJK 符号和标点 (CJK Symbols and Punctuation)
		0x3040,0x309F,//日文平假名 (Hiragana)
		0x30A0,0x30FF,//日文片假名 (Katakana)
		0x3100,0x312F,//注音字母 (Bopomofo)
		0x3130,0x318F,//朝鲜文兼容字母 (Hangul Compatibility Jamo)
		0x3190,0x319F,//象形字注释标志 (Kanbun)
		0x31A0,0x31BF,//注音字母扩展 (Bopomofo Extended)
		0x31C0,0x31EF,//CJK 笔画 (CJK Strokes)
		0x31F0,0x31FF,//日文片假名语音扩展 (Katakana Phonetic Extensions)
		0x3200,0x32FF,//封闭式 CJK 文字和月份 (Enclosed CJK Letters and Months)
		0x3300,0x33FF,//CJK 兼容 (CJK Compatibility)
		0x3400,0x4DBF,//CJK 统一表意符号扩展 A (CJK Unified Ideographs Extension A)
		0x4DC0,0x4DFF,//易经六十四卦符号 (Yijing Hexagrams Symbols)
		0x4E00,0x9FBF,//CJK 统一表意符号 (CJK Unified Ideographs)
//		0xA000,0xA48F,//彝文音节 (Yi Syllables)
//		0xA490,0xA4CF,//彝文字根 (Yi Radicals)
//		0xA500,0xA61F,//Vai
//		0xA660,0xA6FF,//统一加拿大土著语音节补充 (Unified Canadian Aboriginal Syllabics Supplement)
//		0xA700,0xA71F,//声调修饰字母 (Modifier Tone Letters)
//		0xA720,0xA7FF,//拉丁文扩展-D (Latin Extended-D)
//		0xA800,0xA82F,//Syloti Nagri
//		0xA840,0xA87F,//八思巴字 (Phags-pa)
//		0xA880,0xA8DF,//Saurashtra
//		0xA900,0xA97F,//爪哇语 (Javanese)
//		0xA980,0xA9DF,//Chakma
//		0xAA00,0xAA3F,//Varang Kshiti
//		0xAA40,0xAA6F,//Sorang Sompeng
//		0xAA80,0xAADF,//Newari
//		0xAB00,0xAB5F,//越南傣语 (Vi?t Thái)
//		0xAB80,0xABA0,//Kayah Li
//		0xAC00,0xD7AF,//朝鲜文音节 (Hangul Syllables)
//		0xD800,0xDBFF,//High-half zone of UTF-16
//		0xDC00,0xDFFF,//Low-half zone of UTF-16
//		0xE000,0xF8FF,//自行使用区域 (Private Use Zone)
		0xF900,0xFAFF,//CJK 兼容象形文字 (CJK Compatibility Ideographs)
//		0xFB00,0xFB4F,//字母表达形式 (Alphabetic Presentation Form)
//		0xFB50,0xFDFF,//阿拉伯表达形式A (Arabic Presentation Form-A)
//		0xFE00,0xFE0F,//变量选择符 (Variation Selector)
//		0xFE10,0xFE1F,//竖排形式 (Vertical Forms)
//		0xFE20,0xFE2F,//组合用半符号 (Combining Half Marks)
		0xFE30,0xFE4F,//CJK 兼容形式 (CJK Compatibility Forms)
//		0xFE50,0xFE6F,//小型变体形式 (Small Form Variants)
//		0xFE70,0xFEFF,//阿拉伯表达形式B (Arabic Presentation Form-B)
		0xFF00,0xFFEF,//半型及全型形式 (Halfwidth and Fullwidth Form)
//		0xFFF0,0xFFFF,//特殊 (Specials)
		null
	];
	entitiesRange.pop();
	//排序控制，可省略
	entitiesRange.sort(function(a,b){return a<b?-1:a==b?0:1});
	var len=entitiesRange.length;
	return function(code){
		for(var i=0;i<len;i++){
			if(entitiesRange[i]>=code){
				return entitiesRange[i]==code?true:i%2==1;
			}
		}
		return false;
	};
})();

/* ========================================================
调用示例：  */
//返回true
$isAllowedUnicode('中'.charCodeAt(0));
//叙利亚文符号"ܑ"，当前不允许，返回false
$isAllowedUnicode(String.fromCharCode(0x0711).charCodeAt(0));
被依赖函数： 
$isEscapeSequense$iuni_typeset$iuni_typeset$getCharWidth$getCharWidth$iuni_typeset