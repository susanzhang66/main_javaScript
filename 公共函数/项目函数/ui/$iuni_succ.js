函数名称：$iuni_succ
函数描述： 
成功提示tips
函数代码： 
$iuni_succ = (function(){

	var getSucc= $getSingle( function(){

		var Succ = $iuni_Ui_base.sub( function(){

			this.tpl = '<div class="ui_pop_layer radius_5"><i class="correct"></i><p data-action="content"></p></div>';

			this.black_layer = false;

			this.init.call( this );

		});

		return Succ.getInstance();

	});


	var timer;

 	return function( str ){
 		
		clearTimeout( timer );

		var obj = getSucc();

                obj.revise_top = -20;

		obj.content.html( str || '' );

		obj.show();

		timer = setTimeout( function(){
			obj.hide();
		}, 1500 );

 	};


})();
调用示例： 
$iuni_succ( '操作成功' )
依赖函数： 
www_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle$getSingle