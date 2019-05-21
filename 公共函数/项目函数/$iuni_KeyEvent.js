函数名称：$iuni_KeyEvent
函数描述： 
监听全局事件
函数代码： 
$iuni_KeyEvent = function(){

	var event = $Event.create( 'iuni' ),

		map = {
			27: 'esc',
			13: 'enter' 
		},

		init_flag = false,

		key_handler = function( ev ){
		
			var keyCode = ev.keyCode,
				target = ev.target;

			if ( map[ keyCode ] ){
				event.trigger( map[ keyCode ], ev );
                          
			}

			
			
		};

	var init = function(){
		if ( init_flag ){
			return;
		}
		init_flag = true;

		$( document ).on( 'keydown', key_handler );

	};


	return {
		listen: function( type, fn ){
			init();
			event.listen( type, fn );
		},
		remove: function(){
			$( document ).off( 'keydown', key_handler )
		}
	}

}();
调用示例： 
$iuni_KeyEvent.listen( 'esc', function(ev){  //开始监听
	alert('这是esc事件');
});

$iuni_KeyEvent.listen( 'enter', function(ev){  //开始监听
	alert('这是回车事件');
});

$iuni_KeyEvent.remove(); //取消监听
依赖函数： 
www_iuni_com:$$Event