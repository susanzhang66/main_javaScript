function $addClass(ids,cName){
	$setClass(ids,cName,"add");	
}
/**
 * url添加参数
 * @param {Object} url 要处理的url
 * @param {Object} param 要添加的参数名
 * @param {Object} value 要添加的参数值，注意需要编码处理
 * @param {Object} replace 是否替换url中的同名参数
 */
function $addParam(url,param,value,replace){
	param+='=';
	var a=document.createElement('a');
	a.href=url;
	var search=a.search.replace(/^\?+/,'');

	search=search?search.split('&'):[];
	if(replace){
		//替换相同参数，把原参数数据清除
		for(var i=search.length;i--;){
			if(search[i].indexOf(param)==0){
				search.splice(i,1);
			}
		}
	}

	search.push(param+value);

	a.search = '?' + search.join('&');	//ie6

	return a.href;
}
/**
 * url添加参数
 * @param {Object} url 要处理的url
 * @param {Object} param 要添加的参数对象，名值对
 * @param {Object} replace 是否替换url中的同名参数
 */
function $addParams(url,param,replace){
	var a=document.createElement('a');
	a.href=url;
	var search=a.search.replace(/^\?+/,'');
	search=search?search.split('&'):[];
	//合并参数
	for(var i=0,len=search.length;i<len;i++){
		var p=search[i].split('='),p0=p[0],p1=typeof p[1]=='undefined'?'':p[1],t=typeof param[p0]!='undefined';
		if(t&&replace){
			continue;
		}
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
	//拼接参数
	var s=[];
	for(var p in param){
		var v=param[p];
		if($isArray(v)){
			for(var i=0,len=v.length;i<len;i++){
				s.push(p+'='+v[i]);
			}
		}else{
			s.push(p+'='+v);
		}
	}
	a.search=s.join('&');
	//返回
	return a.href;
}
function $addSelect(e, t, v) {
	var o = new Option(t, v);  
	e.options[e.options.length] = o;
	return o;
}
/**
 * 添加token标识，防csrf用
 * @param {Object} url 要添加标识的url
 * @param {Object} tokenname token参数名称，默认为tk，由接口确定
 * @param {Object} key token校验key，默认为tgt数据，由接口确定
 */
function $addToken(url, tokenname,key) {
	tokenname = tokenname || 'tk';
	var tgt;
	if (key||(tgt=$getCookie('tgt'))) {
		return $addParam(url, tokenname, key||$t33(tgt), true);
	}
	return url;
}
function $after(fn, after) {
        return function () {
            var ret = fn.apply(this, arguments);
            if (ret === false) {
                return false;
            }
            after.apply(this, arguments);
            return ret;
        };
    };
/**
 * 数组添加元素，判断元素在数组中是否存在，如不存在则添加到末尾，否则返回
 * @param {Object} arr 要添加的数组，可为空
 * @param {Object} obj 要添加的元素
 * 
 * 返回：返回处理后的数组
 */
function $arrAddUniq(arr, obj) {
	if (!arr) {
		arr = [obj];
		return arr;
	}
	for (var i = arr.length; i--; ) {
		if (arr[i] === obj) {
			return arr;
		}
	}
	arr.push(obj);
	return arr;
}
/**
 * 查找数组，返回查找结果
 * @param {Object} arr 要查找的数组
 * @param {Object} fn 查找判断函数
 * @param {Object} num 要查找的数量，负数表示不限制数量，默认为不限制数量
 * 
 * 返回，如果要查找的数量为1，返回当前查找到对对象，否则返回查找到的对象列表
 */
function $arrFind(arr,fn,num){
	num=num||-1;
	if(!arr||arr.length==0){
		return num==1?null:[];
	}
	var result=[],l=0;
	for(var i=0,len=arr.length;i<len;i++){
		if(fn(arr[i])){
			result.push(arr[i]);
			if(++l==num){
				return num==1?result[0]:result;
			}
		}
	}
	return num==1?null:result;
}
/**
 * 将多个数组按照属性值合并对象，组成一个数组并返回，如{a:[1,2],b:[1.1,2.2]}合并后返回的内容是[{a:1,b:1.1},{a:2,b:2.2}]
 * @param {Object} obj 不同属性对应的数组
 */
function $arrMergeProperties(obj){
	var keys=$keys(obj),arr=[];
	var maxLen=$arrNear(keys,function(k){
		return obj[k].length;
	});
	for(var i=0;i<maxLen;i++){
		var item={};
		$each(keys,function(k){
			item[k]=obj[k][i];
		});
		arr.push(item);
	}
	return arr;
}
/**
 * 从数组中查找最符合要求的元素
 * @param {Object} arr 要查找的数组
 * @param {Object} fn 数组元素调用函数，返回值越大表示越符合要求，小于等于0表示放弃
 * @param {Object} num 要查找的数量
 */
function $arrNear(arr,fn,num){
	num=num||-1;
	if(!arr||arr.length==0){
		return num==1?null:[];
	}
	var h=null,e=null,l=0;
	$each(arr,function(x,i){
		var d=fn(x);
		if(d>0){
			if(!h){
				h=e={p:null,n:null,o:x,d:d,i:i};
				l=1;
			}else{
				var c=e;
				while(c){
					if(c.d<d){
						c=c.p;
					}else{
						c.n={p:c,n:c.n,o:x,d:d,i:i};
						if(c.n.n){
							c.n.n.p=c.n;
						}else{
							e=c.n;
						}
						l++;
						break;
					}
				}
				if(!c){
					h.p={p:null,n:h,o:x,d:d,i:i};
					h=h.p;
					l++;
				}
				if(l>num){
					e=e.p;
					e.n.p=null;
					e.n=null;
				}
			}
		}
	});
	if(l==1){
		return h?{index:h.i,value:h.o}:null;
	}else{
		var arr=[];
		while(h){
			arr.push({index:h.i,value:h.o});
			h=h.n;
		}
		return arr;
	}
}
/**
 * 数组reduce操作,用于简化或降级（reduce）数组,Javascript 1.8提供Array.prototype.reduce,本函数提供功能与其相同
 * reduce自左向右遍历数组的每一个元素并调用迭代器,迭代返回操作结果作为下一个迭代的初始值
 * @param {Array} arr 需要作reduce操作的数组
 * @param {Function} iterator 迭代器,支持四个参数,前一个迭代结果值（memo）、当前迭代对象（x）、索引（index）和数组（array）本身
 * @param {Any} memo 迭代初始值
 */
function $arrReduce(arr, iterator, memo) {
	if (arr.reduce) {
		return arr.reduce(iterator, memo);
	}
	$each(arr, function(x, i) {
		memo = iterator(memo, x, i, arr);
	});
	return memo;
}
/**
 * 从数组中移除指定元素，返回移除的数量
 * @param {Object} arr 要移除的数组
 * @param {Object} target 要移除的元素
 * @param {Object} compFunc 自定义比较函数，可以为空
 * 
 * 返回移除的数量
 */
function $arrRemove(arr, target, compFunc) {
	var num = 0, len = arr.length;
	for (var c = 0; c < len; c++) {
		if ( compFunc ? compFunc(arr[c],target) : (arr[c] === target)) {
			arr.splice(c--, 1);
			num++;
		}
	}
	return num;
}
/**
 * 遍历数组,迭代器异步执行,发生错误或者完成遍历后回调
 * @param {Array} arr 需要遍历的数组
 * @param {Function} iterator 迭代器,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数
 * @param {Function} callback 迭代完成回调函数,如果迭代过程出错会传入一个错误参数
 */
function $asyncEach(arr, iterator, callback) {
	callback = callback ||function() {};
	if (!arr.length) {
		return callback();
	}
	var completed = 0;
	$each(arr, function(x) {
		iterator(x, $limitCalls(function(err) {
			if(callback){
				if (err) {
					callback(err);
					callback = null;
				} else {
					if (++completed >= arr.length) {
						callback(null);
					}
				}
			}
		}));
	});
}
/**
 * 顺序遍历数组,迭代器异步执行,发生错误或者完成遍历后回调,类似于$asyncEach,不同点在于$asyncEachSeries是顺序遍历,下一个元素的迭代器执行需要等代上一个元素迭代器执行完成,而$asyncEach不需要等待
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代器,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数
 * @param {Object} callback 迭代完成回调函数,如果迭代过程出错会传入一个错误参数
 */
function $asyncEachSeries(arr, iterator, callback) {
	callback = callback ||function() {};
	if (!arr.length) {
		return callback();
	}
	var completed = 0;
	var iterate = function() {
		iterator(arr[completed], $limitCalls(function(err) {
			if (callback) {
				if (err) {
					callback(err);
					callback = null;
				} else {
					completed += 1;
					if (completed >= arr.length) {
						callback(null);
					} else {
						iterate();
					}
				}
			}
		}));
	};
	iterate();
}
/**
 * 类似于$asyncEach,但在执行完毕时会返回每个执行的结果.如果其中一个执行出现错误,返回的数组中将仅包含已经成功执行了的结果
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代函数,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数,回调函数允许传递2个参数,分别是错误信息和结果信息
 * @param {Object} callback 完成或错误后的回调,带有2个参数,1:错误信息,无错误则为空,2:已经成功执行了的结果数组
 */
function $asyncMap(arr, iterator, callback) {
	var results = [];
	arr = $map(arr, function(x, i) {
		return {
			index : i,
			value : x
		};
	});
	$asyncEach(arr, function(x, callback) {
		iterator(x.value, function(err, v) {
			results[x.index] = v;
			callback(err);
		});
	}, function(err) {
		callback(err, results);
	});
}
/**
 * 类似于$asyncEachSeries,但在执行完毕时会返回每个执行的结果.如果其中一个执行出现错误,返回的数组中将仅包含已经成功执行了的结果
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代函数,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数,回调函数允许传递2个参数,分别是错误信息和结果信息
 * @param {Object} callback 完成或错误后的回调,带有2个参数,1:错误信息,无错误则为空,2:已经成功执行了的结果数组
 * 
 * 注:该函数及其类似于$asyncMap,区别点是$asyncMap的遍历不会等待,而$asyncEachSeries的遍历必须在上一个元素遍历完成后执行
 */
function $asyncMapSeries(arr, iterator, callback) {
	var results = [];
	arr = $map(arr, function(x, i) {
		return {
			index : i,
			value : x
		};
	});
	$asyncEachSeries(arr, function(x, callback) {
		iterator(x.value, function(err, v) {
			results[x.index] = v;
			callback(err);
		});
	}, function(err) {
		callback(err, results);
	});
}
function $attr(attr,val,node){
	var results=[],
		node=node||document.body;
	walk(node,function(n){
		var actual=n.nodeType===1&&(attr==="class"?n.className:n.getAttribute(attr));
		if(typeof actual === 'string' && (actual === val || typeof val !== 'string')){
				results.push(n);
		}
	});
	return results;
	function walk(n,func){
		func(n);
		n=n.firstChild;
		while(n){
			walk(n,func);
			n=n.nextSibling;
		}
	}
}
/**
 * 向上遍历查找属性为特定值的节点
 * @param {Object} attr 属性名
 * @param {Object} val 属性值
 * @param {Object} node 节点
 * @param {Object} top 遍历的最高节点(不包括)
 * @param {Object} recursion 是否在找到后继续遍历
 */
function $attrParent(attr,val,node,top,recursion){
	var result=[],top=top||document.body;
	var fn=val?(typeof val=='function'?val:val.test?val.test:function(av){return av===val;}):function(av){return av!==null;};
	while(node&&node!=top){
		var av=node.getAttribute(attr);
		if(fn.call(val,av,node)){
			result.push(node);
			if(!recursion){
				break;
			}
		}
		node=node.parentNode;
	}
	return recursion?result:result[0];
}
function $before(before, fn) {
     return function () {
	if (fn.apply(this, arguments) === false) {
		 return false;
	}
	 return before.apply(this, arguments);
      }
 }
/**
 * 返回一个封装函数,该封装函数绑定函数fn的this对象,如果context参数后面带有更多的参数,那么更多的那些参数将成为函数fn的前几个预置参数,封装函数的参数会跟在预置函数后面
 * @param {Object} fn 需要绑定的函数
 * @param {Object} context 需要绑定的this对象
 */
function $bindContext(fn,context) {
	if (arguments.length < 3 && !context){
		return this;
	}
	var slice=Array.prototype.slice;
	var args = slice.call(arguments, 2);
	var bound = function() {
		return fn.apply(context, arguments.length?args.concat(slice.apply(arguments)):args);
	};
	return bound;
}
function $bindEvent(dom, handle, type) {
	if (!dom || !handle) {
		return;
	}
	type = type || 'click';
	if ( dom instanceof Array) {
		for (var i = 0, l = dom.length; i < l; i++) {
			$bindEvent(dom[i], handle, type);
		}
		return;
	}
	if ( type instanceof Array) {
		for (var i = 0, l = type.length; i < l; i++) {
			$bindEvent(dom, handle, type[i]);
		}
		return;
	}
	function setHandler(dom, type, handler,wrapper) {
		var eid=dom.__eventId = dom.__eventId || $incNum();
		$bindEvent.__allHandlers = $bindEvent.__allHandlers || {};
		$bindEvent.__allHandlers[eid]=$bindEvent.__allHandlers[eid]||{};
		$bindEvent.__allHandlers[eid][type]=$bindEvent.__allHandlers[eid][type]||[];
		$bindEvent.__allHandlers[eid][type].push({handler : handler,wrapper: wrapper});
	}
	function createDelegate(handle, context) {
		return function(e) {
			return handle.call(context,$eventNormalize(e || window.event));
		};
	}
	if(type=='wheel' || type=='mousewheel'|| type=='DOMMouseScroll'){
		//对wheel,mousewheel,DOMMouseScroll做一致性兼容
		type=( 'onwheel' in document || document.documentMode >= 9 )?'wheel':(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll": "mousewheel";
	}
	if (window.addEventListener) {
		var wrapper = createDelegate(handle, dom);
		setHandler(dom, type, handle, wrapper)
		dom.addEventListener(type, wrapper, false);
	} else if (window.attachEvent) {
		var wrapper = createDelegate(handle, dom);
		setHandler(dom, type, handle, wrapper)
		dom.attachEvent("on" + type, wrapper);
	} else {
		dom["on" + type] = handle;
	}
}
function $child(node, val, fn) {
	var results = [], node = node || document.body;
	walk(node.firstChild, function(n) {
		if (!n) {
			return;
		}
		var actual = n.nodeType === 1 && n.nodeName.toLowerCase();
		if ( typeof actual === 'string' && (actual === val || typeof val !== 'string')) {
			results.push(n);
			fn && fn(n);
		}
	});
	return results;
	function walk(n, func) {
		func(n);
		while (n && ( n = n.nextSibling)) {
			func(n, func);
		}
	}
}
function $clone(obj,deep){
	if(!obj){
		return obj;
	}
	if($isArray(obj)){
		var clone=new Array(obj.length);
		for(var i=obj.length;i--;){
			clone[i]=deep?$clone(obj[i],deep):obj[i];
		}
		return clone;
	}else if(Object.prototype.toString.call(obj) =="[object Object]"){
		var clone={};
		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				clone[k]=deep?$clone(obj[k],deep):obj[k];
			}
		}
		return clone;
	}else{
		return obj;
	}
}
/**
 * 返回预置参数的柯里化函数
 * @param {Object} fn 需要柯里化的函数
 */
function $curry(fn) {
	if (arguments.length < 2) {
		return fn;
	}
	var slice = Array.prototype.slice, args = slice.call(arguments, 1);
	return function() {
		return fn.apply(this, arguments.length ? args.concat(slice.apply(arguments)) : args);
	}
}
function $delClass(ids,cName){	
	$setClass(ids,cName,"remove");
}
function $delCookie(name, path, domain, secure) {
	//删除cookie
	var value = $getCookie(name);
	if(value != null) {
		var exp = new Date();
		exp.setMinutes(exp.getMinutes() - 1000);
		path = path || "/";
		document.cookie = name + '=;expires=' + exp.toGMTString() + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
	}
}
/**
 * 延迟一个函数执行时间,在一定时间后执行
 * @param {Object} fn 要执行的函数
 * @param {Object} timeout 延迟的时间,单位毫秒
 * 
 * 返回延时的定时器,如果需要中途取消延时,可操作该定时器
 * 注:如执行函数需要参数,直接添加到timeout参数后面即可
 */
function $delay(fn, timeout) {
	var args = Array.prototype.slice.call(arguments, 2);
	return setTimeout(function() {
		return fn.apply(fn, args);
	}, timeout);
}
function $display(ids,state){
	var state=state||'';
	if(typeof(ids)=="string"){
		var arr=ids.split(',');		
		for(var i=0,len=arr.length;i<len;i++){
			var o=$id(arr[i]);
			o && (o.style.display=state);
		}	
	}else if(ids.length){
		for(var i=0,len=ids.length;i<len;i++){
			ids[i].style.display=state;
		}			
	}else{
		ids.style.display=state;
	}
}
/**
 * 
 * 异步的类似于$doWhilst的操作,但是判断条件是相反的,语义上$doWhilst是当条件不成立时中断循环,$utile是当条件成立时中断循环
 * @param {Object} test 条件测试函数,测试while条件是否成立
 * @param {Object} iterator 异步执行函数,条件测试为true时调用,传入一个callback的函数参数,当语句执行完成后回调callback表示当前执行完成,执行下一步
 * @param {Object} callback 完成条件循环后进行回调,正常回调时无传入参数,错误时传入一个错误参数
 */
function $doUntil(iterator, test, callback) {
	iterator(function(err) {
		if (err) {
			return callback(err);
		}
		if (!test()) {
			$doUntil(iterator, test, callback);
		} else {
			callback();
		}
	});
}
/**
 * 异步的类似于do...while的操作
 * @param {Object} iterator 异步执行函数,条件测试为true时调用,传入一个callback的函数参数,当语句执行完成后回调callback表示当前执行完成,执行下一步
 * @param {Object} test 条件测试函数,测试while条件是否成立
 * @param {Object} callback 完成条件循环后进行回调,正常回调时无传入参数,错误时传入一个错误参数
 * 
 * 注:iterator类似于do...while语句中的需要执行的代码部分,由于是异步的,使用callback回调表示执行完成
 * 如果执行出现错误,可在callback回调添加一个错误参数,那么循环将会终止,并直接回调执行完成函数
 */
function $doWhilst(iterator, test, callback) {
	iterator(function(err) {
		if (err) {
			return callback(err);
		}
		if (test()) {
			$doWhilst(iterator, test, callback);
		} else {
			callback();
		}
	});
}
/**
 * 给dom元素做fixed定位，dom元素必须可以脱离所有文档流控制，即dom元素的所有父节点及祖父节点不能有position设置
 * IE6下通过定时调节位置的方式来实现
 * @param {Object} dom dom节点
 * @param {Object} pos 定位，可以设定left,top,bottom,right定位
 */
