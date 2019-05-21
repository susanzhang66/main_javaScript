/**
 * 给dom元素做fixed定位，dom元素必须可以脱离所有文档流控制，即dom元素的所有父节点及祖父节点不能有position设置
 * IE6下通过定时调节位置的方式来实现
 * @param {Object} dom dom节点
 * @param {Object} pos 定位，可以设定left,top,bottom,right定位
 */
function $domFixed(dom,pos){
	var posKey=['left','top','bottom','right'];
	if($isBrowser('ie6')){
		var checkPos=function(){
			dom.style.position='absolute';
			for(var i=posKey.length;i--;){
				if(typeof pos[posKey[i]]=='number'){
					var offset=pos[posKey[i]];
					switch(posKey[i]){
						case "top":
							offset+=$getPageScrollTop();
							break;
						case "left":
							offset+=$getPageScrollLeft();
							break;
						case "bottom":
							offset+=$getPageHeight()-$getPageScrollTop()-$getWindowHeight();
							break;
						case "right":
							offset+=$getPageWidth()-$getPageScrollLeft()-$getWindowWidth();
							break;
					}
					dom.style[posKey[i]]=offset+'px';
				}
			}
		}
		if(dom.__fixedTimer){
			clearInterval(dom.__fixedTimer);
			dom.__fixedTimer=0;
		}
		checkPos();
		//定时调度
		dom.__fixedTimer=setInterval(checkPos,100);
		return dom.__fixedTimer;
	}else{
		//支持fixed属性的浏览器
		dom.style.position='fixed';
		for(var i=posKey.length;i--;){
			if(typeof pos[posKey[i]]=='number'){
				dom.style[posKey[i]]=pos[posKey[i]]+'px';
			}
		}
	}
}
调用示例： 
//把元素定位到右下角，距离右边40像素，距离下边20像素的位置
$domFixed($id('test'),{
    bottom:40,
    right:20
});
依赖函数： 
$getWindowWidth$getPageWidth$getWindowHeight$getPageHeight$getPageScrollLeft$getPageScrollTop$isBrowser