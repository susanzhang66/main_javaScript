函数名称：$iuni_upload
函数描述： 
上传图片组件
函数代码： 
$iuni_upload = (function(){

	var Upload_box = $iuni_Ui_base.sub( function(){

		this.tpl = '<div class="s_sns_mask publish_upload_wrapper"><h3 class="mask_header"><span>上传图片</span><div data-action="cancelBtn" class="mask_close"></div></h3><div class="mask_body  mask_body_reset" style="width:100%;height:100%"><iframe name="upload_iframe" src="about:blank" class="upload_frame" frameborder="0"></iframe></div></div>';

		this.black_layer = true;

		this.init.call( this );

	});


	var instance,
		contentWindow,
		show,
		hook;

	show = function( obj ){
		var instance = get_upload_box( obj );
	}

	var get_upload_box = $getSingle( function( obj ){

		var tgt = $getCookie('tgt');

		document.domain = 'iuni.com';

		instance = Upload_box.getInstance();

		instance.hide();

		hook = 'upload_' + ( +new Date );

		window[ hook ] = {
			act: obj.action || '',
			succ: obj.succ || function(){},
			cancal_all: function(){
				instance.hide();
			},
			tgt: tgt
		};

		var iframe = instance.target.find( 'iframe' ).attr( 'src', 'http://www.iuni.com/upload/upload.shtml?hook=' + hook );

		iframe.one( 'load', function(){

			var doc;
			contentWindow = iframe[0].contentWindow;
			doc = contentWindow.document;

			instance.show();

			if ( doc.body.clientWidth && doc.body.clientHeight ){
				set_wh( doc.body.clientWidth, doc.body.clientHeight );
			}

			show = function(){
				instance.show();
			}

		});

		return instance;

	});


	var set_wh = function( w, h ){
		instance.target.css( 'width', w ).css( 'height', h );	
		instance.revise_top = -50;	//各种padding的修正
		instance.show();
	};


	return {
		start: function( obj ){
			return show( obj );
		}
	}


})();
调用示例： 
upload.start({
	action: 'http://town.iuni.com/api/attachment/upload', //上传图片的cgi
	succ: function( data ){  //上传成功回调
		alert (data);
	}
});
依赖函数： 
$getCookie$getSinglewww_iuni_com:$iuni_Ui_base$getSinglewww_iuni_com:$$Class$after$throttle