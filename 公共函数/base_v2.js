/* =========================================================================
@ base.js:全站公共使用的js
============================================================================ */
/**
@ $addEvent:绑定事件
* param {element}elem:元素
* param {string}type:事件类型
* param {function}handle:句柄
*/
function $addEvent(elem,type,handle){
	if(!elem || !type || !handle){
		return;	
	}	
	if(elem instanceof Array){
		for(var i = 0, len = elem.length; i < len; i++) {
			$addEvent(elem[i], type, handle);
		}
		return;	
	}	
	if( type instanceof Array) {
		for(var i = 0, len = type.length; i < len; i++) {
			$addEvent(elem, type[i], handle);
		}
		return;
	}
	if(!$addEvent.createDelegate){
		$addEvent.createDelegate=function(handle, context) {
			return function() {
				return handle.apply(context, arguments);
			};
		};
	}
	var delegateHandle=$addEvent.createDelegate(handle,elem);
	
	var typeArr=type.split("."),type=typeArr[0],spaceId=typeArr.length>1?typeArr[1]:false;	
	if(window.addEventListener){
		elem.addEventListener(type,delegateHandle,false);	
	}else if(window.attachEvent){
		elem.attachEvent("on"+type,delegateHandle);
	}else{
		alert("你的浏览器太out了");	
	}
	
	elem.__eventHandle= elem.__eventHandle || {};
	elem.__eventHandle[type]=elem.__eventHandle[type] || [];	
	if(spaceId){
		elem.__eventHandle[type].push({delegateHandle:delegateHandle,handle:handle,spaceId:spaceId});
	}else{
		elem.__eventHandle[type].push({delegateHandle:delegateHandle,handle:handle});
	}
	
	return delegateHandle;
}

/**
@ $removeEvent:取消事件监听
* param {element}elem:元素
* param {string}type:事件类型
* param {function}handle:句柄
*/
function $removeEvent(elem,type,handle,delegateHandle){
	if(arguments.length<2){return;}	
	var typeArr=type.split("."),type=typeArr[0],spaceId=typeArr.length>1?typeArr[1]:false;
	if(!elem.__eventHandle || !elem.__eventHandle[type]){return;}
	
	for(var i=0,eventArr=elem.__eventHandle[type],len=eventArr.length,isremove,eventSingle;i<len;i++){
		isremove=false,eventSingle=eventArr[i];
		if(!handle || (handle && (eventSingle.handle===handle))){
			if(!spaceId || (spaceId && (eventSingle.spaceId===spaceId))){
				if(!delegateHandle || (delegateHandle && delegateHandle===eventSingle.delegateHandle)){
					isremove=true;
				}
			}
		}
		if(isremove){
			if(window.removeEventListener){
				elem.removeEventListener(type,eventSingle.delegateHandle,false);	
			}else{
				elem.detachEvent("on"+type,eventSingle.delegateHandle);
			}
			eventArr.splice(i,1);
			i--;
			len--;
			if(delegateHandle){
				break;
			}
		}
	}
}
/* ===================================================
@ run before:
====================================================== */
/* ---------------------------------------------------
@ $DelayLoad ：延时加载
------------------------------------------------------ */
function $DelayLoad(o,undefined){
	var othis=this;
	othis._selfId=(++othis.constructor._newNum);
	othis._selfName=".$DelayLoad"+othis._selfId;
	
	if(o!=undefined){
		othis.oContent=document.getElementById(o).getElementsByTagName("img");
	}else{
		othis.oContent=document.images;
	}
}
$DelayLoad.prototype={
	init:function(){
		var othis=this;
		
		if(othis.oContent.length == 0){ return false;}	
		
		othis.oLoadItems=new Array();
		var len=othis.oContent.length;
		for(var i=0;i<len;i++){
			if(othis.oContent[i].attributes["init_src"]){
				othis.oLoadItems.push($(othis.oContent[i]));
			}
		}
		if(othis.oLoadItems.length == 0){return false; }
		
		$(window).bind("scroll"+othis._selfName+" resize"+othis._selfName,othis,othis.fnLoad);			
		othis.fnLoad();	
	},
	fnLoad:function(e){
		var othis=(e && e.data) || this;		
		var owin=$(window),oLoad=othis.oLoadItems;
		var scrollStart=owin.scrollTop(),winH=owin.height(),end=scrollStart+winH;
		
		var sum=oLoad.length;
		for(var i=0;i<sum;i++){ 
			
		   if(oLoad[i].attr("src")==oLoad[i].attr("init_src")){
				oLoad.splice(i,1);
				i--;
				sum--;
				continue;
			}		
			
			var offTop=parseInt(oLoad[i].offset().top); 
			var offBottom=parseInt(offTop+(oLoad[i].outerHeight() || othis.height));		
			
			if((offTop >= scrollStart && offTop <=end) || (offBottom>=scrollStart && offBottom <= end || (offTop<scrollStart && offBottom > end))){
				oLoad[i].attr("src",oLoad[i].attr("init_src"));
				oLoad.splice(i,1);
				i--;
				sum--;
			}
		}
			
		if(sum==0){
			$(window).unbind("scroll"+othis._selfName+" resize"+othis._selfName);
		}			
	}
};
$DelayLoad._newNum=0;
$DelayLoad.prototype.constructor=$DelayLoad;

/* --------------------------------
* $FocusBlur :
* callback {function} callback:回调 ，带有两个参数，isFocus：是否为focus，isNull是否为空
----------------------------------- */
function $FocusBlur(o){
	if(o==undefined){return;}
	
	this.otxt=$id(o.otxt);
	this.config.cssFocus=o.config.cssFocus || this.config.cssFocus;
	this.config.defValue=o.config.defValue || this.config.defValue;
	this.callback=typeof callback=="function"?callback:this.callback;
	
	//初始化
	this.init();
}
$FocusBlur.prototype={
	config:{cssFocus:"focus",defValue:""},
	callback:function(){},
	init:function(){
		var that=this,otxt=that.otxt;
		
		// 绑定	
		$(otxt).bind("focus",that,that.focusHandler);
		$(otxt).bind("blur",that,that.blurHandler);
		
		// 设置状态
		if(otxt.value.length==0){
			otxt.value=that.config.defValue;
			otxt.style.color="#999999";
		}else{
			otxt.style.color="#000000";
		}
	},
	focusHandler:function(e){
		var that=e.data,isNull=false,cfg=that.config,o=that.otxt;
		$(o).addClass(cfg.cssFocus);
		o.style.color="#000000";
		if(o.value == cfg.defValue){
			isNull=true;
			o.value="";	
		}
		that.callback(true,isNull);
	},
	blurHandler:function(e){
		var that=e.data,isNull=false,cfg=that.config,o=that.otxt;
		$(o).removeClass(cfg.cssFocus);
		if(o.value.length==0){
			isNull=true;
			o.value=cfg.defValue;
			o.style.color="#999999";	
		}
		that.callback(false,isNull);
	}
};
$FocusBlur.prototype.constructor=$FocusBlur;

/* -------------------------------------------------- 
@ $FixedtoTop : 固定在浏览器顶部
----------------------------------------------------- */
function $FixedtoTop(o){
	var othis=this;
	othis._selfID=++othis.constructor._newNum;
	othis._selfName=".$FixedtoTop"+othis._selfID;
	if(!o || !o.obj){return false;}
	
	othis.config=$.extend({},othis.config,o.config);
	othis.obj=$(o.obj);
	othis.show();
}
$FixedtoTop.prototype={
	config:{toTop:0,start:0,zIndex:200},
	setPos:function(e){
		var othis=e.data,cfg=othis.config,scrollNum=$(window).scrollTop();
		
		if(scrollNum<cfg.start){
			othis.obj.css({"position":"relative","top":0,"zIndex":1});
		}else{
			othis.obj.css({"position":"fixed","top":cfg.toTop,"zIndex":cfg.zIndex});
		}		
	},
	setPosIe6:function(e){
		var othis=e.data,cfg=othis.config,scrollNum=$(window).scrollTop();
		
		if(scrollNum < cfg.start){
			othis.obj.css({"position":"relative","top":0,"zIndex":1});
		}else{
			othis.obj.css({"position":"absolute","top":scrollNum,"zIndex":cfg.zIndex});
		}
	},
	hide:function(e){
		var othis=e.data;
		othis.obj.slideUp(200);
		if($.browser.msie&&Number($.browser.version)<=6){
			$(window).unbind("scroll "+othis._selfName);
		}
	},
	toNormal:function(e){
		var othis=e.data;
		othis.obj.css({"position":"relative","top":0,"zIndex":1});
		$(window).unbind("scroll "+othis._selfName);
	},
	show:function(e){		
		var othis=(e && e.data) || this,cfg=othis.config;
				
		if(cfg.start==0){
			othis.obj.css({"position":"fixed","top":cfg.toTop,"zIndex":cfg.zIndex});
			
			if($.browser.msie&&Number($.browser.version)<=6){
				var owin=$(window);
				othis.setPos=othis.setPosIe6;
				owin.bind("scroll "+othis._selfName,othis,othis.setPos);
			}
		}else{
			var owin=$(window);
			if($.browser.msie&&Number($.browser.version)<=6){
				othis.setPos=othis.setPosIe6;
			}
			owin.bind("scroll "+othis._selfName,othis,othis.setPos);
		}
		othis.obj.slideDown(200);	
	}
};
$FixedtoTop.prototype.constructor=$FixedtoTop;
$FixedtoTop._newNum=0;

/* -------------------------------------------------- 
@ $FixedFloatRight : 固定在浏览器右侧
----------------------------------------------------- */
function $FixedFloatRight(o){
	var othis=this;
	othis._selfID=++othis.constructor._newNum;
	othis._selfName=".$FixedFloatRight"+othis._selfID;
	if(!o || !o.obj){return false;}
	
	othis.config=$.extend({},othis.config,o.config);
	othis.obj=$(o.obj);
}
$FixedFloatRight.prototype={
	config:{ toRight:10,toBottom:10,toStart:0,toEnd:0},
	init:function(){
		var othis=this,cfg=othis.config;
		cfg.objH=cfg.objH || othis.obj.outerHeight();	
		
		if($.browser.msie&&Number($.browser.version)<=6){
			othis.setPos=othis.setPosIe6;
		}
		$(window).bind("scroll"+othis._selfName+" resize"+othis._selfName,othis,othis.setPos);
		othis.setPos();
	},	
	setPos:function(e){
		var othis=(e && e.data) || this,cfg=othis.config;
		var owin=$(window),scrollNum=owin.scrollTop(),winH=owin.height();
		
		if(scrollNum+winH -othis.obj.outerHeight()-cfg.toBottom< cfg.toStart){	
			othis.obj.css({"position":"absolute","top":cfg.toStart});
		} else if(scrollNum+winH>=cfg.toEnd){
			othis.obj.css({"position":"absolute","top":cfg.toEnd-othis.obj.outerHeight()-cfg.toBottom});			
		}else {
			othis.obj.css({"position":"fixed","top":winH-othis.obj.outerHeight()-cfg.toBottom});
		}				
	},
	setPosIe6:function(e){
		var othis=(e && e.data) || this,cfg=othis.config;
		var owin=$(window),scrollNum=owin.scrollTop(),winH=owin.height();
		
		if(scrollNum+winH -othis.obj.outerHeight()-cfg.toBottom< cfg.toStart){	
			othis.obj.css({"position":"absolute","top":cfg.toStart});
		} else if(scrollNum+winH>=cfg.toEnd){
			othis.obj.css({"position":"absolute","top":cfg.toEnd-othis.obj.outerHeight()-cfg.toBottom});			
		}else {
			othis.obj.css({"position":"absolute","top":scrollNum+winH-othis.obj.outerHeight()-cfg.toBottom});
		}
	}
};
$FixedFloatRight.prototype.constructor=$FixedFloatRight;
$FixedFloatRight._newNum=0;

/* --------------------------------------------------
@ $Hover :
----------------------------------------------------- */
function $Hover(o){
	var othis=this;
	if(o.obj==undefined){
		return;
	}else{
		othis.obj=$(o.obj);	
		othis.oPanel=othis.obj.find(o.selectorPanel);
	}
	if(o.cssHover){othis.cssHover=o.cssHover;}
	othis.config=$.extend({},othis.config,o.config);
	othis.obj.bind("mouseenter",othis,othis.mouseenterHandler);	
	othis.obj.bind("mouseleave",othis,othis.mouseleaveHandler);		
}
$Hover.prototype={
		cssHover:"curr",
		config:{onBefore:null},
		mouseenterHandler:function(e){
			var eData=e.data;
			clearTimeout(eData._timeout);
			if(!eData.obj.hasClass(eData.cssHover)){
				eData._timeout=setTimeout(function(){
					if(eData.config.onBefore!=null){
						eData.config.onBefore();
					}
					eData.oPanel.stop(false,true);
					eData.obj.addClass(eData.cssHover);	
					eData.oPanel.slideDown(200);
				},200);
			}
		},
		mouseleaveHandler:function(e){
			var eData=e.data;
			clearTimeout(eData._timeout);
			if(eData.obj.hasClass(eData.cssHover)){
				eData._timeout=setTimeout(function(){
					eData.oPanel.stop(false,true);
					eData.oPanel.slideUp(200,function(){
						eData.obj.removeClass(eData.cssHover);
					});	
				},300);
		    }
		}
};
$Hover.prototype.constructor=$Hover;

/* --------------------------------------------------
@ $Quantity:商品数量增减
----------------------------------------------------- */
function $Quantity(o){
	var othis=this;
	
	if(!o || !o.obj){return;}
	
	othis.config=$.extend({},othis.config,o.config);
	var cfg=othis.config;
	
	othis.obj=$(o.obj);
	othis.oTxt=othis.obj.find(cfg.selectorTxt);
	othis.oAdd=othis.obj.find(cfg.selectorAdd);
	othis.oRedu=othis.obj.find(cfg.selectorRedu);
	
	// 绑定事件
	othis.oAdd.bind("click",othis,othis.addHandler);
	othis.oRedu.bind("click",othis,othis.reduHandler);
	othis.oTxt.bind("keypress",othis,othis.keypressHandler);
	othis.oTxt.bind("blur",othis,othis.blurHandler);	
	
	// 初始化
	othis.init();
}

$Quantity.prototype={
	config:{selectorTxt:".ui_quantity_num",selectorAdd:".ui_quantity_add",selectorRedu:".ui_quantity_redu",cssAddDis:"ui_quantity_add_dis",cssReduDis:"ui_quantity_redu_dis",minValue:1,maxValue:1000,colnum:1,onAfter:null},
	init:function(){
		this.setStatus(this.oTxt.val());
	},
	addHandler:function(e){
		var othis=e.data,cfg=othis.config,nmin=cfg.minValue,nmax=cfg.maxValue,colnum=cfg.colnum,value=parseInt(othis.oTxt.val());
		if($(this).hasClass(cfg.cssAddDis)){
			e.stopPropagation();
			return false;
		}
		if(isNaN(value) || value < nmin){
			value=nmin;
		}else if(value>=nmax) {
			value=nmax;
		}else{
			value=value+colnum;
		}
		
		othis.oTxt.val(value);
		othis.setStatus(value);
		if(othis.config.onAfter!=null){othis.onAfter=othis.config.onAfter;othis.onAfter();}
		
		e.stopPropagation();
	},
	blurHandler:function(e){
		var othis=e.data,cfg=othis.config;
		var value=parseInt(othis.oTxt.val());
		if(isNaN(value) || value<cfg.minValue){
			value=cfg.minValue;	
		}else if(value > cfg.maxValue){
			value=cfg.maxValue;	
		}
		othis.oTxt.val(value);
		othis.setStatus(value);
				
		if(othis.config.onAfter!=null){othis.onAfter=othis.config.onAfter;othis.onAfter();}
	},
	keypressHandler:function(e){
		if(e.keyCode<48 || e.keyCode>57) {
			e.preventDefault();
		    var othis=e.data;
			othis.oTxt.val(othis.config.minValue);
		}
	},
	reduHandler:function(e){
		var othis=e.data,cfg=othis.config,nmin=cfg.minValue,nmax=cfg.maxValue,colnum=cfg.colnum,value=parseInt(othis.oTxt.val());
			
		if($(this).hasClass(cfg.cssReduDis)){
			e.stopPropagation();
			return false;
		}
		if(isNaN(value) || value-colnum < nmin || value > nmax){
			value=nmin;
		}else{
			value=value-colnum;
			
		}
		
		othis.oTxt.val(value);
		othis.setStatus(value);		
		
		if(othis.config.onAfter!=null){othis.onAfter=othis.config.onAfter;othis.onAfter();}
		
		e.stopPropagation();
	},
	setStatus:function(num){
		var othis=this,cfg=othis.config,n=num;
		if(n<=cfg.minValue){
			othis.oRedu.addClass(cfg.cssReduDis);
		}else{
			othis.oRedu.removeClass(cfg.cssReduDis);
		}
	
		if(n>=cfg.maxValue){
			othis.oAdd.addClass(cfg.cssAddDis);
		}else{
			othis.oAdd.removeClass(cfg.cssAddDis);
		}
	}	
};
$Quantity.prototype.constructor=$Quantity;

