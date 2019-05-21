函数名称：$iuni_Login_layer
函数描述： 
登陆浮层
函数代码： 
var $iuni_Login_layer = (function(){

	var Login_layer = $iuni_Ui_base.sub( function(){

		this.tpl = '<div><div data-action="close_layer" class="login_close_bnts"></div><iframe name="login_iframe" style="width:100%;height:100%" src="about:blank" frameborder="0"></iframe></div>';

		this.black_layer = true;

		this.init.call( this );

	});

	var instance,
		params,
		re_url,
		callback_url,
		iframe,
		default_width,
		default_height,
		contentWindow,
		close_layer,
		no_close_btn,	//是否禁止了取消关闭按钮
		default_src,
		event = $Event.create( 'Login_layer' );


	var check_close_btn = function(){
		if ( no_close_btn && close_layer ){
			instance.no_close_btn = true;
			close_layer.hide();
		}else{
			instance.no_close_btn = false;
			close_layer.show();
		}
	};

	var init = (function(){

		var flag = false;

		return function( src ){

			if ( flag ){
				return false;
			}

			document.domain = 'iuni.com';

			flag = true;

			instance = Login_layer.getInstance();

			close_layer = instance.target.find( '[data-action="close_layer"]' );

			close_layer.on( 'click', function(){
				instance.hide();
			});

			var src = ( src || default_src ) + '?r=' + Math.random();

			if ( callback_url ){
				src += '&callback_url=' + encodeURIComponent( callback_url );
			}

			iframe = instance.target.find( 'iframe' ).attr( 'src', src );
					
			iframe.one( 'load', function(){

				var doc;
				contentWindow = iframe[0].contentWindow;
				doc = contentWindow.document;

				$Event.trigger( 'login_layer_loaded', contentWindow );
			
				if ( default_width && default_height ){
					return set_wh( default_width, default_height );
				}

				try{
					var login_layer_parent = doc.getElementById( 'login_layer_parent' );
					instance.parent.show();
					if ( login_layer_parent.clientWidth && login_layer_parent.clientHeight ){
						return set_wh( login_layer_parent.clientWidth, login_layer_parent.clientHeight );
					}
               
				}catch(e){
					set_wh( default_width, default_height );
				}

				

			});

		}

	})();


	var show = function( params ){

		no_close_btn = Array.prototype.pop.call( arguments ) === 'no_close_btn';
		
		var params = params || {};
			
		if ( Object.prototype.toString.call( params ) === '[object Object]' ){
			$iuni_Login_layer.succ( params.succ || function(){} );
			$iuni_Login_layer.fail( params.fail || function(){} );
			re_url = params.reurl;
			callback_url = params.callback_url;
			default_width = params.width || 670;
			default_height = params.height || 486;
		}else{
			$iuni_Login_layer.succ( function(){} );
			$iuni_Login_layer.fail( function(){} );
			re_url = params;
		}

		if ( !params ){
			params = {};
		}

		init( params.src );

		check_close_btn();

		if ( contentWindow ){
                       
			try{
				contentWindow.iuni.uc.login_iframe.event.trigger( 'after_show' );
			}catch(e){

			}
			 $Event.trigger( 'login_layer_loaded', contentWindow );
			instance.show();
		}

	};

	var hide = function( target ){

		if ( target === 'iframe' && no_close_btn ){
			return;
		}
		return instance.hide();
	};

	var trigger = function( type, data ){
		var type = Array.prototype.shift.call( arguments );
		event.trigger( type, data );
	};

    var succ = function( fn ){
		var _fn = fn;
		
		event.listen( 'succ', function(data){

			$Event.trigger( 'login_succ', data );

			var flag = _fn.apply( this, arguments );
			
			if ( flag === false ){
				return false;
			}

			setTimeout( function(){

				if ( re_url && re_url.indexOf( 'http:' ) > -1  ){
					return location.href = re_url;
				}

				return location.reload( true );

			}, 100 );

		});
		
	};

	var fail = function( fn ){
		event.listen( 'fail', fn );
	};

	var set_wh = function( w, h ){
		instance.target.css( 'width', w ).css( 'height', h );
		instance.show();
	};


	var set_default_src = function( src ){
		default_src = src;
	};

	set_default_src( 'http://passport.iuni.com/login_iframe.shtml' );


	return {
		show: show,
		hide: hide,
		succ: succ,
		fail: fail,
		trigger: trigger,
		set_wh: set_wh
	}

})();
调用示例： 
$iuni_Login_layer.show({
        width: 600,   //宽度，非必选，跨域登陆的时候必选，
        height: 600,  //高度，非必选，跨域登陆的时候必选，
	src: 'http://www.iuni.com/login_iframe.shtml',		//登陆iframe地址，非必选
	succ: function( data ){	//成功后回调，非必选
		console.dir(data);  //data, 用户信息
		//alert ('succ');
              return false; //return false 登陆成功之后不刷新页面
	},
	fail: function(){	//失败后回调，非必选
		//alert ('fail');
	},
	re_url: 'http://baidu.com',	//登陆成功后回跳地址，非必选
        callback_url: 'http://www.iuni.com/login_callback.shtml'       //跨域登陆时的回调代理地址
});

或者简写方法:
$iuni_Login_layer.show(  'http://baidu.com' )   //登陆成功后回跳地址，非必选
依赖函数： 
$Eventwww_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle