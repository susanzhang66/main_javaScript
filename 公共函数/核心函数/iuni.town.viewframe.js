/******************************
 社区展示类框架
 提供横屏展示基础框架操作

 接收自定义事件：
 requestShowMenu：请求显示菜单
 requestHideMenu：请求隐藏菜单
 requestVisableViewScale：请求获得可视视图尺寸数据
 requestViewScroll：请求获得视图滚动位置数据
 *requestSetViewWidth：请求设置视图总宽度，该事件将不再使用，统一改为requestSetViewLength(参数：width)
 *requestSetViewHeight：请求设置视图总高度，该事件将不再使用，统一改为requestSetViewLength(参数：height)
 requestSetViewLength：请求设置视图总长度(参数：length)
 requestSetViewScroll：请求设置视图滚动位置(参数：scrollLeft)

 提供自定义事件：
 visableViewScale：提供可视视图尺寸数据(参数：[width:height])
 viewScroll：提供视图滚动位置(参数：scroll,maxScroll)
 viewScrollEnd：视图连续滚动时提供滚动结束事件

 2014-01-26 11:07:17 wubocao 创建
 *******************************/

$namespace("iuni.town.viewframe");
/******************************
 　全局参数配置
 *******************************/
iuni.town.viewframe.data = {
	direct : 'x', //滚动条方向 x/y
	mouseScrollPixel : 120, //鼠标滚轮的基本单位，120像素
	keyScrollPixel : 40, //键盘滚动的基本单位，40像素
	hasMenu : true, //是否有菜单
	menuShow : false, //是否显示菜单
	menuHiddenClass : 'no_nav', //菜单控制样式
	menuWidth : 259, //菜单宽度
	wrapPadding : [0, 44, 0, 44], //包裹层边框
	hasTitle : true, //是否有标题
	titleHeight : 95, //标题高度
	scrollPadding : 50, //滚动条距离边框边距
	scrollHeight : 30, //滚动条高度(横向滚动时设定)
	scrollRight : 30, //滚动条右边距(竖向滚动时设定)
	scrollTop : 0, //滚动条定位上位移(竖向滚动时设定)
	scrollPosRef : 'body',//滚动条定位对象
	scrollBarBorder : 0, //滚动条边框
	scrollBarOffset : -2, //滚动定位偏移
	visiableViewSize : [0, 0], //可视内容区域
	viewWidth : 960, //内容总宽度(根据滚动条方向2选1)
	viewHeight : 750, //内容总高度(根据滚动条方向2选1)
	viewScrollLeft : 0, //内容左滚动位置(根据滚动条方向2选1)
	viewScrollTop : 0, //内容上滚动位置(根据滚动条方向2选1)
	autoWidth : false, //自动确定宽度，不做计算，竖屏滚屏时可设置
	sliderBar : null, //滚动组件
	cache : {}//缓存数据
};

iuni.town.viewframe.dom = {
	main : $id('sns_main'), //外层框架
	body : $id('sns_body'), //主区域
	menu : $id('sns_menu'), //菜单
	title : $id('sns_title'), //标题
	scroll : $id('sns_scroll'), //滚动条
	outView : $id('sns_out_view'), //外层内容区
	scrollView : $id('sns_scroll_view'), //滚动内容层
	view : $id('sns_view')//内容区域
};
/******************************
 　初始化配置
 *******************************/
iuni.town.viewframe.init = function(opt) {
	//扩展数据
	$extend(this.data, opt || {});
	//初始化滚动组件
	this.initSliderBar();
	//初始化框架尺寸
	this.initFrameScale();
	//初始化菜单控制
	this.initMenu();
	//初始化滚动控制
	this.initScroll();
	//添加触发事件监听，避免业务不监听导致内存泄漏
	this.dealEventListener();
};
/******************************
 　功能实现区
 *******************************/

/**
 * 初始化滚动显示组件
 */
