function $id(id) {
    return typeof (id) == "string" ? document.getElementById(id) : id;
}
/*
函数名称：$getPageHeight
函数描述： 
获得页面高度
*/
function $getPageHeight() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollHeight 是网页内容实际高度，可以小于 clientHeight，NS、FF 认为 scrollHeight 是网页内容高度，不过最小值是 clientHeight，改为统一FF标准
	return Math.max(doeCath .scrollHeight,doeCath .clientHeight);
}

/*
函数名称：$getPageWidth
函数描述： 
获得页面宽度
*/ 
function $getPageWidth() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	//IE、Opera 认为 scrollWidth 是网页内容实际宽度，可以小于 clientWidth，NS、FF 认为 scrollWidth 是网页内容宽度，不过最小值是 clientWidth，改为统一FF标准
	return Math.max(doeCath.scrollWidth,doeCath.clientWidth);
}

/*
函数名称：$getWindowHeight
函数描述： 
获取浏览器窗口高度
*/ 
function $getWindowHeight() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientHeight;
}

/*
函数名称：$getWindowWidth
函数描述： 
获得浏览器窗口宽度
*/ 
function $getWindowWidth() {
	var docCath=document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.clientWidth;
}

/*
函数名称：$getPageScrollTop
函数描述： 
获得浏览器页面滚动上边距
函数代码： 
*/
function $getPageScrollTop() {
	var docCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return docCath.scrollTop;
}

/*
函数名称：$getPageScrollLeft
函数描述： 
获得浏览器页面滚动左边距
函数代码： 
*/
function $getPageScrollLeft() {
	var doeCath = document.compatMode == 'BackCompat' ? document.body: document.documentElement;
	return doeCath.scrollLeft;
}

/*
函数名称：$isBrowser
函数描述： 
判断是否指定浏览器类型
*/ 
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
/*
* 函数名称：添加事件
* @param {dom} a
* @param {event} b
* @param {function} c
* @param {布尔值} ture,捕获。false,冒泡。
*/
function addEvent(a, b, c, d) {
	a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent("on" + b, c)
}

function removeEvent(a, b, c, d) {
	a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent("on" + b, c)
}

/**
 * 扩展属性，将第二个参数起到最后一个参数的所有属性复制到dest上去
 * @param {Object} dest
 */
function $extend(dest) {
    dest = dest || {};
    var len = arguments.length;
    if (len > 1) {
        for (var i = 1; i < len; i++) {
            var src = arguments[i];
            if (src) {
                //复制属性
                for (var property in src) {
                    if (src.hasOwnProperty(property)) {
                        dest[property] = src[property];
                    }
                }
            }
        }
    }
    return dest;
}

/*
函数名称：$setStyles
函数描述： 
给dom元素设置样式

参数：
dom 要设置的dom元素
styles 要设置的样式对象，key-value值
*/ 
function $setStyles(dom,styles){
	for(var key in styles){
		var v=styles[key];
		key=key.replace(/-(\w)/g,function($0,$1){
			return $1.toUpperCase();
		});
		dom.style[key]=v;
	}
}

/*
函数名称：$eventNormalize
函数描述： 
规范化事件，获得标准事件对象，提取自JQ

参数：
event 原始事件对象

返回：
规范化后的事件，包括规范以下属性及事件：
metaKey，pageX，pageY，relatedTarget，target，timeStamp，type，which，preventDefault()，stopPropagation()
对滚动事件wheel，
规范type=mousewheel，提供delta，deltaX，deltaY属性
函数代码：  */
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

/*
函数名称：$incNum
函数描述： 
获取自增数字，每次调用加1
*/ 
/**
 * 获取自增数字
 */
function $incNum(acc){
	acc=acc||$incNum;
	acc.num=acc.num||0;
	return acc.num++;
}

/*
函数名称：$bindEvent
函数描述： 
绑定事件
函数代码： 
*/
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

