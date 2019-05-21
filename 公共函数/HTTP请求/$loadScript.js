/*
异步加载script
参数：
url-script的url，也可以为对象，提供扩展选项，包括url，charset，cache等
callback-加载完成后的回调

*/

function $loadScript(url,callback) {
	var head = document.head||document.getElementsByTagName('head')[0] || document.documentElement,script,options,s;
	if (typeof url ==="object") {
		options = url;
		url = undefined;
	}
	s = options || {};
	url = url || s.url;
	callback = callback || s.success;
	script = document.createElement('script');
	script.async = s.async || false;
	script.type ='text/javascript';
	if (s.charset) {
		script.charset = s.charset;
	}
	if(s.cache === false){
		url = url+( /\?/.test( url ) ?'&' : '?')+(new Date()).getTime();
	}
	script.src = url;
	head.insertBefore(script, head.firstChild);
	if(callback){
		document.addEventListener ? script.addEventListener('load', callback, false) : (script.onreadystatechange = function() {
			if (/loaded|complete/.test(script.readyState)) {
				script.onreadystatechange = null;
				callback();
			}
		});
	}
}


 
$loadScript('http://www.gionee.com/static/js/jquery.js',function(){
   alert('加载完成');
});