function $domFixed(dom,pos){
	var posKey=['left','top','bottom','right'];
	if($isBrowser('ie6')){
		var checkPos=function(){
			dom.style.position='absolute';
			for(var i=posKey.length;i--;){
				if(typeof pos[posKey[i]]=='number'){
					var offset=pos[posKey[i]];
					switch(posKey[i]){
						case "top":
							offset+=$getPageScrollTop();
							break;
						case "left":
							offset+=$getPageScrollLeft();
							break;
						case "bottom":
							offset+=$getPageHeight()-$getPageScrollTop()-$getWindowHeight();
							break;
						case "right":
							offset+=$getPageWidth()-$getPageScrollLeft()-$getWindowWidth();
							break;
					}
					dom.style[posKey[i]]=offset+'px';
				}
			}
		}
		if(dom.__fixedTimer){
			clearInterval(dom.__fixedTimer);
			dom.__fixedTimer=0;
		}
		checkPos();
		//定时调度
		dom.__fixedTimer=setInterval(checkPos,100);
		return dom.__fixedTimer;
	}else{
		//支持fixed属性的浏览器
		dom.style.position='fixed';
		for(var i=posKey.length;i--;){
			if(typeof pos[posKey[i]]=='number'){
				dom.style[posKey[i]]=pos[posKey[i]]+'px';
			}
		}
	}
}
function $each(jn, fn) {
	var len = jn.length;
	if ("number" === typeof len) {
		for (var i = 0; i < len; i++) {
			try {
				fn(jn[i], i,jn);
			} catch(e) {
				if ($break(e)) {
					break;
				} else {
					throw e;
				};
			}
		}
	} else {
		for (var k in jn) {
			try {
				fn(jn[k], k,jn);
			} catch(e) {
				if ($break(e)) {
					break;
				} else {
					throw e;
				};
			}
		}
	}
}
function $evalJSON(str) {
	var json = str.replace(/^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1'), cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	if (cx.test(json)) {
		json = json.replace(cx, function(a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}
	try {
		if ($isJSON(json))
			return eval('(' + json + ')');
	} catch (e) {
	}
	throw new SyntaxError('Badly formed JSON string: ' + json);
}
/**
 * 扩展属性，将第二个参数起到最后一个参数的所有属性复制到dest上去
 * @param {Object} dest
 */
function $extend(dest) {
	dest=dest||{};
	var len = arguments.length;
	if (len > 1) {
		for (var i = 1; i < len; i++) {
			var src = arguments[i];
			if(src){
				//复制属性
				for (var property in src) {
					if(src.hasOwnProperty(property)){
						dest[property] = src[property];
					}
				}
			}
		}
	}
        return dest;
}
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
/**
 * 格式化时间函数
 * @param {Object} time 时间，Date对象
 * @param {Object} opt 选项，可以是格式化字符串，也可以是更多参数的选项
 * 选项参数说明如下，判断优先级从上至下
 * ftin1d：如果存在，当要格式的时间和当前时间同一天内时，使用该格式化字符串
 * ftin1w：如果存在，当要格式的时间和当前时间同一周内时，使用该格式化字符串
 * ftlt1w：如果存在，当要格式的时间和当前时间小于一周时，使用该格式化字符串
 * ftin1m：如果存在，当要格式的时间和当前时间同一月内时，使用该格式化字符串
 * ftcustom：通过函数自定义格式化串，该参数为以上参数中最高优先级
 * 如：ftcustom:function(time){return time.getData()<10?'Y-M 上旬':time.getData()<20?'Y-M 中旬':'Y-M 下旬'}
 * ft：格式化字符串
 * 格式化参数
 * Y-年份，四位数字
 * y-年份，两位数字
 * M-月份，补零
 * m-月份，不补零
 * mc-月份，中文
 * me-月份，英文缩写月份
 * D-日，补零
 * d-日，不补零
 * w-周，数字
 * wc-周，中文字符
 * we-周，英文缩写周
 * H-24时，补零
 * h-12时，补零
 * Hz-24时，不补零
 * hz-12时，不补零
 * apc-上午，下午
 * ape- am,pm
 * N-分，补零
 * n-分，不补零
 * S-秒，补零
 * s-秒，不补零
 * I-毫秒，补零
 * i-毫秒，不补零
 * ftOpt:扩展格式化参数，定制化
 * 如：apc1:function(time){var h=time.getHour;return h<6?'凌晨':h<11?'上午':h<14?'中午':h<19?'下午':'晚上'}
 */
function $formatDate(time,opt){
	if(!$formatDate.__data){
		//基础字段
		$formatDate.__data={
			Y:function(time){return time.getFullYear();},
			y:function(time){return time.getFullYear().substring(2);},
			M:function(time){return fillZero(time.getMonth()+1,2);},
			m:function(time){return time.getMonth()+1;},
			mc:function(time){return ['一','二','三','四','五','六','七','八','九','十','十一','十二'][time.getMonth()];},
			me:function(time){return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][time.getMonth()];},
			D:function(time){return fillZero(time.getDate(),2);},
			d:function(time){return time.getDate();},
			w:function(time){return time.getDay();},
			wc:function(time){return ['日','一','二','三','四','五','六'][time.getDay()];},
			we:function(time){return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][time.getDay()];},
			H:function(time){return fillZero(time.getHours(),2);},
			h:function(time){return fillZero(time.getHours(),2);},
			Hz:function(time){return time.getHours();},
			hz:function(time){return time.getHours();},
			apc:function(time){return time.getHours()<12?'上午':'下午';},
			ape:function(time){return time.getHours()<12?'am':'pm';},
			N:function(time){return fillZero(time.getMinutes(),2);},
			n:function(time){return time.getMinutes();},
			S:function(time){return fillZero(time.getSeconds(),2);},
			s:function(time){return time.getSeconds();},
			I:function(time){return fillZero(time.getMilliseconds(),3);},
			i:function(time){return time.getMilliseconds();}
		};
		$formatDate.__compData=genCompData($formatDate.__data);
	}
	//初始化选项
	if(typeof opt=='string'){
		opt={
			ft:opt
		};
	}
	if(!opt||!opt.ft){
		opt={
			ft:'Y-M-D H:N:S'
		};
	}
	if(!time){
		time=new Date();
	}
	//选择时间格式化字段
	var now=new Date(),tc=now.getTime()-time.getTime(),ft;
	if(opt.ftcustom){
		//自定义时间格式
		ft=opt.ftcustom(time);
	}else if(opt.ftin1d&&tc<86400000&&now.getDate()==time.getDate()){
		//同一日内
		ft=opt.ftin1d;
	}else if(opt.ftin1w&&tc<604800000&&(now.getDay()>time.getDay()||tc<86400000)){
		//同一周内
		ft=opt.ftin1w;
	}else if(opt.ftlt1w&&tc<604800000){
		//小于一周
		ft=opt.ftlt1w;
	}else if(opt.ftin1m&&tc<2678400000&&now.getMonth()==time.getMonth()){
		//同一月内
		ft=opt.ftlt1w;
	}else{
		//其他
		ft=opt.ft;
	}
	//自定义格式化字段
	var compData=$formatDate.__compData,curCompData={};
	if(opt.ftOpt){
		curCompData=genCompData(opt.ftOpt);
	}
	//生成格式化内容
	var result=[],last='',texts={},next=false;
	for(var i=0,len=ft.length;i<=len;i++){
		if(i<len){
			var c=ft.charAt(i);
			if(next){
				//转义字符
				result.push(c);
				next=false;
				continue;
			}else{
				if(c=='\\'){
					//进入转义
					if(!last){
						next=true;
						continue;
					}else{
						var testText=last+c,c1=compData[testText],c2=curCompData[testText];
					}
				}else{
					var testText=last+c,c1=compData[testText],c2=curCompData[testText];
				}
			}
		}else{
			c=testText=c1=c2=null;
		}
		if(i<len&&(c1||c2)){
			//有匹配到的内容,尝试继续匹配
			last=testText;
		}else{
			//无匹配到内容
			if(last){
				var text;
				//有历史匹配内容
				if(texts[last]){
					text=texts[last];
					//回溯1
					c&&i--;
				}else if(curCompData[last]&&curCompData[last][0]){
					text=texts[last]=curCompData[last][0](time);
					//回溯1
					c&&i--;
				}else if(compData[last]&&compData[last][0]){
					text=texts[last]=compData[last][0](time);
					//回溯1
					c&&i--;
				}else{
					text=last.substring(0,1);
					//无对应数据,回溯全部
					i-=last.length;
				}
				result.push(text);
				last='';
			}else{
				//无历史匹配内容
				c&&result.push(c);
				continue;
			}
		}
	}
	//返回结果
	return result.join('');
	//生成比较数据
	function genCompData(data){
		var testObj={};
		for(var k in data){
			for(var i=k.length;i;i--){
				var s=k.substring(0,i);
				if(!testObj[s]){
					testObj[s]=[0,0];
				}
				if(i==k.length){
					testObj[s][0]=data[k];
				}else{
					testObj[s][1]=1;
				}
			}
		}
		return testObj;
	}
	//填零函数
	function fillZero(d,len){
		d=d.toString();
		for(var i=len-d.length;i-->0;){
			d='0'+d;
		}
		return d;
	}
}
/**
 * 模版渲染引擎
 * @param {String} tpl 模版字符串
 * @param {Object} data 模版渲染数据，对象格式，如果不传入该值，模版渲染引擎会返回编译后的模版代码函数，程序可调用该函数并传入模版数据来获取渲染结果
 */
function $formatTpl(tpl, data) {
	var code = "var p=[];with(obj){p.push(" + tpl.replace(/[\r\t\n]/g, " ").replace(/<%/g, '\t').replace(/%>/g, '\r').replace(/(^|\r)([^\t]*)(\t|$)/g, function($0, $1, $2, $3) {
		return $1 + $toJSON($2) + $3;
	}).replace(/\t\s*\=([^\r]*)\r/g, ');p.push($1);p.push(').replace(/\t([^\r]*)\r/g, ');$1\rp.push(') + ");}return p.join('');";
	var func = new Function("obj", code);
	return data ? func(data) : func;
}
/**
 * 获得字符数组，将字符串转换为数组，会正确处理html转义字符进行处理，如'测试&lt;&gt;'会被转换为['测','试','&lt;','&gt;']
 * @param {Object} str 要转换的字符串
 * @param {Object} enableEscape 支付支持html转义字符
 */
function $getCharArray(str,enableEscape) {
	if (!$getCharArray.feature_split_normal) {
		$getCharArray.feature_split_normal = '1,2'.split(/(,)/g).length == 3 ? 1 : -1;
	}
	if(typeof enableEscape!=undefined&&!enableEscape){
		var charArr = [];
		for(var i=0,len=str.length;i<len;i++){
			charArr.push(str.charAt(i));
		}
		return charArr;
	}
	//把字符串根据转义字符切分
	var reg = /(&#\d+;|&[a-z0-9]+;)/ig, arr = str.split(reg), escCode;
	if ($getCharArray.feature_split_normal == -1) {
		//部分浏览器使用正则切分会忽略正则里面的子匹配，在此进行修复
		var __bugfixed0 = 0;
		$each(str.match(reg) || [], function(code, i) {
			if ((typeof arr[i * 2]=='undefined')||(arr[i * 2] != str.substring(__bugfixed0, __bugfixed0 + arr[i * 2].length))) {
				//补齐空缺，bug，空内容会被忽略
				arr.splice(i * 2, 0, '');
			}
			insertIndex = i * 2 + 1;
			__bugfixed0 += arr[i * 2].length + code.length;
			arr.splice(insertIndex, 0, code);
		});
	}
	var charArr = [],escCode;
	$each(arr, function(str, i) {
		if (i % 2 == 1&&(escCode=$isEscapeSequense(str))) {
			//转义字符
			charArr.push('&#'+escCode+';');
		} else {
			for (var j = 0, len = str.length; j < len; j++) {
				var c=str.charAt(j);
				charArr.push(c=='&'?'&#38;':c);
			}
		}
	});
	return charArr;
}
/**
 * 获取字符串中每个字符的显示宽度
 * @param {String} str 字符串
 * @param {Object} opt 选项
 *
 * 选项值：
 * fontStyles:文字的样式
 * domTag:字符所放的标签，默认pre
 * callback:回调，返回包含每个字符显示宽度的对象
 * chaWidth:用于提高效率，缓存之前获取的宽度。
 */
function $getCharWidth(str, opt) {
	opt = $extend({
		fontStyles : {},
		callback : null,
		chaWidth : {},
		domTag : 'pre'
	}, opt);
	//创建等待队列
	$getCharWidth.waitList=$getCharWidth.waitList||[];
	if (!opt.callback) {
		return;
	}
	if (!str) {
		opt.callback(opt.chaWidth);
		return;
	}
	if($getCharWidth.status==1){
		//加入等待队列
		$getCharWidth.waitList.push([str,opt]);
		return;
	}
	//需要判断的字符
	var fontStyles = opt.fontStyles || {}, callback = opt.callback, chaWidth = opt.chaWidth || {}, domTag = opt.domTag;
	//处理字符串转义字符
	var escCode,newChaWidth = {};
	//遍历需要计算宽度的字符
	$each($isArray(str)?str:$getCharArray(str), function(x) {
		if (!chaWidth[x] && !newChaWidth[x]) {
			if (x.length>1||$isAllowedUnicode(x.charCodeAt(0))) {
				chaWidth[x] = newChaWidth[x] = -1;
			}
		}
	});
	//处理数组，要计算宽度的字符。采用分批计算方式
	var chars = $keys(newChaWidth), charLen = chars.length;
	if (!charLen) {
		callback(opt.chaWidth);
		//判断等待队列
		if($getCharWidth.waitList.length){
			$getCharWidth.apply(null,$getCharWidth.waitList.shift());
		}
		return;
	}
	//初始化dom节点，用于计算宽度
	var arrLen = charLen > 512 ? 256 : charLen, arr = new Array(arrLen);
	for (var i = 0; i < arrLen; i++) {
		arr[i] = 0;
	}
	var range = document.createDocumentFragment();
	var doms = $map(arr, function(x, i, arr) {
		var dom = document.createElement(domTag);
		$setStyles(dom, fontStyles);
		$setStyles(dom, {
			position : 'absolute',
			left : 0,
			top : 0,
			visibility : 'hidden',
			zIndex : i,
			whiteSpace:'pre'
		});
		range.appendChild(dom);
		return dom;
	});
	var node = document.createElement('div');
	$setStyles(node, {
		position : 'absolute',
		left : 0,
		top : 0,
		visibility : 'hidden',
		zIndex : 9999
	});
	node.appendChild(range);
	document.body.appendChild(node);
	//遍历字符，获取宽度
	var c = 0;
	$getCharWidth.status=1;
	$whilst(function() {
		return c < charLen;
	}, function(cb) {
		var i = 0;
		node.style.display = 'none';
		var chs = $map(doms, function(dom) {
			if (c < charLen) {
				var ch = chars[c];
				dom.innerHTML = ch;
				c++;
				i++;
				return ch;
			}
		});
		node.style.display = '';
		setTimeout(function() {
			$each(chs, function(ch, i) {
				if (ch) {
					var dom = doms[i];
					var cw = dom.clientWidth;
					if (cw > 0) {
						chaWidth[ch] = cw;
					}
				}
			});
			cb();
		});
	}, function(success) {
		document.body.removeChild(node);
		callback(chaWidth);
		$getCharWidth.status=0;
		//判断等待队列
		if($getCharWidth.waitList.length){
			$getCharWidth.apply(null,$getCharWidth.waitList.shift());
		}
	});
}
function $getCookie(name) {
	//读取COOKIE
	var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
	return val ? (val[2] ? unescape(val[2]) : "") : null;
}
/**
 * 获取事件相对页面坐标
 * @param {Object} e 鼠标事件
 */
function $getEventCoords(e) {
	e=e||window.event;
	if (e.pageX || e.pageY) {
		return {
			x : e.pageX,
			y : e.pageY
		};
	}
	return {
		x : e.clientX||0 + document.body.scrollLeft - document.body.clientLeft,
		y : e.clientY||0 + document.body.scrollTop - document.body.clientTop
	};
}
function $getOffset (ele,oRefer){//oRefer是定位参照物。可以不写，不写就是和浏览器的绝对位置
	//注意：oRefer必须是ele的offset祖先，要不然取到的值是ele距离body的绝对偏移量
		oRefer=oRefer||document.body;
		var x=ele.offsetLeft;
		var y=ele.offsetTop;
		p=ele.offsetParent;//重在理解好offsetParent
		
		while(p!=oRefer&&p!=document.body){
			 
			if(window.navigator.userAgent.indexOf('MSIE 8.0')>-1){//ie8有个bug（边框问题）
				x+=p.offsetLeft;
				y+=p.offsetTop;
			}else{
				x+=p.offsetLeft+p.clientLeft;
				y+=p.offsetTop+p.clientTop;
			}		
			p=p.offsetParent;
			
		}
		var obj={};
		obj.left=x;
		obj.top=y;
		return obj;
	}
function $getPageHeight() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollHeight 是网页内容实际高度，可以小于 clientHeight，NS、FF 认为 scrollHeight 是网页内容高度，不过最小值是 clientHeight，改为统一FF标准
	return Math.max(doeCath .scrollHeight,doeCath .clientHeight);
}
function $getPageScrollLeft() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return doeCath.scrollLeft;
}
function $getPageScrollTop() {
	var docCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.scrollTop;
}
function $getPageWidth() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollWidth 是网页内容实际宽度，可以小于 clientWidth，NS、FF 认为 scrollWidth 是网页内容宽度，不过最小值是 clientWidth，改为统一FF标准
	return Math.max(doeCath.scrollWidth,doeCath.clientWidth);
}
function $getQuery(name, url) {
	var u = arguments[1] || window.location.search, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), r = u.substr(u.indexOf("\?") + 1).match(reg);
	return r != null ? r[2] : "";
}
function $getSingle( fn ) {
    var ret;
    return function () {
        return ret || ( ret = fn.apply(this, arguments) );
    };
};
function $getStack(e, d) {
	if (e && e.stack) {
		var s = e.stack.replace(/(?:http:)[^:]*:(.*)/g, "$1").replace(/[\n\s]/g, "").replace(/@/g, "at").split("at"), l = d ? d + 1 : s.length - 1;
		return s.slice(1, l).join(":");
	} else if (arguments.callee.caller.caller) {
		var curr = arguments.callee.caller.caller, c, o = [];
		while (curr) {
			c = curr;
			o.push(c.toString().replace(/[\t\n\r]/g, "").substring(0, 100));
			curr = curr.caller;
		}
		return o.join(":");
	} else {
		return "";
	}
}
function $getTarget(e, parent, tag) {
	var e = e || window.event, tar = e.srcElement || e.target;
	if (parent && tag && tar.nodeName.toLowerCase() != tag) {
		while ( tar = tar.parentNode) {
			if (tar == parent || tar == document.body || tar == document) {
				return null;
			} else if (tar.nodeName.toLowerCase() == tag) {
				break;
			}
		}
	};
	return tar;
}
function $getToken(){
    var tgt = $getCookie('tgt');
    if (!tgt){
     return ''; 
   }
return $t33(tgt);
}
function $getWindowHeight() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientHeight;
}
function $getWindowWidth() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientWidth;
}
function $get_file_size( unit, amount ){
	return ( { 'K': 1024, 'M': 1024 * 1024, 'G': 1024 * 1024 * 1024 }[ unit ] || 1 ) * amount;
}
function $hasClass(old,cur){
	if(!old||!cur) return null;
	var arr=old.split(' ');
	for(var i=0,len=arr.length;i<len;i++){
		if(cur==arr[i]){
			return cur;
		}
	};
	return null;
}
function $id(id) {
	return typeof (id) == "string" ? document.getElementById(id) : id;
}
function $inArray(t, arr) {
	for (var i = arr.length; i--; ) {
		if (arr[i] === t) {
			return i * 1;
		}
	};
	return -1;
}
/**
 * 获取自增数字
 */
function $incNum(acc){
	acc=acc||$incNum;
	acc.num=acc.num||0;
	return acc.num++;
}
function $initBadjs() {
	var errorStr = "";
	window.onerror = function(msg, url, l) {
		var stack = $getStack(), ts = msg.replace(/\n/g, " ") + "|" + encodeURIComponent(url + ":" + stack) + "|" + l;
		//记录信息，调试需要的时候调用
		$initBadjs._last_err_msg = {
			msg : msg,
			url : url,
			l : l,
			stack : stack
		};
		if (errorStr.indexOf(ts) == -1 || $initBadjs._badjs_allow_resend) {
			errorStr += ts + ",";
			$sendBadjs(msg, url, l + ":" + stack);
		}
		return false;
	}
}
/**
 *判断是否数组 
 * @param {Object} value
 */
function $isArray(value){
	return Object.prototype.toString.call(value) == '[object Array]';
}
/**
 * 浏览器判断函数
 * @param {String} str
 */
function $isBrowser(str) {
	if(!$isBrowser.att){
		str = str.toLowerCase();
		var b = navigator.userAgent.toLowerCase();
		var att = [];
		att['firefox'] = b.indexOf("firefox") != -1;
		att['opera'] = b.indexOf("opera") != -1;
		att['safari'] = b.indexOf("safari") != -1;
		att['chrome'] = b.indexOf("chrome") != -1;
		att['gecko'] = !att['opera'] && !att['safari'] && b.indexOf("gecko") > -1;
		att['ie'] = !att['opera'] && b.indexOf("msie") != -1;
		att['ie6'] = !att['opera'] && b.indexOf("msie 6") != -1;
		att['ie7'] = !att['opera'] && b.indexOf("msie 7") != -1;
		att['ie8'] = !att['opera'] && b.indexOf("msie 8") != -1;
		att['ie9'] = !att['opera'] && b.indexOf("msie 9") != -1;
		att['ie10'] = !att['opera'] && b.indexOf("msie 10") != -1;
		$isBrowser.att=att;
	}
	return $isBrowser.att[str];
}
function $isJSON(str) {
	if (/^\s*$/.test(str)){
		return false;
	}
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
	str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
	str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(str);
}
/**
 * 判断对象是否undefined
 * @param {Object} variable
 */
function $isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}
/**
 * 请求jsonp数据
 * @param {Object} opt 请求选项，具体选项及默认值如下
 * url:'',//url
 * data:{},//请求数据，key-value对，拼接到url上去，需要自行处理encode
 * timeout:0,//超时设置，单位毫秒
 * charset:'utf8',//编码
 * addToken:true,//是否添加token
 * tokenName:'tk',//token参数名
 * tokenValue:'',//token参数值
 * callbackParam:'callback',//回调参数名
 * callbackName:'__jsonpcallback',//回调参数
 * callback:null,//回调函数
 * errorback:null//错误回调函数
 */