/* --------------------------------------------------
@ $Slide:滚动切换
----------------------------------------------------- */
function $Slide(o,undefined){
	var othis=this,undefined;
	othis.timeout=null;
	othis._selfID=(++othis.constructor._newNum);
	othis._selfName=".$Slide"+othis._selfID;
	
	if(!o){return;}
	if(o.config!=undefined){
		othis.config=$.extend({},othis.config,o.config);	
	}
	if(o.oslide!=undefined){
		othis.oslide=$(o.oslide);
		othis.oPanel=othis.oslide.find(othis.config.panelSelector);
		othis.oItems=othis.oPanel.find(othis.config.itemsSelector);
		othis.oOptionsCon=othis.oslide.find(othis.config.optionsSelector);
		othis.oOptions=othis.oOptionsCon.find(othis.config.optionSelector);
	}
}
$Slide.prototype={
	config:{pos:0,isRandom:false,speed:400,delay:4000,auto:false,moveWay:"moveWidth",itemsSelector:".ui_slide_item",panelSelector:".ui_slide_panel",optionSelector:".ui_slide_option",optionsSelector:".ui_slide_options",optionCSSCurr:"ui_slide_option_curr",itemCSSCurr:"ui_slide_item_curr",itemWidth:0,itemHeight:0,onBeforeMove:null,isDelay:false},
	autoPlay:function(){
		var othis=this;
		clearTimeout(othis.timeout);
		othis.config.pos++;
		othis.move();
		othis.timeout=setTimeout(function(){othis.autoPlay(); return othis.timeout;},othis.config.delay);
	},
	setPos:function(){
		var othis=this;
		othis.config.pos>=othis.sum?othis.config.pos=othis.config.pos-othis.sum:othis.config.pos=othis.config.pos;
	},
	itemsHandler: function(e){
		var othis=e.data;
		clearTimeout(othis.timeout);	
	},
	optionsEnterHandler:function(e){
		var othis=e.data,cfg=othis.config,oself=$(this);
		othis.delayTimeout=setTimeout(function(){ 
			clearTimeout(othis.timeout);
			var index=othis.oOptions.index(oself);
			cfg.pos=index;
			othis.move();				
		},200);		
	},
	leaveHandler:function(e){
		var othis=e.data;
		clearTimeout(othis.delayTimeout);
		if(othis.config.auto){
			clearTimeout(othis.timeout);
			othis.timeout=setTimeout(function(){othis.autoPlay(); return othis.timeout;},othis.config.delay);
		}
	},
	init:function(){
	   var othis=this,cfg=othis.config;
	   var sum=othis.oOptions.length;
	   othis.sum=sum;
	   
	   if(sum==0){othis.oslide.hide();return false;}
	   if(sum==1){
		   othis.oOptions.hide();
		   othis.oItems.addClass(cfg.itemCSSCurr);
		   if(othis.config.isDelay){
			  cfg.pos=0;
			  $(window).bind("resize"+othis._selfName+" scroll"+othis._selfName,othis,othis.fnDelay);
			  othis.fnDelay(); 
		   }
		   return false;
	   }
	   
	   if(cfg.isRandom){
			cfg.pos=Math.floor(othis.sum*Math.random());
	   }
	   
	   othis.setMoveWay();
	   
	   if(othis.config.isDelay){
		  othis.config.onBeforeMove=othis.fnDelay; 
		  $(window).bind("resize"+othis._selfName+" scroll"+othis._selfName,othis,othis.fnDelay);
		  othis.fnDelay();
	   }
	   
	   othis.oItems.mouseenter(othis,othis.itemsHandler);
	   othis.oOptions.mouseenter(othis,othis.optionsEnterHandler);
	   othis.oOptions.mouseleave(othis,othis.leaveHandler);
		
		if(cfg.auto){
			othis.oItems.mouseleave(othis,othis.leaveHandler);
			othis.timeout=setTimeout(function(){othis.autoPlay(); return othis.timeout;},cfg.delay);	
		}			
	},
	move:function(){
		if(this.config.onBeforeMove){
			this.onBeforeMove=this.config.onBeforeMove;
			this.onBeforeMove();	
		}	
		this.movefunc();		
	},
	setMoveWay:function(){			
		var othis=this,cfg=othis.config;	
		othis.oInitMoveWay[cfg.moveWay](othis);
		othis.movefunc=othis.oMoveWays[cfg.moveWay];
	},
	setStatus:function(){
		var othis=this,cfg=othis.config;
		othis.oItems.removeClass(cfg.itemCSSCurr);	
		othis.oItems.eq(cfg.pos).addClass(cfg.itemCSSCurr);
		othis.oOptions.removeClass(cfg.optionCSSCurr);
		othis.oOptions.eq(cfg.pos).addClass(cfg.optionCSSCurr);
	},
	oInitMoveWay:{
		 // moveWidth 移动宽度
		 moveWidth:function(e){
			 var othis=e,cfg=othis.config;
			 othis.itemValue=othis.config.itemWidth || othis.oItems.eq(0).outerWidth(true); 
			 othis.oPanel.css({"width":othis.itemValue*othis.sum});
			 othis.setPos();
			 othis.oPanel.css({"left":-cfg.pos*othis.itemValue});
			 othis.setStatus();
		},
		
		// moveHeight 移动高度
		moveHeight:function(e){	
			var othis=e,cfg=othis.config;
			othis.itemValue=othis.config.itemHeight || othis.oItems.eq(0).outerHeight(true);
			othis.oPanel.css({"height":othis.itemValue*othis.sum});
			othis.setPos();
			othis.oPanel.css({"top":-cfg.pos*othis.itemValue});
			othis.setStatus();
		},
		
		// moveNone:直接切换，没有特效
		moveNone:function(e){
			  var othis=e,cfg=othis.config;
				 othis.setPos();
				 othis.oItems.hide();
				 othis.oItems.eq(cfg.pos).show();
				 othis.setStatus();	
		},
		
		// moveOpacity 改变透明度
		moveOpacity:function(e){
				var othis=e,cfg=othis.config;
				 othis.setPos();
				 othis.oItems.hide();
				 othis.oItems.eq(cfg.pos).show();
				 othis.setStatus();	
			},
		
		// moveWidthC 移动宽度--无痕的
		
		// moveHeightC 移动高度--无痕的
		moveHeightC:function(e){
			var othis=e;
			othis.oItemsFirst=othis.oItems.eq(0);
			othis.oItemsFirst.css("position","relative");
			othis.itemValue=othis.config.itemWidth || othis.oItemsFirst.outerWidth(true);
			othis.oPanel.css({"width":othis.itemValue*(othis.sum+1)});	
			othis.setPos();
			othis.oPanel.css({"left":-cfg.pos*othis.itemValue});
			othis.setStatus();	
		}
	},
	oMoveWays:{
		// moveWidth 移动宽度
		 moveWidth:function(){
			var othis=this,cfg=othis.config;
			othis.oPanel.stop(false,true);
			othis.setPos();
			othis.setStatus();
			othis.oPanel.animate({"left":-cfg.pos*othis.itemValue},cfg.speed);
		 },
		 
		 // moveHeight 移动高度
		 moveHeight:function(){
			var othis=this,cfg=othis.config;
			othis.oPanel.stop(false,true);
			othis.setPos();
			othis.oPanel.animate({"top":-cfg.pos*othis.itemValue},cfg.speed);
			othis.setStatus();
		 },
		
		// moveNone:直接切换，没有特效
		moveNone:function(){
			var othis=this,cfg=othis.config;
			othis.setPos();
			othis.setStatus();
			othis.oItems.hide();
			othis.oItems.eq(cfg.pos).show();
		},
		
		// moveOpacity 改变透明度
		moveOpacity:function(){
			var othis=this,cfg=othis.config;
			othis.setPos();
			othis.oItems.hide();
			othis.oItems.eq(cfg.pos).fadeIn();
			othis.setStatus();
		},
		
		// moveHeightC 移动高度--无痕的
		moveHeightC:function(){
			var othis=this,cfg=othis.config;
			othis.oPanel.stop(false,true);
			
			if(cfg.pos>othis.sum-1){
				othis.oItemsFirst.css({"left":othis.itemValue*othis.sum});
				othis.oPanel.animate({"left":-cfg.pos*othis.itemValue},cfg.speed,function(){
					othis.oPanel.css("left",0);
					othis.oItemsFirst.css("left",0);
				});
				cfg.pos=cfg.pos-othis.sum;
				othis.setStatus();
			}else if(othis.pos<0){
				cfg.pos=cfg.pos+othis.sum;
				othis.setStatus();
				othis.oPanel.css("left",-othis.itemValue*othis.sum);
				othis.oItemsFirst.css({"left":othis.itemValue*othis.sum});
				othis.oPanel.animate({"left":-(cfg.pos*othis.itemValue)},cfg.speed,function(){
					othis.oItemsFirst.css("left",0);
				});
			}else{
				othis.setStatus();
				othis.oPanel.animate({"left":-cfg.pos*othis.itemValue},cfg.speed);
			} 
		}
	},
	fnDelay:function(e){
		var othis=(e && e.data) || this,oimgs;
		if(!othis.oDelayImgs){
			oimgs=othis.oslide.find("img");	
			othis.oDelayImgs=new Array();	
			oimgs.each(function(){
				if($(this).attr("orial_src")){othis.oDelayImgs.push(this);}	
			});		
		};
		var spos=othis.config.pos;
		if(spos>othis.oItems.length-1){spos=spos-othis.oItems.length;}
		oimgs=othis.oItems.eq(spos).find("img");
		
		var owin=$(window);	
		var scrollStart=owin.scrollTop(),winH=owin.height(),end=scrollStart+winH;
		
		var sum=oimgs.length;
		oimgs.each(function(){
			var oself=$(this);
			var offTop=parseInt(oself.offset().top);
			var offBottom=parseInt(offTop+(oself.outerHeight() || 800));
			if((offTop>=scrollStart && offTop <=end) || (offBottom>=scrollStart && offBottom <= end )){
				oself.attr("src",oself.attr("orial_src"));
				for(var i=0;i<othis.oDelayImgs.length;i++){
					if(othis.oDelayImgs[i]== this){othis.oDelayImgs.splice(i,1);i--;break;}	
				}
			}	
		});
		if(othis.oDelayImgs.length==0){ othis.config.onBeforeMove=null; $(window).unbind("resize"+othis._selfName+" scroll"+othis._selfName);}
	}	
};
$Slide.prototype.constructor=$Slide;
$Slide._newNum=0;
$Slide.play=function(o){
	var obj=new $Slide(o);
	obj.init();
	return obj;
};

