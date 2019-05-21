$Request = (function(){
           
			if ( typeof $Request !== 'undefined' ){
				return $Request;
			}

			var map = {},

			buildParams = function( url, param ){
				var ary = [];
				for ( var name in param ){
					ary.push( name + '=' + param[ name ] );
				}
				
				if ( !url ){
					return ary.join( '&' );
				}

				return url + ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + ary.join( '&' );
			},

			random = function(){
				return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace( /[xy]/g, function( c ){
					var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r&0x3|0x8 );
						return v.toString( 16 )
					}).toUpperCase();
			},

			extend = function( obj1, obj2 ){
				for ( var i in obj2 ){
					obj1[ i ] = obj2[ i ];
				}
				return obj1;
			},


			getDomain = function(){
				var host;
				return function(){
					if ( host ){
						return host;
					}
					var _host = location.hostname.split('.');
					_host.shift();

					return host = _host.join('.');
				};
			}(),


			del = function( prop ){
				try{
					delete window[ prop ];
				}catch(e){
					window[ prop ] = null;
				}
			},

			errorFilterFn = function(){

			},

			restartFilterFn = function(){

			},

			parseJSON = function( data ) {
		
				if ( typeof data !== "string" || !data ) {
					return null;
				}

				data = data.replace( /(^\s*)|(\s*$)/g, '' );

				if ( window.JSON && window.JSON.parse ) {
					return window.JSON.parse( data );
				}

					// Logic borrowed from http://json.org/json2.js
				//if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					//.replace( rvalidtokens, "]" )
					//.replace( rvalidbraces, "")) ) {
						return ( new Function( "return " + data ) )();
					//}
			},

			getXHR = function(){
				return window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
			},


			restartFilterStack = [],

			urlRoot = '',


			before = function (before, fn) {
		        return function () {
		            if (fn.apply(this, arguments) === false) {
		                return false;
		            }
		            return before.apply(this, arguments);
		        };
		    },

			cache = {};

			map.get = function( url, param, timeout, _cathe, target, callback, method ){

				if ( _cathe && cache[ cacheUrl ] ){
					return callback.call( window, cache[ cacheUrl ] );
				}

				var xhr = getXHR();
	
				if ( !method ){
					url = buildParams( url, param );
				}

				xhr.open( method || 'get', url, true );

				if ( timeout ){
					timer = setTimeout( function(){
						clearTimeout( timer );
						fn.call( window, 'timeout' );
						fn = function(){};
					}, timeout );
				}

				var fn = function( data ){
					clearTimeout( timer );	
					callback.call( window, data );
				}

				xhr.onreadystatechange = function() {

					if ( xhr.readyState !== 4 ) return;

					if ( ( xhr.status >= 200 && xhr.status< 300 ) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0 ){
						var data = parseJSON( xhr.responseText );
						fn.call( window, data );
					}

					xhr = null;
				};


				if ( !method ){
					xhr.send( null );
				}else{
					xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
					xhr.send( buildParams( null, param ) );
				}

				return {
					stop: function(){
						clearTimeout( timer );
						fn = function(){};
					}
				}

			};

			map.post = function( url, param, timeout, _cathe, target, callback ){
				return map.get( url, param, timeout, _cathe, target, callback, 'post' );
			}

			map.jsonp = function( url, param, timeout, _cathe, target, callback ){

				var callbackName = 'dance_' + random(),
						head = document.getElementsByTagName( 'head' )[ 0 ],
						script = document.createElement( 'script' ),
						timer,
						newUrl,
						param = extend( {}, param ),
						cacheUrl = buildParams( url, param );

						
						param.callback = callbackName;

                        param.dtype = 'jsonp';


				if ( _cathe && cache[ cacheUrl ] ){
					return callback.call( window, cache[ cacheUrl ] );
				}

				newUrl = buildParams( url, param );

				var fn = function( data ){
				
						callback.call( window, data );
				
						del( callbackName );
						script.parentNode && head.removeChild( script );
	
				}
		

				script.src = newUrl;

				head.appendChild( script );


				if ( timeout ){
					timer = setTimeout( function(){
						fn.call( window, 'timeout' );
						window[ callbackName ] = function(){};
					}, timeout );
				}

				window[ callbackName ] = function( data ){
					clearTimeout( timer );
					fn( data );
					if ( _cathe ){
						cache[ cacheUrl ] = data;
					}
				};

				return {
					stop: function(){
						clearTimeout( timer );
						head.removeChild( script );
						window[ callbackName ] = function(){};
					}
				}

			};

			map.iframe = function(){

				var callback_type;

				var create = function( tagName, attrs ){
					var tag = document.createElement( tagName );
					for ( var i in attrs ){
						tag[ i ] = attrs[ i ];
						tag.setAttribute( i, attrs[ i ] );	
					}
					return tag;
				},

				hide = function( obj ){
					obj.style.display = 'none';
					return obj;
				};


				var getIframe = function( timer, callback ){

					var iframe;

					try{
						//www.domain.com/set_domain.html
						var iframeurl="http://www."+getDomain()+"/set_domain.html";
						iframe = document.createElement( '<iframe src="'+iframeurl+'" name='+ timer +'></iframe>' );
						iframe.attachEvent( 'onload', function(){
							callback();
						});
					}catch(e){
						iframe = document.createElement( 'iframe' );
						iframe.name = timer;
						callback_type = 'no_callback';
					}

					return document.body.appendChild( hide( iframe ) );
					//return document.body.appendChild( iframe );	
				};



				var removeNode = function( node ){
					while ( node.firstChild ) {
						node.removeChild( node.firstChild );
					}
					if ( node.parentNode ){
						node.parentNode.removeChild( node );	
					}
				};


					return function( url, param, timeout, _cathe, target, callback ){

					var timer = 'dance_' + random(),
						__timer;

					var callbackName = timer,
						iframe,
						input,
						__form;
						

					if ( target === 'self' ){
						__form = create( 'form', {
							"method": 'post',
							"action": url
						});
					}else if ( target === 'blank' ){
						__form = create( 'form', {
							"method": 'post',
							"action": url,
							"target": '_blank'
						});
					}else{
						__form = create( 'form', {
							"target": target || timer,
							"method": 'post',
							"action": url
						});
					}

					
					document.body.appendChild( hide( __form ) );

					var fn = function( data ){
						callback.call( window, data );
						del( callbackName );
						removeNode( __form );
						removeNode( iframe );
					};


					if ( timeout ){
						__timer = setTimeout( function(){
							fn.call( window, 'timeout' );
							window[ callbackName ] = function(){};
						}, timeout );
					}

					var __random = 'dance_' + random();

					window[ __random ] = function( data ){
						clearTimeout( __timer );
						fn( data );
						if ( _cathe ){
							cache[ url ] = data;
						}
					};


					var param = extend( {}, param );

					if (target !== 'self' && target !== 'blank' ){
						param.callback = 'parent.' + __random;
                    	param.dtype = 'iframe';
						param.domainName = getDomain();
					}


					for ( var i in param ){
						input = create( 'textarea', {
							"name": i,
							"value": param[ i ]
						});
						__form.appendChild( input );
					}

					iframe = getIframe( timer, function(){
						__form.submit();
					});

					if ( callback_type === 'no_callback' ){
						__form.submit();
					}

					return {
						stop: function(){
                                                        try{
                                                              clearTimeout( timer );
							      window[ callbackName ] = function(){};
							      removeNode( __form );
							      removeNode( iframe );
                                                         }catch(e){
                                                         }
							
						}
					}

				}

			}();



			var Request = function( config ){
				this.url = config.url.indexOf( 'http' ) > -1 ? config.url : urlRoot + config.url;
				this.type = config.type || 'jsonp';
				this.param = config.param || {};
				this.cache = !!config.cache;
				this.lock = !!config.lock;
				this.target = config.target;
				this.locked = false;
				this._timeout = config.timeout;
				this.donefn = [];
				this.errorfn = [];
				this.beforeSendfn = [];
				this._request = null;
				this.startTime = null;
				this.timeoutfn = function(){};
			}


			Request.prototype.setParam = function( param ){

				this.param = extend( this.param, param || {} );
			};


			Request.prototype.done = function( fn ){
				this.donefn.push( fn );
			};


			Request.prototype.error = function( fn ){
				this.errorfn.push( fn );
			};


			Request.prototype.beforeSend = function( fn ){
				this.beforeSendfn.push( fn );
			};


			Request.prototype.timeout = function( fn ){
				this.timeoutfn = fn;
			};


			Request.prototype.start = function(){

				var type = this.type,
					me = this;

	/************************** beforeSend *******************************/

				if ( this.lock && this.locked ){
					return false;
				}


				this.locked = true;

				for ( var i = 0, c; c = this.beforeSendfn[ i++ ]; ){	
					if ( c.call( this, this.param ) === false ){
						this.locked = false;
						return false;
					}
				}

				this._request = map[ type ]( this.url, this.param || {}, this._timeout, this.cache, this.target, function( data ){
                   
                    me.locked = false;
		
					if ( data === 'timeout' ){
						me.timeoutfn.call( me );
						$Event.trigger( 'requestTimeout', me );
						return false;
					}

					if ( restartFilterFn.call( me, data, me.url ) === true ){
						restartFilterStack.push( me );
					}

					if ( errorFilterFn.call( me, data, me.url ) === false ){

						for ( var i = 0, c; c = me.errorfn[ i++ ]; ){
							c.call( me, data );
						}

						return;
					}

					for ( var i = 0, c; c = me.donefn[ i++ ]; ){
						c.call( me, data );
					}

					$Event.trigger( 'requestDone', me );

				});

				this.startTime = +new Date();

			};


			Request.prototype.stop = function(){
                                try{
                                   this._request && this._request.stop();
                                }catch(e){
                                }
				
			};

                        //document.domain = 'iuni.com'
                        document.domain=getDomain();


			
			var _ret = {
				create: function( obj ){
					return new Request( obj );
				},
				getPrototype: function(){
					return Request.prototype;
				},
				setErrorFilter: function( fn ){
					errorFilterFn = fn;
				},
				setReStartFilter: function( fn ){
					restartFilterFn = fn;
				},
				restart: function(){
					while( restartFilterStack.length ){
						var request = restartFilterStack.shift();
						request.start();
					}
				},
				setUrlRoot: function( url ){
					urlRoot = url;
				}
			}


            	        _ret.setErrorFilter( function( data, url ){

        if ( data.code === 0 || data.returnCode === 0 ){
            return true;
        }

        if ( ( data.returnCode === -1 || data.code === 6000 ) && url.indexOf( '/getinfo' ) < 0 ){
        	 //失去登陆态的情况不放入error回调， 会自动弹出登陆框
        	return true;
        }

        return false;

    });
                   return _ret;

		})();