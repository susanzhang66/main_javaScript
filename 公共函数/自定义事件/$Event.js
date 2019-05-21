/*
函数名称：$Event
函数描述： 
自定义事件组件，模块间可通过该组件发送/接收自定义事件进行通讯

通过自定义事件通讯按照以下步骤执行
1，获取组件
var event=$Event.create(namespace);//namespace参数控制事件传播范围，只有相同的namespace范围内的组件能发送和监听事件。默认可不填

2，发送事件
event.trigger(eventType,eventData);//组件发送一个类型为eventType的事件，事件内容为eventData。eventType必须为字符串

3，监听事件
event.listen(eventType,fn,flag);//组件监听类型为eventType的事件，fn为监听事件的回调，flag为离线事件监听标记，离线事件是指没有被任何监听器收取过的事件，默认所有离线事件都会被回调，flag值为last则只有最后一条离线事件被回调，none则表示不会回调离线数据。添加监听后，离线事件会被清空。


4，移除指定事件类型的所有监听器，并添加新的监听器
event.one(eventType,fn,flag);

5，移除指定类型的指定监听器
event.remove(eventType,fn);
函数代码： 
*/
$Event = (function(){

       if ( typeof $Event !== 'undefined' ){
           return $Event;
       }

	var global = this,
		Event,
		random = 'random';

	Event = function(){

		var _listen, _trigger, _remove, _slice = Array.prototype.slice, _shift = Array.prototype.shift, _unshift = Array.prototype.unshift, namespaceCache = {}, create, find,
			each = function( ary, fn ){
				var ret;
				for ( var i = 0, l = ary.length; i < l; i++ ){
					var n = ary[i];
					ret = fn.call( n, i, n);
				}
				return ret;
			};

		_listen = function( key, fn, cache ){
			if ( !cache[ key ] ){
				cache[ key ] = [];
			}
			cache[key].push( fn );
		};

		_remove = function( key, cache ,fn){
			if ( cache[ key ] ){
				if(fn){
					for(var i=cache[ key ].length;i--;){
						if(cache[ key ]===fn){
							cache[ key ].splice(i,1);
						}
					}
				}else{
					cache[ key ] = [];
				}
			}
		};

		_trigger = function(){
			var cache = _shift.call(arguments),
				key = _shift.call(arguments),
				args = arguments,
				_self = this,
				ret,
				stack = cache[ key ];

			if ( !stack || !stack.length ){
				return;
			}

			return each( stack, function(){
				return this.apply( _self, args );
			});

		};

		_create = function( namespace ){
			var namespace = namespace || random;

			var cache = {},
				offlineStack = [],	//是否支持离线事件 
				ret = {
					listen: function( key, fn, last ){
						_listen( key, fn, cache );
						if ( offlineStack === null ){
							return;
						}
						if ( last === 'last' ){
							offlineStack.length && offlineStack.pop()();
						}else if(last=='none'){
							//noop;
						}else{
							each( offlineStack, function(){
								this();
							});
						}
						
						offlineStack = null;
					},
					one: function( key, fn ,last){
						_remove( key, cache );
						this.listen( key, fn ,last);
					},
					remove:function(key,fn){
						_remove( key, cache ,fn);
					},
					trigger: function(){
						var fn,
							args,
							_self = this;

						_unshift.call( arguments, cache );

						args = arguments;
						fn = function(){
							return _trigger.apply( _self, args );
						};

						if ( offlineStack ){
							return offlineStack.push( fn );
						}
						return fn();
					}
				};

			return namespace ?
				( namespaceCache[ namespace ] ? namespaceCache[ namespace ] : namespaceCache[ namespace ] = ret )
					: ret;

		};

		return {
			create: _create,
			listen: function( key, fn, last ){
				var event = this.create( 'global' );
				event.listen( key, fn, last );
			},
			trigger: function(){
				var event = this.create( 'global' );
				event.trigger.apply( this, arguments );
			}
		};

	}();
	
	return Event;


})();
调用示例： 
/************** a.js ***********************/

var event = $Event.create();

event.trigger('change',1)

/************** b.js ***********************/

var event = $Event.create();

event.listen('change', function(a){
	alert (a)
})

或者
   $Event.listen( 'click', function(a){} );  
   $Event.trigger( 'click', 1 )
被依赖函数： 
www_iuni_com:$KeyEventwww_iuni_com:$Login_layer