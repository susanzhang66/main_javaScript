$iuni_prompt
函数描述： 
与系统函数prompt类似  弹出用户可输入内容的弹框
函数代码： 
$iuni_prompt = (function(){

	var getConfirm = $getSingle( function(){

		var Confirm = $iuni_Ui_base.sub( function(){

			this.tpl = '<div class="ui_tips_wraper ui_tips_wraper_group">'+
				'<h3 class="ui_tips_hd">'+
					'<span class="z" data-action="title"></span>'+
					'<span data-action="cancelBtn" class="ui_close y">X</span>'+
				'</h3>'+
				'<div class="ui_tips_bd ui_tips_bd_group">'+
					'<h4 class="tips_contener tips_contener_group" data-action="content"></h4>'+
					'<div class="group_wordnum">'+
						'<span class="num" data-action="txtCurCount">0</span>/<span data-action="txtTotalCount" class="sum"></span>'+
					'</div>'+
					'<div class="inputarea">'+
						'<textarea class="user_input" data-action="txtContent"></textarea>'+
					'</div>'+
					'<div class="tips_btn230">'+
						'<span href="#" class="cancelBtn_group" data-action="customBtn"></span>'+
						'<a href="#" class="btn_green" data-action="submitBtn"><span></span></a>'+
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
		obj.show();

 		obj.title.html( param.title || '提示' );
		obj.content.html( param.content || '' );
		obj.submitBtn.one( 'click', function(){
		 	param.callback && param.callback( obj.target.find('[data-action=txtContent]').val() );
		 	obj.hide();
		}).children().html( param.submitBtnTxt || '确定' );		

		param.customBtnTxt && obj.target.find('[data-action=customBtn]').html( param.customBtnTxt ).click( function(){
		 	param.customCallback && param.customCallback();
		 	obj.hide();
		});
		param.desc && obj.target.find('[data-action=desc]').html( param.desc );
		param.maxWords && obj.target.find('[data-action=txtTotalCount]').text( param.maxWords );

		param.maxWords && obj.target.find('[data-action=txtContent]').unbind('keyup').bind( 'keyup' , function( e ){

			var curCount = obj.target.find('[data-action=txtCurCount]');
			if( this.value.length > param.maxWords - 1 && e.keyCode !== 8 ){
				curCount.addClass('color_red');
				e.preventDefault();
			}else{
				curCount.removeClass('color_red');
			}
			this.value = this.value.substr( 0 , param.maxWords );
			curCount.text( this.value.length );
		});
 	};
 	
})();
调用示例： 
$iuni_prompt({
		content : '小组管理员需要验证你的身份，请输入你的请求信息。',
		title : '加入小组',
		customBtnTxt : '取消',
		maxWords : 50,
		callback : function( content ){
			console.log(content);
		}
	});
依赖函数： 
www_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle$getSingle