function $jsonp(opt){
	//选项
	opt=$extend({
		url:'',//url
		data:{},//请求数据，key-value对，拼接到url上去，需要自行处理encode
		timeout:0,//超时设置，单位毫秒
		charset:'utf8',//编码
		addToken:true,//是否添加token
		tokenName:'tk',//token参数名
		tokenValue:'',//token参数值
		callbackParam:'callback',//回调参数名
		callbackName:'__jsonpcallback',//回调参数
		callback:null,//回调函数
		errorback:null//错误回调函数
	},opt);
	
	var callback=opt.callback,errorback=opt.errorback,callbackName=opt.callbackName,script,timer,success=false;
	//回调函数设置
	$jsonp.index=($jsonp.index||0)+1;
	while(window[callbackName+$jsonp.index]){
		$jsonp.index++;
	}
	callbackName+=$jsonp.index;
	//设置回调
	window[callbackName]=function(data){
		success=true;
		//取消超时
		timer&&(timer=clearTimeout(timer));
		//清理script
		clear();
		if(!arguments.callee.timeout){
			//正常回调，非超时
			if(arguments.length>1){
				//如果参数数量大于1,非内部定义规范标准格式jsonp回调，直接回调，不做处理
				callback.apply(this,arguments);
			}else{
				//无返回数据，错误
				if(!data){
					errorback&&errorback();
				}else{
					//标准数据
					var returnCode=data.returnCode;
					//返回码正确
					if(parseInt(returnCode)==0){
						callback&&callback(data);
					}else{
						//返回错误
						errorback&&errorback(data);
					}
				}
			}
		}
	};
	//发送请求
	send();
	//发送请求
	function send(){
		var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		script = document.createElement("script");
		script.charset=opt.charset;
		var data=opt.data;
		//添加token
		if(opt.addToken){
			var token=opt.tokenValue;
			if(!token){
				var tgt=$getCookie('tgt');
				token=tgt?$t33(tgt):'';
			}
			data[opt.tokenName]=token;
		}
		//禁止浏览器缓存
		data[new Date().getTime()]='';
		//超时设置
		var timeout=opt.timeout;
		if(timeout){
			timer=setTimeout(function(){
				window[callbackName].timeout=true;
				//清理script
				clear();
				//超时
				errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应超时'});
				timer=0;
			},timeout);
		}
		//设置回调
		var callbackParam=opt.callbackParam;
		data[callbackParam]=callbackName;
		//拼装url
		url=$addParams(opt.url,data,true);
		//监听事件
		script.onload = script.onreadystatechange = function() {
			var uA = navigator.userAgent.toLowerCase();
			if (!(!(uA.indexOf("opera") != -1) && uA.indexOf("msie") != -1) || /loaded|complete/i.test(this.readyState)) {
				//加载完成，取消超时
				timer&&(timer=clearTimeout(timer));
				if(!success){
					//清理script
					clear();
					//错误
					errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应错误'});
				}
			}
		};
		script.onerror = function(){
			//取消超时
			timer&&(timer=clearTimeout(timer));
			timer=0;
			//清理script
			clear();
			//错误
			errorback&&errorback({returnCode:9999,errorCode:9999,msg:'请求响应错误'});
		};
		//设置url
		script.src=url;
		head.appendChild(script);
	}
	//清除回调函数
	function clear(){
		//取消回调
		window[callbackName]=undefined;
		if(script){
			//取消事件
			script.onerror = script.onload = script.onreadystatechange=null;
			//取消script
			script.parentNode&&script.parentNode.removeChild(script);
		}
	}
}
/**
 * 获取对象的属性名集合
 */
function $keys(obj) {
	if(typeof obj!='object'){
		return null;
	}
	if (Object.keys) {
		return Object.keys(obj);
	}
	var keys = [];
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			keys.push(k);
		}
	}
	return keys;
}
/**
 * 封装函数,限制函数的执行次数,返回一个只允许被调用有限次数的函数,超过次数的调用会报出异常
 * @param {Function} fn 需要被封装的函数
 * @param {Number} lim 限制的次数,默认为1次
 */
function $limitCalls(fn,lim) {
	var lim = lim||1;
	return function() {
		if (lim<=0)
			throw new Error("function was already called for limited times.");
		lim--;
		fn.apply(this, arguments);
	}
}
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
function $loadScript(url,callback) {
	var head = document.head||document.getElementsByTagName('head')[0] || document.documentElement,script,options,s;
	if (typeof url ==="object") {
		options = url;
		url = undefined;
	}
	s = options || {};
	url = url || s.url;
	callback = callback || s.success;
	script = document.createElement('script');
	script.async = s.async || false;
	script.type ='text/javascript';
	if (s.charset) {
		script.charset = s.charset;
	}
	if(s.cache === false){
		url = url+( /\?/.test( url ) ?'&' : '?')+(new Date()).getTime();
	}
	script.src = url;
	head.insertBefore(script, head.firstChild);
	if(callback){
		document.addEventListener ? script.addEventListener('load', callback, false) : (script.onreadystatechange = function() {
			if (/loaded|complete/.test(script.readyState)) {
				script.onreadystatechange = null;
				callback();
			}
		});
	}
}
/**
 * 遍历数组调用迭代器,保存迭代器调用结果到数组,最后返回结果
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代器,传入三个参数,当前遍历到的元素,元素索引,原数组
 */
function $map(arr, iterator) {
	if (arr.map) {
		return arr.map(iterator);
	}
	var results = [];
	$each(arr, function(x, i) {
		results.push(iterator(x, i, arr));
	});
	return results;
}
/**
 * 命名空间定义函数，多个命名空间用逗号‘,’隔开
 */
function $namespace(name) {
	for (var arr = name.split(','), r = 0, len = arr.length; r < len; r++) {
		for (var i = 0, k, name = arr[r].split('.'), parent = {}; k = name[i]; i++) {
			i === 0 ? eval('(typeof ' + k + ')==="undefined"?(' + k + '={}):"";parent=' + k) : ( parent = parent[k] = parent[k] || {});
		}
	}
}
//分页组件
function $page(opt) {
	opt=$extend({
		tpl:'<div class="paginator"><%if(showPre){%><span class="<%=cpn<=1?"page-pre-disabled":"page-pre"%>" <%=cpn<=1?"":"pn_tag=\'goto-"+(cpn-1)+"\'"%>>上一页</span><%}%><%if(showFirst&&min>1){%><span class="page-this" pn_tag="goto-1">1</span><%}%><%if(min>(showFirst?2:1)){%><span class="page-break">...</span><%}%><%for(;min<=max;min++){%><a href="#nolink" class="<%=cpn==min?"cur":""%>" pn_tag="goto-<%=min%>"><%=min%></a><%}%><%if(max<(showLast?pn-1:pn)){%><span class="page-break">...</span><%}%><%if(showLast&&max<pn){%><a href="#nolink" pn_tag="goto-<%=pn%>"><%=pn%></a><%}%><%if(showNext){%><span class="<%=cpn>=max?"page-next-disabled":"page-next"%>" <%=cpn>=max?"":"pn_tag=\'goto-"+(cpn+1)+"\'"%>>下一页</span><%}%><%if(showInput){%><span class="page-skip"> 到第<input type="text" input="<%=pnid%>" value="<%=cpn<pn?(cpn+1):(cpn>1)?(cpn-1):cpn%>" maxlength="4" onchange="this.value=this.value.replace(/[^\\d]+/g,\'\')">页<button pn_tag="gotoinput-<%=pnid%>">确定</button></span><%}%></div>',//模版
		container:null,//翻页组件dom容器
		showPn:10,//显示的页数
		showPnPre:4,//前置显示的页数
		showFirst:true,//是否显示第一页
		showLast:true,//是否显示最后页
		showPre:true,//是否显示上一页
		showNext:true,//是否显示下一页
		showInput:true,//是否显示快速跳转页
		callback:null,//回调
		pnid:$incNum()
	},opt);
	
	if(!opt.container||opt.container.pnid){
		return;
	}
	opt.container.pnid=opt.pnid;
	
	var data={
		num:100,//总条目数
		ps:20,//每页条目数
		pn:5,//总页数
		cpn:1//当前页数
	};
	//模版渲染函数
	var renderFn=$formatTpl(opt.tpl);

	/**
	 * 设置数据
	 * @param {Object} num 条目数
	 * @param {Object} ps 每页条目数
	 * @param {Object} cpn 当前页
	 */
	function set(num,ps,cpn){
		if(num<0){
			num=0;
		}
		if(ps<3){
			ps=3;
		}else if(ps>50){
			ps=50;
		}
		data.num=num;
		data.ps=ps;
		data.pn=Math.ceil(num/ps);
		gotoPn(cpn);
	}
	
	/**
	 * 跳转到指定页
 	 * @param {Object} cpn
	 */
	function gotoPn(cpn){
		cpn=parseInt(cpn);
		if(isNaN(cpn)||cpn<1){
			cpn=1;
		}else if(cpn>data.pn){
			cpn=data.pn;
		}
		data.cpn=cpn;
		render();
		opt.callback&&opt.callback(cpn);
	}

	//渲染html
	function render(){
		//显示列表的最小，最大页
		var min=Math.max(data.cpn-opt.showPnPre,1),max=Math.min(data.pn,min+opt.showPn);
		min=Math.max(1,max-opt.showPn);
		var html=renderFn({num:data.num,ps:data.ps,pn:data.pn,cpn:data.cpn,min:min,max:max,showFirst:opt.showFirst,showLast:opt.showLast,showPre:opt.showPre,showNext:opt.showNext,showInput:opt.showInput,pnid:opt.pnid});
		opt.container.innerHTML=html;
	}
	
	//绑定事件
	function bindEvent(){
		$bindEvent(opt.container,function(e){
			var el=$getTarget(e,this),tag;
			while(el&&el!=this&&!(tag=el.getAttribute('pn_tag'))){
				el=el.parentNode;
			}
			if(tag){
				var tagInfo=tag.split('-');
				switch(tagInfo[0]){
					//跳转到指定页
					case 'goto':
						var page=tagInfo[1];
						gotoPn(page);
						break;
					case 'gotoinput':
						var page=$attr('input',tagInfo[1],opt.container)[0].value;
						gotoPn(page);
						break;
				}
			}
		});
	}
	//绑定事件
	bindEvent();

	//返回对象接口
	return {
		init : function(num,ps,cpn){
			set(num,ps,cpn);
		},
		go : function(cpn){
			gotoPn(cpn);
		}
	};
};
/**
 * 简易字符串解析替换，将字符串中的{#seg#}替换为data数据中seg对应的属性值,seg字段规范内容为字母，数字，下划线
 * @param {Object} str 要解析的字符串
 * @param {Object} data 替换数据
 * @param {Object} unReplaceIfNotDefine 是否不替换未定义属性的{#seg#}段为空
 */
function $parseStr(str,data,unReplaceIfNotDefine){
	return str.replace(/{#\s*([\w\d_]+)\s*#}/g,function($0,$1){
		var d=data[$1],t=typeof d=='undefined';
		if(t&&unReplaceIfNotDefine){
			return $0;
		}
		return t?'':d;
	});
}
/**
 * 解析排版文字，将文字按照宽度排版分解成行，回调排版后的所有行内容列表。
 * 注：因排版计算随浏览器区别比较大，目前该函数只支持以下样式控制下的展示计算:
 * white-space:pre-wrap(IE8以下使用pre代替)，word-wrap:break-word，word-break:break-all，word-spacing:0
 * 即：不合并空格，自动换行，中断所有词组，空格默认宽度展示。
 * @param {String} text 文字
 * @param {Object} conf 配置，包括宽度设置，是否使用<br/>强制换行选项
 * @param {Object} fontStyle 字体样式，主要为字体系列(font-family)，字体尺寸(font-size)，字体粗细(font-weight)，字体异体(font-variant)，字体样式(font-style)，等一些列字体样式
 * @param {Function} callback 回调，返回计算完成后的行内容列表
 * @param {Object} chaCache 文字宽度缓存，相同字体样式的运算建议使用一个对象作为文字宽度缓存，这样可以极大提高程序的运行效率
 */
function $parseTypesetText(text, conf, fontStyle, callback, chaCache) {
	conf = $extend({
		width : 0, //宽度
		useBr : false//使用<br/>断行，默认不使用
	}, conf);
	//文字缓存
	chaCache = chaCache || {};
	//获取文字宽度
	$getCharWidth(text, {
		fontStyles : fontStyle,
		chaWidth : chaCache,
		callback : function(chaWidth) {
			var lines = [], curW = 0, curLine = [];
			//遍历文字，输出行
			$each($getCharArray(text), function(c) {
				if (c == '\n') {
					curLine.push(c);
					//换行
					newLine();
				} else if (chaWidth[c] > 0) {
					var width = chaWidth[c];
					if (width > 0) {
						if ((curW + width) > conf.width) {
							newLine();
						}
						curLine.push(c);
						curW += width;
					}
				}
			});
			if(curLine.length>0){
				newLine();
			}
			//回调
			callback && callback(lines);
			//新行
			function newLine() {
				if (conf.useBr) {
					if (curLine.length == 0) {
						curLine.push(' ');
					}
					curLine.push('<br/>');
				}
				lines.push(curLine.join(''));
				curW = 0;
				curLine.length = 0;
			}
		}
	});
}
/**
 * 解析url，返回协议，域名，端口，url，路径，参数，锚点
 * @param {Object} url
 */
function $parseUrl(url){
	var a=document.createElement('a');
	a.href=url;
	return {
		protocol:a.protocol,
		hostname:a.hostname,
		port:a.port,
		href:a.href,
		pathname:a.pathname,
		search:a.search,
		hash:a.hash
	};
}
/**
 * 预加载资源
 * @param {Object} url 加载资源url
 * @param {Object} callback 加载完成回调
 */
function $preload(url, callback) {
	var img = new Image(0);
	img.onload = img.onerror = img.onabort = function() {
		img.onload = img.onerror = img.onabort = null;
		callback&&callback(img);
	};
	img.src = url;
}
/**
 * 阻止事件默认行为
 * @param {Object} e，事件对象
 */
