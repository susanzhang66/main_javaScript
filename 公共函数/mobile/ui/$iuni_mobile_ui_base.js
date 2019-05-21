/*
/*flex布局 & 垂直水平居中*/
:root .u_fb {display: -webkit-box;}
.u_f {-webkit-box-flex: 1;display: block;}
:root .u_fb_pc {display: -webkit-box;-webkit-box-pack: center;/*垂直居中*/}
:root .u_fb_ac {display: -webkit-box;-webkit-box-align: center;/*水平居中*/}
:root body .u_fb_as {display: -webkit-box;-webkit-box-align: start;}
:root .u_c {display: -webkit-box;-webkit-box-pack: center;-webkit-box-align: center;}
.u_sub2 > .u_f {width: 50%;-webkit-box-sizing: border-box;box-sizing: border-box;}
.u_fb_v {-webkit-box-orient:vertical;}

/*按钮*/
.ui_btn {-webkit-appearance: none;appearance: none;display: block;border-radius: 3px;width: 100%;height: 45px;line-height: 45px;font-size: 18px;-webkit-box-sizing: border-box;box-sizing: border-box;text-align: center;border: 0 none;color: #FFF;}
.btn_tran,.btn_tran_red,.btn_tran_green {background: transparent;border: 1px solid #fff;line-height: 43px;border-radius: 0;color: #666;}
.btn_tran_red {color: #F62E2A;border-color: #F62E2A;border-radius: 3px;}
.btn_tran_green {color: #2B9A79;border-color: #2B9A79;border-radius: 3px;}
.btn_white {background: #FFF;color: #009977;border-radius: 0;}
.btn_white:hover {background: #D7D7D7;}
.btn_green {background: #009977;}
.btn_orange {background: #EF4222;}
.btn_orange:hover {background: #ff6600;}
.btn_gray,.btn_gray:hover {background: #cccccc;}
.btn_small,.btn_middle,.btn_mini {display: inline-block;padding: 0 15px;width: auto;vertical-align: top;}
.btn_middle {padding: 0 22px;}
.btn_mini {height: 30px;line-height: 30px;padding: 0 10px;}



$iuni_mobile_ui_base = (function(){


    _id = 0,

    use_black_layer_count = {};

    var base = $Class.create( function( tpl ){       //ui父类
        this.tpl = tpl;            //模板
        this.parent = null;        //ui父节点
        this.submitBtn = null;     //确定按钮
        this.closeBtn = null;      //关闭按钮
        this.cancelBtn = null;     //取消按钮
        this.remove = false;       //关闭时是否移除对象
        this.revise_top = 0;             //
    });


    base.interface( 'init', function(){      //初始化

        var me = this;     

        this.parent = this.render().appendTo( $$( 'body' ) ).hide();  //创建父节点容器

        this.closeBtn = this.parent.find( '[data-action="closeBtn"]' );
        this.cancelBtn = this.parent.find( '[data-action=cancelBtn]' );
        this.submitBtn = this.parent.find( '[data-action="submitBtn"]' );
        this.title = this.parent.find( '[data-action="title"]' );   //标题容器
        this.content = this.parent.find( '[data-action="content"]' );  //内容容器

        this.closeBtn.on( 'tap', function(){
            me.hide();
        });

        this.cancelBtn.on( 'tap', function(){
            me.hide();
        });

        this.id = ++_id;

    });



    base.interface( 'render', function(){    //生成节点

        var parent;

        this.target = $$( this.tpl );;


        return this.target.wrap( '<div></div>' ).parent().prepend( '<div></div>' );

    });

    base.interface( 'show', function(){

       
        this.parent.show( 200 );

        this.submitBtn.focus();
    });


    base.interface( 'hide', function(){


        this.parent.hide( 250 );
        if ( this.remove ){
            this.parent.off().remove();
        }
    });

    return base;

})();


var Confirm = $iuni_mobile_ui_base .sub( function(){    //创建一个Ui的子类，可以继承遮罩层，居中，渐显渐隐动画，esc按钮关闭等功能。
    
    this.tpl = '<div class="u_c ui_fixed ui_left ui_top ui_bottom ui_right ui_mask" data-action="black_layer"><div class="ui_dialog"><div class="dialog_txt ui_tac" data-action="content">是否删除订单</div><div class="u_fb btn_dialog_area" data-sub="2"><button data-action="submitBtn" class="u_f btn_dialog">是</button><button data-action="cancelBtn" class="u_f btn_dialog">否</button></div></div></div>';

    this.remove = true; //隐藏的时候删除对象

    this.init.call( this );  //初始化

});

var comfirm = Confirm.getInstance();   //获取一个comfirm对象

comfirm.show();  //显示

// comfirm.hide();  //隐藏