iuni.town.viewframe.initSliderBar = function() {
	var that = this;
	if (this.data.direct != 'x') {
		//y轴方向，设置滚动条位置
		if(this.data.scrollPosRef=='body'){//根据body定位
			this.dom.scroll.style.top = this.data.scrollTop + this.data.scrollPadding + (this.data.hasTitle ? this.data.titleHeight : 0) + this.data.wrapPadding[0] + 'px';
			this.dom.scroll.style.right = this.data.scrollRight + this.data.wrapPadding[1] + 'px';
		}else if(this.data.scrollPosRef=='view'){//根据view定位
			this.dom.scroll.style.top = this.data.scrollTop + this.data.scrollPadding + 'px';
			this.dom.scroll.style.right = this.data.scrollRight + 'px';
		}
		//高度改为自动模式，因此需要定时检测高度变化
		var autoHeightTimer = setInterval(function() {
			var height = Math.max(that.dom.view.scrollHeight, that.data.visiableViewSize[1]);
			if (height != that.data.viewHeight) {
				$Event.trigger('requestSetViewLength', height);
			}
		}, 100);
		//初始化高度
		this.data.viewHeight = this.dom.view.scrollHeight;
	}
	//最大位置，根据滚动条方向确定
	var max = this.data.direct == 'x' ? this.data.viewWidth : this.data.viewHeight;
	var sliderBar = $sliderBar({
		direction : this.data.direct, //方向
		dom : this.dom.scroll, //dom元素
		barBorder : this.data.scrollBarBorder,
		barOffset : this.data.scrollBarOffset,
		tpl : '<div class="s_sns_scroll slider slider_<%=direction%>" s_tag="main" style="margin:0 auto;"><i class="sns_scroll_bar_l"></i><i class="sns_scroll_bar_r"></i><div class="s_sns_scrollbtn" s_tag="bar"><i class="sns_sccollbtn_l"></i><i class="sns_sccollbtn_r"></i><b class="sns_sccollbtn_m"></b></div></div>',
		min : 0,
		max : max,
		cur : [0, max]
	});
	this.data.sliderBar = sliderBar;
};

/**
 *初始化框架尺寸
 */
