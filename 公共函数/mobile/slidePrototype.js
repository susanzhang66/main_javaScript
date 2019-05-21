iuni.mobile.goods.phones_detail.delayLoad=function( startDom ){

	this.imgs = startDom.find('img');
	this.len = this.imgs.length;
	this.imgsArry = new Array();
	this.winH = $$(window).height();
	this.scrolltop = $$(window).scrollTop(),
	this.name = '.delay'+Date.parse(new Date());

	for(var j = 0;j<this.len;j++){
		this.imgsArry.push(this.imgs[j]);
	}

	if(!this.len) return;

	// this.delayFunc();

	$$(window).on('scroll'+this.name,{that:this},this.delayFunc).trigger('scroll'); 
};

iuni.mobile.goods.phones_detail.delayLoad.prototype.delayFunc = function(e){
		var that = e.data.that;
		for(var i=0;i<that.len;i++){

			var imgdom = $$(that.imgsArry[i]);

			var offTop = imgdom.offset().top,orSrc = imgdom.attr('orig_src');
			scrolltop = $$(window).scrollTop();

			if(offTop < scrolltop+that.winH){  
				if(imgdom.attr('src') != orSrc){ 
					imgdom.attr('src',orSrc);

					that.imgsArry.splice(i,1);
					i--;
					that.len--;
				}else{
					continue;
				}
			}
			if(that.len==0){
				$$(window).off('scroll'+that.name);
			}
			
		}
}