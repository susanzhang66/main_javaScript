//灵活的职责链
//定金500客户
var order500 = function( orderType, pay, stock ){
	if( orderType == 1 && pay == true ){
		console.log('定金500用户，得到100元优惠')
	}else{
		// order200( orderType, pay, stock );
		return 'nextSucessor';
	}
}

//定金200客户
var order200 = function( orderType, pay, stock ){
	if( orderType == 2 && pay == true ){
		console.log('定金200用户，得到50元优惠')
	}else{
		// orderNormal( orderType, pay, stock ); //普通购买
		return 'nextSucessor';
		//异步 手动设置
		// var self = this;
		// setTimeout(function(){
		// 	self.next();
		// },2000)
	}
}

//普通购买
var orderNormal = function( orderType, pay, stock ){
	if( stock > 0  ){
		console.log('普通购买，无优惠劵')
	}else{
		// order200( orderType, pay, stock );   测试，只需要传给第一个节点： order500( 1, true, 500 );
		console.log('手机库存不足');
	}
}
//构建灵活的职责链，将以上函数包装进 职责链节点。
var Chain = function( fn ){
	this.fn = fn;
	this.successor = null;
}
//指定链中的下一个节点
Chain.prototype.setNextSuccesstor = function( successor ){
	return this.successor = successor;
}

//传递请求给下一个节点
Chain.prototype.passRequst = function(){
	
	var ret = this.fn.apply( this, arguments );

	if( ret == 'nextSucessor' ){
		return this.successor && this.successor.passRequst.apply( this.successor, arguments );
	}

	return ret;
}
//适合异步的职责链，创建
Chain.prototype.next = function(){

	return this.successor && this.successor.passRequst.apply( this.successor, arguments );

}
//三个节点。
var chainOrder500 = new Chain( order500 );
var chainOrder200 = new Chain( order200 );
var chainOrderNormal = new Chain( orderNormal );

chainOrder500.setNextSuccesstor( chainOrder200 ); 
chainOrder200.setNextSuccesstor( chainOrderNormal ); 

//请求：
chainOrder500.passRequst( 1, true, 500 );


//用AOP实现指责链。
Function.prototype.after = function( fn ){
	var self = this;
	return function(){
		var ret = self.apply( this, arguments );
		if( ret == 'nextSucessor' ){
			return fn.apply( this, arguments );
		}

		return ret;
	}
}

var order = order500.after( order200 ).after( orderNormal );

order( 1, true, 500 );