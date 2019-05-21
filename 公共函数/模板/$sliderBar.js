/*
函数名称：$sliderBar
函数描述： 
滑动条组件

参数:
opt 选项，选项内容如下：
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

返回：
滑动条对象，提供以下方法
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
函数代码： 
*/
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
	function flush() {        //cur0:已滑动的滚动条长度，cur1,当前滚动条长度；barLength：当前可视滚动条长度
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
调用示例： 
//创建sliderbar
var sliderbar=$sliderBar({
	direction:'x',//横轴方向
	dom:document.body,//dom元素
	min:1,//表示范围为1-500
	max:500
});

//滑动条滑动到3-20单元范围
sliderbar.setCurRange(3,20);
依赖函数： 
$getOffset$stopPropagation$unbindEvent$eventNormalize$extend$incNum$bindEvent$bindEvent$delClass$hasClass$id$setClass$preventDefault$getEventCoords$addClass$setClass$display$id$attr$formatTpl$toJSON$extend