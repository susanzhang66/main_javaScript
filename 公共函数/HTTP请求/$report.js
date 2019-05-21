 /**
函数名称：$report
函数描述： 
发送url上报请求
函数代码：

 * 发送URL请求进行数据上报
 * @param {Object} uri
 * @param {Object} param 可选
 */
function $report(url, param) {
	param=param||{};
	var arr = [];
	for (var k in param) {
		arr.push(k + '=' + param[k]);
	}
	arr.push(new Date().getTime());
	var reportUrl = url+(url.indexOf('?')!=-1?'&':'?') + arr.join('&');
	var img = new Image(0);
	img.onload = img.onerror = img.onabort = function() {
		img.onload = img.onerror = img.onabort = null;
	};
	img.src = reportUrl;
}

 
//上报一个数据请求
$report('http://www.iuni.com/report',{data:1,uid:2});
//被依赖函数： 
$sendBadjs$initBadjs