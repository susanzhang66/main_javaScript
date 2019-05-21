// 创建jsonp请求
var $Request = (function() {

	var map = {},

		buildParams = function(url, param) {
			var ary = [];
			for (var name in param) {
				ary.push(name + '=' + param[name]);
			}

			return url + (url.indexOf('?') > -1 ? '&' : '?') + ary.join('&');
		},

		random = function() {
			return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16)
			}).toUpperCase();
		},

		extend = function(obj1, obj2) {
			for (var i in obj2) {
				obj1[i] = obj2[i];
			}
			return obj1;
		},


		getDomain = function() {
			var host;
			return function() {
				if (host) {
					return host;
				}
				var _host = location.hostname.split('.');
				_host.shift();

				return host = _host.join('.');
			};
		}(),


		del = function(prop) {
			try {
				delete window[prop];
			} catch (e) {
				window[prop] = null;
			}
		},

		errorFilterFn = function() {

		},

		urlRoot = '',


		before = function(before, fn) {
			return function() {
				if (fn.apply(this, arguments) === false) {
					return false;
				}
				return before.apply(this, arguments);
			};
		},

		cache = {};


	map.jsonp = function(url, param, timeout, _cathe, callback) {

		var callbackName = 'dance_' + random(),
			head = document.getElementsByTagName('head')[0],
			script = document.createElement('script'),
			timer,
			newUrl,
			param = extend({}, param);

		param.callback = callbackName;

		param.dtype = 'jsonp';



		if (_cathe && cache[url]) {
			return callback.call(window, cache[url]);
		}


		newUrl = buildParams(url, param);

		var fn = function(data) {
			try {
				callback.call(window, data);
			} catch (e) {
				throw new Error('jsonp request error');
			} finally {
				del(callbackName);
				script.parentNode && head.removeChild(script);
			}
		}


		script.src = newUrl;

		head.appendChild(script);


		if (timeout) {
			timer = setTimeout(function() {
				fn.call(window, 'timeout');
				window[callbackName] = function() {};
			}, timeout);
		}

		window[callbackName] = function(data) {
			clearTimeout(timer);
			fn(data);
			if (_cathe) {
				cache[url] = data;
			}
		};

		return {
			stop: function() {
				clearTimeout(timer);
				head.removeChild(script);
				window[callbackName] = function() {};
			}
		}

	};


	map.iframe = function() {

		var create = function(tagName, attrs) {
			var tag = document.createElement(tagName);
			for (var i in attrs) {
				tag[i] = attrs[i];
				tag.setAttribute(i, attrs[i]);
			}
			return tag;
		},

			hide = function(obj) {
				obj.style.display = 'none';
				return obj;
			};


		var getIframe = function(timer) {

			var iframe;

			try {
				iframe = document.createElement('<iframe name=' + timer + '></iframe>');
			} catch (e) {
				iframe = document.createElement('iframe');
			}

			iframe.name = timer;

			return document.body.appendChild(hide(iframe));
		};


		var removeNode = function(node) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};


		return function(url, param, timeout, _cathe, callback) {

			var timer = 'dance_' + random(),
				__timer;

			var callbackName = timer,
				iframe = getIframe(timer),
				input;



			var __form = create('form', {
				"target": timer,
				"method": 'post',
				"action": url
			});


			document.body.appendChild(hide(__form));

			var fn = function(data) {
				try {
					callback.call(window, data);
				} catch (e) {
					throw new Error('jsonp request error');
				} finally {
					del(callbackName);
					removeNode(__form);
					removeNode(iframe);
				}
			};


			if (timeout) {
				__timer = setTimeout(function() {
					fn.call(window, 'timeout');
					window[callbackName] = function() {};
				}, timeout);
			}

			var __random = 'dance_' + random();

			window[__random] = function(data) {
				clearTimeout(__timer);
				fn(data);
				if (_cathe) {
					cache[url] = data;
				}
			};


			var param = extend({}, param);

			param.callback = 'parent.' + __random;
			param.dtype = 'iframe';
			param.domainName = getDomain();

			for (var i in param) {
				input = create('input', {
					"name": i,
					"value": param[i]
				});
				__form.appendChild(input);
			}

			$(__form).submit();


			return {
				stop: function() {
					clearTimeout(timer);
					window[callbackName] = function() {};
					removeNode(__form);
					removeNode(iframe);
				}
			}

		}

	}();



	var Request = function(config) {
		this.url = config.url.indexOf('http') > -1 ? config.url : urlRoot + config.url;
		this.type = config.type || 'jsonp';
		this.param = config.param || {};
		this.cache = !! config.cache;
		this.lock = !! config.lock;
		this.locked = false;
		this._timeout = config.timeout;
		this.donefn = [];
		this.errorfn = [];
		this.beforeSendfn = [];
		this._request = null;
		this.timeoutfn = function() {};
	}


	Request.prototype.setParam = function(param) {

		this.param = extend(this.param, param || {});
	};


	Request.prototype.done = function(fn) {
		this.donefn.push(fn);
	};


	Request.prototype.error = function(fn) {
		this.errorfn.push(fn);
	};


	Request.prototype.beforeSend = function(fn) {
		this.beforeSendfn.push(fn);
	};


	Request.prototype.timeout = function(fn) {
		this.timeoutfn = fn;
	};


	Request.prototype.start = function() {

		var type = this.type,
			me = this;

		/************************** beforeSend *******************************/

		if (this.lock && this.locked) {
			return false;
		}


		this.locked = true;

		for (var i = 0, c; c = this.beforeSendfn[i++];) {
			if (c.call(this, this.param) === false) {
				this.locked = false;
				return false;
			}
		}

		this._request = map[type](this.url, this.param || {}, this._timeout, this.cache, function(data) {
			me.locked = false;
			if (data === 'timeout') {
				me.timeoutfn.call(me);
				return false;
			}

			if (errorFilterFn.call(me, data) === false) {

				for (var i = 0, c; c = me.errorfn[i++];) {
					c.call(me, data);
				}

				return;
			}

			for (var i = 0, c; c = me.donefn[i++];) {
				c.call(me, data);
			}



		});

	};


	Request.prototype.stop = function() {
		this._request && this._request.stop();
	};



	return {
		create: function(obj) {
			return new Request(obj);
		},
		getPrototype: function() {
			return Request.prototype;
		},
		setErrorFilter: function(fn) {
			errorFilterFn = fn;
		},
		setUrlRoot: function(url) {
			urlRoot = url;
		}
	}



})();