iuni.town.viewframe.initFrameScale = function() {
	var that = this;
	//变量名，根据滚动条方向确定
	var lengthName = this.data.direct == 'x' ? 'width' : 'height', lengthNameUc = $ucfirst(lengthName);
	var offsetName = this.data.direct == 'x' ? 'left' : 'top', offsetNameUc = $ucfirst(offsetName);
	var visiableViewIndex = this.data.direct == 'x' ? 0 : 1;
	var viewLengthName = 'view' + lengthNameUc, scrollOffsetName = 'scroll' + offsetNameUc, viewScrollOffsetName = 'viewScroll' + offsetNameUc;
	var noticeTimer;
	//监听scale事件
	$Event.listen('scale', function(data) {
		var width = data[0], height = data[1];
		//处理实际显示区域
		//宽度，减去边框
		width = width - that.data.wrapPadding[1] - that.data.wrapPadding[3];
		//宽度，减去菜单宽度
		if (that.data.menuShow) {
			width -= that.data.menuWidth;
		}
		//高度，减去边框
		height = height - that.data.wrapPadding[0] - that.data.wrapPadding[2];
		if (that.data.hasTitle) {
			//有标题，高度，减去标题
			height = height - that.data.titleHeight;
		}
		if (that.data.direct == 'x') {
			//x方向滚动条，高度，减去滚动条
			height -= that.data.scrollHeight;
		}
		//判断是否发生了变化
		if (that.data.visiableViewSize[0] != width || that.data.visiableViewSize[1] != height) {
			var visiableLength = that.data.direct == 'x' ? width : height;
			//更新实际长度
			if (lengthName == 'width') {
				//高度可以有浏览器控制自己撑大，因此不需要手动设置高度
				if (visiableLength >= that.data[viewLengthName]) {
					//可视宽度大于实际宽度，设置实际宽度为可视宽度
					that.dom.view.style[lengthName] = visiableLength + 'px';
				} else {
					that.dom.view.style[lengthName] = that.data[viewLengthName] + 'px';
				}
			}
			//显示尺寸发生了变动
			if (that.data.visiableViewSize[visiableViewIndex] != visiableLength) {
				if (that.data.direct != 'x') {
					//Y方向，需要重新计算视图高度
					var viewHeight = Math.max(that.dom.view.scrollHeight, height);
					if (viewHeight != that.data.viewHeight) {
						$Event.trigger('requestSetViewLength', viewHeight);
					}
				}
				//重设滚动条宽度，左右50像素差
				that.data.sliderBar.setLength(visiableLength - 2*that.data.scrollPadding);
				//重新当前显示范围
				var state = that.data.sliderBar.getState(), begin = state.begin, end = begin + visiableLength;
				if (end > state.max) {
					end = state.max;
					begin = end - visiableLength;
				}
				if (begin < state.min) {
					begin = state.min;
				}
				that.data.sliderBar.setCurRange(begin, end);
				//更新scrollLeft
				that.data[viewScrollOffsetName] = begin;
				//触发事件，滚动位置发生变化
				that.trigger('viewScroll', begin, state.max - visiableLength);
			}
			if (that.data.direct == 'x') {
				//x方向滚动条
				//实际展示内容区域变动
				if (!that.data.autoWidth) {
					that.dom.outView.style.width = that.dom.scrollView.style.width = width + 'px';
				}
				that.dom.outView.style.height = that.dom.view.style.height = height + 'px';
			} else {
				//y方向滚动条
				//实际展示内容区域变动
				if (!that.data.autoWidth) {
					that.dom.outView.style.width = that.dom.view.style.width = width + 'px';
				}
				that.dom.outView.style.height = that.dom.scrollView.style.height = height + 'px';
			}
			//设置最新值
			that.data.visiableViewSize = [width, height];
			//清除上次延时触发通知
			if (noticeTimer) {
				clearTimeout(noticeTimer);
			}
			//延时触发通知,500ms
			noticeTimer = setTimeout(function() {
				noticeTimer = 0;
				that.trigger('visableViewScale', that.data.visiableViewSize);
			}, 500);
		}
	});
	//请求获取可视区域数据
	$Event.listen('requestVisableViewScale', function() {
		if (noticeTimer) {
			clearTimeout(noticeTimer);
			noticeTimer = 0;
		}
		//立即返回当前可视区域数据
		$Event.trigger('visableViewScale', that.data.visiableViewSize);
	});
};

/**
 * 初始化菜单控制
 */
iuni.town.viewframe.initMenu = function() {
	if (this.data.hasMenu) {
		var that = this;
		//接受显示菜单请求
		$Event.listen('requestShowMenu', function() {
			if (!that.data.menuShow) {
				//显示菜单
				that.data.menuShow = true;
				$delClass(that.dom.main, that.data.menuHiddenClass);
				//触发尺寸变更
				that.trigger('requestScale');
			}
		});
		//接受隐藏菜单请求
		$Event.listen('requestHideMenu', function() {
			if (that.data.menuShow) {
				//显示菜单
				that.data.menuShow = false;
				$addClass(that.dom.main, that.data.menuHiddenClass);
				//触发尺寸变更
				that.trigger('requestScale');
			}
		});
	}
};

/**
 * 初始化滚动组件
 */
