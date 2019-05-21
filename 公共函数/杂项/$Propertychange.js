函数名称：$Propertychange
函数描述： 
模拟input onchange事件，兼容所有浏览器
函数代码： 
$Propertychange = (function(){

$Propertychange = function( timer ){
	this.timer = timer || 200;
	this.t = null;
	this.stack = [];
}


$Propertychange.prototype.add = function( input, fn ){
	this.stack.push( { fValue: '', input: input, fn: fn } );
	this.bind();
}


$Propertychange.prototype.addProchange = function( input, fn ){
	for ( var i = 0, c; c = this.stack[i++]; ){
		if ( c.input === input ){

			var oldFn = c.fn;

			c.fn = function(){
				oldFn( input.val() );
				fn( input.val() );
			}
			return;
		}
	}
}


$Propertychange.prototype.bind = function(){

	var self = this;

	if ( this.t ) return;

	this.t = setInterval( function(){

		for ( var i = 0, c; c = self.stack[ i++ ]; ){
			var newValue = c.input.val();
			if ( newValue != c.fValue ){
				var oldValue = c.fValue;
				c.fValue = newValue;
				c.fn.call( c.input[0], newValue, oldValue );
			}
		}

	}, this.timer );
}


$Propertychange.prototype.unbind = function(){
	clearTimeout( this.t );
	this.t = null;
}


$Propertychange.prototype.remove = function( input ){
	clearTimeout( this.t );
	this.stack.length = 0;
}


$Propertychange.prototype.removeOne = function( input ){
	for ( var i = 0, c; c = this.stack[i++]; ){
		if ( c.input === input ){
			this.stack.splice( i, 1 );
			return;
		}
	}
}
return $Propertychange;
})()
调用示例： 
var name_change = new Propertychange();

	name_change.add( name, function( value ){
		$( this ).removeClass( 'infor_true' );
		if ( $.trim( this.value ) === '' ){
			return $( this ).next( 'p' ).show().html( '请填写真实姓名' );
		}
		$( this ).addClass( 'infor_true' );	
	});


	name_change.bind();