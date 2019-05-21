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


调用示例： 
$bindEvent(dom,function(e){
    alert("dom被点击");
},"click");
依赖函数： 
$eventNormalize $extend $incNum
被依赖函数： 
$unbindEvent$sliderBar$pagewww_iuni_com:$iuni_pagination$sliderBarwww_iuni_com:$iuni_showOneCtl