iuni.town.viewframe.initScroll = function() {
	var that = this;
	//变量名，根据滚动条方向确定
	var lengthName = this.data.direct == 'x' ? 'width' : 'height', lengthNameUc = $ucfirst(lengthName);
	var offsetName = this.data.direct == 'x' ? 'left' : 'top', offsetNameUc = $ucfirst(offsetName);
	var visiableViewIndex = this.data.direct == 'x' ? 0 : 1;
	var viewLengthName = 'view' + lengthNameUc, scrollLengthName='scroll' + lengthNameUc, scrollOffsetName = 'scroll' + offsetNameUc, viewScrollOffsetName = 'viewScroll' + offsetNameUc;
	//滚动计时器
	var scrollTimer;
	//滚动显示组件事件监听
	var sliderBar = this.data.sliderBar;
	//设置显示范围变化触发
	sliderBar.onUnitRange(function(range) {
		scrollTo(range[0], 'sliderBar');
	});
	//拖拽释放
	sliderBar.onReleaseMove(function() {
		//检测滚动事件结束
		testScrollEventEnd(true);
	});
	//初始化展示层长度，滚动位置
	if (lengthName == 'width') {
		this.dom.view.style[lengthName] = this.data[viewLengthName] + 'px';
	}
	this.dom.scrollView[scrollOffsetName] = this.data[viewScrollOffsetName];
	//事件转换
	$Event.listen('requestSetViewWidth', function(width) {
		$Event.trigger('requestSetViewLength', width);
	});
	$Event.listen('requestSetViewHeight', function(height) {
		$Event.trigger('requestSetViewLength', height);
	});
	//请求内容展示层长度度变更
	$Event.listen('requestSetViewLength', function(length) {
		if (that.data[viewLengthName] != length) {
			//可见长度
			var visiableLength = that.data.visiableViewSize[visiableViewIndex];
			//更新滚动窗长度
			that.data[viewLengthName] = length;
			//更新实际长度
			if (lengthName == 'width') {
				//高度可以有浏览器控制自己撑大，因此不需要手动设置高度
				if (length < visiableLength) {
					//可视长度大于实际长度，设置实际长度为可视长度
					that.dom.view.style[lengthName] = visiableLength + 'px';
				} else {
					that.dom.view.style[lengthName] = length + 'px';
				}
			}
			//更新滚动组件显示范围
			sliderBar.setTotalRange(0, length);
			//重新当前显示范围
			var state = that.data.sliderBar.getState(), begin = state.begin, end = begin + visiableLength;
			if (end > state.max) {
				end = state.max;
				begin = end - visiableLength;
			}
			if (begin < state.min) {
				begin = state.min;
			}
			that.data.sliderBar.setCurRange(begin, end);
			//更新scroll
			that.data[viewScrollOffsetName] = begin;
			//触发事件，滚动位置发生变化
			that.trigger('viewScroll', begin, state.max - visiableLength);
			//检测滚动事件结束
			testScrollEventEnd(true);
		}
	});
	//请求内容展示滚动到指定位置
	$Event.listen('requestSetViewScroll', function(scroll) {
		if (that.data.viewScrollOffsetName != scroll) {
			scrollTo(scroll);
			//检测滚动事件结束
			testScrollEventEnd(true);
		}
	});
	//请求获取滚动数据
	$Event.listen('requestViewScroll', function() {
		//立即返回当前滚动数据
		$Event.trigger('viewScroll', that.data[viewScrollOffsetName], that.data[viewLengthName] - that.data.visiableViewSize[visiableViewIndex]);
	});

	//鼠标滚轮滚动
	$bindEvent(this.dom.scrollView, function(e) {
		scroll(-1 * that.data.mouseScrollPixel * e.delta);
		//阻止默认行为
		e.preventDefault();
		//检测滚动事件结束
		testScrollEventEnd();
	}, 'mousewheel');
	//拖动滚动
	$bindEvent(this.dom.scrollView, function(e) {
		scrollTo(this[scrollOffsetName], 'scroll');
		//检测滚动事件结束
		testScrollEventEnd();
	}, 'scroll');
	//键盘滚动
	$bindEvent(document, function(e) {
		//带功能键，不处理
		if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
			return;
		}
		//输入框内左右键，不处理
		if (e.target && /^(input)|(textarea)|(select)$/i.test(e.target.tagName)) {
			return;
		}
		if (e.which == '33' || e.which == '34') {
			//pageup?pagedown
			scroll((e.which == '34' ? 1 : -1) * that.data.visiableViewSize[visiableViewIndex]);
		} else if (e.which == '35' || e.which == '36') {
			//home?end
			scrollTo(e.which == '36' ? 0 : that.data[viewLengthName]);
		} else if (e.which == '37' || e.which == '38' || e.which == '39' || e.which == '40') {
			//向右/向下?向左/向上
			scroll(((e.which == '39' || e.which == '40') ? 1 : -1) * that.data.keyScrollPixel);
		} else {
			return;
		}
		//阻止默认行为
		e.preventDefault();
		//检测滚动事件结束
		testScrollEventEnd();
	}, 'keydown');
	//滚动内容视图
	function scroll(inc) {
		scrollTo(that.data[viewScrollOffsetName] + inc);
	}

	//滚动到指定位置
	function scrollTo(scroll, from) {
		//纵向滚动，滚动之前先计算长度
		if(lengthName=='height'){
			var viewLength=Math.max(that.dom.view[scrollLengthName], that.data.visiableViewSize[visiableViewIndex]);
			if(viewLength!=that.data[viewLengthName]){
				//长度发生变更，先重新设置长度
				$Event.trigger('requestSetViewLength',viewLength);
			}
		}
		var minScroll = 0, maxScroll = that.data[viewLengthName] - that.data.visiableViewSize[visiableViewIndex];
		//因viewLengthName有可能小于显示长度度，最大值有可能为负数，因此放到最小值前计算
		if (scroll > maxScroll) {
			scroll = maxScroll;
		}
		if (scroll < minScroll) {
			scroll = minScroll;
		}
		//更新滚动位置
		that.data[viewScrollOffsetName] = scroll;
		that.dom.scrollView[scrollOffsetName] = scroll;
		//非滚动条触发,更新滚动条
		if (from !== 'sliderBar') {
			sliderBar.setCurRange(scroll, Math.min(scroll + that.data.visiableViewSize[visiableViewIndex], that.data[viewLengthName]));
		}
		//触发事件，滚动位置发生变化
		that.trigger('viewScroll', scroll, maxScroll);
	}

	//检查滚动事件结束
	function testScrollEventEnd(now) {
		if (scrollTimer) {
			clearTimeout(scrollTimer);
		}
		if (now) {
			//滚动结束事件
			that.trigger('viewScrollEnd');
			scrollTimer = 0;
		} else {
			//延时触发
			scrollTimer = setTimeout(function() {
				//滚动结束事件
				that.trigger('viewScrollEnd');
				scrollTimer = 0;
			}, 100);
		}
	}

};

