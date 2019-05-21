/*
$extend
函数描述： 
扩展属性，将第二个参数起到最后一个参数的所有属性复制到dest上去
*/ 
/**
 * 扩展属性，将第二个参数起到最后一个参数的所有属性复制到dest上去
 * @param {Object} dest
 */
function $extend(dest) {
	dest=dest||{};
	var len = arguments.length;
	if (len > 1) {
		for (var i = 1; i < len; i++) {
			var src = arguments[i];
			if(src){
				//复制属性
				for (var property in src) {
					if(src.hasOwnProperty(property)){
						dest[property] = src[property];
					}
				}
			}
		}
	}
        return dest;
}
调用示例： 
//obj结果为{a:2,b:2,c:3}
var obj=$extend({},{a:1,b:2},{a:2,c:3});
被依赖函数： 
$jsonpwww_iuni_com:$iuni_dialogManager$getCharWidthwww_iuni_com:$iuni_getArticleItemswww_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articlePagewww_iuni_com:$iuni_getArticleItems$parseTypesetTextwww_iuni_com:$iuni_typeset$pagewww_iuni_com:$iuni_typeset$sliderBar$parseTypesetText$eventNormalize$unbindEventwww_iuni_com:$iuni_dialogManager$sliderBar$pagewww_iuni_com:$iuni_pagination$sliderBarwww_iuni_com:$iuni_showOneCtlwww_iuni_com:$iuni_dialogManager$bindEventwww_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_getArticleItems