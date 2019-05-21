$iuni_mobile_customAlert = (function(){

	var getConfirm = $getSingle( function(){

		var Confirm = $iuni_mobile_ui_base.sub( function(){
			this.tpl = '<div class="u_c ui_fixed ui_left ui_top ui_bottom ui_right ui_mask" data-action="black_layer"><div class="ui_dialog"><div class="dialog_txt ui_tac" data-action="content">是否删除订单</div><div class="u_fb btn_dialog_area" data-sub="2"><button data-action="submitBtn" class="u_f btn_dialog">是</button><button data-action="customBtn" class="u_f btn_dialog">否</button></div></div></div>';
			
			this.black_layer = true;

			this.init.call( this );

		});

		return Confirm.getInstance();

	});

 	return function( param ){

 		var obj = getConfirm();

 		obj.title.html( param.title || '提示' );
		obj.content.html( param.content || '' );
		obj.submitBtn.html( param.submitBtnTxt || '确定' );
                
		obj.show();

		obj.submitBtn.off().on( 'click', function(e){
		 	param.callback && param.callback(e);
		 	obj.hide();
		});

		param.customBtnTxt && obj.target.find('[data-action="customBtn"]').html( param.customBtnTxt ).click( function(){
		 	param.customCallback && param.customCallback();
		 	obj.hide();
		});

 	};


})();