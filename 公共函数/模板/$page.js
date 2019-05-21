/*
函数名称：$page
函数描述： 
分页组件，允许自定义输出模版

参数：
opt 组件选项，具体选项见下：
tpl：模版，可自定义，如不填使用默认模版
container：组件dom容器，必须
showPn：显示的页数，可选，默认10
showPnPre：显示当前页前N页，默认4
showFirs：是否显示第一页，默认true
showLast：是否显示最后页，默认true
showPre：是否显示上一页，默认true
showNext：是否显示下一页，默认true
showInput：是否显示快速跳转页，默认true
callback：翻页回调函数，传入当前页参数

返回：
返回翻页对象，翻页对象包含init和go方法
init：初始化翻页组件，传入3个参数（总条目数，每页条目数，当前页）
go：跳转到指定页，传入1个参数（指定跳转页）
*/ 
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

/*
调用示例： 
//创建一个翻页组件
var pn=$page({container:$id('output')});
//初始化，300条目，每页10条目
pn.init(300,10);
//跳转到30页
pn.go(30);
依赖函数： 
$attr,$getTarget,$bindEvent,$incNum,$formatTpl,$toJSON,$incNum,$extend

*/