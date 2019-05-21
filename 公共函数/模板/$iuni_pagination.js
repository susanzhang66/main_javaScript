函数名称：$iuni_pagination
函数描述： 
用户中心分页
函数代码： 
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
调用示例： 
//初始化翻页对象
this.pager = $iuni_pagination({
	//maxPage : data.data.totalPage,
	displayPage : 4,
	pageCon : "pagebox",
	currPage : 1,
	currPageClass : "thispage",
	callback : function( page , elem ){

		iuni.uc.myorder.getOrderList( page );
	}
});

//设置最大页数,会自动更新按钮
this.pager.setMaxPage( orderList.totalPage );
依赖函数： 
$domAttr$bindEvent$incNum$extend$eventNormalize