$iuni_mobile_confirm = (function(){

    var getConfirm = $getSingle( function(){

        var Confirm = $iuni_mobile_ui_base.sub( function(){

             this.tpl = '<div class="u_c ui_fixed ui_left ui_top ui_bottom ui_right ui_mask" data-action="black_layer"><div class="ui_dialog"><div class="dialog_txt ui_tac" data-action="content">是否删除订单</div><div class="u_fb btn_dialog_area" data-sub="2"><button data-action="submitBtn" class="u_f btn_dialog">是</button><button data-action="cancelBtn" class="u_f btn_dialog">否</button></div></div></div>';



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

        obj.submitBtn.off().on( 'tap', function(){
            param.callback && param.callback();
            obj.hide();
        });

    };


})();