function $preventDefault(e) {
	e = e || window.event;
	if (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
}
/**
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
function $sendBadjs(msg, src, d) {
	//编码
	function encode(str) {
		if (str && str.replace) {
			return encodeURIComponent(str.replace(/\|/g, '_'));
		}
		return '';
	}
	if (!$sendBadjs.path) {
		var w = window, hn = location.hostname.split('.');
		hn.reverse();
		hn.length = 2;
		hn.push('rd');
		hn.reverse();
		hn = hn.join('.');
		$sendBadjs.path = 'http://' + hn + '/dp/rptData';
	}
	var ts = encode(msg.replace(/\n/g, " ").replace(/\|/g, ";").replace(/-/g, '_') + "-" + src.replace(/\|/g, ";").replace(/-/g, '_') + "-" + d.replace(/\|/g, ";").replace(/-/g, '_'));
	//页面ID，用于标识页面
	var pageId = encode(w['__PAGEID'] || (location.protocol + '//' + location.host + location.pathname));
	var uid = encode($getCookie('uid'));
	var sid = encode($getCookie('sid'));
	$report($sendBadjs.path,{
		id:pageId,
		type:'badjs',
		data:ts,
		uid:uid,
		sid:sid
	});
}
function $setClass(ids,cName,kind){	
	if(typeof(ids)=="string"){
		var arrDom=ids.split(",");
		for(var i=0,len=arrDom.length;i<len;i++){
			setClass($id(arrDom[i]),cName,kind);
		}
	}
	if(ids instanceof Array){  //一堆的元素集合  array
		for(var i=0,len=ids.length; i<len && ids[i]; i++){
			setClass(ids[i],cName,kind);
		}
	}else{
		setClass(ids,cName,kind);
	};
	
	function setClass(obj,cName,kind){
		if(!obj){//做校验,避免异常
			return;
		}
		var oldName=obj.className,
			arrName=oldName?oldName.split(' '):[];
		if(kind=="add"){
			if(!$hasClass(oldName,cName)){
				arrName.push(cName);
				obj.className=arrName.join(' ');
			}
		}else if(kind=="remove"){
			var newName=[];
			for(var i=0,len=arrName.length;i<len;i++){
				if(cName!=arrName[i]&&' '!=arrName[i]){
					newName.push(arrName[i]);
				}
			};
			obj.className=newName.join(' ');
		}
	}	
}
function $setCookie(name, value, expires, path, domain, secure) {
	//写入COOKIES
	var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
	expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
	document.cookie = name + '=' + escape(value) + ( expires ? ';expires=' + exp.toGMTString() : '') + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
}
function $setStyles(dom,styles){
	for(var key in styles){
		var v=styles[key];
		key=key.replace(/-(\w)/g,function($0,$1){
			return $1.toUpperCase();
		});
		dom.style[key]=v;
	}
}
function $set_default_value( dom, value ){

	dom[0].onfocus = function(){
		if ( dom.val() === value ){
	 		dom.val( '' );
	 		dom.removeClass( 'color_gray1' );
	 	}
	};


	dom[0].onblur = function(){
		if ( dom.val() === '' ){
	 		dom.val( value );
	 		dom.addClass( 'color_gray1' );
	 	}
	};

	dom.removeAttr( 'placeholder' );

	setTimeout(function(){
		if ( dom.val() === '' ){
			dom.val( value );
			dom.addClass( 'color_gray1' );
		}
	}, 100);

	return {
		get_val: function(){
			var val = dom.val();
			if ( val === value ){
				return '';
			}
			return val;
		}
	}
	
}
/**
 * 滑动条组件
 * @param {Object} opt 选项
 * 选项内容
 * dom 滑动条放置的dom元素，必须
 * direction 方向，横向:x/纵向:y
 * length 滑动条总长度
 * tpl 滑动条html模版，可按照一定约束定制
 * min 滑动条调节范围的最小单元
 * max 滑动条调节范围的最大单元
 * cur 滑动条当前范围
 * ps 滑动条范围
 * barOffset 滑动条左右偏移，滑动条总长度减去左右偏移后为滑动条实际可滑动范围
 * barBorder 滑动条边框宽度
 * onStartMove 回调，开始移动事件，在mousedown的时候触发
 * onReleaseMove 回调，结束移动事件，在mouseup的时候触发
 * onUnitRange 回调，滑动条单元范围变化，在滑动到范围变化的时候触发
 * onOffset 回调，滑动条偏移像素，在滑动条发生滑动触发，值为相对当前单元位置的偏移值
 *
 * 返回：
 * 滑动条对象，提供以下方法
 * setCurRange：function(begin,end,align) 设置当前内容单元范围
 * 参数：begin 内容开始单元，end 内容结束单元，align 滑动条是否对齐单元
 *
 * setTotalRange：function(min,max)设置滑动条表示最大最小单元
 * 参数：min 内容最小单元，max 内容最大单元
 *
 * destroy：function()在滑动条组件需要销毁时调用，解除内部事件绑定，清空html
 *
 * getState：function()获取滑动条当前状态
 * 返回：
 * {
 * 	min 滑动条表示最小单元
 * 	max 滑动条表示最大单元
 * 	length 滑动条长度
 * 	ps 滑动条范围
 * 	begin 滑动条当前范围开始
 * 	end 滑动条当前范围结束
 * 	offset 滑动条当前范围开始偏移像素
 * 	mstate 滑动条当前鼠标状态，鼠标按下:down/鼠标放开:up
 * }
 */
function $sliderBar(opt) {

	opt = $extend({
		dom : null, //滑动条放置的dom元素，必须
		direction : 'x', //方向，横向:x/纵向:y
		length : 500, //滑动条总长度
		tpl : '<div class="slider slider-<%=direction%>" s_tag="main"><span class="slider-min" s_tag="start">-</span><div class="slider-area"><span class="slider-bar" s_tag="bar"></span></div><span class="slider-max" s_tag="end">+</span></div>',
		min : 1, //滑动条调节范围的最小单元
		max : 100, //滑动条调节范围的最大单元
		cur : [1, 10], //滑动条当前范围
		ps : 10, //滑动条范围
		barOffset : 0, //滑动条左右偏移，滑动条总长度减去左右偏移后为滑动条实际可滑动范围
		barBorder : 1, //滑动条边框宽度
		onStartMove : null, //回调，开始移动事件，在mousedown的时候触发
		onReleaseMove : null, //回调，结束移动事件，在mouseup的时候触发
		onUnitRange : null, //回调，滑动条单元范围变化，在滑动到范围变化的时候触发
		onOffset : null,//回调，滑动条偏移像素，在滑动条发生滑动触发，值为相对当前单元位置的偏移值
		autoHide:true//自动隐藏
	}, opt);

	var main, start, end, bar, barParent;

	function init() {
		if (opt.ps) {
			opt.cur[1] = opt.cur[0] + opt.ps - 1;
		} else {
			opt.ps = opt.cur[1] - opt.cur[0] + 1;
		}
		opt.dom.innerHTML = $formatTpl(opt.tpl, opt);
		var dom = opt.dom;
		main = $attr('s_tag','main',dom)[0];
		start = $attr('s_tag','start',dom)[0];
		end = $attr('s_tag','end',dom)[0];
		bar = $attr('s_tag','bar',dom)[0];
		barParent = opt.dom.childNodes[0];
		bindEvent();
		flush();
	}

	//长度，滑动条总偏移，滑动条总长，滑动条边框
	var length = opt.length, barOffset = opt.barOffset, barTotalLen = length - 2 * barOffset, barBorder = opt.barBorder;
	//位移偏差，滑动条起始位置便宜，滑动条长度
	var pixoffset = 0, barStartOffset = 0, barWidth = 0;
	//位置变更标志
	var posChange = false;
	//刷新显示
	function flush() {
		//处理bar位置
		var min = opt.min, max = opt.max, mm = max - min, cur0 = opt.cur[0], cur1 = opt.cur[1], cur0Len = Math.round((cur0 - min) * barTotalLen / mm), cur1Len = Math.round((cur1 - min) * barTotalLen / mm), barLength = cur1Len - cur0Len, barStart = barOffset + cur0Len;
		//判断位置是否发生变更
		if ((barWidth != barLength) || (barStartOffset != barStart + pixoffset)) {
			posChange = true;
		}
		//设置显示
		if (opt.direction == 'x') {
			main.style.width = length + 'px';
			bar.style.width = ( barWidth = barLength) - 2 * barBorder + 'px';
			bar.style.left = ( barStartOffset = barStart + pixoffset) + 'px';
		} else {
			main.style.height = length + 'px';
			bar.style.height = ( barWidth = barLength) - 2 * barBorder + 'px';
			bar.style.top = ( barStartOffset = barStart + pixoffset) + 'px';
		}
		if(cur0==min&&cur1==max){
			opt.autoHide&&$display(opt.dom,'none');
		}else{
			$display(opt.dom,'block');
		}
	}
	
	//设置显示长度 
	function setLength(len){
		var pf=Math.round(pixoffset*len/length);
		length=len;
		barTotalLen = length - 2 * barOffset;
		//重设范围
		setCurRange(opt.cur[0], opt.cur[1], pf)
	}

	//移动像素
	function move(len) {
		//滑动条起始和结束位置

		var bs = barStartOffset - barOffset + len, be = bs + barWidth;
		//单元数量
		var min = opt.min, max = opt.max, mm = max - min;

		if (bs <= 0) {
			//已经移动到最小
			goStart();
			return;
		}
		if (be >= barTotalLen) {
			//已经移动到最大
			goEnd();
			return;
		}
		//起始位置，偏移
		var begin = Math.floor(bs * mm / barTotalLen) + min, end = begin + opt.ps - 1, beginOff = bs - Math.round((begin - min) * barTotalLen / mm);
		if (begin < opt.min) {
			begin = opt.min;
			end = begin + opt.ps - 1;
			beginOff = 0;
		}
		if (end >= opt.max) {
			end = opt.max;
			begin = opt.max - opt.ps + 1;
			beginOff = 0;
		}
		//设置位置
		setCurRange(begin, end, beginOff);
	}

	function moveTo(left) {
		var len = left - barStartOffset + barOffset;
		move(len);
	}

	//设置当前单元范围
	function setCurRange(begin, end, pf) {
		if (begin <= opt.min) {
			begin = opt.min;
		}
		if (end >= opt.max) {
			end = opt.max;
			pf = 0;
		}
		var ps = end - begin + 1;
		if (ps <= 0) {
			//范围不合法
			return;
		}
		opt.ps = ps;
		var newRange = [begin, end];
		//单元变化
		if (begin != opt.cur[0] || end != opt.cur[1]) {
			opt.cur = newRange;
			opt.onUnitRange && opt.onUnitRange(newRange, (begin / opt.max ).toFixed(2));
		}
		if ( typeof pf == 'number') {
			//偏移变化
			if (pf != pixoffset) {
				pixoffset = pf;
				opt.onOffset && opt.onOffset(pf, newRange, (begin / opt.max ).toFixed(2));
			}
		}
		flush();
	}

	//设置全部单元
	function setTotalRange(min, max) {
		opt.min = min;
		opt.max = max;
		flush();
	}

	//开始
	function goStart() {
		setCurRange(opt.min, opt.min + opt.ps - 1, 0);
		if (opt.onMove) {
			opt.onMove(opt.min, opt.ps);
		}
	}

	//结束
	function goEnd() {
		setCurRange(opt.max - opt.ps + 1, opt.max, 0);
		if (opt.onMove) {
			opt.onMove(opt.max - opt.ps, opt.max);
		}
	}

	//鼠标左键状态，鼠标位置
	var mstate = 'up', mpos;

	//按下按钮
	function mouseDown(e) {
		if (mstate == 'up') {
			//更改状态
			mstate = 'down';
			//更改样式
			$addClass(bar, 'slider-bar-cur');
			//绑定document事件
			documentBind();
			//记录初始坐标
			mpos = $getEventCoords(e);
			//开始移动
			opt.onStartMove && opt.onStartMove();
		}
		//且阻止默认行为
		$preventDefault(e);
		return false;
	}

	//放开按钮
	function mouseUp(e) {
		if (mstate == 'down') {
			//更改状态
			mstate = 'up';
			//更改样式
			$delClass(bar, 'slider-bar-cur');
			//释放document事件
			documentRelease();
			//计算鼠标位置
			calculatemPos($getEventCoords(e));
			//释放移动
			opt.onReleaseMove && opt.onReleaseMove();
		}
	}

	//移动
	function mouseMove(e) {
		if (mstate == 'down') {
			//计算鼠标位置
			calculatemPos($getEventCoords(e));
		}
	}

	//计算鼠标位置
	function calculatemPos(curPos) {
		//距离偏移，总距离，当前位置
		var lr, len = opt.length - 2 * opt.barOffset, cur;
		if (opt.direction == 'x') {
			lr = curPos.x - mpos.x;
		} else {
			lr = curPos.y - mpos.y;
		}
		posChange = false;
		move(lr);
		//位置发生变更
		if (posChange) {
			mpos = curPos;
		}
	}

	//绑定事件
	function bindEvent() {
		//到起始页
		start && $bindEvent(start, goStart);
		//到结束页
		end && $bindEvent(end, goEnd);
		$bindEvent(bar, mouseDown, 'mousedown');

		$bindEvent(barParent, barClick, 'click');

	}

	function documentBind() {
		$bindEvent(document.body, mouseMove, 'mousemove');
		$bindEvent(document.body, mouseUp, 'mouseup');
		$bindEvent(document.body, mouseUp, 'mouseleave');
	}

	function documentRelease() {
		$unbindEvent(document.body, mouseMove, 'mousemove');
		$unbindEvent(document.body, mouseUp, 'mouseup');
		$unbindEvent(document.body, mouseUp, 'mouseleave');
	}

	function barClick(ev) {
		var ev = ev || window.event, target = ev.target || ev.srcElement, eventCoords, left, width;
		if (target === bar || target.parentNode === bar) {
			$stopPropagation(ev);
			return false;
		}
		eventCoords = $getEventCoords(ev);
		//当前鼠标位置
		left = $getOffset(bar).left;
		width = bar.offsetWidth;
		move(eventCoords.x - left - width / 2);
	}

	//销毁
	function destroy() {
		//取消事件
		$unbindEvent(bar, mouseDown, 'mousedown');
		if (mstate == 'down') {
			documentRelease();
		}
		opt.dom.innerHTML = '';
	}

	//初始化
	init();

	return {
		/**
		 * 设置当前内容单元范围
		 * @param {Object} begin 内容开始单元
		 * @param {Object} end 内容结束单元
		 * @param {Object} align 对齐单元
		 */
		setCurRange : function(begin, end, align) {
			setCurRange(begin, end, align ? 0 : pixoffset);
		},
		/**
		 * 设置滑动条表示最大最小单元
		 * @param {Object} min
		 * @param {Object} max
		 */
		setTotalRange : function(min, max) {
			setTotalRange(min, max);
		},
		/**
		 * 移动到百分比位置
		 */
		moveTo : function(pencent) {
			var left = barParent.offsetWidth * pencent;
			moveTo(left);
		},
		/**
		 * 设置显示长度
		 */
		setLength:function(length){
			setLength(length);
		},
		/**
		 * 销毁
		 */
		destroy : function() {
			destroy();
		},
		/**
		 * 获取当前状态
		 */
		getState : function() {
			return {
				min : opt.min,
				max : opt.max,
				length : opt.length,
				ps : opt.ps,
				begin : opt.cur[0],
				end : opt.cur[1],
				offset : pixoffset,
				mstate : mstate
			};
		},
		onStartMove:function(cb){
			opt.onStartMove=cb;
		},
		onReleaseMove:function(cb){
			opt.onReleaseMove=cb;
		},
		onUnitRange:function(cb){
			opt.onUnitRange=cb;
		},
		onOffset:function(cb){
			opt.onOffset=cb;
		}
	};
}
/**
 * 阻止事件传播(冒泡)
 * @param {Object} e，事件对象
 */
function $stopPropagation(e) {
	e = e || window.event;
	if (e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}
}
/**
 * 过滤字符串，将不支持的unicode字符去除掉
 * @param {Object} str 要过滤的字符串
 * @param {Object} enableEscape 是否支持html转义字符
 * @param {Object} enableMultiLine 是否支持换行
 */
function $strFilterUnicode(str,enableEscape,enableMultiLine){
	return $map($getCharArray(str,enableEscape),function(c){
		if(c=='\n'&&enableMultiLine){
			return c;
		}
		return c.length>1?c:$isAllowedUnicode(c.charCodeAt(0))?c:'';
	}).join('');
}
/**
 * 过滤字符串，返回HTML可接受的内容，将不支持的标签转义，去除script代码防止xss攻击
 * @param {Object} str 要过滤的字符串
 * @param {Object} allowTags 允许的标签
 * @param {Object} allowML 允许换行
 */
function $strHTMLFilter(str,allowTags,allowML){
	//允许的标签
	allowTags=allowTags||{};
	if($isArray(allowTags)){
		allowTags=$arrReduce(allowTags,function(memo,tag){
			memo[tag]=true;
			return memo;
		},{});
	}
	var newStrArr=[],lastIndex=0;
	//过滤处理所有标签
	str.replace(/<\w+([\s\\\/]+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, function($0,$1){
		//处理内容
		var curIndex=str.indexOf($0);
		var content=str.substring(lastIndex,curIndex);
		newStrArr.push(content.replace('<','&lt;').replace('>','&gt;'));
		lastIndex=curIndex+$0.length;
		//处理标签
		var tag;
		if($0.charAt(1)=='/'){
			tag=$0.substring(2,$0.length-1);
		}else{
			tag=$0.substring(1,$0.length-($1?$1.length:0)-1);
		}
		//标签转小写
		tag=tag.toLowerCase();
		if(!allowTags[tag]){
			//不支持的标签，转换所有尖括号，文本内容不会造成攻击
			newStrArr.push($0.replace(/[<>]/g,function(r){
				return "&#" + r.charCodeAt(0) + ";";
			}));
			return $0;
		}else if($1){
			var atts=[];
			//支持的标签，过滤
			//分析属性组
			var props=$strFilterUnicode($strTrim($1).replace(/[\r\n\f]/g,'').replace(/[<>]/,function(r){
				return "&#" + r.charCodeAt(0) + ";";
			}),true);
			//分析属性
			while(props){
				props=props.replace(/([^\s=]+)(\s*=\s*("[^"]*"|'[^']*')?)?/,function(p,att,eq,val){
					//非法属性，去掉
					if(!/^[\w\._]+$/.test(att)){
						return '';
					}
					//事件
					if(/^on\w+/i.test(att)){
						//事件触发，去掉
						return '';
					}
					//路径
					if(/(src$)|(href$)/i.test(att)){
						if(!val||val.length==2){
							atts.push(att+'=""');
							return '';
						}
						//url规则化
						var info=$parseUrl(val.substring(1,val.length-1));
						if(/^http/i.test(info.protocol)){
							atts.push(att+'="'+info.href+'"');
							return '';
						}
						//非规则url
						return '';
					}
					atts.push(att+'='+(val?val:'""'));
					return '';
				}).replace(/^\s+/,'');
			}
			newStrArr.push($0.substring(0,tag.length+1)+(atts.length?(' '+ atts.join(' ')):'')+'>');
			return $0;
		}else{
			newStrArr.push($0);
			return $0;
		}
	});
	//将所有的非标签内容进行过滤
	if(lastIndex!=str.length-1){
		newStrArr.push(str.substring(lastIndex).replace(/</g,'&lt;').replace(/>/g,'&gt;'));
	}
	//过滤字符
	return $strFilterUnicode(newStrArr.join(''),true,allowML);
}
/**
 * 过滤字符串两边的空白
 * @param {Object} str
 */
function $strTrim(str){
	if(!str){
		return str;
	}
	return str.replace(/(^\s+)|(\s+$)/g,'');
}
function $t33(str) {
	for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
		hash += (hash << 5) + str.charAt(i).charCodeAt();
	};
	return hash & 0x7fffffff;
}
/**
 * 自动处理依赖顺序,处理有依赖关系的多个任务的执行,比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。
 * @param {Object} tasks 任务map,任务名-任务数据对,任务数据是一个数组,数组前几项内容为依赖任务名,最后一项为任务,任务可以为函数或者带有handle函数的对象
 * @param {Object} callback 任务完成回调,可选,callback支持2个参数,错误参数和处理结果.如果有任务中途出错，则会把该错误传给最终callback
 * @param {Object} context 绑定任务函数的this对象,可选
 */
function $taskAuto(tasks, callback, context) {
	callback = callback || function() {};
	var keys = $keys(tasks),remain=keys.length;
	var slice = Array.prototype.slice;
	if (!remain) {
		return callback(null);
	}
	var results = {};
	var listeners = [];
	var addListener = function(fn) {
		listeners.unshift(fn);
	};
	var removeListener = function(fn) {
		for (var i = listeners.length; i--;) {
			if (listeners[i] === fn) {
				listeners.splice(i, 1);
				return;
			}
		}
	};
	var taskComplete = function() {
		$each(listeners.slice(0), function(fn) {
			fn();
		});
	};

	addListener(function() {
		if (callback) {
			if (!remain) {
				var cb=callback;
				callback=null;
				cb(null, results);
			}
		}
	});

	$each(keys, function(k) {
		var task = $isArray(tasks[k]) ? tasks[k] : [tasks[k]], taskFn = task[task.length - 1], taskType = typeof taskFn;
		//任务完成回调
		var taskCallback = $limitCalls(function(err) {
			var args = slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			if (err) {
				if (callback) {
					//任务发生错误,处理以完成的任务,并回调.
					var safeResults = $clone(results);
					safeResults[k] = args;
					var cb=callback;
					callback=null;
					cb(err, safeResults);
				}
			} else {
				remain--;
				//任务完成成功,设置值,并触发完成事件
				results[k] = args;
				taskComplete();
			}
		});
		//任务开始
		var startTask = function() {
			//当前任务开始
			if (taskType == 'function') {
				taskFn.call(context, taskCallback, results);
			} else if (taskType == 'object' && taskFn.handle) {
				taskFn.handle(taskCallback, results);
			} else {
				taskCallback('任务错误,无可用任务');
			}
		};
		var requires = task.slice(0, task.length - 1) || [];
		//检查依赖任务已经准备齐全并且当前任务未开始
		var ready = function() {
			for(var i=requires.length;i--;){
				if(!results.hasOwnProperty(requires[i])){
					return false;
				}
			}
			return !results.hasOwnProperty(k);
		};
		if (ready()) {
			startTask();
		} else {
			//添加任务完成监听器
			var listener = function() {
				if (ready()) {
					//移除监听器,并开始任务
					removeListener(listener);
					startTask();
				}
			};
			addListener(listener);
		}
	});
}
/**
 * 获得一个任务数组的执行迭代器
 * @param {Object} tasks 任务列表,任务为函数或拥有handle执行方法的对象.
 */
function $taskIterator(tasks) {
	var makeCallback = function(index) {
		var fn = function() {
			if (tasks.length) {
				var t=tasks[index],type=typeof t;
				if(type=='function'){
					t.apply(this, arguments);
				}else if(type=='object'&&t.handle){
					t.handle.apply(t,arguments);
				}
			}
			return fn.next();
		};
		fn.next = function() {
			return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
		};
		return fn;
	};
	return makeCallback(0);
}
/**
 * 并行执行多个任务,在所有任务执行完成或某个任务出错后进行回调
 * @param {Array} tasks 任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 * @param {Function} callback 完成所有任务后回调,可选
 * @param {Object} context 绑定任务函数的this对象,可选
 * 
 * 注:任务函数接收一个callback回调函数的参数,该回调函数在任务执行完成后或出错时调用,出错时传入错误信息
 */
function $taskParallel(tasks, callback,context) {
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback=callback||function(){};
	var slice=Array.prototype.slice;
	$asyncMap(tasks,function(fn, callback) {
		var type=typeof fn,cb=function(err) {
			var args = slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			callback.call(null, err, args);
		};
		if(type=='function'){
			fn.call(context, cb);
		}else if(type=='object'&&t.handle){
			fn.handle(cb);
		}
	},callback);
}
/**
 * 顺序执行任务,前一个任务的结果执行完成下一个任务才会开始,提取自async组件
 * @param {Object} tasks,任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 *  任务调用参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用参数第一个参数为错误信息,之后的为当前任务的结果数据
 *  如果调用wrap带有错误信息,那么下一个任务将不会被执行,而会直接调用完成所有任务后的callback回调,并且传入错误信息和已经执行完成的结果
 * @param {Function} callback,完成所有任务后回调,可选
 * @param {Object} context,绑定任务函数的this对象,可选
 */
function $taskSeries(tasks, callback,context) {
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback = callback ||function() {};
	var slice = Array.prototype.slice;
	if ($isArray(tasks)) {
		$asyncMapSeries(tasks, function(fn, callback) {
			if (fn) {
				var type=typeof fn,cb=function(err) {
					var args = slice.call(arguments, 1);
					if (args.length <= 1) {
						args = args[0];
					}
					callback(err, args);
				};
				if(type=='function'){
					fn.call(this, cb);
				}else if(type=='object'&&fn.handle){
					fn.handle(cb);
				}
			}
		}, callback);
	} else {
		var results = {};
		$asyncEachSeries($keys(tasks), function(k, callback) {
			var fn=tasks[k],type=typeof fn,cb=function(err) {
				var args = slice.call(arguments, 1);
				if (args.length <= 1) {
					args = args[0];
				}
				results[k] = args;
				callback(err);
			};
			if(type=='function'){
				fn.call(this, cb);
			}else if(type=='object'&&fn.handle){
				fn.handle(cb);
			}
		}, function(err) {
			callback(err, results);
		});
	}
}
/**
 * 顺序执行任务,前一个任务的结果作为下一个任务的参数,提取自async组件
 * @param {Object} tasks,任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 *  任务调用参数最后一个参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用参数第一个参数为错误信息,之后的为下一个任务接收到的参数
 *  如果调用wrap带有错误信息,那么下一个任务将不会被执行,而会直接调用完成所有任务后的callback回调,并且传入错误信息
 * @param {Function} callback,完成所有任务后回调,可选
 * @param {Object} context,绑定任务函数的this对象,可选
 */
function $taskWaterfall(tasks,callback,context){
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback=callback||function(){};
	if(!$isArray(tasks)){
		var err = new Error('First argument to waterfall must be an array of functions');
		return callback.call(context,err);
	}
	if(!tasks.length){
		return callback.call(context);
	}
	var slice=Array.prototype.slice;
	var wrapIterator = function(iterator) {
		return function(err) {
			if (err) {
				callback.apply(context, arguments);
				callback = function() {};
			} else {
				var args = slice.call(arguments, 1);
				var next = iterator.next();
				if (next) {
					args.push(wrapIterator(next));
				} else {
					args.push(callback);
				}
				setTimeout(function() {
					iterator.apply(context, args);
				});
			}
		};
	};
	wrapIterator($taskIterator(tasks))();
}
function $throttle( fn, _interval ) {		//函数节流，防止onresize事件频繁触发

        var __self = fn,
            timer,
            firstTime = true,
            interval = _interval || 500;

        return function () {

            var args = arguments,
                __me = this;

            if (firstTime) {
                __self.apply(__me, args);
                return firstTime = false;
            }

            if (timer) {
                return false;
            }

            timer = setTimeout(function () {

                clearTimeout(timer);
                timer = null;

                __self.apply(__me, args);

            }, interval);

        };

    }
function $toHTML( str ){
		var r = (str||'').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace( /&amp;/g, "&" ).replace( /&quot;/g, '"' ).replace( /&nbsp;/g, " " ).replace( /&#39;/g, "'" );
		return r;
}
/**
 *将对象转化为json字符串 
 */
function $toJSON(obj) {
	var IS_DONTENUM_BUGGY = (function() {
		for (var p in {toString : 1}) {
			if (p === 'toString')
				return false;
		}
		return true;
	})();
	var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
	var _toString = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty, NULL_TYPE = 'Null', UNDEFINED_TYPE = 'Undefined', BOOLEAN_TYPE = 'Boolean', NUMBER_TYPE = 'Number', STRING_TYPE = 'String', OBJECT_TYPE = 'Object', FUNCTION_CLASS = '[object Function]', BOOLEAN_CLASS = '[object Boolean]', NUMBER_CLASS = '[object Number]', STRING_CLASS = '[object String]', ARRAY_CLASS = '[object Array]', DATE_CLASS = '[object Date]', NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON && typeof JSON.stringify === 'function' && JSON.stringify(0) === '0' && typeof JSON.stringify(function() {}) === 'undefined';
	return Str('', {'' : obj}, []);
	function Type(o) {
		switch(o) {
			case null:
				return NULL_TYPE;
			case (void 0):
				return UNDEFINED_TYPE;
		}
		var type = typeof o;
		switch(type) {
			case 'boolean':
				return BOOLEAN_TYPE;
			case 'number':
				return NUMBER_TYPE;
			case 'string':
				return STRING_TYPE;
		}
		return OBJECT_TYPE;
	}

	function Str(key, holder, stack) {
		var value = holder[key];
		if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}
		var _class = _toString.call(value);
		switch (_class) {
			case NUMBER_CLASS:
			case BOOLEAN_CLASS:
			case STRING_CLASS:
				value = value.valueOf();
		}
		switch (value) {
			case null:
				return 'null';
			case true:
				return 'true';
			case false:
				return 'false';
		}
		var type = typeof value;
		switch (type) {
			case 'string':
				return inspectStr(value, true);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'object':
				for (var i = 0, length = stack.length; i < length; i++) {
					if (stack[i] === value) {
						throw new TypeError("Cyclic reference to '" + value + "' in object");
					}
				}
				stack.push(value);
				var partial = [];
				if (_class === ARRAY_CLASS) {
					for (var i = 0, length = value.length; i < length; i++) {
						var str = Str(i, value, stack);
						partial.push( typeof str === 'undefined' ? 'null' : str);
					}
					partial = '[' + partial.join(',') + ']';
				} else {
					var keys = tokeys(value);
					for (var i = 0, length = keys.length; i < length; i++) {
						var key = keys[i], str = Str(key, value, stack);
						if ( typeof str !== "undefined") {
							partial.push(inspectStr(key,true) + ':' + str);
						}
					}
					partial = '{' + partial.join(',') + '}';
				}
				stack.pop();
				return partial;
		}
	}

	function inspectStr(str, useDoubleQuotes) {
		var specialChar = {
			'\b' : '\\b',
			'\t' : '\\t',
			'\n' : '\\n',
			'\f' : '\\f',
			'\r' : '\\r',
			'\\' : '\\\\'
		};
		var escapedString = str.replace(/[\x00-\x1f\\]/g, function(character) {
			if ( character in specialChar) {
				return specialChar[character];
			}
			return '\\u00' + toPaddedString(character.charCodeAt(), 2, 16);
		});
		if (useDoubleQuotes)
			return '"' + escapedString.replace(/"/g, '\\"') + '"';
		return "'" + escapedString.replace(/'/g, '\\\'') + "'";
	}

	function toPaddedString(num, length, radix) {
		var string = num.toString(radix || 10);
		return times('0', length - string.length) + string;
	}

	function times(str, count) {
		return count < 1 ? '' : new Array(count + 1).join(str);
	}

	function tokeys(object) {
		if (Type(object) !== OBJECT_TYPE) {
			throw new TypeError();
		}
		var results = [];
		for (var property in object) {
			if (_hasOwnProperty.call(object, property))
				results.push(property);
		}
		if (IS_DONTENUM_BUGGY) {
			for (var i = 0; property = DONT_ENUMS[i]; i++) {
				if (_hasOwnProperty.call(object, property))
					results.push(property);
			}
		}
		return results;
	}

}
function $ucfirst(str){
	if(!str){
		return str;
	}
	return str.replace(/^./,function(s){return s.toUpperCase();});
}
function $unbindEvent(dom, handle, type) {
	type=type||'click';
	if (!dom || !handle) {
		return;
	}
	if ( dom instanceof Array) {
		for (var i = 0, l = dom.length; i < l; i++) {
			$unbindEvent(dom[i], handle, type);
		}
		return;
	}
	if ( type instanceof Array) {
		for (var i = 0, l = type.length; i < l; i++) {
			$unbindEvent(dom, handle, type[i]);
		}
		return;
	}
	function find(dom, type, handler) {
		var eid=dom.__eventId;
		if (!eid||!$bindEvent.__allHandlers||!$bindEvent.__allHandlers[eid]||!$bindEvent.__allHandlers[eid][type]) {
			return null;
		}
		var wrapers=$bindEvent.__allHandlers[eid][type];
		for (var i = wrapers.length; i--;) {
			if (wrapers[i].handler == handler) {
				var wrapper = wrapers[i].wrapper;
				wrapers.splice(i,1);
				return wrapper;
			}
		}
		return null;
	}
	if(type=='wheel' || type=='mousewheel'|| type=='DOMMouseScroll'){
		//对wheel,mousewheel,DOMMouseScroll做一致性兼容
		type=( 'onwheel' in document || document.documentMode >= 9 )?'wheel':(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll": "mousewheel";
	}
	if (window.removeEventListener) {
		dom.removeEventListener(type, find(dom, type, handle) || handle, false);
	} else if (window.detachEvent) {
		dom.detachEvent("on" + type, find(dom, type, handle) || handle);
	}
}
/**
 * 
 * 异步的类似于$whilst的操作,但是判断条件是相反的,语义上$whilst是当条件不成立时中断循环,$utile是当条件成立时中断循环
 * @param {Object} test 条件测试函数,测试while条件是否成立
 * @param {Object} iterator 异步执行函数,条件测试为true时调用,传入一个callback的函数参数,当语句执行完成后回调callback表示当前执行完成,执行下一步
 * @param {Object} callback 完成条件循环后进行回调,正常回调时无传入参数,错误时传入一个错误参数
 */
function $until(test, iterator, callback) {
	if (!test()) {
		iterator(function(err) {
			if (err) {
				return callback(err);
			}
			$until(test, iterator, callback);
		});
	} else {
		callback();
	}
}
/**
 * 异步的类似于while的操作,说明可参考$doWhilst
 * @param {Object} test 条件测试函数,测试while条件是否成立
 * @param {Object} iterator 异步执行函数,条件测试为true时调用,传入一个callback的函数参数,当语句执行完成后回调callback表示当前执行完成,执行下一步
 * @param {Object} callback 完成条件循环后进行回调,正常回调时无传入参数,错误时传入一个错误参数
 */
function $whilst(test, iterator, callback) {
	if (test()) {
		iterator(function(err) {
			if (err) {
				return callback(err);
			}
			$whilst(test, iterator, callback);
		});
	} else {
		callback();
	}
}
$Class = function() {

    var create = function(fn, methods, parent) {   //Class.create: 创建一个类，外部调用时只需传入构造函数fn

      fn = fn || function() {};

      var _initialize, _instances = [],
        instance, _unique = 0,
        ret, temp_class = function() {};

      _initialize = function(args) {
        fn.apply(this, args);
      };

      if (parent) {
        temp_class.prototype = parent.prototype;
        _initialize.prototype = new temp_class();
        _initialize.prototype.constructor = _initialize;
        _initialize.prototype.superClass = temp_class.prototype;
      }

      for (var i in methods) {
        _initialize.prototype[i] = methods[i];
      }

      _initialize.prototype.implement = function() {
        var fns = arguments[0].split('.'),
          args = Array.prototype.slice.call(arguments, 1),
          fn = this;
        for (var i = 0, c; c = fns[i++];){
          fn = fn[c];
          if (!fn) {
            throw new Error('接口未实现');
          }
        }
        return fn.apply(this, args);
      };

      var getInstance = function() {   //获取类的一个实例对象
        var args = Array.prototype.slice.call(arguments, 0),
          __instance = new _initialize(args);

        __instance.constructor = ret;

        _instances[_unique++] = __instance;

        return _instances[_unique - 1];
      };

      var empty = function() {  //销毁类的所有实例对象

        for (var i = 0, c; c = _instances[i++];) {
          c = null;
        }
        _instances = [];
        _instances.length = 0;
        _unique = 0;
      };

      var getCount = function() { //返回类的实例对象个数
        return _unique;
      };

      var getPrototype = function() {  //返回类的prototype
        return _initialize.prototype;
      };

      var sub = function(fn, methods) {  //创建类的子类
        var a = $Class.create(fn, methods, _initialize);
        return a;
      };

      var interface = function(key, fn, a) {  //给类添加原型函数

        if (!_initialize) {
          return;
        }

        var keys = key.split('.'),
          __proto = _initialize.prototype,
          last_key = keys.pop(),
          __namespace;

        if (keys.length) {
          __namespace = keys[0];

          if (!_initialize.prototype.hasOwnProperty(__namespace)) {
            _initialize.prototype[__namespace] = {};
          }

          _initialize.prototype[__namespace][last_key] = fn;

        } else {
          _initialize.prototype[last_key] = fn;
        }

      };

      ret = {
        interface: interface,   //给类添加原型方法
        getInstance: getInstance,  //获取类的实例对象
        getInstances: function() {  //获取类的所有实例，返回数组格式
          return _instances;
        },
        empty: empty,   //销毁类的所有实例
        getCount: getCount,  //获取类的所有实例个数
        getPrototype: getPrototype,  //获取类的prototype
        sub: sub,   //创建类的一个子类
        initialize: _initialize //已废弃，待删
      };

      return ret;

    };

    return {
      create: create    //创建一个类
    };
  }();
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
				var event = this.create( );
				event.listen( key, fn, last );
			},
			trigger: function(){
				var event = this.create( );
				event.trigger.apply( this, arguments );
			}
		};

	}();
	
	return Event;


})();
$LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage";

        return {

            save: function ( key, data ) {

                if ( storage && data) {
                    storage.setItem( key, data  );
                    return true;
                }

                return false;

            },

            get: function ( key ) {

                if ( storage ) {
                    return storage.getItem( key );
                }

                return null;

            },

            remove: function ( key ) {

                storage && storage.removeItem( key );

            }

        };

        function getUserData () {

            var container = document.createElement( "div" );
            container.style.display = "none";

            if( !container.addBehavior ) {
                return null;
            }

            container.addBehavior("#default#userdata");

            return {

                getItem: function ( key ) {

                    var result = null;

                    try {
                        document.body.appendChild( container );
                        container.load( LOCAL_FILE );
                        result = container.getAttribute( key );
                        document.body.removeChild( container );
                    } catch ( e ) {
                    }

                    return result;

                },

                setItem: function ( key, value ) {

                    document.body.appendChild( container );
                    container.setAttribute( key, value );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                },
//               暂时没有用到
//                clear: function () {
//
//                    var expiresTime = new Date();
//                    expiresTime.setFullYear( expiresTime.getFullYear() - 1 );
//                    document.body.appendChild( container );
//                    container.expires = expiresTime.toUTCString();
//                    container.save( LOCAL_FILE );
//                    document.body.removeChild( container );
//
//                },

                removeItem: function ( key ) {

                    document.body.appendChild( container );
                    container.removeAttribute( key );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                }

            };

        }

    } )();
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
						iframe = document.createElement( '<iframe src="http://www.iuni.com/set_domain.html" name='+ timer +'></iframe>' );
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
						input = create( 'input', {
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
							clearTimeout( timer );
							window[ callbackName ] = function(){};
							removeNode( __form );
							removeNode( iframe );
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

					

				});

			};


			Request.prototype.stop = function(){
				this._request && this._request.stop();
			};

                        document.domain = 'iuni.com'


			
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
$break = (function() {
	return 'undefined' === typeof $break ? function(t) {
		return t === $break;
	} : $break;
})();
var $domAttr = (function() {
    var fixAttr = {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        maxlength: 'maxLength',
        cellspacing: 'cellSpacing',
        cellpadding: 'cellPadding',
        rowspan: 'rowSpan',
        colspan: 'colSpan',
        usemap: 'useMap',
        frameborder: 'frameBorder',
        contenteditable: 'contentEditable'
    },
    suppor,
    div = document.createElement( 'div' );  

    div.setAttribute('class', 't');     
    suppor = div.className === 't';
    div = null;
    return function(elem, name, val) {
            elem[val ? "setAttribute" : "getAttribute"](suppor ? name : (fixAttr[name] || name), val);
    }
})();
/**
 * 规范化事件
 * @param {event} event 原始事件
 */