/* ---------------------------------------------------
@ $Tab : tab切换
------------------------------------------------------ */
function $Tab(o,undefined){
	var othis=this;
	othis._selfID=(++othis.constructor._newNum);
	othis._selfName=".$Tab"+othis._selfID;
	
	if(!o){return;}
	if(o.config!=undefined){
		othis.config=$.extend({},othis.config,o.config);	
	}
	if(o.oTab!=undefined){
		othis.oTab=$(o.oTab);
		othis.oPanel=othis.oTab.find(othis.config.selectorPanel);
		othis.oItems=othis.oPanel.find(othis.config.selectorItem);
		othis.oOptionsCon=othis.oTab.find(othis.config.selectorOptions);
		othis.oOptions=othis.oOptionsCon.find(othis.config.selectorOption);
	}	
}
$Tab.prototype={	
	config:{pos:0,isRandom:false,selectorItem:".ui_tab_item",selectorPanel:".ui_tab_panel",selectorOption:".ui_tab_option",selectorOptions:".ui_tab_options",cssOptionCurr:"ui_tab_option_curr",onBeforeMove:null,onAfterMove:null,isDelay:false},
	init:function(){
	   var othis=this,cfg=othis.config;
	   var sum=othis.oOptions.length;
	   othis.sum=sum;
	   
	   if(sum==0){othis.oTab.hide();return false;}
	   if(sum==1){
		   cfg.pos=0;
	   }else{
		   if(cfg.isRandom){
				cfg.pos=Math.floor(sum*Math.random());
		   }	
	   	   othis.oOptions.mouseenter(othis,othis.optionsEnterHandler);
	  	   othis.oOptions.mouseleave(othis,othis.optionsLeaveHandler);	   
	   }
	   	   
	   if(cfg.isDelay){
		  $(window).bind("resize"+othis._selfName+" scroll"+othis._selfName,othis,othis.fnDelay);
	   }
	   	   
	   othis.move();
	},
	move:function(){
		if(this.config.onBeforeMove){
			this.onBeforeMove=this.config.onBeforeMove;
			this.onBeforeMove();	
		}	
		if(this.config.isDelay){
		 	this.fnDelay();
		 }
		this.movefunc();			
		if(this.config.onAfterMove){
			this.onAfterMove=this.config.onAfterMove;
			this.onAfterMove();	
		}		
	},
	movefunc:function(){
		var othis=this,cfg=othis.config;
			othis.oItems.hide();
			othis.oItems.eq(cfg.pos).show();
			othis.oOptions.removeClass(cfg.cssOptionCurr);
			othis.oOptions.eq(cfg.pos).addClass(cfg.cssOptionCurr);
	},
	optionsEnterHandler:function(e){
		var othis=e.data,cfg=othis.config,oself=$(this);
		othis._delayTimeout=setTimeout(function(){ 
			clearTimeout(othis._delayTimeout);
			var index=othis.oOptions.index(oself);
			cfg.pos=index;
			othis.move();				
		},200);		
	},
	optionsLeaveHandler:function(e){
		clearTimeout(e.data._delayTimeout);
	},
	fnDelay:function(e){
		var othis=(e && e.data) || this,oimgs;
		if(!othis.oDelayImgs){
			oimgs=othis.oTab.find("img");	
			othis.oDelayImgs=new Array();	
			oimgs.each(function(){
				if($(this).attr("orial_src")){othis.oDelayImgs.push(this);}	
			});		
		}
		var spos=othis.config.pos;
		oimgs=othis.oItems.eq(spos).find("img");
		
		var owin=$(window);	
		var scrollStart=owin.scrollTop(),winH=owin.height(),end=scrollStart+winH;
		
		var sum=oimgs.length;
		oimgs.each(function(){
			var oself=$(this);
			if(!oself.attr("orial_src")){return;}
			
			var offTop=parseInt(oself.offset().top);
			var offBottom=parseInt(offTop+(oself.outerHeight() || 800));
			if((offTop>=scrollStart && offTop <=end) || (offBottom>=scrollStart && offBottom <= end) || (offTop< scrollStart && offBottom > end)){
				oself.attr("src",oself.attr("orial_src"));
				for(var i=0;i<othis.oDelayImgs.length;i++){
					if(othis.oDelayImgs[i]== this){othis.oDelayImgs.splice(i,1);i--;break;}	
				}
			}	
		});
		if(othis.oDelayImgs.length==0){ othis.config.isDelay=false; $(window).unbind("resize"+othis._selfName+" scroll"+othis._selfName);}
	}	
};
$Tab.prototype.constructor=$Tab;
$Tab.play=function(o){
	var obj=new $Tab(o);
	obj.init();
	return obj;
};

function $trim(str){
	return str.replace(/^\s+|\s$/g,'');	
}

/* ---------------------------------------------------
@ MinWin :迷你窗口
------------------------------------------------------ */
function $MinWin(o){
	var othis=this;
	othis._selfId=++othis.constructor._newNum;
	othis._spaceName=".$Minwin"+othis._selfId;
	
	if(!o){ return false;}
	
	if(o.obj){
	othis.obj=$(o.obj);
	}
	if(o.objWin){
	othis.objWin=othis.obj.find(o.objWin);
	}else{
	othis.objWin=othis.obj.children();
	}
	if(o.oclose){
	othis.oclose=othis.obj.find(o.oclose);
	}else{
	othis.oclose=othis.obj.find(".ui_minWin_close");
	}	
	if(o.closeTime){
	othis.closeTime=parseInt(o.closeTime);
	}
	
	if ($isBrowser("ie6")) {
			var iframe = document.createElement("iframe");
			$extend(iframe.style, {
				position : "absolute",
				left : "0px",
				top : "0px",
				width : "100%",
				zIndex : -1,
				border : "none",
				backgroundColor : "#000000"
			});
			iframe.setAttribute("allowtransparency", "yes");
			try{
			iframe.document.body.style.backgroundColor = "#000000";
			}catch(e){}
			othis.coverIframe=othis.obj.get(0).appendChild(iframe);
			othis.coverIframe.style.position = "absolute";
			othis.coverIframe.style.zIndex="1";
			othis.objWin.get(0).style.zIndex="2";
	}
}
$MinWin.prototype.closeTime=0;
$MinWin.prototype.show=function(){
		var othis=this;	
		othis.obj.show();
		
		var objH=parseInt(othis.objWin.outerHeight());
		
		if($.browser.msie && Number($.browser.version) <= 6){	
		othis.obj.css({"height":$(document).height()});	
		othis.coverIframe.height=$(document).height();
		othis.posIE6();	
		
		var owin=$(window);	
		owin.bind("scroll"+othis._spaceName,{ominwin:othis},function(event){
		var ominwin=event.data.ominwin;
		    	ominwin.posIE6();
		});	
		owin.bind("resize"+othis._spaceName,{ominwin:othis},function(event){
		var ominwin=event.data.ominwin;
		    	ominwin.posIE6();
		});	
	}else{
		othis.objWin.css({"marginTop":-parseInt(objH/2)});
	}
	
	othis.oclose.bind("click"+othis._spaceName,{ominwin:othis},function(event){
		var ominwin=event.data.ominwin;
		    ominwin.hide();
	});
	
	if(othis.closeTime){
		setTimeout(function(){othis.hide();},othis.closeTime);
	}
}
$MinWin.prototype.hide=function(){
	var othis=this;
	othis.obj.hide();
	othis.oclose.unbind("click"+othis._spaceName);
	
	if($.browser.msie && Number($.browser.version) <= 6){
		var owin=$(window);	
		owin.unbind("scroll"+othis._spaceName);
		owin.unbind("resize"+othis._spaceName);
		}
}
$MinWin.prototype.posIE6=function(){	
	var othis=this;
	var objH=parseInt(othis.objWin.outerHeight());
	
	var owin=$(window);
	var winH=parseInt(owin.height());
	var scrollTop=parseInt(owin.scrollTop());
	
	othis.objWin.css({"top":scrollTop+parseInt((winH-objH)/2)});
}
$MinWin._newNum=0;

/* ===================================================
@ running:
====================================================== */

// 设置ie6背景缓存
(function(navigator){
	var browser = new Object();
	browser.name=navigator.appName;
	if(browser.name.indexOf("Microsoft")!=-1){
		browser.version=navigator.appVersion.indexOf("MSIE");
		browser.version=parseInt(navigator.appVersion.substring(browser.version+4));
		if(browser.version<=6){
			document.execCommand("BackgroundImageCache", false, true);
		}
	}
})(window.navigator);

/* ===================================================
@ user：用户信息
====================================================== */
/**
 * 设置cookie
 * @param {String} name
 * @param {String} value
 * @param {String} expires
 * @param {String} path
 * @param {String} domain
 * @param {String} secure
 */
function $setCookie(name, value, expires, path, domain, secure) {
	var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
	expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
	document.cookie = name + '=' + escape(value) + ( expires ? ';expires=' + exp.toGMTString() : '') + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
}

/* --------------------------------------------------
 * 获取cookie
 * @param {string} name
 * @return null 没有找到
 * @return ""/string value
 */
