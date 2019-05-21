function $iuni_mobile_fixedTop(dom ,top , zindex){

	//top:要固定的高度
	function fixTop( dom ,top , zindex) {
		var that = this;
		this.startTop = $$(dom).offset().top; 
		this.dom = $$(dom);
		this.top = top;
		this.zIndex = zindex;

		$$(window).bind("scroll",that,that.scrollFun);

		
	}
	fixTop.prototype.scrollFun = function( e ){
		var scrolltop = $$(window).scrollTop(),edata = e.data;
		if(scrolltop<edata.startTop){
			edata.dom.css({"position":"relative","top":0,"zIndex":edata.zIndex});
		}else{
			edata.dom.css({"position":"fixed","top":edata.top,"zIndex":edata.zIndex,width:"100%"});
		}	
	}

	return new fixTop(dom,top,zindex);

};

$iuni_mobile_fixedTop("#phone_detail",0,100);