var $eventNormalize = (function() {
	function returnFalse() {
		return false;
	}

	function returnTrue() {
		return true;
	}

	var EventWrap = function(src, props) {
		// Allow instantiation without the 'new' keyword
		if (!(this instanceof EventWrap)) {
			return new EventWrap(src, props);
		}
		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
			// Event type
		} else {
			this.type = src;
		}
		// Put explicitly provided properties onto the event object
		if (props) {
			$extend(this, props);
		}
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || new Date().getTime();
	};
	EventWrap.prototype = {
		isDefaultPrevented : returnFalse,
		isPropagationStopped : returnFalse,
		isImmediatePropagationStopped : returnFalse,
		preventDefault : function() {
			var e = this.originalEvent;
			this.isDefaultPrevented = returnFalse;
			if (!e) {
				return;
			}
			// If preventDefault exists, run it on the original event
			if (e.preventDefault) {
				e.preventDefault();
				// Support: IE
				// Otherwise set the returnValue property of the original event to false
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation : function() {
			var e = this.originalEvent;
			this.isPropagationStopped = returnFalse;
			if (!e) {
				return;
			}
			// If stopPropagation exists, run it on the original event
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			// Support: IE
			// Set the cancelBubble property of the original event to true
			e.cancelBubble = true;
		},
		stopImmediatePropagation : function() {
			this.isImmediatePropagationStopped = returnFalse;
			this.stopPropagation();
		}
	};
	var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/;
	var props = "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" ");
	var fixHooks = {};
	var keyHooks = {
		props : "char charCode key keyCode".split(" "),
		filter : function(event, original) {
			// Add which for key events
			if (event.which == null) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}
			return event;
		}
	}, mouseHooks = {
		props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter : function(event, original) {
			var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
			// Calculate pageX/Y if missing and clientX/Y available
			if (event.pageX == null && original.clientX != null) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;
				event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - (doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0 ) - (doc && doc.clientTop || body && body.clientTop || 0 );
			}
			// Add relatedTarget, if necessary
			if (!event.relatedTarget && fromElement) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}
			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if (!event.which && button !== undefined) {
				event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0 ) ) );
			}
			return event;
		}
	};
	var special = {};
	//fix mousewheel
	fixHooks.wheel = fixHooks.mousewheel = fixHooks.DOMMouseScroll = mouseHooks;
	//hook
	var lowestDelta;
	function shouldAdjustOldDeltas(original, absDelta) {
		return original.type === 'mousewheel' && absDelta % 120 === 0;
	}
	special.wheel = special.mousewheel = special.DOMMouseScroll = function(event, original) {
		var delta = 0, deltaX = 0, deltaY = 0, absDelta = 0;
		//fixed type
		event.type = 'mousewheel';
		//fixed delta
		if ('detail' in original) {
			deltaY = original.detail * -1;
		}
		if ('wheelDelta' in original) {
			deltaY = original.wheelDelta;
		}
		if ('wheelDeltaY' in original) {
			deltaY = original.wheelDeltaY;
		}
		if ('wheelDeltaX' in original) {
			deltaX = original.wheelDeltaX * -1;
		}
		// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
		if ('axis' in original && original.axis === original.HORIZONTAL_AXIS) {
			deltaX = deltaY * -1;
			deltaY = 0;
		}
		// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
		delta = deltaY === 0 ? deltaX : deltaY;
		// New school wheel delta (wheel event)
		if ('deltaY' in original) {
			deltaY = original.deltaY * -1;
			delta = deltaY;
		}
		if ('deltaX' in original) {
			deltaX = original.deltaX;
			if (deltaY === 0) {
				delta = deltaX * -1;
			}
		}
		// Store lowest absolute delta to normalize the delta values
		absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
		if (!lowestDelta || absDelta < lowestDelta) {
			lowestDelta = absDelta;
			// Adjust older deltas if necessary
			if (shouldAdjustOldDeltas(original, absDelta)) {
				lowestDelta /= 40;
			}
		}
		// Adjust older deltas if necessary
		if (shouldAdjustOldDeltas(original, absDelta)) {
			// Divide all the things by 40!
			delta /= 40;
			deltaX /= 40;
			deltaY /= 40;
		}
		// Get a whole, normalized value for the deltas
		delta = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta / lowestDelta);
		deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
		deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);
		// Add information to the event object
		event.deltaX = deltaX;
		event.deltaY = deltaY;
		event.delta = delta;
		return event;
	};

	var eventNormalize = function(event) {
		if ( event instanceof EventWrap) {
			return event;
		}
		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy, type = event.type, originalEvent = event, fixHook = fixHooks[type];
		if (!fixHook) {
			fixHooks[type] = fixHook = rmouseEvent.test(type) ? mouseHooks : rkeyEvent.test(type) ? keyHooks : {};
		}
		copy = fixHook.props ? props.concat(fixHook.props) : props;
		event = new EventWrap(originalEvent);

		i = copy.length;
		while (i--) {
			prop = copy[i];
			event[prop] = originalEvent[prop];
		}
		// Support: IE<9
		// Fix target property (#1925)
		if (!event.target) {
			event.target = originalEvent.srcElement || document;
		}
		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if (event.target.nodeType === 3) {
			event.target = event.target.parentNode;
		}
		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;
		event=fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		event=special[type] ? special[type](event, originalEvent) : event;
		return event;
	};
	return eventNormalize;
})();
var $getTpl = (function() {
	function a(h, g) {
		h = h.replace(/[\n\r]/g, "");
		var d = h.match(/<!--(.*?)\/\*(.*?)\*\/(.*?)\1-->/gi);
		var c = {};
		if (!d) {
			return [];
		}
		for (var f = 0; f < d.length; f++) {
			var e = d[f].match(/^<!--(.*?)\/\*(.*?)\*\/(.*?)\1-->$/i);
			c[e[1]] = e[3].replace(/^\s*/, "").replace(/\d*$/, "");
		}
		return c;
	}
	return function(d) {
		var b = $id("tpl_" + d);
		var c = a( b ? b.innerHTML : "", true);
		return c;
	};
})();
var $hex_md5 = (function(){

var hexcase=0;function hex_md5(a){ if(a=="") return a; return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};
	
	return hex_md5;

})();
/**
 * 判断是否系统允许的unicode字符
 */