/**
 *代理接管触发自定义事件 ，对部分事件重复触发做过滤
 */
iuni.town.viewframe.trigger = function(type, value) {
	var cache = this.data.cache;
	var trigger = true;
	if (type == 'visableViewScale') {
		if (cache['trigger-visableViewScale'] && cache['trigger-visableViewScale'][0] == value[0] && cache['trigger-visableViewScale'][1] == value[1]) {
			trigger = false;
		} else {
			cache['trigger-visableViewScale'] = value;
		}
	} else if (type == 'viewScroll') {
		if (cache['trigger-viewScroll'] === value) {
			trigger = false;
		} else {
			cache['trigger-viewScroll'] = value;
		}
	} else if (type == 'viewScrollEnd') {
		if (cache['trigger-viewScrollEnd'] == cache['trigger-viewScroll']) {
			trigger = false;
		} else {
			cache['trigger-viewScrollEnd'] = cache['trigger-viewScroll'];
		}
	}
	if (trigger) {
		$Event.trigger(type, value);
	}
};

/**
 * 添加触发事件监听，避免内存泄漏。
 */
iuni.town.viewframe.dealEventListener = function() {
	//空事件监听，避免内存泄漏
	$Event.listen('visableViewScale', empty);
	$Event.listen('viewScroll', empty);
	$Event.listen('viewScrollEnd', empty);
	function empty() {
	}

};

if (window.config_viewframe) {
	iuni.town.viewframe.init(window.config_viewframe);
} else {
	iuni.town.viewframe.init();
}