function $getCookie(name) {
	var reg = new RegExp("(^| |(?=;))" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
	return val ? (val[2] ? unescape(val[2]) : "") : null;
}

/*
 * 删除cookie 
 * @param {String} name
 * @param {String} path
 * @param {String} domain
 * @param {String} secure
 */
function $delCookie(name, path, domain, secure) {
	var value = $getCookie(name);
	if (value != null) {
		var exp = new Date();
		exp.setMinutes(exp.getMinutes() - 1000);
		path = path || "/";
		document.cookie = name + '=;expires=' + exp.toGMTString() + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
	}
}

/* ---------------------------------------------------
* $getLoginInfo : 获取登录信息
@param {Object} userInfo：存储用户登录信息；status：0/1未登录/已登录;
@param {Object} userInfo.info:已登录用户的信息，用户id，用户名(user_id,user_name);
@param {Array} callbackArr:回调队列
@param {number} isCheck:是否异步请求中（1是；0否）；
------------------------------------------------------ */
var $getLoginInfo=(function(){
	var userInfo,callbackArr=[],isCheck=0;
	
	function checkInfo(){
		var cookieName="tgt",userInfo;
		var cookieValue=$getCookie(cookieName);
		if(cookieValue===null || cookieValue.length==0){
			userInfo={status:0};
			var len=callbackArr.length;
			for(var i=0;i<len;i++){
				try{
				   callbackArr[i](userInfo);						
				}catch(e){}
			}
			callbackArr.length=0;
		}else{
			$.ajax({url:"/user.php?act=get_login_user",type:"get",dataType:"json",success:function(data){
				userInfo={};
				userInfo.status=data.status;
				if(userInfo.status==0){
					var exp = new Date();
					exp.setMinutes(exp.getMinutes() - 1000);
					document.cookie =cookieName + '=;expires=' + exp.toGMTString() + ';path=/;domain=.gionee.com;';
				}else{
					userInfo.info=data.user_infor;
				}
				
				var len=callbackArr.length;
				if(len>0){
					for(var i=0;i<len;i++){
						callbackArr[i](userInfo);	
					}
					callbackArr.length=0;
				}
			}});
		}
		isCheck=0;
	}
	
	return function(callback){
			if(userInfo){  //有用户信息
				callback(userInfo);	
			}else{  // 未检测
				if(isCheck==0){ // 
					isCheck=1;
					callbackArr.push(callback);	
					checkInfo();
				}else{
					callbackArr.push(callback);	
				}	
			}
		}
})();

/* -----------------------------------------------------
* $getCartInfo:获取购物车数据
* @param {function} callback:回调函数；
*/ 
var $getCartInfo=(function(){
	return function(callback){
		$.ajax({url:"/flow.php?step=get_cart_goods",type:"POST",context:document.body,dataType:"json",success:function(data){
			//console.log(data);
			try{
				callback(data);
			}catch(e){}
		}});
	}
})();

/* -----------------------------------------------------
* $addCartPro:向购物车中添加商品
* @param {Object} goods : {quick:1/0,spec:[],goods_id:"",number:1,parent:0};
* @param {function} callback:回调函数；
*/ 
var $addCartPro=(function(){
	return function(goods,callback){
		var len=goods.spec.length,str='';
		for(var i=0;i<len;i++){
			str+=',"'+goods.spec[i]+'"';
		}
		if(len > 0){
			str='"'+str.substr(2);
		}
		str='{"quick":'+goods.quick+',"spec":['+str+'],"goods_id":'+goods.goods_id+',"number":'+goods.number+',"parent":'+goods.parent+'}';
		var datas={};
		datas.goods=str;
		datas[hex_md5($getCookie("gn_token_id") || "")]=1;
		$.ajax({url:"/flow.php?step=add_to_cart",type:"POST",context:document.body,dataType:"json",data:datas,success:function(data){
			callback(data);
		}});
	}
})();

/* --------------------------------------------------------
 * @$addModAddress：增加修改地址
 * @param:data:地址信息
 * @param:callback:回调函数
 */
var $addModAddress=(function(){
	return function(data,callback){
		callback= typeof callback == "function" ? callback : function() {};
		$.ajax({url:"/flow.php?step=consignee",type:"GET",context:document.body,dataType:"json",data:data,success:function(data){
			callback(data);
		}});
	}
})();


/* =============================================================
@ 模版
================================================================ */
//$id
function $id(id) {
	return typeof (id) == "string" ? document.getElementById(id) : id;
};

//$getTpl
$getTpl=(function() {
	var reg=/(.*?)\/\*(.*?)\*\/(.*)\1/i,regAll=/<!--(.*?)\/\*(.*?)\*\/(.*?)\1-->/gi;
	function decode(str, desc) {
		str = str.replace(/[\n\r]/g, "");
		var a = str.match(regAll);
		var b = {};
		if (!a) {
			return [];
		}
		for (var i = 0; i < a.length; i++) {
			var s=a[i];
			//360js引擎bug，对字符串需要重新修改分配内存
			var t = (' '+s).substring(1).match(reg);
			b[t[1]] = t[3].replace(/^\s*/,'').replace(/\d*$/,'');
		}
		return b;
	};
	
	return function(id) {
			var s = $id("tpl_" + id);
			var obj = decode(s ? s.innerHTML : "",true);
			return obj;
		};
})(); 

//$formatTpl
$formatTpl=(function() {
	return function(tpl, data) {
			var fn =new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + tpl.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
			return data ? fn(data) : fn;
		}		
		 
})(); 

/* ========================================
 * 获取收货人地址接口 
 */
$getRegion=(function(){
	return function(type,parent,callback){
		$.ajax({url:"/region.php?type="+type+"&parent="+parent,type:"GET",context:document.body,dataType:"json",success:function(data){
			callback(data);
		}});
	}
})();
$editAddAddress=(function(){
	return function(data,callback){		
		$.ajax({url:"/flow.php?step=consignee",type:"POST",context:document.body,dataType:"json",data:data,success:function(data){
			callback(data);
		}});
	}
})();
$delAddress=(function(){
	return function(address_id,callback){		
		$.ajax({url:"/flow.php?step=drop_consignee",type:"GET",context:document.body,dataType:"json",data:{id:address_id},success:function(data){
			callback(data);
		}});
	}
})();

//格式化浮点数，v 为原数据，e表示要保留的小数位数，（吴健武增加）
function $round(v,e){
	var t=1,oriale=e;
	for(;e>0;t*=10,e--);
	for(;e<0;t/=10,e++);
	var result=(Math.round(v*t)/t).toString();
	
	var reg=result.match(/^\d+\.(\d*)$/);
	var addlength=0;
	if(reg==null){
		result+=".";
		addlength=oriale;
	}else{
		addlength=oriale-reg[1].length;
	}
	for(var i=0;i<addlength;i++){
		result+="0";
	}
	return result;
}

//---------------------------------------------系统核心库函数------------------------------//
function $namespace(name) {
	for (var arr = name.split(','), r = 0, len = arr.length; r < len; r++) {
		for (var i = 0, k, name = arr[r].split('.'), parent = {}; k = name[i]; i++) {
			i === 0 ? eval('(typeof ' + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : ( parent = parent[k] = parent[k] || {});
		}
	}
}

var $float=(function(){
	if(typeof $float!='undefined'){
		return $float;
	}
	var cache={},id=0;
	return window.$float=function(opt) {
		//选项
		var option = {
			left : 0,
			top : 0,
			width : 400,
			height : 0,
			title : "",
			html : "",
			autoResize : false,
			cover : true,
			dragble : false,
			fix : false,
			showClose : true,
			cName : "module_box_normal",
			style : "stand",
			contentStyle : "",
			cssUrl : "http://shop.gionee.com/static/css/float.css",
			onInit : null,
			onClose : null
		};
		for (var i in opt) {
			option[i] = opt[i];
		}
		//初始化
		option.id=id++;
		//加载css
		$loadCss(option.cssUrl);
		//关闭，析构，关闭其他，保持fixed，resize，show，setPos定义
		option.setAutoResize=autoResize;
		option.close = close;
		option.destruct = destruct;
		option.closeOther = closeOther;
		option.keepFix = keepFix;
		option.resize = resize;
		option.show = show;
		option.setPos = setPos;
		//窗体对象缓存注册
		cache[option.id]=option;
		//关闭其他
		option.closeOther();
		//显示
		option.show();
		//自动重置大小
		option.setAutoResize();
		//拖拽
		if (option.dragble) {
			$initDragItem({
				barDom : option.boxTitleHandle,
				targetDom : option.boxHandle
			});
		}
		return option;
		
		//关闭浮窗
		function close() {
			//销毁
			this.destruct();
			//关闭回调
			this.onClose&&this.onClose(this);
		}
		
		//销毁浮窗
		function destruct() {
			//移除遮罩
			if(this.cover){
				$mask.remove();
			}
			//移除定时器
			if (this.sizeTimer) {
				clearInterval(this.sizeTimer);
			}
			if (this.fixTimer) {
				clearInterval(this.fixTimer);
			}
			//移除dom
			this.boxHandle&&document.body.removeChild(this.boxHandle);
			this.boxHandle = null;
			//移除窗体对象缓存注册
			cache[this.id]=undefined;
			delete cache[this.id];
		}
		
		//显示浮窗
		function show() {
			//创建浮窗
			var c = document.createElement("div"), content = "",id=this.id;
			c.id = 'float_box_' + id;
			c.style.position = "absolute";
			if ($isBrowser("ie6")) {
				content = '<iframe frameBorder="0" style="position:absolute;left:0;top:0;z-index:-1;border:none;" id="float_iframe_' + id + '"></iframe>';
			}
			c.className = option.cName;
			var data={
				content:content,
				id:id,
				style:this.contentStyle ? ('style="' + this.contentStyle + '"') : "",
				html:this.html,
				title:this.title,
				showClose:this.showClose ? '' : 'none'
			}
			switch(this.style) {
				case"stand":
					c.innerHTML =$formatStr('{#content#}<div class="box_title" id="float_title_{#id#}"><a href="javascript:;" style="display:{#showClose#};"  class="bt_close" id="float_closer_{#id#}">×</a><h4>{#title#}</h4></div><div class="box_content" {#style#}>{#html#}</div>',data);
					break;
				default:
					c.innerHTML = $formatStr('{#content#}<div class="box_content" {#style#} id="float_title_{#id#}">{#html#}</div>',data);
					break;
			}
			//加入document
			document.body.appendChild(c);
			c=null;
			//绑定dom
			this.boxHandle = $id('float_box_' + id);
			this.boxTitleHandle = $id('float_title_' + id);
			this.boxCloseHandle = $id('float_closer_' + id);
			if ($isBrowser("ie6")) {
				this.boxIframeHandle = $id('float_iframe_' + id);
			}
			//初始化zIndex
			this.boxHandle.style.zIndex=getTopZindex(id);
			//初始化高宽
			this.height&&(this.boxHandle.style.height = (option.height == "auto" ? option.height : option.height + "px"));
			this.width&&(this.boxHandle.style.width = (option.width == "auto" ? option.width : option.width + "px"));
			this.sw = parseInt(this.boxHandle.offsetWidth);
			this.sh = parseInt(this.boxHandle.offsetHeight);
			//设置位置
			this.setPos();
			//显示遮罩
			if(this.cover){
				$mask.add();
			}
			var that=this;
			//关闭事件
			this.boxCloseHandle&&(this.boxCloseHandle.onclick = function() {
				that.close();
				return false;
			});
			//初始化回调
			this.onInit&&this.onInit(option);
		}
	
		//设置位置
		function setPos(left, top) {
			var psw = $getPageScrollWidth(), psh = $getPageScrollHeight(), ww = $getWindowWidth(), wh = $getWindowHeight();
			var p = [0, 0];
			left && (this.left = left);
			top && (this.top = top);
			p[0] = parseInt(this.left ? this.left : (psw + (ww - this.sw) / 2));
			p[1] = parseInt(this.top ? this.top : (psh + (wh - this.sh) / 2));
			((p[0] + this.sw) > (psw + ww))&&(p[0] = psw + ww - this.sw - 10) ;
			((p[1] + this.sh) > (psh + wh) )&&(p[1] = psh + wh - this.sh - 10);
			(p[1] < psh) && (p[1] = psh);
			(p[0] < psw) && (p[0] = psw);
			if ($isBrowser("ie6")) {
				this.boxIframeHandle.height = (this.sh - 2) + "px";
				this.boxIframeHandle.width = (this.sw -2) + "px";
			}
			this.boxHandle.style.left = p[0] + "px";
			this.boxHandle.style.top = p[1] + "px";
			this.keepFix();
		}
	
		//保持Fixed
		function keepFix() {
			if (this.fix) {
				var that = this;
				if ($isBrowser("ie6")) {
					!this.fixTimer && (this.fixTimer = setInterval(function() {
						that.boxHandle.style.left = (that.left ? that.left : ($getPageScrollWidth() + ($getWindowWidth() - that.sw) / 2)) + "px";
						that.boxHandle.style.top = (that.top ? that.top : ($getPageScrollHeight() + ($getWindowHeight() - that.sh) / 2)) + "px";
					}, 30));
				} else {
					this.boxHandle.style.position = "fixed";
					this.boxHandle.style.left = (this.left ? this.left : ($getWindowWidth() - this.sw) / 2) + "px";
					this.boxHandle.style.top = (this.top ? this.top : ($getWindowHeight() - this.sh) / 2) + "px";
				}
			}
		}
	
		//重置大小
		function resize(w, h) {
			if (w && w.constructor === Number) {
				this.sw = w;
				this.boxHandle.style.width = this.sw + "px";
				if ($isBrowser("ie6")) {
					this.boxIframeHandle.width = (this.sw - 2) + "px";
				}
			}
			if (h && h.constructor === Number) {
				this.sh = h;
				this.boxHandle.style.height = this.sh + "px";
				if ($isBrowser("ie6")) {
					this.boxIframeHandle.height = (this.sh - 2) + "px";
				}
			}
			this.setPos();
		}
		
		//自动重置大小
		function autoResize() {
			if (this.autoResize) {
				var that = this;
				this.sizeTimer = setInterval(function() {
					that.sw = that.boxHandle.offsetWidth;
					that.sh = that.boxHandle.offsetHeight;
					if ($isBrowser("ie6")) {
						that.boxIframeHandle.height = (that.sh - 2) + "px";
						that.boxIframeHandle.width = (that.sw - 2) + "px";
					}
				}, 50);
			}
		}
		
		//关闭其他浮窗
		function closeOther() {
			for (var id in cache) {
				if (id==this.id) {
					continue;
				}
				cache[id].close();
			}
		}
		
		//获取最高Zindex
		function getTopZindex(curId){
			var arr=[];
			for (var id in cache) {
				if(id!=curId){
					arr.push([id,cache[id].zIndex]);
				}
			}
			if(arr.length==0){
				return 9000;
			}
			arr.sort(function(a,b){
				return (a[1]<b[1])?-1:(a[1]==b[1])?0:1;
			});
			var top=arr[0][1];
			if(top>9999){
				for(var i=arr.length;i--;){
					var option=cache[arr[i][0]];
					option.boxHandle.style.zIndex=option.zIndex=9000-i;
				}
			}
			return cache[arr[0][0]].zIndex+1;
		}
	};
})();

//加载css
var $loadCss=(function(){
	if(typeof $loadCss=="function"){
		return $loadCss;
	}
	var cache={};
	return window.$loadCss=function(path, callback) {
		if (!path) {
			return;
		}
		var l;
		if (!cache[path]) {
			l = document.createElement('link');
			l.setAttribute('type', 'text/css');
			l.setAttribute('rel', 'stylesheet');
			l.setAttribute('href', path);
			l.setAttribute("id", "loadCss" + Math.random());
			document.getElementsByTagName("head")[0].appendChild(l);
			cache[path]=true;
		}
		l && ( typeof callback == "function") && (l.onload = callback);
		return true;
	};
})();

function $isBrowser(str){
	str=str.toLowerCase();
	var b = navigator.userAgent.toLowerCase();
	var isBro=false;
	switch (str){
		case 'chrome' : isBro=b.indexOf("chrome") != -1; break;
		case 'firefox' : isBro=b.indexOf("firefox") != -1; break;
		case 'safari' : isBro=b.indexOf("safari") != -1 && b.indexOf("chrome") == -1; break;
		case 'opera' : isBro=b.indexOf("opera") != -1; break;
		case 'ie' : isBro=b.indexOf("msie") != -1; break;
		case 'ie6' : isBro=b.indexOf("msie 6") != -1; break;
		case 'ie7' : isBro=b.indexOf("msie 7") != -1; break;
		case 'ie8' : isBro=b.indexOf("msie 8") != -1; break;
		case 'ie9' : isBro=b.indexOf("msie 9") != -1; break;
		case 'ie10' : isBro=b.indexOf("msie 10") != -1; break;
		case 'gecko' : isBro=b.indexOf("opera")== -1 && b.indexOf("safari") == -1 && b.indexOf("chrome") == -1 && b.indexOf("gecko") > -1; break;
	}	
	return isBro;
}

function $formatStr(str, obj, replaceIfUnfind) {
	if (str) {
		if ( typeof replaceIfUnfind == "undefined") {
			replaceIfUnfind = true;
		}
		str = str.replace(/{#([^#]+)#}/g, function(a, b) {
			return typeof obj[b] != "undefined" ? obj[b] : ( replaceIfUnfind ? "" : a);
		});
		return str;
	}
	return "";
}

function $getPageScrollHeight() {
	var bodyCath = document.body;
	var doeCath = document.compatMode == 'BackCompat' ? bodyCath : document.documentElement;
	return doeCath.scrollTop==0?bodyCath.scrollTop:doeCath.scrollTop;
}

function $getPageScrollWidth() {
	var bodyCath = document.body;
	var doeCath = document.compatMode == 'BackCompat' ? bodyCath : document.documentElement;
	return doeCath.scrollLeft==0?bodyCath.scrollLeft:doeCath.scrollLeft;
}

function $getScrollPosition() {
	var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
	return [ scrollLeft ? scrollLeft : 0, scrollTop ? scrollTop : 0];
}

function $getWindowHeight() {
	var bodyCath = document.body;
	return (document.compatMode == 'BackCompat' ? bodyCath : document.documentElement).clientHeight;
}

function $getWindowWidth() {
	var bodyCath = document.body;
	return (document.compatMode == 'BackCompat' ? bodyCath : document.documentElement).clientWidth;
}

function $getContentHeight() {
	var bodyCath = document.body;
	var doeCath = document.compatMode == 'BackCompat' ? bodyCath : document.documentElement;
	return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) ? bodyCath.scrollHeight : doeCath.scrollHeight;
}

function $getContentWidth() {
	var bodyCath = document.body;
	var doeCath = document.compatMode == 'BackCompat' ? bodyCath : document.documentElement;
	return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) ? bodyCath.scrollWidth : doeCath.scrollWidth;
}

