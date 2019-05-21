$arrivalNotice
函数描述： 
$arrivalNotice(sku_id);货到通知弹框
函数代码： 
var $arrivalNotice=(function(){
    var dialog;
    var dialog_layer = $iuni_Ui_base.sub( function( tpl ){
        this.tpl = tpl;
        this.black_layer = true;
        this.no_close_btn = false;
        this.init.call( this );
    });
    var validator={
        //所有可用的检查
        types:{},

        //在当前验证会话中的
        //错误信息,错误的数量
        messageslength:0,
        messages:{},

        //当前验证配置
        //名称：验证类型
        config:{},

        //接口方法
        //‘data’为键值对
        validate:function(data){
            var i,msg,type,checkerArr,checker,result;

            //重置所有消息
            this.messageslength=0;
            this.messages={};

            for(i in data){
                if(data.hasOwnProperty(i)){
                    type=this.config[i];
                    if(!type){
                        continue;
                    }

                    checkerArr=type.reg || [];
                    for(var j= 0,lenj=checkerArr.length;j<lenj;j++){
                        checker=this.types[checkerArr[j]];
                        if(!checker){
                            throw{
                                name:"ValidationError",
                                message:"No handler to lidate type "+type
                            };
                        }
                        result=checker.validate(data[i]);
                        if(!result){
                            this.messageslength++;
                            this.messages[i]=type.msg[j] || "";
                            break;
                        }
                    }
                }
            }
            return {status:this.messageslength===0,msg:this.messages};
        }
    };
    validator.types={
        isMobile:{
            validate:function(value){
                return value.replace(/^\s+/,"") .replace(/\s+$/,"").match(/^1\d{10}$/);
            }
        },
        isMail:{
            validate:function(value){
                return value.replace(/^\s+/,"") .replace(/\s+$/,"").match(/^[^@]+@[^@\.].*$/);
            }
        }
    };
    validator.config={
        mobile:{
            reg:["isMobile"],
            msg:['请填写正确的手机号码']
        },
        email:{
            reg:["isMail"],
            msg:['请填写正确的邮箱地址']
        }
    };

    function getUserInfo(sku_id,callback){
        $.ajax({
            url:"http://www.iuni.com/api/user/get_email_mobile",
            type:"get",
            dataType:"json",
            data:{
                sku_id:sku_id
            },
            context:document.body,
            success:function(json){
                callback && callback(json.data);
            }
        });
    }

    function createDialog(sku_id){
        var dialog;
        var tpl='<div class="ui_tips_wraper ui_tips_wraper_resetBig" ><h3 class="ui_tips_hd"><span class="z" data-action="title">缺货登记</span><span data-action="cancelBtn" class="ui_close y">X</span></h3><div class="ui_tips_bd ui_tips_bd_resetBig" style="background:#fff"><h4 class="ui_tipstitle">请填写您的联系方式，该商品到货时我们将第一时间通知您！</h4><form class="ui_tipform"><label>手机号码</label><input class="ui_tipformText" type="text" data_action="mobile"><span class="ui_tipform_errMessage" style="display:none;" data_action="mobile_hint">请填写正确的手机号码</span><label>电子邮箱</label><input class="ui_tipformText" type="text" data_action="email"><span class="ui_tipform_errMessage" style="display:none;" data_action="email_hint">请填写正确的邮箱地址</span><span class="ui_tipform_errMessage" style="display:none;"  data_action="form_hint">请填写您的手机号码或邮箱地址</span><input type="button" class="btn_greencss3" value="确定" data_action="save"></form></div></div>';
        dialog=dialog_layer.getInstance(tpl);

        //初始化dom
        dialog.cacheDom={};
        var cacheDom=dialog.cacheDom;
        var dom=dialog.target[0];
        cacheDom.mobile=$attr("data_action","mobile",dom)[0];
        cacheDom.mobile_hint=$attr("data_action","mobile_hint",dom)[0];
        cacheDom.email=$attr("data_action","email",dom)[0];
        cacheDom.email_hint=$attr("data_action","email_hint",dom)[0];
        cacheDom.form_hint=$attr("data_action","form_hint",dom)[0];
        cacheDom.save=$attr("data_action","save",dom)[0];

        //绑定事件
        function initEvent(){

            function setDefaut(dom,dom_hint){
                dom.className="ui_tipformText";
                dom_hint.style.display="none";
                cacheDom.form_hint.style.display="none";
            }
            function setHint(dom,dom_hint,hint){
                dom.className="ui_tipformText ui_tipformText_err";
                dom_hint.style.display="block";
                if(hint){
                    dom_hint.innerHTML=hint;
                }
            }
            function saveHint(hint){
                cacheDom.form_hint.innerHTML=hint || '请填写您的手机号码或邮箱地址';
                cacheDom.form_hint.style.display="block";
            }

            //focus
            $bindEvent(cacheDom.mobile,function(){
                setDefaut(cacheDom.mobile,cacheDom.mobile_hint);
            },"focus");
            $bindEvent(cacheDom.email,function(){
                setDefaut(cacheDom.email,cacheDom.email_hint);
            },"focus");

            //blur
            $bindEvent(cacheDom.mobile,function(){
                var dom=this,value=dom.value.replace(/^\s+/,"").replace(/\s+$/,"");
                if(value.length>0){
                    if(!validator.validate({mobile:value}).status){
                        setHint(cacheDom.mobile,cacheDom.mobile_hint);
                    }
                }
            },"blur");
            $bindEvent(cacheDom.email,function(){
                var dom=this,value=dom.value.replace(/^\s+/).replace(/\s+$/);
                if(value.length>0){
                    if(!validator.validate({email:value}).status){
                        setHint(cacheDom.email,cacheDom.email_hint);
                    }
                }
            },"blur");

            //click
            $bindEvent(cacheDom.save,function(){

                var mobile=cacheDom.mobile.value.replace(/^\s+/,'').replace(/\s+$/,'');
                var email=cacheDom.email.value.replace(/^\s+/,'').replace(/\s+$/,'');

                var result=validator.validate({
                    mobile:mobile,
                    email:email
                });
                if(result.msg.mobile && result.msg.email){
                    if(mobile.length===0 && email.length===0){
                        saveHint();
                    }
                    return;
                }

                var data={
                    sku_id:dialog.sku_id,
                    dtype:"json"
                };
                if(!result.msg.mobile){
                    data.mobile=mobile;
                }
                if(!result.msg.email){
                    data.email=email;
                }

                //提交
                $.ajax({
                    url:"http://www.iuni.com/goods/checkin_notify",
                    type:"POST",
                    dataType:"json",
                    data:data,
                    context:document.body,
                    success:function(json){
                        if(json.returnCode===0){//成功
                            dialog.hide();
                            var d=dialog_layer.getInstance('<div class="ui_tips_wraper ui_tips_wraper_resetBig"><h3 class="ui_tips_hd"><span class="z" data-action="title">缺货登记</span><span data-action="cancelBtn" class="ui_close y">X</span></h3><div class="ui_tips_bd ui_tips_bd_resetBig"><i class="iunifont"></i><div class="ui_tips_contentRight">	<p>登记成功，该商品到货后我们会第一时间通知您！<br>该窗口5秒后自动关闭</p><span class="btn_greencss3" data-action="cancelBtn">确定</span> </div></div></div>');
                            d.show();
                            setTimeout(function(){
                                d.hide();
                            },5000);
                        }else{
                            var errorCode=json.errorCode;
                            if(errorCode===4 || errorCode===5){
                                //已登记过
                                dialog.hide();
                                var d=dialog_layer.getInstance('<div class="ui_tips_wraper ui_tips_wraper_resetBig"><h3 class="ui_tips_hd"><span class="z" data-action="title">缺货登记</span><span data-action="cancelBtn" class="ui_close y">X</span></h3><div class="ui_tips_bd ui_tips_bd_resetBig"><i class="iunifont icon_yellow"></i><div class="ui_tips_contentRight ui_tips_contentRight_reset"><p>您已经登记过了，无需重复登记。</p><span class="btn_greencss3"  data-action="cancelBtn">确定</span></div></div></div>');
                                d.show();
                            }else{
                                $iuni_fail( json.msg );
                            }
                        }
                    }
                });

            },"click");

        }
        initEvent();

        //设置方法+初始值
        dialog.setSKU=function(sku_id){
            dialog.sku_id=sku_id;
        };
        dialog.setValue=function(mobile,email){
            var cacheDom=this.cacheDom;
            if(mobile!==false){
                cacheDom.mobile.value=mobile || "";
            }
            if(email!==false){
                cacheDom.email.value=email || "";
            }
        }
        if(sku_id){
            dialog.setSKU(sku_id);
            getUserInfo(dialog.sku_id,function(data){
                if(data){
                    dialog.setValue(data.mobile,data.email);
                }
            });
        }

        return dialog;
    }

    return function(sku_id){
        if(!sku_id){
            return;
        }
        if(!dialog){
            dialog=createDialog(sku_id);
        }
        dialog.setSKU(sku_id);
        dialog.show();
        return dialog;
    }

})();
调用示例： 
$arrivalNotice(sku_id);
依赖函数： 
www_iuni_com:$iuni_fail$getSingle$throttle$after$Classwww_iuni_com:$$getSinglewww_iuni_com:$iuni_Ui_base$bindEvent$incNum$extend$eventNormalize$attrwww_iuni_com:$www_iuni_com:$iuni_Ui_base