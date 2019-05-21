/**
 * 请求jsonp数据
 * @param {Object} opt 请求选项，具体选项及默认值如下
 * url:'',//url
 * data:{},//请求数据，key-value对，拼接到url上去，需要自行处理encode
 * timeout:0,//超时设置，单位毫秒
 * charset:'utf8',//编码
 * addToken:true,//是否添加token
 * tokenName:'tk',//token参数名
 * tokenValue:'',//token参数值
 * callbackParam:'callback',//回调参数名
 * callbackName:'__jsonpcallback',//回调参数
 * callback:null,//回调函数    
 * errorback:null//错误回调函数
 
当返回码 returnCode==0时执行，否则执行errorback();=============================================================================================

 依赖函数： 
$addParams$isArray$t33$getCookie$extend
 */
function $jsonp(opt){
	//选项
	opt=$extend({
		url:'',//url
		data:{},//请求数据，key-value对，拼接到url上去，需要自行处理encode
		timeout:0,//超时设置，单位毫秒
		charset:'utf8',//编码
		addToken:true,//是否添加token
		tokenName:'tk',//token参数名
		tokenValue:'',//token参数值
		callbackParam:'callback',//回调参数名
		callbackName:'__jsonpcallback',//回调参数
		callback:null,//回调函数
		errorback:null//错误回调函数
	},opt);
	
	var callback=opt.callback,errorback=opt.errorback,callbackName=opt.callbackName,script,timer,success=false;
	//回调函数设置
	$jsonp.index=($jsonp.index||0)+1;
	while(window[callbackName+$jsonp.index]){
		$jsonp.index++;
	}
	callbackName+=$jsonp.index;
	//设置回调
	window[callbackName]=function(data){
		success=true;
		//取消超时
		timer&&(timer=clearTimeout(timer));
		//清理script
		clear();
		if(!arguments.callee.timeout){
			//正常回调，非超时
			if(arguments.length>1){
				//如果参数数量大于1,非内部定义规范标准格式jsonp回调，直接回调，不做处理
				callback.apply(this,arguments);
			}else{
				//无返回数据，错误
				if(!data){
					errorback&&errorback();
				}else{
					//标准数据
					var returnCode=data.returnCode;
					//返回码正确
					if(parseInt(returnCode)==0){
						callback&&callback(data);
					}else{
						//返回错误
						errorback&&errorback(data);
					}
				}
			}
		}
	};
	//发送请求
	send();
	//发送请求
	function send(){
		var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		// document.head 谷歌,ie9可以，      火狐,ie9--不可以；
		// document.documentElement ie9--，火狐，谷歌可以
		// document.getElementsByTagName("head")[0] 谷歌，ie9--可以，    火狐不可以
		script = document.createElement("script");
		script.charset=opt.charset;
		var data=opt.data;
		//添加token
		if(opt.addToken){
			var token=opt.tokenValue;
			if(!token){
				var tgt=$getCookie('tgt');
				token=tgt?$t33(tgt):'';
			}
			data[opt.tokenName]=token;
		}
		//超时设置
		var timeout=opt.timeout;
		if(timeout){
			timer=setTimeout(function(){
				window[callbackName].timeout=true;
				//清理script
				clear();
				//超时
				errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应超时'});
				timer=0;
			},timeout);
		}
		//设置回调
		var callbackParam=opt.callbackParam;
		data[callbackParam]=callbackName;
		//拼装url
		url=$addParams(opt.url,data,true);
		//监听事件
		script.onload = script.onreadystatechange = function() {
			var uA = navigator.userAgent.toLowerCase();
			if (!(!(uA.indexOf("opera") != -1) && uA.indexOf("msie") != -1) || /loaded|complete/i.test(this.readyState)) {
				//加载完成，取消超时
				timer&&(timer=clearTimeout(timer));
				if(!success){
					//清理script
					clear();
					//错误
					errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应错误'});
				}
			}
		};
		script.onerror = function(){
			//取消超时
			timer&&(timer=clearTimeout(timer));
			timer=0;
			//清理script
			clear();
			//错误
			errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应错误'});
		};
		//设置url
		script.src=url;
		head.appendChild(script);
	}
	//清除回调函数
	function clear(){
		//取消回调
		window[callbackName]=undefined;
		if(script){
			//取消事件
			script.onerror = script.onload = script.onreadystatechange=null;
			//取消script
			script.parentNode&&script.parentNode.removeChild(script);
		}
	}
}


/*
========================================================
*/
$jsonp({
    url:'http://www.iuni.com/getsomedata',
    data:{
        a:encodeURIComponent('这是一堆数据&内容'),
        b:2
    },
    callback:function(data){
        console.log('回调数据',data);
    },
    errorback:function(data){
        console.log('请求发生错误',data);
    }
});