(function(){
	if(typeof $mask!="undefined"){
		return;
	}
	var num=0,mask,maskSize=[0, 0],coverTimer;
	$mask={
		add:function(){
			if(!mask){
				createMask();
			}
			if(!num){
				showMask();
			}
			num++;
		},
		remove:function(){
			num--;
			if(!num){
				//隐藏
				mask.style.display = "none";
			}
		}
	};
	//创建遮罩
	function createMask() {
		var c = document.createElement("div");
		c.style.display = "none";
		c.style.width = "0px";
		c.style.height = "0px";
		c.style.backgroundColor = "#000000";
		c.style.zIndex = 250;
		c.style.position = "fixed";
		c.style.hasLayout = -1;
		c.style.left = "0px";
		c.style.top = "0px";
		c.style.filter = "alpha(opacity=20);";
		c.style.opacity = "0.2";
		if ($isBrowser("ie6")) {
			var iframe = document.createElement("iframe");
			$extend(iframe.style, {
				position : "absolute",
				left : "0px",
				top : "0px",
				width : "100%",
				zIndex : -1,
				border : "none",
				backgroundColor : "#000000"
			});
			iframe.setAttribute("allowtransparency", "yes");
			var t = setInterval(function() {
				try{
					iframe.contentWindow.document.body.style.backgroundColor = "#000000";
					clearInterval(t);
				}catch(e){}
			}, 50);
			c.appendChild(iframe);
			c.style.position = "absolute";
			c.coverIframe = iframe;
		}
		mask=c;
	}
	//显示遮罩
	function showMask(){
		document.body.appendChild(mask);
		//显示
		mask.style.display = "block";
		//定时保持显示
		keepShow();
		if(!coverTimer){
			coverTimer = setInterval(function() {
				keepShow();
			}, 50);
		}
		//保持显示
		function keepShow() {
			if(num>0){
				var ch = $getContentHeight(), cw = $getContentWidth(), wh = $getWindowHeight(), ww = $getWindowWidth(), ns = [wh, ww];
				//IE6
				if ($isBrowser("ie6")) {
					mask.style.top = $getPageScrollHeight() + "px";
				}
				if (ns.toString() != maskSize.toString()) {
					maskSize = ns;
					mask.style.height = ns[0].toFixed(0) + "px";
					mask.style.width = ns[1].toFixed(0) + "px";
					if (mask.coverIframe) {
						mask.coverIframe.style.height = ns[0].toFixed(0) + "px";
						mask.coverIframe.style.width = ns[1].toFixed(0) + "px";
					}
				}
			}
		}
	}
})();

function $initDragItem(opt) {
	var option = {
		barDom : "",
		targetDom : ""
	};
	for (var i in opt) {
		option[i] = opt[i];
	}
	var that = arguments.callee;
	that.option ? "" : that.option = {};
	option.barDom.style.cursor = 'move';
	option.targetDom.style.position = "absolute";
	option.barDom.onmousedown = function(e) {
		var e = window.event || e;
		that.option.barDom = this;
		that.option.targetDom = option.targetDom;
		var currPostion = [parseInt(option.targetDom.style.left) ? parseInt(option.targetDom.style.left) : 0, parseInt(option.targetDom.style.top) ? parseInt(option.targetDom.style.top) : 0];
		that.option.diffPostion = [$getMousePosition({evt:e})[0] - currPostion[0], $getMousePosition({evt:e})[1] - currPostion[1]];
		document.onselectstart = function() {
			return false;
		};
		window.onblur = window.onfocus = function() {
			document.onmouseup();
		};
		return false;
	};
	option.targetDom.onmouseup = document.onmouseup = function() {
		if (that.option.barDom) {
			that.option = {};
			document.onselectstart = window.onblur = window.onfocus = null;
		}
	};
	option.targetDom.onmousemove = document.onmousemove = function(e) {
		try {
			var e = window.event || e;
			if (that.option.barDom && that.option.targetDom) {
				that.option.targetDom.style.left = ($getMousePosition({evt:e})[0] - that.option.diffPostion[0]) + "px";
				that.option.targetDom.style.top = ($getMousePosition({evt:e})[1] - that.option.diffPostion[1]) + "px";
			}
		} catch(e) {
		}
	};
};

