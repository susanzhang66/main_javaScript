$iuni_customAlert
函数描述： 
可自定义的confirm弹出框
函数代码： 
$iuni_customAlert = (function(){

	var getConfirm = $getSingle( function(){

		var Confirm = $iuni_Ui_base.sub( function(){
			this.tpl = '<div class="ui_tips_wraper">'+
				'<h3 class="ui_tips_hd">'+
					'<span class="z" data-action="title"></span>'+
					'<span data-action="cancelBtn" class="ui_close y">X</span>'+
				'</h3>'+
				'<div class="ui_tips_bd">'+
					'<h4 class="tips_contener" data-action="content"></h4>'+
					'<p class="tips_else" data-action="desc"></p>'+
					'<div class="tips_btn230">'+
						'<a href="#" class="btn_green" data-action="submitBtn">'+
							'<span></span>'+
						'</a>'+
						'<a href="#" class="btn_link" data-action="customBtn"></a>'+
					'</div>'+
				'</div>'+
			'</div>';
			
			this.black_layer = true;

			this.init.call( this );

		});

		return Confirm.getInstance();

	});


 	return function( param ){

 		var obj = getConfirm();

 		obj.title.html( param.title || '提示' );
		obj.content.html( param.content || '' );
		obj.submitBtn.children().html( param.submitBtnTxt || '确定' );
                
		obj.show();

		obj.submitBtn.off().on( 'click', function(){
		 	param.callback && param.callback();
		 	obj.hide();
		});

		param.customBtnTxt && obj.target.find('[data-action=customBtn]').html( param.customBtnTxt ).click( function(){
		 	param.customCallback && param.customCallback();
		 	obj.hide();
		});
		param.desc && obj.target.find('[data-action=desc]').html( param.desc );

 	};


})();
调用示例： 
$iuni_customAlert({
	title: '提示', //非必填,
	content: '内容', //必填',
	submitBtnTxt: '不确定',
	customBtnTxt: '不取消',
	callback: function() {
		alert(1)
	}, //必填
	customCallback: function() {
		alert(2)
	}

});
依赖函数： 
www_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle$getSingle