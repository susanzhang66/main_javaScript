/**
 * 将字符串解析为参数对象
 * @param {Object} str
 */
function $parseStrToParam(str) {
	var param={};
	search = str ? str.split('&') : [];
	//合并参数
	for(var i=0,len=search.length;i<len;i++){
		var p=search[i].split('='),p0=p[0],p1=typeof p[1]=='undefined'?'':p[1],t=typeof param[p0]!='undefined';
		if(t){
			if($isArray(param[p0])){
				param[p0].unshift(p1);
			}else{
				param[p0]=[p1,param[p0]];
			}
		}else{
			param[p0]=p1;
		}
	}
	return param;
}