function $getMousePosition(e) {
	var e = window.event ? window.event : e;
	if (e.evt)
		e = e.evt;
	var pos = [];
	if ( typeof e.pageX != "undefined") {
		pos = [e.pageX, e.pageY];
	} else if ( typeof e.clientX != "undefined") {
		pos = [e.clientX + $getScrollPosition()[0], e.clientY + $getScrollPosition()[1]];
	}
	return pos;
}

function $extend() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, options;
	if ( typeof target != "object" && typeof target != "function")
		target = {};
	for (; i < length; i++)
		if (( options = arguments[i]) != null)
			for (var name in options) {
				var copy = options[name];
				if (target === copy)
					continue;
				if (copy !== undefined)
					target[name] = copy;
			}
	return target;
}

function $login(opt){
	var option={
		title:"登录后继续操作",
		callback:function(){}
	};	
	
	var returnUrl=window.location.href,domain="http://shop.gionee.com";
	if(!returnUrl || returnUrl.indexOf(domain)==-1){
		returnUrl="/";
	}
	option.skip=returnUrl;
	
	for(var k in opt){
		option[k]=opt[k];
	}	
	//设置用户中心跳转来源
	$setCookie("userReferr",option.skip);
	
	var _float=$float({
		title:option.title,
		width:"700",
		html:'<iframe src="http://passport.gionee.com/cas/n/fl?service=http://shop.gionee.com/login_success.shtml" width="660px" height="470px" align="top" scrolling="no" frameborder="0"></iframe>'
	});
	
	//设置domain
	try{
		var hn=location.hostname,d=hn.split(".");
		d.reverse(),d.length=2,d.reverse();
		document.domain=d.join(".");
	}catch(e){}
	window.loginsucess=function(){
		_float.close();
		option.callback&&option.callback();
	}
}

// 竖风琴
function $SlideOrgan(opt){
	this._selfId=(++this.constructor._newNum);
	this._selfName=".SlideOrgan"+this._selfId;
	
	this.option={
		width:0,
		height:0,
		navValue:0, //导航的宽度
		auto:false,  //是否自动播放
		delay:2000,  //播放间隔时间
		speed:400,  //播放速度
		delayLoad:true, //是否延时加载
		pos:0,
		zIndex:1,   //整个风琴的z-index
		seleSlide:"",
		seleItem:".ui_slide_item",
		seleNav:".ui_slide_nav",
		cssCurrItem:"ui_slide_item_curr",
		onMoveBefore:null,
		onMoveAtfer:null
	};
	if(!opt || !opt.seleSlide){return;}
	
	var that=this,config=that.option;
	for(var prop in opt){
		config[prop]=opt[prop];
	}
	that.init();
}
$SlideOrgan.prototype={
	constructor:$SlideOrgan,
	init:function(){
		var that=this,opt=that.option;
		//元素
		that.domSlide=$(opt.seleSlide);
		that.domItems=that.domSlide.children(opt.seleItem);
		that.domNavs=that.domSlide.find(opt.seleNav);
		
		//初始化
		that.initStatus();		
		
		//绑定事件
		that.bindEvent();
		
		//延时加载图片
		if(opt.delayLoad){
			opt.onBeforeMove=that.fnDelay; 
			$(window).bind("resize"+that._selfName+" scroll"+that._selfName,that,that.fnDelay);
			that.fnDelay();
		}		
		
		//运行
		if(opt.auto){
			that._timeout=setTimeout(function(){
				that.autoPlay();
			},opt.delay);
		}
	},
	initStatus:function(){
		var that=this,opt=that.option;
		that.itemsLen=that.domItems.length;
		that.itemValue=that.domItems.eq(0).outerWidth(true);
		
		that.navValue=opt.navValue || that.domNavs.eq(0).width();
		for(var i=0,len=that.itemsLen;i<len;i++){
			that.domItems.eq(i).css({"zIndex":opt.zIndex+(len-i),"right":(len-i-1)*that.navValue});
		}
		that.setStatus();
	},
	setStatus:function(){
		var that=this,opt=that.option;
		that.domItems.removeClass(opt.cssCurrItem);
		that.domItems.eq(opt.pos).addClass(opt.cssCurrItem);
	},
	bindEvent:function(){
		var that=this,opt=that.option;
		//item
		that.domItems.bind("mouseenter",function(){
			clearTimeout(that.domItems._timeout);
			clearTimeout(that._timeout);
			that.domItems._timeout=setTimeout(function(){
				clearTimeout(that._timeout);
				clearTimeout(that.domItems._timeout);
				that.domItems.stop(false,true);					
			},opt.speed);
		});
		that.domItems.bind("mouseleave",function(){
			clearTimeout(that.domItems._timeout);
			clearTimeout(that._timeout);
			that.domItems._timeout=setTimeout(function(){
				clearTimeout(that._timeout);
				clearTimeout(that.domItems._timeout);
				if(opt.auto){
					that._timeout=setTimeout(function(){
						that.autoPlay();
					},opt.delay);
				}					
			},opt.speed);
		});
		// nav
		that.domNavs.bind("mouseenter",function(e){
			var oself=$(this);
			var index=that.domNavs.index(oself);
			if(index==that.option.pos){return;}
			
			clearTimeout(that._timeout);
			that.domNavs._timeout=setTimeout(function(){
				clearTimeout(that._timeout);
				that.option.pos=index;
				that.move();
			},200);
		});
		
	},
	setPos:function(){
		var that=this,opt=that.option,len=that.itemsLen;
		if(opt.pos >len-1 || opt.pos<0){
			opt.pos=0;
		}
	},
	autoPlay:function(){
		var that=this,opt=that.option;
		clearTimeout(that._timeout);
		opt.pos++;
		that.setPos();
		that.move();
		that._timeout=setTimeout(function(){
			that.autoPlay();
		},opt.delay);	
	},
	movefunc:function(){
		var that=this,opt=that.option;
		that.domItems.stop(false,true);	
		
		var len=that.itemsLen,itemValue=that.itemValue,navValue=that.navValue;	
		that.setStatus();
		
		for(var i=0,right=0;i<len;i++){
			if(i<opt.pos){
				right=(len-i-2)*navValue+itemValue;
			}else{
				right=(len-i-1)*navValue;
			}
			that.domItems.eq(i).animate({"right":right},opt.speed,'easeInOut');
		}	
	},
	move:function(){
		if(this.option.onBeforeMove){
			this.onBeforeMove=this.option.onBeforeMove;
			this.onBeforeMove();
		}
		this.movefunc();	
		if(this.option.onAfterMove){
			this.onAfterMove=this.option.onAfterMove;
			this.onAfterMove();
		}
	},
	fnDelay:function(e){
		var that=(e && e.data) || this,opt=that.option;
		
		//获取需要加载的图片
		if(!that.delayImgs){
			that.delayImgs=new Array(that.itemsLen);
			for(var i=0,oimgs;i<that.itemsLen;i++){
				that.delayImgs[i]=that.delayImgs[i] || [];
				oimgs=that.domItems.eq(i).find("img");
				oimgs.each(function(){
					if($(this).attr("orial_src")){that.delayImgs[i].push(this);}	
				});
			}	
		};
		
		//加载显示区域
		that.setPos();
		var pos=opt.pos;
		
		//加载显示区图片
		var owin=$(window);	
		var scrollStart=owin.scrollTop(),winH=owin.height(),end=scrollStart+winH;
		for(var i=0,delayimg=that.delayImgs[pos],len=delayimg.length;i<len;i++){
			domjimg=$(delayimg[i]);
			var offTop=parseInt(domjimg.offset().top);
			var offBottom=parseInt(offTop+(domjimg.outerHeight() || 800));
			if((offTop>=scrollStart && offTop <=end) || (offBottom>=scrollStart && offBottom <= end) || (offTop< scrollStart && offBottom > end)){
					domjimg.attr("src",domjimg.attr("orial_src"));
					delayimg.splice(i,1);
					i--;
					len--;
			}
		}
				
		//判断是否加载完，加载完解除绑定
		for(var i=0,len=that.delayImgs.length;i<len;i++){
			if(that.delayImgs[i].length!==0){break;}
		}
		if(i===len){ 
			opt.onBeforeMove=null; 
			$(window).unbind("resize"+that._selfName+" scroll"+that._selfName);
		}
	}		
};
$SlideOrgan._newNum=0;