/* ============================================ 调用实例 */
var request = $Request.create({
			url: 'http://app.shop.gionee.com/api/app.php?act=cart_count',  //请求地址，必选
			param: { b: 4 }, //请求参数，可选
			timeout: 5000,   //设置超时时间，可选
			cache: true,   //是否缓存结果, 缓存之后相同的请求不会再请求后台, 从缓存里取得数据，可选
			lock: true   //结果未返回的时候是否锁定, 防止重复点击，可选
		});


		request.done( function( data ){
			alert (1);   //成功执行
		});


		request.error( function( data ){
			console.log(data)    //错误
		});


		request.timeout( function(){
			alert (3);    //请求超时
		});


		request.setParam({     //请求之前动态设置参数
			a: 1
		});


		request.beforeSend(function( param ){     //请求之前的过滤器, 如果返回false, 不会发起请求, 可用在表单验证等地方.
			return false;
		});


		request.start();   //开始请求

                request.stop()   //抛弃已经发起的请求




         $Request.getFunc( 'start' );  //返回Request对象的原型方法.

         $Request.setErrorFilter( function( data ){  //设置Request对象的error条件，设置之后符合该条件的数据返回会走入request.error回调
             if ( data.code !== 0 || data.status !== 1  ){
                 return false;
             }
          });