var $isAllowedUnicode=(function (){
		//entity code范围，控制在主要编码范围内
	var entitiesRange=[
//--		0x0000,0x007F,//C0控制符及基本拉丁文 (C0 Control and Basic Latin)
		0x0020,0x007E,

//--		0x0080,0x00FF,//C1控制符及拉丁文补充-1 (C1 Control and Latin 1 Supplement)
		0x00A1,0x00AC,
		0x00AE,0x00FF,

		0x0100,0x017F,//拉丁文扩展-A (Latin Extended-A)
		0x0180,0x024F,//拉丁文扩展-B (Latin Extended-B)
//		0x0250,0x02AF,//国际音标扩展 (IPA Extensions)
//		0x02B0,0x02FF,//空白修饰字母 (Spacing Modifiers)
//		0x0300,0x036F,//结合用读音符号 (Combining Diacritics Marks)
//		0x0370,0x03FF,//希腊文及科普特文 (Greek and Coptic)
//		0x0400,0x04FF,//西里尔字母(Cyrillic)
//		0x0500,0x052F,//西里尔字母补充 (Cyrillic Supplement)
//		0x0530,0x058F,//亚美尼亚语 (Armenian)
//		0x0590,0x05FF,//希伯来文 (Hebrew)
//		0x0600,0x06FF,//阿拉伯文 (Arabic)
//		0x0700,0x074F,//叙利亚文 (Syriac)
//		0x0750,0x077F,//阿拉伯文补充 (Arabic Supplement)
//		0x0780,0x07BF,//马尔代夫语 (Thaana)
//		0x07C0,0x077F,//西非书面语言 (N'Ko)
//		0x0800,0x085F,//阿维斯塔语及巴列维语(Avestan and Pahlavi)
//		0x0860,0x087F,//Mandaic
//		0x0880,0x08AF,//撒马利亚语 (Samaritan)
//		0x0900,0x097F,//天城文书 (Devanagari)
//		0x0980,0x09FF,//孟加拉语 (Bengali)
//		0x0A00,0x0A7F,//锡克教文 (Gurmukhi)
//		0x0A80,0x0AFF,//古吉拉特文 (Gujarati)
//		0x0B00,0x0B7F,//奥里亚文 (Oriya)
//		0x0B80,0x0BFF,//泰米尔文 (Tamil)
//		0x0C00,0x0C7F,//泰卢固文 (Telugu)
//		0x0C80,0x0CFF,//卡纳达文 (Kannada)
//		0x0D00,0x0D7F,//德拉维族语 (Malayalam)
//		0x0D80,0x0DFF,//僧伽罗语 (Sinhala)
//		0x0E00,0x0E7F,//泰文 (Thai)
//		0x0E80,0x0EFF,//老挝文 (Lao)
//		0x0F00,0x0FFF,//藏文 (Tibetan)
//		0x1000,0x109F,//缅甸语 (Myanmar)
//		0x10A0,0x10FF,//格鲁吉亚语(Georgian)
//		0x1100,0x11FF,//朝鲜文 (Hangul Jamo)
//		0x1200,0x137F,//埃塞俄比亚语 (Ethiopic)
//		0x1380,0x139F,//埃塞俄比亚语补充 (Ethiopic Supplement)
//		0x13A0,0x13FF,//切罗基语 (Cherokee)
//		0x1400,0x167F,//统一加拿大土著语音节 (Unified Canadian Aboriginal Syllabics)
//		0x1680,0x169F,//欧甘字母 (Ogham)
//		0x16A0,0x16FF,//如尼文(Runic)
//		0x1700,0x171F,//塔加拉语 (Tagalog)
//		0x1720,0x173F,//Hanunóo
//		0x1740,0x175F,//Buhid
//		0x1760,0x177F,//Tagbanwa
//		0x1780,0x17FF,//高棉语 (Khmer)
//		0x1800,0x18AF,//蒙古文 (Mongolian)
//		0x18B0,0x18FF,//Cham
//		0x1900,0x194F,//Limbu
//		0x1950,0x197F,//德宏泰语 (Tai Le)
//		0x1980,0x19DF,//新傣仂语 (New Tai Lue)
//		0x19E0,0x19FF,//高棉语记号 (Kmer Symbols)
//		0x1A00,0x1A1F,//Buginese
//		0x1A20,0x1A5F,//Batak
//		0x1A80,0x1AEF,//Lanna
//		0x1B00,0x1B7F,//巴厘语 (Balinese)
//		0x1B80,0x1BB0,//巽他语 (Sundanese)
//		0x1BC0,0x1BFF,//Pahawh Hmong
//		0x1C00,0x1C4F,//雷布查语(Lepcha)
//		0x1C50,0x1C7F,//Ol Chiki
//		0x1C80,0x1CDF,//曼尼普尔语(Meithei/Manipuri)
//		0x1D00,0x1D7F,//语音学扩展 (Phonetic Extensions)
//		0x1D80,0x1DBF,//语音学扩展补充 (Phonetic Extensions Supplem
//		0x1DC0,0x1DFF,//结合用读音符号补充 (Combining Diacritics Marks Supplement)
//		0x1E00,0x1EFF,//拉丁文扩充附加 (Latin Extended Additional)
//		0x1F00,0x1FFF,//希腊语扩充 (Greek Extended)
//--		0x2000,0x206F,//常用标点(General Punctuation)
		0x2010,0x2010,
		0x2012,0x2027,
		0x2030,0x205E,

//		0x2070,0x209F,//上标及下标 (Superscripts and Subscripts)
//		0x20A0,0x20CF,//货币符号 (Currency Symbols)
//		0x20D0,0x20FF,//组合用记号 (Combining Diacritics Marks for Symbols)
//		0x2100,0x214F,//字母式符号 (Letterlike Symbols)
//		0x2150,0x218F,//数字形式 (Number Form)
//		0x2190,0x21FF,//箭头 (Arrows)
//		0x2200,0x22FF,//数学运算符 (Mathematical Operator)
//		0x2300,0x23FF,//杂项工业符号 (Miscellaneous Technical)
//		0x2400,0x243F,//控制图片 (Control Pictures)
//		0x2440,0x245F,//光学识别符 (Optical Character Recognition)
//		0x2460,0x24FF,//封闭式字母数字 (Enclosed Alphanumerics)
//		0x2500,0x257F,//制表符 (Box Drawing)
//		0x2580,0x259F,//方块元素 (Block Element)
//		0x25A0,0x25FF,//几何图形 (Geometric Shapes)
//		0x2600,0x26FF,//杂项符号 (Miscellaneous Symbols)
//		0x2700,0x27BF,//印刷符号 (Dingbats)
//		0x27C0,0x27EF,//杂项数学符号-A (Miscellaneous Mathematical Symbols-A)
//		0x27F0,0x27FF,//追加箭头-A (Supplemental Arrows-A)
//		0x2800,0x28FF,//盲文点字模型 (Braille Patterns)
//		0x2900,0x297F,//追加箭头-B (Supplemental Arrows-B)
//		0x2980,0x29FF,//杂项数学符号-B (Miscellaneous Mathematical Symbols-B)
//		0x2A00,0x2AFF,//追加数学运算符 (Supplemental Mathematical Operator)
//		0x2B00,0x2BFF,//杂项符号和箭头 (Miscellaneous Symbols and Arrows)
//		0x2C00,0x2C5F,//格拉哥里字母(Glagolitic)
//		0x2C60,0x2C7F,//拉丁文扩展-C (Latin Extended-C)
//		0x2C80,0x2CFF,//古埃及语 (Coptic)
//		0x2D00,0x2D2F,//格鲁吉亚语补充 (Georgian Supplement)
//		0x2D30,0x2D7F,//提非纳文 (Tifinagh)
//		0x2D80,0x2DDF,//埃塞俄比亚语扩展 (Ethiopic Extended)
//		0x2E00,0x2E7F,//追加标点 (Supplemental Punctuation)
		0x2E80,0x2EFF,//CJK 部首补充 (CJK Radicals Supplement)
		0x2F00,0x2FDF,//康熙字典部首 (Kangxi Radicals)
		0x2FF0,0x2FFF,//表意文字描述符 (Ideographic Description Characters)
		0x3000,0x303F,//CJK 符号和标点 (CJK Symbols and Punctuation)
		0x3040,0x309F,//日文平假名 (Hiragana)
		0x30A0,0x30FF,//日文片假名 (Katakana)
		0x3100,0x312F,//注音字母 (Bopomofo)
		0x3130,0x318F,//朝鲜文兼容字母 (Hangul Compatibility Jamo)
		0x3190,0x319F,//象形字注释标志 (Kanbun)
		0x31A0,0x31BF,//注音字母扩展 (Bopomofo Extended)
		0x31C0,0x31EF,//CJK 笔画 (CJK Strokes)
		0x31F0,0x31FF,//日文片假名语音扩展 (Katakana Phonetic Extensions)
		0x3200,0x32FF,//封闭式 CJK 文字和月份 (Enclosed CJK Letters and Months)
		0x3300,0x33FF,//CJK 兼容 (CJK Compatibility)
		0x3400,0x4DBF,//CJK 统一表意符号扩展 A (CJK Unified Ideographs Extension A)
		0x4DC0,0x4DFF,//易经六十四卦符号 (Yijing Hexagrams Symbols)
		0x4E00,0x9FBF,//CJK 统一表意符号 (CJK Unified Ideographs)
//		0xA000,0xA48F,//彝文音节 (Yi Syllables)
//		0xA490,0xA4CF,//彝文字根 (Yi Radicals)
//		0xA500,0xA61F,//Vai
//		0xA660,0xA6FF,//统一加拿大土著语音节补充 (Unified Canadian Aboriginal Syllabics Supplement)
//		0xA700,0xA71F,//声调修饰字母 (Modifier Tone Letters)
//		0xA720,0xA7FF,//拉丁文扩展-D (Latin Extended-D)
//		0xA800,0xA82F,//Syloti Nagri
//		0xA840,0xA87F,//八思巴字 (Phags-pa)
//		0xA880,0xA8DF,//Saurashtra
//		0xA900,0xA97F,//爪哇语 (Javanese)
//		0xA980,0xA9DF,//Chakma
//		0xAA00,0xAA3F,//Varang Kshiti
//		0xAA40,0xAA6F,//Sorang Sompeng
//		0xAA80,0xAADF,//Newari
//		0xAB00,0xAB5F,//越南傣语 (Vi?t Thái)
//		0xAB80,0xABA0,//Kayah Li
//		0xAC00,0xD7AF,//朝鲜文音节 (Hangul Syllables)
//		0xD800,0xDBFF,//High-half zone of UTF-16
//		0xDC00,0xDFFF,//Low-half zone of UTF-16
//		0xE000,0xF8FF,//自行使用区域 (Private Use Zone)
		0xF900,0xFAFF,//CJK 兼容象形文字 (CJK Compatibility Ideographs)
//		0xFB00,0xFB4F,//字母表达形式 (Alphabetic Presentation Form)
//		0xFB50,0xFDFF,//阿拉伯表达形式A (Arabic Presentation Form-A)
//		0xFE00,0xFE0F,//变量选择符 (Variation Selector)
//		0xFE10,0xFE1F,//竖排形式 (Vertical Forms)
//		0xFE20,0xFE2F,//组合用半符号 (Combining Half Marks)
		0xFE30,0xFE4F,//CJK 兼容形式 (CJK Compatibility Forms)
//		0xFE50,0xFE6F,//小型变体形式 (Small Form Variants)
//		0xFE70,0xFEFF,//阿拉伯表达形式B (Arabic Presentation Form-B)
		0xFF00,0xFFEF,//半型及全型形式 (Halfwidth and Fullwidth Form)
//		0xFFF0,0xFFFF,//特殊 (Specials)
		null
	];
	entitiesRange.pop();
	//排序控制，可省略
	entitiesRange.sort(function(a,b){return a<b?-1:a==b?0:1});
	var len=entitiesRange.length;
	return function(code){
		for(var i=0;i<len;i++){
			if(entitiesRange[i]>=code){
				return entitiesRange[i]==code?true:i%2==1;
			}
		}
		return false;
	};
})();
$len = (function(){

	var getLength = function( str ){	
  		var a = str.length , b = str.match(/[^\x00-\x80]/ig);
 		if( b != null ) a += b.length * 1;
  		return a;
	}

	return function( str, length ){
		var len = getLength( str );

		if ( len > length + 3 ){
			return $toHTML( str.substr( 0, length ) +  '...' );
		}

                return str;
 
	}

})();
$micro_tmpl = (function(){
  var cache = {},
    toHTML = function( str ){
      return str.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace( /&amp;/g, "&" ).replace( /&quot;/g, '"' ).replace( /&nbsp;/g, " " ).replace( /&#39;/g, "'" );
    };
  var micro_tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var str = toHTML( document.getElementById( str ).innerHTML );
    var data = data || {};
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

  return micro_tmpl;
})();
/**
 * 消息组件，提供addListener,removeListener,send三个方法
 * 
 * $msg.addListener(type,callback); 添加消息监听
 * 参数说明：type:消息类型，字符串，也可以为多个类型值的数组，表示一次监听多个消息类型。callback:监听消息回调。支持2个参数:msg(消息)，type(消息类型);
 * $msg.removeListener(type,callback); 移除消息监听
 * 参数说明：type:消息类型，字符串，也可以为多个类型值的数组，表示一次取消监听多个消息类型。callback:监听消息回调。
 * $msg.send(type,msg);发送消息
 * 参数说明：type:消息类型，字符串，也可以为多个类型值的数组，表示一次发送多个消息类型。msg:消息体
 */
$msg = (function() {
	if ( typeof $msg == "object") {
		return $msg;
	}
	
	function run(param, call) {
		if ( param instanceof Array) {
			for (var i = param.length; i--; ) {
				call(param[i]);
			}
			return;
		}
		param && call(param);
	}


	msg = {
		listener:null,
		types:{},
		addListener : function(type, callback) {
			var tps = this.types;
			callback && run(type, function(t) {
				tps[type] = $arrAddUniq(tps[t], callback);
			});
		},
		removeListener : function(type, callback) {
			var tps = this.types;
			callback && run(type, function(t) {
				tps[t] && $arrRemove(tps[t], callback);
			});
		},
		send : function(type, msg) {
			var tps = this.types;
			var error = [];
			run(type, function(t) {
				var tq = tps[t];
				if (tq) {
					$each(tq.slice(), function(callback) {
						try {
							callback(msg,t);
						} catch(e) {
							error.push(e)
						};
					});
				}
			});
			if (error && error.length > 0) {
				//错误
				window.setTimeout(function() {throw error;});
			}
		}
	};
	return msg;
})();
/**
 * 判断字符串是否HTML转义字符
 */
var $isEscapeSequense = (function() {
	//转义实体
	var entities = {
		'quot' : 34,
		'amp' : 38,
		'lt' : 60,
		'gt' : 62,
		'nbsp' : 160,
		'iexcl' : 161,
		'cent' : 162,
		'pound' : 163,
		'curren' : 164,
		'yen' : 165,
		'brvbar' : 166,
		'sect' : 167,
		'uml' : 168,
		'copy' : 169,
		'ordf' : 170,
		'laquo' : 171,
		'not' : 172,
		'reg' : 174,
		'macr' : 175,
		'deg' : 176,
		'plusmn' : 177,
		'sup2' : 178,
		'sup3' : 179,
		'actue' : 180,
		'micro' : 181,
		'para' : 182,
		'middot' : 183,
		'cedil' : 184,
		'sup1' : 185,
		'ordm' : 186,
		'raquo' : 187,
		'frac14' : 188,
		'frac12' : 189,
		'frac34' : 190,
		'iquest' : 191,
		'Agrave' : 192,
		'Aacute' : 193,
		'Acirc' : 194,
		'Atilde' : 195,
		'Auml' : 196,
		'Aring' : 197,
		'AElig' : 198,
		'Ccedil' : 199,
		'Egrave' : 200,
		'Eacute' : 201,
		'Ecirc' : 202,
		'Euml' : 203,
		'Igrave' : 204,
		'Iacute' : 205,
		'Icirc' : 206,
		'Iuml' : 207,
		'ETH' : 208,
		'Ntilde' : 209,
		'Ograve' : 210,
		'Oactue' : 211,
		'Ocirc' : 212,
		'Otilde' : 213,
		'Ouml' : 214,
		'times' : 215,
		'Oslash' : 216,
		'Ugrave' : 217,
		'Uacute' : 218,
		'Ucirc' : 219,
		'Uuml' : 220,
		'Yacute' : 221,
		'THORN' : 222,
		'szlig' : 223,
		'agrave' : 224,
		'aacute' : 225,
		'acirc' : 226,
		'atilde' : 227,
		'auml' : 228,
		'aring' : 229,
		'aelig' : 230,
		'ccedil' : 231,
		'egrave' : 232,
		'eacute' : 233,
		'ecirc' : 234,
		'euml' : 235,
		'igrave' : 236,
		'iacute' : 237,
		'icirc' : 238,
		'iuml' : 239,
		'eth' : 240,
		'ntilde' : 241,
		'ograve' : 242,
		'oacute' : 243,
		'ocirc' : 244,
		'otilde' : 245,
		'ouml' : 246,
		'divide' : 247,
		'oslash' : 248,
		'ugrave' : 249,
		'uactue' : 250,
		'ucirc' : 251,
		'uuml' : 252,
		'yacute' : 253,
		'thorn' : 254,
		'yuml' : 255
	};
	return function(str) {
		if (str.match(/^&(#(\d+)|([a-z0-9]+));$/i)) {
			var isNum = false, code;
			if (RegExp.$2) {
				code = parseInt(RegExp.$2);
				isNum = true;
			} else {
				code = RegExp.$3;
			}
			if (isNum) {
				return $isAllowedUnicode(code) ? code : false;
			} else {
				return entities[code] || false;
			}
		}
		return false;
	};
})();
/**
 * 获取合适尺寸的用户头像url
 * @param {Object} url 用户头像url
 * @param {Object} type 尺寸：small，middle，big
 */
function $iuni_getAvatar(url,type){
	var no_avatar='http://static.iuniimg.com/img/no_avatar_small.jpg'
	if(!url){
		url=no_avatar;
	}
	return url.replace(/avatar_\w*\.(\w+)$/, "avatar_"+type+".$1");
}
//分页
function $iuni_pagination(ops){
	if( !ops || !ops.pageCon ){
		return;
	}

	var maxPage = ops.maxPage || 0,//总页数
		displayPage = ops.displayPage || 4,//连续显示的主体页数
		currPage = ops.currPage || 1,//当前页
		currPageClass = ops.currPageClass || "thispage",
		pageCon = document.getElementById(ops.pageCon),//翻页按钮所在容器
		callback = ops.callback;
	//初始化翻页按钮
	makeBtn(currPage);

	//绑定容器事件,监听按钮点击
	$bindEvent(pageCon , function(e){

		var target = e.target || e.srcElement,
			role = target.getAttribute("data-role");

		if(target.nodeName.toLowerCase() === "a"){
			var _pnum = parseInt(target.innerHTML),
				_page = _pnum;

			if( isNaN( _pnum ) ){//不是页码
				_page = role === "prev" ? (currPage === 1 ? 1 : currPage - 1) : 
					( role === "next" ? (currPage === maxPage ? maxPage : currPage + 1) :
						null );
			}

			selectPage( _page , target );
		}
		return false;
	} , "click");


	//获得显示的区间
	function getInterval( page ){

		var start , end , _dp = displayPage , _mp = maxPage;

		if( _mp - 2 < _dp ){
			start = 2;
			end = _mp - 1;
		}
		else if( page < _dp ){
			start = 2;
			end = _dp;
		}else if( page > (_mp - _dp) ){
			start = _mp - _dp;
			end = _mp - 1;
		}else{
			start = page - Math.ceil((_dp - 1)/2);
			end = page + Math.floor((_dp - 1)/2)
		}

		return [start , end];
	}

	//创建翻页按钮
	function makeBtn( page ){
		if( maxPage < 2 ){return}

		var interval = getInterval(page) , i = interval[0],
			len = interval[1] + 1,
			btns ,
			strRes = '<a href="javascript:;" data-role = "prev" class="pre"></a><a href="javascript:;">1</a>${interval}<a href="javascript:;">'+maxPage+'</a><a href="javascript:;" data-role = "next" class="next"></a>',
			strInter = '',
			strBtn = '<a href="javascript:;">${num}</a>',
			strDopts = '<a href="javascript:;">...</a>';
		for( ; i < len ; i++){
			strInter += strBtn.replace("${num}",i);
		}
		if( interval[0] !== 2 ){
			strInter = strDopts + strInter;
		}
		if( interval[1] !== maxPage -1 ){
			strInter = strInter + strDopts;
		}

		strRes = strRes.replace("${interval}" , strInter);
		pageCon.innerHTML = strRes;
		btns = pageCon.childNodes;
		for(var i = 0 , len = btns.length , item; i < len ; i++){
			item = btns[i];
			if(item.innerHTML == page){
				$domAttr( item , "class" , currPageClass );
				break;
			}
		}
		//首页或尾页时隐藏翻页按钮
		if( maxPage > 1 && ( page === 1 || page === maxPage ) ){
			btns[ page === 1? 0 : btns.length -1 ].style.visibility = "hidden";
		}

	}

	//选择页
	function selectPage(page , elem){
		if( page === currPage || !page  || page < 1 || page > maxPage){return}
		currPage = page;
		makeBtn(page);
		callback && callback(page , elem);
	}

	//设置总页数
	function setMaxPage( mp ){
		maxPage = mp || 1;		
		makeBtn(currPage);
	}

	function getCurrPage(){
		return currPage;
	}

	//返回对象接口
	return {
		setMaxPage : setMaxPage,
		selectPage : selectPage,
		getCurrPage : getCurrPage
	};
};
/**
 * 解析bbcode
 * @param text,要解析的文章文本
 * @param customCodes,自定义标签定义对象
 */
function $iuni_parseBBcode(text,customCodes){
	if(!$iuni_parseBBcode.feature_split_normal){
		$iuni_parseBBcode.feature_split_normal='1,2'.split(/(,)/g).length==3;
	}
	customCodes=customCodes||{};
	//转换html标签包围符号<>
	text=text.replace(/[<>\t]/ig,function($0){
		return {
			'<':'&lt;',
			'>':'&gt;',
			'\t':'    '//转换制表符\t为4个空格
		}[$0];
	});
	//统一换行符,\r\n->\n(windows),\r->\n(apple),\n\r->\n(未知)
	text=text.replace(/(\r\n)|(\n\r)|(\r)/g,'\n');
	//去除控制转义字符
	text=text.replace(/[\r\f\v\b]/g,'');
	//根据bbcode切分
	var reg=/\[(\w+)(=[^ \f\n\r\t\v\[\]]*)?\]([^\[\]]*)\[\/\1\]/g,arr=text.split(reg);
	//IE7及以下版本 String.prototype.split 正则bug
	if(!$iuni_parseBBcode.feature_split_normal){
		var __bugfixed0=0;
		$each(text.match(reg)||[],function(bbcode,i){
			var fl=bbcode.indexOf(']'),tag=bbcode.substring(1,fl),code2,tag,eq,t,eqIndex,insertIndex;
			if((eqIndex=tag.indexOf('='))!=-1){
				eq=tag.substring(eqIndex);
				tag=tag.substring(0,eqIndex);
			}
			t=bbcode.substring(fl+1,bbcode.length-(tag.length+3));
			if((typeof arr[i*4]=='undefined')||(arr[i*4]!=text.substring(__bugfixed0,__bugfixed0+arr[i*4].length))){
				//补齐空缺，bug，空内容会被忽略
				arr.splice(i*4,0,'');
			}
			insertIndex=i*4+1;
			__bugfixed0+=arr[i*4].length+bbcode.length;
			arr.splice(insertIndex,0,tag,eq,t);
		});
	}
	//允许的bbcode
	var allowedBBcode={
		//img标签解析
		img:function(arg,data){
			if(!arg){
				return false;
			}
			arg=arg.replace(/\s+/g,'');
			//尺寸
			if(!arg.match(/^(\d+\*\d+;)*(\d+\*\d+);?$/)){
				return false;
			}
			var sizes=$map(arg.split(';'),function(s,i){
				if(!s){
					return null;
				}
				var size=s.split('*');
				return [parseInt(size[0]),parseInt(size[1])];
			});
			$arrRemove(sizes,null);
			var urls=$map(data.split(';'),function(d){
				if(!d){
					return null;
				}
				return $parseUrl(d).href;
			});
			$arrRemove(urls,null);
			if(sizes.length!=urls.length){
				return false;
			}
			return {
				type:'img',
				sizes:sizes,
				urls:urls
			};
		},
		//url标签解析
		url:function(arg,data){
			var text=$strTrim(data);
			if(!text){
				//空内容，返回
				return false;
			}
			var urlInfo=$parseUrl(arg);
			return {
				type:'url',
				href:urlInfo.href,
				text:text
			};
		}
	};
	//遍历拆分数据，处理bbcode
	var codeArr=[],code,arg;
	for(var i=0,len=arr.length;i<len;i++){
		var data=arr[i];
		switch(i%4){
			case 0://文本内容
					//还原
					if(codeArr.length&&codeArr[codeArr.length-1].type=='text'){
						codeArr[codeArr.length-1].data+=data||'';
					}else{
						//img标签
						codeArr.push({type:'text',data:data});
					}
				break;
			case 1://bbcode
				code=data;
				break;
			case 2://arg
				arg=data?data.substring(1):null;
				break;
			case 3://data
				var data=customCodes[code]?customCodes[code](arg,data):allowedBBcode[code]&&allowedBBcode[code](arg,data);
				if(data){
					//解析正确则放入数组
					data&&codeArr.push({type:'bbcode',data:data});
				}else if(!allowedBBcode[code]){
					data=$parseStr('[{#code#}{#arg#}]{#data#}[/{#code#}]',{code:code,arg:arg===null?'':'='+arg,data:data||''});
					//还原
					if(codeArr.length&&codeArr[codeArr.length-1].type=='text'){
						codeArr[codeArr.length-1].data+=data||'';
					}else{
						codeArr.push({type:'text',data:data});
					}
				}
				break;
		}
	}
	return codeArr;
}
/**
 * iuni文字排版程序
 * @param {Object} codeArr 排版的bbcode数组
 * @param {Object} opt 排版选项，选项内容如下
 * width:容器高度
 * height:容器宽度
 * lineHeight:文字行高
 * fontStyle:文字的样式，用于计算文字宽度
 * chaCache:文字宽度缓存对象，同一文字样式下请使用同一文字宽度缓存对象，这样可以提高文字宽度计算效率
 * lazyLoadImgAttr:延时加载图片属性，如果开启，图片节点没有src属性，只有lazyLoadImgAttr属性
 * callback:完成排版后的回调
 * enableText:是否启用text代码内容输出
 * enableBbcode:是否启用bbcode代码内容输出
 * enableBbcodeImg:是否启用bbcode-img代码内容输出
 * enableBbcodeUrl:是否启用bbcode-url代码内容输出
 * enableBbcodeXXX:是否启用bbcode-xxx代码内容输出(自定义bbcode时使用，enableBbcodeXXX使用驼峰写法)
 * 
 * customBBcodeHtml:自定义bbcode解析器，内容格式为codeTag:function()
 * 解析器函数参数说明如下：
 * height 容器高度
 * width 容器宽度
 * curHeight 当前位置高度
 * curWidth 当前位置宽度
 * lineHeight 行高
 * code bbcode
 * callback 回调，
 * 回调内容为(返回生成的html代码，完成后的当前光标高度，当前光标宽度，当前页放不下截断后剩余的code)
 */
function $iuni_typeset(codeArr,opt){
	opt=$extend({
		width:400,//宽
		height:200,//高
		lineHeight:20,//行高
		fontStyle:{},//文字样式
		domTag:'div',//文字宽度计算使用节点
		chaCache:{},//文字宽度缓存
		lazyLoadImgAttr:false,//延迟加载图片属性
		callback:null,//完成回调
		enableText:true,//是否启用text节点内容输出
		enableBbcode:true,//是否启用bbcode节点内容输出
		enableBbcodeImg:true,//是否启用bbcode-img节点内容输出
		enableBbcodeUrl:false,//是否启用bbcode-url节点内容输出
		imgCheck:false,//图片检查,如果要检查，设置函数bool function(url)
		urlCheck:false,//链接检查,如果要检查，设置函数bool function(url)
		customBBcodeHtml:{}//自定义bbcode解析
	},opt);
	
	//初始化内容
	var htmls=[],remains=null;
	var width=opt.width,//宽度
	height=opt.height,//高度
	lineHeight=opt.lineHeight,//行高
	curHeight=0,//当前y
	curWidth=0,//当前x
	domTag=opt.domTag,//文字宽度计算用的标签
	fontStyle=opt.fontStyle,//文字样式
	chaCache=opt.chaCache,//文字缓存
	customBBcodeHtml=opt.customBBcodeHtml||{};//自定义bbcode解析
	//默认解析器
	var codeHtml={
		//文本字段解析
		text:function(height,width,curHeight,curWidth,lineHeight,code,callback){
			var charArr=$isArray(code.data)?code.data:$getCharArray(code.data);//文字数组
			if(!charArr||!charArr.length){
				//无内容
				callback('',curHeight,curWidth);
				return;
			}
			//获取宽度
			$getCharWidth(charArr,{
				fontStyles:fontStyle,
				domTag:domTag,
				chaWidth:chaCache,
				callback:function(chaWidth){
					var htmls=[],cw;
					//处理字符串转义字符
					var escCode,end=false;
					//遍历需要计算宽度的字符
					for(var i=0,len=charArr.length;i<len;i++){
						var x=charArr[i];
						if(curHeight+lineHeight>height){
							//已不足一行,返回
							callback(htmls.join(''),curHeight,curWidth,{type:'text',data:charArr.slice(i)});
							return;
						}
						if(x=='\n'){
							//换行
							htmls.push(x);
							curHeight+=lineHeight;
							curWidth=0;
							continue;
						}
						cw=chaWidth[x];
						if(cw){
							if((curWidth+=cw)>width){//换行
								curHeight+=lineHeight;
								curWidth=0;
								i--;
								continue;
							}
							htmls.push(x);
						}
					}
					//回调
					callback(htmls.join(''),curHeight,curWidth);
				}
			});
		},
		//bbcode解析
		bbcode:function(height,width,curHeight,curWidth,lineHeight,code,callback){
			var data=code.data,type=data.type,dealFunc=customBBcodeHtml[type]||bbcodeHtml[type];
			//检查是否支持
			if(dealFunc&&opt['enableBbcode'+$ucfirst(type)]){
				dealFunc(height,width,curHeight,curWidth,lineHeight,data,function(html,curHeight,curWidth,remainCode){
					callback(html,curHeight,curWidth,remainCode?{type:'bbcode',data:remainCode}:null);
				});
			}else{
				callback('',curHeight,curWidth,null);
			}
		}
	};
	//内置bbcode解析器
	var bbcodeHtml={
		img:function(height,width,curHeight,curWidth,lineHeight,code,callback){
			var data=code,sizes=data.sizes,urls=data.urls;
			//获得合适的尺寸图片
			var size,url,of=Number.MAX_VALUE,dataset=[];
			$each(sizes,function(s,i){
				if(Math.abs(s[0]-width)<=of){
					of=Math.abs(s[0]-width);
					size=s;
					url=urls[i];
				};
				dataset.push(s[0]+','+s[1]+','+url);
			});
			if(opt.imgCheck&&!opt.imgCheck(url)){
				//检查通过失败
				callback('',curHeight,curWidth);
				return;
			}
			//布局换行产生的高度
			var addHeight=curWidth==0?0:lineHeight;
			//处理高度
			var ih=Math.round(size[1]*width/size[0]);
			if(ih+curHeight+addHeight>height){
				//位置不够,回调
				callback('',curHeight,curWidth,code);
			}else{
				curHeight+=ih+addHeight;
				curWidth=0;
				var html=$parseStr('<img style="display:block;width:{#width#}px;height:{#height#}px" {#srcAttrName#}="{#src#}" data-set="{#dataset#}"/>',{
					src:url,
					srcAttrName:opt.lazyLoadImgAttr?opt.lazyLoadImgAttr:'src',
					width:width,
					height:ih,
					dataset:dataset.join('#')
				});
				callback(html,curHeight,curWidth);
			}
		},
		url:function(height,width,curHeight,curWidth,lineHeight,code,callback){
			var data=code,href=data.href,urlText=data.text;
			if(opt.urlCheck&&!opt.urlCheck(href)){
				//检查通过失败
				callback('',curHeight,curWidth);
				return;
			}
			var htmls=['<a target="blank" href="',href,'">'];
			var charArr=$isArray(urlText)?urlText:$getCharArray(urlText);//文字数组
			if(!charArr||!charArr.length){
				//无内容
				callback('',curHeight,curWidth);
				return;
			}
			//获取宽度
			$getCharWidth(charArr,{
				fontStyles:fontStyle,
				domTag:domTag,
				chaWidth:chaCache,
				callback:function(chaWidth){
					var cw;
					//处理字符串转义字符
					var escCode,end=false;
					//遍历需要计算宽度的字符
					for(var i=0,len=charArr.length;i<len;i++){
						var x=charArr[i];
						if(curHeight+lineHeight>height){
							//已不足一行,返回
							htmls.push('</a>');
							callback(htmls.join(''),curHeight,curWidth,{type:'url',data:{href:href,urlText:charArr.slice(i)}});
							return;
						}
						if(x=='\n'){
							//换行
							htmls.push(x);
							curHeight+=lineHeight;
							curWidth=0;
							continue;
						}
						cw=chaWidth[x];
						if(cw){
							if((curWidth+=cw)>width){//换行
								curHeight+=lineHeight;
								curWidth=0;
								i--;
								continue;
							}
							htmls.push(x);
						}
					}
					htmls.push('</a>');
					//回调
					callback(htmls.join(''),curHeight,curWidth);
				}
			});
		}
	};
	
	//开始遍历解析
	$asyncEachSeries(codeArr,function(code,callback){
		//剩余
		if(remains){
			remains.push(code);
			return callback();
		}
		//空节点
		if(!code){
			return callback();
		}
		var type=code.type;
		//检查支持
		if(codeHtml[type]&&opt['enable'+$ucfirst(type)]){
			codeHtml[type](height,width,curHeight,curWidth,lineHeight,code,function(html,cHeight,cWidth,remainCode){
				htmls.push(html);
				remainCode&&(remains=[remainCode]);
				curHeight=cHeight;
				curWidth=cWidth;
				callback();
			});
		}else{
			return callback();
		}
	},function(){
		//解析完成，回调html，剩余内容，当前高度
		opt.callback&&opt.callback(htmls.join(''),remains,curHeight);
	});
}
$iuni_KeyEvent = function(){

	var event = $Event.create( 'iuni' ),

		map = {
			27: 'esc',
			13: 'enter' 
		},

		init_flag = false,

		key_handler = function( ev ){
		
			var keyCode = ev.keyCode,
				target = ev.target;

			if ( map[ keyCode ] ){
				event.trigger( map[ keyCode ], ev );
                          
			}

			
			
		};

	var init = function(){
		if ( init_flag ){
			return;
		}
		init_flag = true;

		$( document ).on( 'keydown', key_handler );

	};


	return {
		listen: function( type, fn ){
			init();
			event.listen( type, fn );
		},
		remove: function(){
			$( document ).off( 'keydown', key_handler )
		}
	}

}();
$iuni_Ui_base = (function(){


    var base = $Class.create( function( tpl ){       //ui父类
        this.tpl = tpl;            //模板
        this.parent = null;        //ui父节点
        this.submitBtn = null;     //确定按钮
        this.closeBtn = null;      //关闭按钮
        this.cancelBtn = null;     //取消按钮
        this.black_layer = false;  //是否有遮罩层
        this.remove = false;       //关闭时是否移除对象
        this.no_close_btn = false;	//是否禁止关闭按钮，强制登陆时有用
        this.o_scroll_top = 0;
        this.revise_top = 0;
    });


    base.interface( 'checkKeyCancel', function(){    //按下esc关闭浮层

        var stack = [],
            old_win_scroll = window.onscroll,
            old_key_down = document.onkeydown;

        return function( obj, mode ){
            
            if ( mode === 'add' ){
                stack.push( obj );
            }else{

                for ( var l = stack.length - 1; l >= 0; l-- ){
                    if ( stack[ l ] === obj ){
                        stack.splice( l, 1 );
                    }
                }
            }

            if ( stack.length ){
                document.onkeydown = $after( old_key_down || function(){}, function( ev ){
                    var ev = ev || window.event;
                    if ( ev.keyCode === 27 ){
                        $.each( stack, function( i, n ){
                        	try{
                        		n.no_close_btn || n.hide();
                        	}catch(e){

                        	}
                            
                        });
                    }
                });

                $( window ).off().on( 'resize', $throttle( function(){
                    $.each( stack, function( i, n ){
                        n.position();
                    });
                }, 100 ) );


                window.onscroll = $after( old_win_scroll || function(){}, function(){
                    $.each( stack, function( i, n ){
                        if ( n.black_layer ){
                            $( window ).scrollTop( n.o_scroll_top );
                        }
                    });
                });

                return;
            }

            document.onkeydown = old_key_down;
            window.onscroll = old_win_scroll;
            $( window ).off( 'resize' );

        }

    }() );



    base.interface( 'init', function(){      //初始化

        var me = this;     

        this.parent = this.render().appendTo( $( 'body' ) ).hide();  //创建父节点容器

        this.closeBtn = this.parent.find( '[data-action="closeBtn"]' );
        this.cancelBtn = this.parent.find( '[data-action=cancelBtn]' );
        this.submitBtn = this.parent.find( '[data-action="submitBtn"]' );
        this.title = this.parent.find( '[data-action="title"]' );   //标题容器
        this.content = this.parent.find( '[data-action="content"]' );  //内容容器

        this.closeBtn.on( 'click', function(){
            me.hide();
        });

        this.cancelBtn.on( 'click', function(){
            me.hide();
        });


    });



    base.interface( 'render', function(){    //生成节点

        var parent;

        this.target = $( this.tpl ).css({
            position: 'absolute',
            zIndex: 9999
        });;

        if ( this.black_layer ){   //是否需要遮罩层
            this.black_layer = $( '<div style="width:100%;height: 100%;background:#000;position:fixed;_position:absolute;z-index:9998;top:0px;left:0px;opacity:0.5;filter:alpha(opacity=50)"></div>' );
            return this.target.wrap( '<div></div>' ).parent().prepend( this.black_layer );
        }

        return this.target.wrap( '<div></div>' ).parent().prepend( '<div></div>' );

    });


    base.interface( 'position', function( type ){

        var winWidth = $(window).width(),
            winHeight = $(window).height(),
            width = this.target.width(),
            height = this.target.height(),
            winScrollLeft = $(window).scrollLeft(), 
            winScrollTop = $(window).scrollTop(), 
            top = this.target.css( 'top' ),
            marginLeft = parseInt( this.target.css( 'margineft' ) ),
            paddingLeft = parseInt( this.target.css( 'paddingLeft' ) ),
            marginTop = parseInt( this.target.css( 'marginTop' ) ),
            paddingTop = parseInt( this.target.css( 'paddingTop' ) ),
            o_offset,
            o_left,
            o_top,
            n_left,
            n_top,
            time;

            marginLeft = isNaN( marginLeft ) ? 0 : marginLeft;
            paddingLeft = isNaN( paddingLeft ) ? 0 : paddingLeft;
            marginTop = isNaN( marginTop ) ? 0 : marginTop;
            paddingTop = isNaN( paddingTop ) ? 0 : paddingTop;

        if ( !$.support.fixedPosition && this.black_layer ){    //for ie6
            this.black_layer.css( 'width', winWidth + winScrollLeft );
            this.black_layer.css( 'height', winHeight + winScrollTop );
        }
        
        width = width + paddingLeft * 2 + marginLeft * 2;
        height = height + paddingTop * 2 + marginTop * 2;

        o_offset = this.target.offset();
        o_left = o_offset.left;
        n_top = o_offset.top;

        n_left = winWidth / 2 - width / 2 + winScrollLeft;
        n_top = winHeight / 2 - height / 2 +  winScrollTop - 10 + ( this.revise_top || 0 );


        time = Math.abs( n_left - o_left ) / 3 * 2;
        var me = this;

        this.o_scroll_top = $( window ).scrollTop();

        if ( type === 'show' || type === 'position' ){     //直接显示
            this.target.css( 'left', n_left );
            this.target.css( 'top', n_top );

            if ( type === 'show' ){
            	setTimeout(function(){
                	me.position( 'position' );
            	}, 0);
            }
           
            return false;
        }

        this.target.stop().animate( { left:n_left, top:n_top }, time, 'swing' );


    });

    base.interface( 'show', function(){
        var me = this;

        me.position( 'show' );

        this.parent.fadeIn( 200 );

        this.checkKeyCancel( this, 'add' );
        this.submitBtn.focus();
    });


    base.interface( 'hide', function(){
        this.parent.fadeOut( 300 );
        this.checkKeyCancel( this, 'del' );
        if ( this.remove ){
            this.parent.off().remove();
        }
    });

    return base;

})();
$iuni_dialogManager = (function() {
	if(typeof $iuni_dialogManager!='undefined'){
		return $iuni_dialogManager;
	}
	//当前登录用户id，所有对话
	var curUID, allDialogs = {
		//id:dialog
	};
	var tpl = '<div class="s_sns_talk"><h2><div class="s_content cf"><div class="content_left"><img src="<%=avatar%>" sns_dialog_tag="avatar"/></div><div class="content_right"><h3 sns_dialog_tag="nickname"><%=nickname%></h3><p></p></div></div></h2><div class="talk_content_wrap"><div class="talk_content" sns_dialog_tag="view"></div></div><div class="talk_bottom"><form method="get" action="#" target="_blank" sns_dialog_tag="form"><span class="content_box"><textarea name="text"></textarea><span class="s_page"><span sns_dialog_tag="text_num">0</span>/100</span></span><button type="submit" class="talk_btn talk_btn_useless" name="btn">发送</button></form></div><div class="close" sns_dialog_tag="close"></div></div>', 
	fn = $formatTpl(tpl), 
	viewTpl = '<%if(hasOld){%><div class="talk_list"><h3><span class="talk_list_more" sns_dialog_tag="more">查看更多消息</span></div><%}for(var i=0,len=groups.length;i<len;i++){var msgs=groups[i];%><div class="talk_list"><h3><b class="thor_line"><span class="time"><%=formatDate(msgs[0].created)%></span></b></h3><%for(var j=0,len1=msgs.length;j<len1;j++){var msg=msgs[j];%> <p class="<%=(cuid==msg.uid)?"s_me":"s_friend"%> s_<%=msg.mid==-1?"sending":msg.mid==-2?"error":"ok"%>"><span><%=msg.message%><i class="a"></i></span></p><%}%></div><%}%>', 
	viewFn = $formatTpl(viewTpl);
	//销毁对话
	function destroy(dl) {
		//取消定时器
		dl.timer = dl.timer && clearInterval(dl.timer);
		//解绑事件
		$unbindEvent([dl.dom, dl.closeDom, dl.viewDom, dl.formDom, dl.inputDom, dl.submitDom, dl.testNumDom]);
		//移除节点
		dl.dom.parentNode && dl.dom.parentNode.removeChild(dl.dom);
		//解除注册
		allDialogs[dl.uid] && (
		delete allDialogs[dl.uid]);
	}

	//管理器
	var manager = {
		//获取实例
		getInstance : function(uid) {
			if (curUID) {
				if (!allDialogs[uid]) {
					var dialog = Dialog.getInstance(uid);
					allDialogs[uid] = dialog;
				}
				return allDialogs[uid];
			}
		},
		//用户登出
		login : function(uid) {
			if (curUID != uid) {
				//销毁所有对话
				$each($keys(allDialogs), function(fuid) {
					destroy(fuid);
				});
				//重置
				curUID = uid;
				allDialogs = {};
			}
		},
		//用户登录
		logout : function() {
			this.login(0);
		},
		//销毁对话
		destroy : function(uid) {
			if (curUID && allDialogs[uid]) {
				destroy(allDialogs[uid]);
			}
		},
		//设置模版
		setTpl : function(t) {
			fn = $formatTpl(t);
			tpl = t;
		},
		//隐藏所有对话
		hideAll:function(){
			$each($keys(allDialogs), function(fuid) {
				allDialogs[fuid].hide();
			});
		}
	};
	//对话类
	var Dialog = $Class.create(function(uid) {
		var that = this;
		this.sendId=0;
		//uid
		this.uid = uid;
		//消息数组，消息是从新至旧的顺序，新消息append到数组最前面
		this.msgs = [];
		//总消息条数
		this.totalMsgs;
		//新消息条数
		this.newMsgs;
		//最远id
		this.farMid,
		//一小时的间隔，两端对话超过该时间间隔将显示时间条，单位 秒
		this.timeIntval = 60 * 60;
		//是否加载过数据
		this.loaded = false;
		//是否正在加载
		this.loading = false;
		//定时器
		this.timer,
		//是否显示
		this.isShow = false;
		//是否可用
		this.enable = true;
		//dom根节点
		this.dom = document.createElement('div');
		//初始化
		this.dom.innerHTML = fn({
			uid : uid,
			nickname : 'iuni用户',
			avatar : ''
		});
		this.viewDom = $attr('sns_dialog_tag','view',this.dom)[0];
		this.formDom = $attr('sns_dialog_tag','form',this.dom)[0];
		this.testNumDom = $attr('sns_dialog_tag','text_num',this.dom)[0];
		this.inputDom = this.formDom.text;
		this.submitDom = this.formDom.btn;
		this.closeDom = $attr('sns_dialog_tag','close',this.dom)[0];
		this.avatarDom = $attr('sns_dialog_tag','avatar',this.dom)[0];
		this.nicknameDom = $attr('sns_dialog_tag','nickname',this.dom)[0];
		//绑定事件
		$bindEvent(this.formDom, function(event) {
			that.submit();
			//阻止提交
			event.preventDefault();
			return false;
		}, 'submit');
		//修改
		$bindEvent(this.inputDom, function(e) {
			that.__checkInput();
		}, 'change');
		//按键
		$bindEvent(this.inputDom, function(e) {
			//修改检查字数和内容
			var length=that.testNumDom.innerHTML = this.value.length;
			//样式设置
			if(length==0){
				$addClass(that.submitDom,"talk_btn_useless");
			}else{
				$delClass(that.submitDom,"talk_btn_useless");
			}
		}, 'keyup');
		//提交
		$bindEvent(this.inputDom, function(e) {
			//检查alt+s,alt+enter提交
			if (e.altKey && (e.which == 83 || e.which == 13)) {
				that.submit();
				e.preventDefault();
			}
		}, 'keydown');
		//关闭
		$bindEvent(this.closeDom, function() {
			that.hide();
		});
		//滚动，禁止window发生滚动
		$bindEvent(this.viewDom, function(event) {
			if (event.delta < 0) {
				if (this.scrollBottom == 0) {
					event.preventDefault();
				}
			} else if (event.delta > 0) {
				if (this.scrollTop == 0) {
					event.preventDefault();
				}
			}
		}, 'mousewheel');
		//点击事件
		$bindEvent(this.viewDom,function(event){
			var target=$attrParent('sns_dialog_tag',null,event.target,this);
			if(target){
				var tag=target.getAttribute('sns_dialog_tag');
				if(tag=='more'){//加载更多
					target.innerHTML="加载中...";
					that.loadBefore();
				}
			}
		});
		//添加到document
		$display(this.dom, 'none');
		document.body.appendChild(this.dom);
		//初始化位置
		this.dom.style.position = 'absolute';
		this.dom.style.left = this.dom.style.top = 0;
		//加载用户信息
		this.__loadUserInfo();
	}, {
		__loadUserInfo:function(){
			var that=this;
			$jsonp({
				url:'http://town.iuni.com/api/info/get_nickname_avatar?dtype=jsonp',
				data:{
					uid:this.uid
				},
				callback:function(result){
					var data=result.data;
					that.avatarDom.src=data.avatar;
					that.nicknameDom.innerHTML=data.nickname;
				},
				errorback:function(result){
					//noop
				}
			});
		},
		//检查是否有历史消息
		hasOldMsg:function(){
			return !this.loaded||(this.totalMsgs-this.newMsgs-this.msgs.length)>0;
		},
		//检查是否有新消息
		hasNewMsg:function(){
			return !this.loaded||this.newMsgs>0;
		},
		//加载之前的消息
		loadBefore : function() {
			if (!this.enable) {
				return;
			}
			if (this.loading) {
				return;
			}
			//检查是否还有历史消息
			if(!this.hasOldMsg()){
				return;
			}
			var that = this;
			this.loading = true;
			//加载数据
			$jsonp({
				url : 'http://town.iuni.com/api/dialog/detail?dtype=jsonp',
				data : {
					uid : this.uid,
					ps : 20,
					mid : this.farMid || ''
				},
				callback : function(result) {
					that.loading = false;
					//加载新数据
					var msgs = result.data.dataContext;
					var totalMsgLength=result.data.countRow;
					if(!that.loaded){
						//第一次加载，设置初始数据
						that.totalMsgs=totalMsgLength;
						that.newMsgs=0;
					}else{
						//处理总数和新消息
						that.newMsgs+=totalMsgLength-that.totalMsgs;
						that.totalMsgs=totalMsgLength;
					}
					that.loaded = true;
					//处理消息
					if (msgs && msgs.length) {
						that.__append(msgs,'old');
					}
				},
				errorback : function(result) {
					that.loading = false;
					that.loaded = true;
				}
			});
		},
		//过滤信息内容
		__filterMsgContent : function(msg){
			if($isArray(msg)){
				var that=this;
				return $map(msg,function(m){
					return that.__filterMsgContent(m);
				});
			}
			msg.message=this.__filterText(msg.message||'');
			return msg;
		},
		//过滤字符串
		__filterText:function(text){
			return text.replace(/[<>&#\/\\]/g,function(r){
				return {
					'<':'＜',
					'>':'＞',
					'&':'＆',
					'#':'＃',
					'\\':'＼',
					'/':'／'
				}[r];
			});
		},
		__splitMsg : function() {//将消息按时间分组
			var that = this;
			var lastTime, groups = [];
			$each(this.msgs, function(msg) {
				if (!lastTime||lastTime-msg.created > that.timeIntval) {
					groups.unshift([]);
				}
				groups[0].unshift(msg);
				lastTime = msg.created;
			});
			return groups;
		},
		__append : function(msgs,type) {//添加信息
			//过滤信息
			msgs=this.__filterMsgContent(msgs);
			//合并添加信息
			if(type=="send"){
				this.msgs .unshift(msgs);
			}else if(type=="fail"){
				//修改信息为失败
				$each(this.msgs,function(msg){
					if(msg.mid==-1&&msg.sendId==msgs.sendId){
						msg.mid=-2;
						throw $break;
					}
				});
			}else if(type=="succ"){
				//修改信息成功
				$each(this.msgs,function(msg){
					if(msg.mid==-1&&msg.sendId==msgs.sendId){
						msg.mid=msgs.mid;
						throw $break;
					}
				});
			}else if(type=="old"){
				//添加老信息
				this.msgs = this.msgs.concat(msgs);
			}else if(type=="new"){
				//添加新信息
				this.msgs=msgs.concat(this.msgs);
			}
			if(this.msgs.length){
				this.farMid=this.msgs[this.msgs.length-1].mid;
			}
			var scrollHeight=this.viewDom.scrollHeight,scrollTop=this.viewDom.scrollTop;
			//更新html
			this.rendView();
			//设置当前位置
			if(type=='old'){
				//保持显示位置不变
				this.viewDom.scrollTop = this.viewDom.scrollHeight-scrollHeight+scrollTop;
			}else{
				//滚动到底部
				this.viewDom.scrollTop=this.viewDom.scrollHeight;
			}
		},
		//渲染对话
		rendView:function(){
			var groups = this.__splitMsg();
			this.viewDom.innerHTML = viewFn({
				cuid : curUID,
				groups : groups,
				hasOld : this.hasOldMsg(),
				formatDate : function(timestamp){
					return $formatDate(new Date(timestamp*1000),{
					ftin1d:'H:N',
					ftlt1w:'星期wc H:N',
					ft:'Y年m月d日 H:N'
					});
				}
			});
		},
		__checkInput : function() {
			//修改检查字数和内容，进行裁剪，控制100个字符
			var text=this.inputDom.value = this.__filterText(this.inputDom.value.substring(0, 100));
			var length=this.testNumDom.innerHTML = text.length;
			if(length==0){
				$addClass(this.submitDom,"talk_btn_useless");
			}else{
				$delClass(this.submitDom,"talk_btn_useless");
			}
		},
		//提交
		submit : function() {
			if (!this.enable) {
				return;
			}
			if($hasClass(this.submitDom.className,"talk_btn_useless")){
				return;
			}
			this.__checkInput();
			var text=this.inputDom.value;
			//提交数据
			if(text.length>0){
				var that=this;
				var sendId=this.sendId++;
				var msg={
					mid:-1,
					uid:curUID,
					sendId:sendId,
					uid_nick:null,
					uid_avatar:null,
					ruid:this.uid,
					ruid_nick:null,
					ruid_avatar:null,
					message:text,
					created:Math.ceil(new Date().getTime()/1000)
				};
				this.__append(msg,'send');
				$jsonp({
					url:'http://town.iuni.com/api/dialog/add?dtype=jsonp',
					data:{
						ruid:this.uid,
						content:encodeURIComponent(text)
					},
					callback:function(result){
						var mid=result.data.mid;
						msg.mid=mid;
						//发送成功
						that.__append(msg,'succ');
					},
					errorback:function(result){
						//发送失败
						that.__append(msg,'fail');
					}
				});
			}
			//重置输入框
			this.inputDom.value='';
			this.testNumDom.innerHTML=0;
			$addClass(this.submitDom,"talk_btn_useless");
		},
		//显示对话框
		show : function() {
			if (!this.enable) {
				return;
			}
			if (!this.isShow) {
				var that = this;
				//隐藏所有对话
				manager.hideAll();
				this.isShow = true;
				$display(this.dom, '');
				//设置位置
				this.setPos();
				//定时
				this.timer = setInterval(function() {
					that.setPos();
				}, 200);
				if (!this.loaded) {
					//加载历史信息
					this.loadBefore();
				}
			}
		},
		hide : function() {//隐藏对话框
			if (!this.enable) {
				return;
			}
			$display(this.dom, 'none');
			this.isShow = false;
			clearInterval(this.timer);
			this.timer = 0;
		},
		close : function() {//关闭，销毁对话
			if (!this.enable) {
				return;
			}
			this.enable = false;
			manager.destroy(this.uid);
		},
		setPos : function() {//设置位置
			if (!this.enable) {
				return;
			}
			//获取高宽
			var width = this.dom.offsetWidth;
			var height = this.dom.offsetHeight;
			//计算位置
			this.dom.style.top = Math.round(($getWindowHeight() - height) / 2 + $getPageScrollTop()) + 'px';
			this.dom.style.left = Math.round(($getWindowWidth() - width) / 2 + $getPageScrollLeft()) + 'px';
		}
	});
	return manager;
})();
/**
 * 控制多个菜单/提示dom的显示，只允许至多显示一个
 * 
 * 提供bind(dom,callback),unbind(dom)方法
 */
$iuni_showOneCtl = (function() {
	if (typeof $iuni_showOneCtl=='object') {
		return $iuni_showOneCtl;
	}
	var bindSet = [], body = document.body;
	$bindEvent(body, checkBind,'mousedown');
	function bind(dom, cb) {
		var flag = 1;
		$each(bindSet, function(bind) {
			if (bind.dom == dom) {
				flag = 0;
				throw $break;
			}
		});
		if (flag) {
			bindSet.push({
				dom : dom,
				cb : cb
			});
			dom.__emphasizeid = bindSet.length;
		}
	}

	function unbind(dom) {
		for (var i = bindSet.length; i--; ) {
			if (bindSet[i].dom == dom) {
				bindSet.splice(i, 1);
				for (var j = bindSet.length; j-- >= i; ) {
					bindSet[j].dom.__emphasizeid = j + 1;
				}
				break;
			}
		}
	}

	function checkBind(event) {
		var dom = event.target, index;
		while (dom && dom != body) {
			//污染dom元素数据，减少循环查询
			if (dom.__emphasizeid) {
				index = dom.__emphasizeid - 1;
				break;
			}
			dom = dom.parentNode;
		}
		$each(bindSet, function(bind, i) {
			if (i !== index) {
				bind.cb('hide');
			}
		});
	}

	return {
		bind : bind,
		unbind : unbind
	};
})();
$iuni_Login_layer = (function(){

	var Login_layer = $iuni_Ui_base.sub( function(){

		this.tpl = '<div><div data-action="close_layer" class="login_close_bnts"></div><iframe name="login_iframe" style="width:100%;height:100%" src="about:blank" frameborder="0"></iframe></div>';

		this.black_layer = true;

		this.init.call( this );

	});


	var instance,
		params,
		re_url,
		callback_url,
		iframe,
		default_width,
		default_height,
		contentWindow,
		close_layer,
		no_close_btn,	//是否禁止了取消关闭按钮
		default_src,
		event = $Event.create( 'Login_layer' );


	var check_close_btn = function(){
		if ( no_close_btn && close_layer ){
			instance.no_close_btn = true;
			close_layer.hide();
		}else{
			instance.no_close_btn = false;
			close_layer.show();
		}
	};

	var init = (function(){

		var flag = false;

		return function( src ){

			if ( flag ){
				return false;
			}

			document.domain = 'iuni.com';

			flag = true;

			instance = Login_layer.getInstance();

			close_layer = instance.target.find( '[data-action="close_layer"]' );

			close_layer.on( 'click', function(){
				instance.hide();
			});

			var src = ( src || default_src ) + '?r=' + Math.random();

			if ( callback_url ){
				src += '&callback_url=' + encodeURIComponent( callback_url );
			}

			iframe = instance.target.find( 'iframe' ).attr( 'src', src );
					
			iframe.one( 'load', function(){

				var doc;
				contentWindow = iframe[0].contentWindow;
				doc = contentWindow.document;
			
				if ( default_width && default_height ){
					return set_wh( default_width, default_height );
				}

				try{
					var login_layer_parent = doc.getElementById( 'login_layer_parent' );
					instance.parent.show();
					if ( login_layer_parent.clientWidth && login_layer_parent.clientHeight ){
						return set_wh( login_layer_parent.clientWidth, login_layer_parent.clientHeight );
					}
				}catch(e){
					set_wh( default_width, default_height );
				}

			});

		}

	})();


	var show = function( params ){

		no_close_btn = Array.prototype.pop.call( arguments ) === 'no_close_btn';
		
		var params = params || {};
			
		if ( Object.prototype.toString.call( params ) === '[object Object]' ){
			$iuni_Login_layer.succ( params.succ || function(){} );
			$iuni_Login_layer.fail( params.fail || function(){} );
			re_url = params.reurl;
			callback_url = params.callback_url;
			default_width = params.width || 670;
			default_height = params.height || 486;
		}else{
			$iuni_Login_layer.succ( function(){} );
			$iuni_Login_layer.fail( function(){} );
			re_url = params;
		}

		if ( !params ){
			params = {};
		}

		init( params.src );

		check_close_btn();

		contentWindow && contentWindow.iuni.common.login_iframe.event.trigger( 'after_show' );

		contentWindow && instance.show();

	};

	var hide = function( target ){

		if ( target === 'iframe' && no_close_btn ){
			return;
		}
		return instance.hide();
	};

	var trigger = function( type, data ){
		var type = Array.prototype.shift.call( arguments );
		event.trigger( type, data );
	};

        var succ = function( fn ){
		var _fn = fn;
		
		event.listen( 'succ', function(data){

			_fn.apply( this, arguments );

			$Event.trigger( 'login_succ', data );

			setTimeout( function(){

				if ( re_url && re_url.indexOf( 'http:' ) > -1  ){
					return location.href = re_url;
				}

				return location.reload( true );

			}, 100 );

		});
		
	};

	var fail = function( fn ){
		event.listen( 'fail', fn );
	};

	var set_wh = function( w, h ){
		instance.target.css( 'width', w ).css( 'height', h );
		instance.show();
	};


	var set_default_src = function( src ){
		default_src = src;
	};

	set_default_src( 'http://www.iuni.com/static/sinclude/page/login_iframe.shtml' );


	return {
		show: show,
		hide: hide,
		succ: succ,
		fail: fail,
		trigger: trigger,
		set_wh: set_wh
	}

})();
$iuni_confirm = (function(){

	var getConfirm = $getSingle( function(){

		var Confirm = $iuni_Ui_base.sub( function(){

			this.tpl = '<div class="s_sns_mask ">' +
                '<h3 class="mask_header">' +
                    '<span data-action="title"></span>' +
                    '<div data-action="cancelBtn" class="mask_close curs"></div>' +
                '</h3>' +
                '<div class="mask_body">' +
                    '<p data-action="content"></p>' +
                    '<div class="mask_btn">' +
                        '<button data-action="submitBtn" class="mask_btn_sure">确定</button>' +
                        '<span data-action="cancelBtn" class="mask_btn_cancle curs">取消</span>' +
                    '</div>' +
                '</div>' +
            '</div>';



			this.black_layer = true;

			this.init.call( this );

		});

		return Confirm.getInstance();

	});


 	return function( param ){

 		var obj = getConfirm();

 		obj.title.html( param.title || '提示' );
		obj.content.html( param.content || '' );
                
		obj.show();

                //setTimeout(function(){
                  // obj.submitBtn.focus();
               // }, 100);

		obj.submitBtn.off().on( 'click', function(){
		 	param.callback && param.callback();
		 	obj.hide();
		});

 	};


})();
$iuni_upload = (function(){

	var Upload_box = $iuni_Ui_base.sub( function(){

		this.tpl = '<div class="s_sns_mask publish_upload_wrapper"><h3 class="mask_header"><span>上传图片</span><div data-action="cancelBtn" class="mask_close"></div></h3><div class="mask_body" style="width:100%;height:100%"><iframe name="upload_iframe" src="about:blank" class="upload_frame" frameborder="0"></iframe></div></div>';

		this.black_layer = true;

		this.init.call( this );

	});


	var instance,
		contentWindow,
		show,
		hook;

	show = function( obj ){
		var instance = get_upload_box( obj );
	}

	var get_upload_box = $getSingle( function( obj ){

		document.domain = 'iuni.com';

		instance = Upload_box.getInstance();

		instance.hide();

		hook = 'upload_' + ( +new Date );

		window[ hook ] = {
			act: obj.action || '',
			succ: obj.succ || function(){},
			cancal_all: function(){
				instance.hide();
			}
		};

		var iframe = instance.target.find( 'iframe' ).attr( 'src', 'http://www.iuni.com/upload/upload.shtml?hook=' + hook );

		iframe.one( 'load', function(){

			var doc;
			contentWindow = iframe[0].contentWindow;
			doc = contentWindow.document;

			instance.show();

			if ( doc.body.clientWidth && doc.body.clientHeight ){
				set_wh( doc.body.clientWidth, doc.body.clientHeight );
			}

			show = function(){
				instance.show();
			}

		});

		return instance;

	});


	var set_wh = function( w, h ){
		instance.target.css( 'width', w ).css( 'height', h );	
		instance.revise_top = -50;	//各种padding的修正
		instance.show();
	};


	return {
		start: function( obj ){
			return show( obj );
		}
	}


})();
window.__corejsLoaded=true;