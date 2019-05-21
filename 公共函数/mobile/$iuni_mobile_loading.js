var $iuni_mobile_loading = (function(){
	var getTip = $getSingle(function() {
		var Tips = $iuni_mobile_ui_base.sub(function() {
			this.tpl = '<div class="u_c ui_fixed ui_top ui_bottom"><div class="ui_loading"><canvas class="canvas" width="48" height="48" data-action="loading"></canvas><span data-action="content">小乌龟，爬爬爬</span></div></div>';
			this.black_layer = true;
			this.init.call(this);
		});
		return Tips.getInstance();
	});
	
	return function( param ){
		param=param||{};
		if(typeof param=='string'){
			param={
				content:param
			};
		}
		var closed=false;
		var timer;
		var obj = getTip();
		var canvas=obj.parent.find('[data-action=loading]')[0];
		renderLoading(canvas);
		obj.title.html(param.title || 'loading');
		if(param.content){
			obj.content.html(param.content);
		}
		obj.show();
		return {
			close:close
		};
		function close(){
			if(!closed){
				clearInterval(timer);
				obj.hide();
			}
			closed=true;
		}
		
		function renderLoading(canvas){
			var ctx = canvas.getContext('2d');
		    if(!ctx){
		        return;
		    }
		    ctx.clearRect(0,0,48,48);//擦除画布
		    ctx.fillStyle = 'transparent';
		    ctx.fillRect(0,0,48,48);
		    ctx.fillStyle = 'black'; //定义点的颜色
		    var base = 0;
		    var update = function(){
		        ctx.save(); //把当前的绘图状态保存起来(如旋转角度的初始位置, 填充颜色, 坐标原点等)
		        ctx.clearRect(0,0,48,48);//擦除画布
		        ctx.translate(24, 24);//把坐标原点移动到画布中央
		        base = (++base === 13) ? (base - 12) : base;//使用base来指示最大的圆点所在的位置, 实现旋转动画的效果
		        var angle = Math.PI / 6;//画12个点, 所以每个点之间的角度是 1/6 PI
		        var beginAngle = angle * base ;
		        for(var i = 1; i <= 6; i ++){ //小圆点半径
		            ctx.beginPath();//开始一个路径
		            if(i === 1){
		                ctx.rotate(beginAngle);
		            }else{
		                ctx.rotate(angle);//每次调用rotate之后, 其旋转角度并不会还原, 而是接着上一次的位置
		            }
		            ctx.arc(0, -18, i * 0.8 + 1, 0, 2 * Math.PI, true);//绘制一个圆点，第二个数字是大圆半径
		            ctx.closePath();//闭合路径
		            //如果不是用beginPath和closePath, 在调用fill方法时, 会导致画布上的所有圆都重叠在一起了
		            ctx.fill();//填充(使用上面最后定义的fillStyle)
		        }
		        ctx.restore();//还原绘图状态, 如果不还原, 则下一次调用rotate时会接着这次的位置旋转, 而不是初始位置
		    }
		    update();
		    timer=setInterval(update, 50);
		}
	}
})();