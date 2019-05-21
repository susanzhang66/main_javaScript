函数名称：$flashChecker
函数描述： 
判断是否安装了flash
函数代码： 
function $flashChecker(){
	
	try{
		var active = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		return true;
	}catch( e ){
		if (navigator.plugins && navigator.plugins.length > 0){
			var swf = navigator.plugins["Shockwave Flash"];
			if ( swf ){
				return true;
			}
		}
	}

	return false;

}
调用示例： 
$flashChecker()