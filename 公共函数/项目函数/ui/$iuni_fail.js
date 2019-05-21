函数名称：$iuni_fail
函数描述： 
失败提示tips
函数代码： 
$iuni_fail = (function(){

	var getFail= $getSingle( function(){

		var Fail = $iuni_Ui_base.sub( function(){

			this.tpl = '<div class="ui_pop_layer radius_5"><i class="error"></i><p data-action="content"></p></div>';

			this.black_layer = false;

			this.init.call( this );

		});

		return Fail.getInstance();

	});


	var timer;

 	return function( str ){
 		
		clearTimeout( timer );

		var obj = getFail();

		obj.revise_top = -20;

		obj.content.html( str || '' );

		obj.show();

		timer = setTimeout( function(){
			obj.hide();
		}, 1500 );

 	};


})();
调用示例： 
$iuni_fail( '操作失败' )
依赖函数： 
www_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle$getSingle
被依赖函数： 
www_iuni_com:$iuni_dialogManagerwww_iuni_com:$arrivalNoticewww_iuni_com:$iuni_arrivalNotice