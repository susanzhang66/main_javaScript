function $DelayLoadImg(o,undefined){
	var othis=this;
	othis._newNum=0;
	othis._selfId=(++othis.constructor._newNum);
	othis._selfName=".$DelayLoadImg"+othis._selfId;
	
	if(o!=undefined){
		othis.oContent=$id(o).getElementsByTagName("img");
	}else{
		othis.oContent=document.images;
	}
	othis.init=function(){
		var othis=this;
		
		if(othis.oContent.length == 0){ return false;}	
		
		othis.oLoadItems=new Array();
		for(var i=0,len=othis.oContent.length;i<len;i++){
			if(othis.oContent[i].attributes["init_src"]){
				othis.oLoadItems.push(eval('$(othis.oContent[i])'));
			}
		}
		if(othis.oLoadItems.length == 0){return false; }
		
		eval('$(window)').bind("scroll"+othis._selfName+" resize"+othis._selfName,othis,othis.fnLoad);			
		othis.fnLoad();	
	};
	othis.fnLoad=function(e){
		var othis=(e && e.data) || this;		
		var owin=eval('$(window)'),oLoad=othis.oLoadItems;
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
			eval('$(window)').unbind("scroll"+othis._selfName+" resize"+othis._selfName);
		}			
	};
	othis.init();
}