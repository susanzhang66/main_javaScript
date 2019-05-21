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


调用示例： 
dom.onclick=function(event){
    event=$eventNormalize(event||window.event);
};
依赖函数： 
$extend
被依赖函数： 
$bindEventwww_iuni_com:$iuni_showOneCtl$sliderBarwww_iuni_com:$iuni_pagination$page$sliderBar$unbindEvent