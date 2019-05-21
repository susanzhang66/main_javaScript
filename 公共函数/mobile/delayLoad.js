iuni.mobile.goods.phones_detail.delayLoad=function( startDom ){

	var imgs = startDom.find('img'),len = imgs.length,imgsArry = new Array();
		winH = $$(window).height(),scrolltop = $$(window).scrollTop(),
		name = '.delay'+new Date();

	for(var j = 0;j<len;j++){
		imgsArry.push(imgs[j]);
	}

	if(!len) return;

	function delayFunc(){

		for(var i=0;i<len;i++){

			var imgdom = $$(imgsArry[i]);

			var offTop = imgdom.offset().top,orSrc = imgdom.attr('orig_src');
			scrolltop = $$(window).scrollTop();

			if(offTop < scrolltop+winH){
				if(imgdom.attr('src') != orSrc){
					imgdom.attr('src',orSrc);

					imgsArry.splice(i,1);
					i--;
					len--;
				}else{
					continue;
				}
			}
			if(len==0){
				$$(window).off('scroll'+name);
			}
			
		}

	}
	delayFunc();
	$$(window).on('scroll'+name,delayFunc);

};