/*
函数名称：$iuni_confirm
函数描述： 
同window.confirm
*/ 
$iuni_confirm = (function(){

	var getConfirm = $getSingle( function(){

		var Confirm = $iuni_Ui_base.sub( function(){

			this.tpl = '<div class="s_sns_mask ">' +
                '<h3 class="mask_header">' +
                    '<span data-action="title"></span>' +
                    '<div data-action="cancelBtn" class="mask_close curs"></div>' +
                '</h3>' +
                '<div class="mask_body">' +
                    '<p data-action="content"></p>' +
                    '<div class="mask_btn">' +
                        '<button data-action="submitBtn" class="mask_btn_sure">确定</button>' +
                        '<span data-action="cancelBtn" class="mask_btn_cancle curs">取消</span>' +
                    '</div>' +
                '</div>' +
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
                
		obj.show();

                //setTimeout(function(){
                  // obj.submitBtn.focus();
               // }, 100);

		obj.submitBtn.off().on( 'click', function(){
		 	param.callback && param.callback();
		 	obj.hide();
		});

 	};


})();
调用示例： 
$iuni_confirm{
  title: '提示'//非必填,
  content: '内容' //必填',
  callback: function(){alert(1)} //必填
}
依赖函数： 
www_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle$getSingle