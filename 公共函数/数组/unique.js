function unique( arry ){
	if( Object.prototype.toString.call(arry) !== "[object Array]"){
		return;
	}else{
		var data = {},len = arry.length;
		if(len<=1) return;
		for(var i=len;i--;){
			if( data[arry[i]] == undefined){
				data[arry[i]] = i;
			}
		}
		arry.length = 0;
		for(var j in data){
			arry[arry.length] = j;
		}
		return arry;
	}
	
}