// 可预览前后画面的切换
function $SlideReview(opt,undefined){
	this._selfId=(++this.constructor._childNum);
	this._selfName=".SlideReview"+this._selfId;
	this.option={
		width:0, //宽度
		height:0, //高度
		pos:0, //初始位置
		isRandom:false, //初始播放位置是否随机
		speed:400, //播放速度
		delay:6000, //播放间隔时间
		auto:true,  //是否自动播放
		delayLoad:true,  //是否延迟加载
		col:1,//单侧预留可观看的个数
		seleSlide:"",  //播放dom元素
		selePanel:".ui_slide_panel",
		seleItems:".ui_slide_item",
		seleOpts:".ui_slide_opts",
		seleOpt:".ui_slide_opt",
		selePrev:".ui_slide_prev",
		seleNext:".ui_slide_next",
		seleMaskPrev:".ui_slide_maskPrev",
		seleMaskNext:".ui_slide_maskNext",
		cssCurrItem:"ui_slide_item_curr",
		cssCurrOpt:"ui_slide_opt_curr",
		cssPrevHover:"ui_slide_prev_hover",
		cssNextHover:"ui_slide_next_hover",
		onBeforeMove:null,
		onAfterMove:null
	}
	
	if(!opt || !opt.seleSlide){return;}	
	
	var that=this,config=that.option;
	for(var prop in opt){
		config[prop]=opt[prop];
	}
	that.init();
}
$SlideReview.prototype={
	constructor:$Slide,
	init:function(){
		var that=this,opt=that.option;
		//获取元素
		that.domSlide=$(opt.seleSlide);
		that.domPanel=that.domSlide.find(opt.selePanel);
		that.domItems=that.domPanel.find(opt.seleItems);
		that.domOptCon=that.domSlide.find(opt.seleOpts);
		that.domOptions=that.domOptCon.find(opt.seleOpt);
		that.domPrev=that.domSlide.find(opt.selePrev);
		that.domNext=that.domSlide.find(opt.seleNext);
		that.domMaskPrev=that.domSlide.find(opt.seleMaskPrev);
		that.domMaskNext=that.domSlide.find(opt.seleMaskNext);
				
		//元素的个数
		that.itemsLen=that.domItems.length;
		if(that.itemsLen===0){
			that.domSlide.hide();
			return;
		}
		if(that.itemsLen===1){
			that.domOptCon.hide();
			that.domPrev.hide();
			that.domNext.hide();
			that.domMaskPrev.hide();
			that.domMaskNext.hide();
			if(opt.delayLoad){
			  opt.pos=0;
			  that.sumLen=1;
			  opt.onBeforeMove=that.fnDelay; 
			  $(window).bind("resize"+that._selfName+" scroll"+that._selfName,that,that.fnDelay);
			  that.fnDelay();
		    }
			return;
		}
		
		if(that.itemsLen===2){
			that.domPrev.hide();
			that.domNext.hide();
			that.domMaskPrev.hide();
			that.domMaskNext.hide();
			that.domSlide.css({"overflow":"hidden","width":that.domItems.eq(0).width(),"margin-left":"auto","margin-right":"auto","margin-top":"0","margin-bottom":"0","height":"460px"});
		}
		
		//克隆元素
		that.domItems.clone().appendTo(that.domPanel);
		that.domItems=that.domPanel.find(opt.seleItems);
		that.sumLen=that.domItems.length;
		if(that.sumLen<4*opt.col+1){			
			that.domItems.clone().appendTo(that.domPanel);
			that.domItems=that.domPanel.find(opt.seleItems);
			that.sumLen=that.domItems.length;
		}
		
		//初始化
		that.initPos();	
		that.initStatus();	
		
		//绑定事件
		that.bindEvent();
		
		//加载图片		
		if(opt.delayLoad){
			opt.onBeforeMove=that.fnDelay; 
			$(window).bind("resize"+that._selfName+" scroll"+that._selfName,that,that.fnDelay);
			that.fnDelay();
		}	
		
		//运行
		if(opt.auto){
			that._timeout=setTimeout(function(){
				that.autoPlay();
			},opt.delay);
		}
				
	},
	initPos:function(){
		var that=this,opt=that.option;
		if(opt.isRandom){
			opt.pos=Math.floor(that.itemsLen*Math.random());
		}
	},
	initStatus:function(){		
		var that=this,opt=that.option;
		that.itemValue=opt.width || that.domItems.eq(0).outerWidth(true);
		that.domPanel.css({"width":that.itemValue*that.sumLen});
		that.setPos();
		that.domPanel.css({"left":-opt.pos*that.itemValue});
		that.setStatus();
	},
	setPos:function(){
		var that=this,opt=that.option,len=that.itemsLen,sumLen=that.sumLen;
		if(opt.pos-opt.col<0){
			opt.pos=opt.pos+len;
		}
		if(opt.pos+opt.col>sumLen-1){
			opt.pos=opt.pos-len;
		}
	},
	setStatus:function(){
		var that=this,opt=that.option;
		that.setPos();
		that.domItems.removeClass(opt.cssCurrItem);
		that.domItems.eq(opt.pos).addClass(opt.cssCurrItem);
		that.domOptions.removeClass(opt.cssCurrOpt);
		that.domOptions.eq(opt.pos%that.itemsLen).addClass(opt.cssCurrOpt);
	},
	autoPlay:function(){
		var that=this,opt=that.option;
		clearTimeout(that._timeout);
		opt.pos++;
		that.move();
		that._timeout=setTimeout(function(){that.autoPlay();},opt.delay);
	},
	movefunc:function(time){		
		var that=this,opt=that.option;
		that.domPanel.stop(false,true);
		
		var left=parseInt(that.domPanel.css("left")) || 0;
		if(opt.pos+opt.col>that.sumLen-1){
				opt.pos=opt.pos-that.itemsLen;
				left=-(opt.pos-1)*that.itemValue;
		}else if(opt.pos-opt.col<0){
				opt.pos=opt.pos+that.itemsLen;		
				left=-(opt.pos+1)*that.itemValue;
		}
	   that.domPanel.css({"left":left});			
	   that.setStatus();		   
	   var toLeft=-opt.pos*that.itemValue;
	   if(time){
	      	that.domPanel.animate({"left":toLeft},time);
	   }else{
	    	that.domPanel.animate({"left":toLeft},opt.speed,'easeInOut');
	   }
	},
	move:function(time){		
		if(this.option.onBeforeMove){
			this.onBeforeMove=this.option.onBeforeMove;
			this.onBeforeMove();
		}
		this.movefunc(time);	
		if(this.option.onAfterMove){
			this.onAfterMove=this.option.onAfterMove;
			this.onAfterMove();
		}
	},
	bindEvent:function(){
		var that=this,opt=that.option;
		//domslide
		if(that.itemsLen>2){
			that.domSlide.bind("mouseenter",function(e){
				clearTimeout(that.domSlide._timeout);
				that.domSlide._timeout=setTimeout(function(){
					that.domPrev.show();
					that.domNext.show();				
				},200);
			});		
			that.domSlide.bind("mouseleave",function(e){
				clearTimeout(that.domSlide._timeout);
				that.domSlide._timeout=setTimeout(function(){
					clearTimeout(that.domSlide._timeout);	
					that.domPrev.hide();
					that.domNext.hide();				
				},200);
			});
		}
		//items
		that.domItems.bind("mouseenter",function(e){
			clearTimeout(that.domItems._timeout);
			clearTimeout(that._timeout);
			that.domItems._timeout=setTimeout(function(){
				clearTimeout(that._timeout);
				clearTimeout(that.domItems._timeout);
				that.domItems.stop(false,true);					
			},200);
		});		
		that.domItems.bind("mouseleave",function(e){
			clearTimeout(that.domItems._timeout);
			clearTimeout(that._timeout);
			if(that.option.auto){
				that._timeout=setTimeout(function(){
					that.autoPlay();
				},opt.delay);
			}
		});
		
		//options
		that.domOptions.bind("mouseenter",function(e){	
			clearTimeout(that.domOptions._timeout);		
			var oself=this;		
			that.domOptions._timeout=setTimeout(function(){
				clearTimeout(that._timeout);
				clearTimeout(that.domOptions._timeout);
				that.domPanel.stop(false,true);				
				var index=$(oself).parent().children().index(oself);
				if(opt.pos%that.itemsLen!==index){					
					opt.pos=index;
					that.move(1);	
				}							
			},200);	
		});	
		that.domOptions.bind("mouseleave",function(e){
			clearTimeout(that._timeout);
			clearTimeout(that.domOptions._timeout);
			if(that.option.auto){
				that._timeout=setTimeout(function(){
					that.autoPlay();
				},opt.delay);
			}
		});
		//btn		
		that.domPrev.bind("click",function(e){
			that.movePrev();
		});		
		that.domNext.bind("click",function(e){
			that.moveNext();
		});			
		that.domMaskPrev.bind("click",function(e){
			that.movePrev();
		});		
		that.domMaskNext.bind("click",function(e){
			that.moveNext();
		});	
	},
	movePrev:function(){		
		var that=this,opt=that.option;
		clearTimeout(that._timeout);
		opt.pos--;
		that.move();
		that._timeout=setTimeout(function(){that.autoPlay();},opt.delay);
	},
	moveNext:function(){		
		var that=this,opt=that.option;
		clearTimeout(that._timeout);
		opt.pos++;
		that.move();
		that._timeout=setTimeout(function(){that.autoPlay();},opt.delay);
	},
	fnDelay:function(e){
		var that=(e && e.data) || this,opt=that.option;
		
		//获取需要加载的图片
		if(!that.delayImgs){
			that.delayImgs=new Array(that.itemsLen);
			for(var i=0,oimgs,j=0;i<that.sumLen;i++){
				oimgs=that.domItems.eq(i).find("img");
				j=i%that.itemsLen;
				that.delayImgs[j]=that.delayImgs[j] || [];
				oimgs.each(function(){
					if($(this).attr("orial_src")){that.delayImgs[j].push(this);}	
				});
			}	
		};
		
		//加载显示区域
		var pos=opt.pos,posArr=[],pos0=pos%that.itemsLen,pos1,pos2;
		posArr.push(pos0);
		pos-opt.col<0?pos1=pos-opt.col+that.itemsLen:pos1=(pos-opt.col)%that.itemsLen;
		if(pos1!==pos0){posArr.push(pos1);}
		pos+opt.col<that.sumLen?pos2=pos+opt.col:pos2=pos+opt.col-that.itemsLen;
		pos2%=that.itemsLen;
		if(pos2!==pos0 && pos2!==pos1){posArr.push(pos2);}
		
		//加载显示区图片
		var owin=$(window);	
		var scrollStart=owin.scrollTop(),winH=owin.height(),end=scrollStart+winH;
		for(var i=0,len=posArr.length,delayimg;i<len;i++){
			delayimg=that.delayImgs[posArr[i]];
			for(var j=0,len2=delayimg.length,domjimg;j<len2;j++){
				domjimg=$(delayimg[j]);
				var offTop=parseInt(domjimg.offset().top);
				var offBottom=parseInt(offTop+(domjimg.outerHeight() || 800));
				if((offTop>=scrollStart && offTop <=end) || (offBottom>=scrollStart && offBottom <= end) || (offTop< scrollStart && offBottom > end)){
					domjimg.attr("src",domjimg.attr("orial_src"));
					delayimg.splice(j,1);
					j--;
					len2--;
				}
			}
		}
				
		//判断是否加载完，加载完解除绑定
		for(var i=0,len=that.delayImgs.length;i<len;i++){
			if(that.delayImgs[i].length!==0){break;}
		}
		if(i===len){ 
			opt.onBeforeMove=null; 
			$(window).unbind("resize"+that._selfName+" scroll"+that._selfName);
		}
	}	
};
$SlideReview._childNum=0;



















