函数名称：$iuni_showOneCtl
函数描述： 
控制多个菜单/提示dom的显示，只允许至多显示一个

提供bind(dom,callback),unbind(dom)方法
函数代码： 
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
调用示例： 
$iuni_showOneCtl.bind(dom1,function(){
   dom1.style.display='none';
});
$iuni_showOneCtl.bind(dom2,function(){
   dom2.style.display='none';
});
依赖函数： 
$break$each$break$bindEvent$incNum$extend$eventNormalize