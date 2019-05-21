/*
函数名称：$unbindEvent
函数描述： 
取消事件绑定
函数代码： 
*/
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




调用示例： 
$unbindEvent(dom,func,'click');
依赖函数： 
$bindEvent$incNum$extend$eventNormalize
被依赖函数： 
$sliderBar