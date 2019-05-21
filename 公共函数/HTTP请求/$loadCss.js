/*
异步加载css文件
参数：
path-css文件url

*/
function $loadCss(path){
	$loadCss.cache=$loadCss.cache||{};
	if(!$loadCss.cache[path]){
			var l = document.createElement('link');
			l.setAttribute('type', 'text/css');
			l.setAttribute('rel', 'stylesheet');
			l.setAttribute('href', path);
			l.setAttribute("id","loadCss"+Math.random());
			document.getElementsByTagName("head")[0].appendChild(l);
			$loadCss.cache[path]=true;
	}
	return true;
}


$loadCss('http://www.gionee.com/static/css/panel.css');