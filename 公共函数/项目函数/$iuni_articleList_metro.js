函数名称：$iuni_articleList_metro
函数描述： 
/*****************************
社区metro风格列表组件
params :options 参数对象 所有参数整合成对象传入组件
必选:
	url:根据帖子id获取数据列表的接口
	ids:当前页所有的帖子id数据
	templateId:列表模版的容器id
	container:列表容器id选择器字符串
可选:
	widthChangeCb:列表总宽发生改变时的回调
	setScroll:设置滚动条
	makeItemBf:生成单条帖子html的预处理
	baseIndex:初始索引,详情页返回时用到
	baseScrollLeft:列表初始左偏移,详情页返回时用到
	listGap:整体列表需要增加的间隙[0]
	itemGap:单项列表需要增加的间隙[0]
	minBlockSize:单条数据最小高度[250]
	bigImgLim:大图最小限制[800]
	smallImgLim:小图最小限制[400]
	pageCount:滚动加载每页的条数[50]

****************************/
函数代码： 
function $iuni_articleList_metro( options ){

	//列表总宽发生改变时的回调 , 设置滚动条
	var widthChangeCb = options.widthChangeCb , setScroll = options.setScroll ,		
		makeItemBf = options.makeItemBf , url = options.url , ids = options.ids ,
		templateId = options.templateId , container = $(options.container),
		//初始加载的索引 , 初始滚动定位
		baseIndex = parseInt(options.baseIndex) || 0 ,baseScrollLeft = parseInt(options.baseScrollLeft) || 0 ,
		//整体列表需要增加的间隙 , 单项列表需要增加的间隙
		listGap = options.listGap || 0 , itemGap = options.itemGap || 0,
		//单条数据最小高度
		minBlockSize = options.minBlockSize || 250 ,
		//大图最小限制,小图最小限制
		bigImgLim = options.bigImgLim || 800 , smallImgLim = options.smallImgLim || 400,
		pageCount = options.pageCount || 50;

	//文章列表缓存 , 列表位置映射 , 显示宽度 , 显示高度 , 当前列可用高度 , 块之间的间隙,是否已初始化
	var cacheList = [] ,cacheMap = [[]] , scaleW , scaleH , useableH , inited = false ,
		//列表总宽度 , 返回的page对象 , 当前获取的首条索引 , id总条数
		totalWidth , pageObj , curIndex = 0 , totalCount;

	if( !url || !ids || !templateId || !container.length){
		throw "miss param";
	}
	pageObj = {
		reRender : reRender,
		setScale : setScale,
		onScroll : onScroll,
		getBaseIndex : getBaseIndex,
		init : init,
		inited : inited
	}
	totalCount = ids.length;

	//调整列表
	var getList = (function() {
		var lock;
		return function( ids, callback ) {
			if( lock ){return}
			lock = 1;
			$jsonp({
				url: url,
				data: {
					id: ids.join(',')
				},
				callback: function(res) {
					callback(res.data.dataContext);
					cacheList = cacheList.concat(res.data.dataContext);
					lock = 0;
				},
				errorback: function(res) {
					//错误处理
				}
			});
		}

	})(),
	getOnePage = function( list ){
		//当前页 , 总页数 , 每页条数
		var _curIndex = curIndex;

		if( list ){
			curIndex = list.length;
			adjustList( list );
		}else if( !list && _curIndex < totalCount ){
			getList( ids.slice( _curIndex , (curIndex = _curIndex + pageCount) ) , adjustList );
		}
	},
	makeImgUrl = function( img , type ){
		var size , rsize , _w = img.width , _h = img.height ,
			_mins = minBlockSize , gap = itemGap;
		if( type === "ver" || type === "hor" ){
			size = bigImgLim;
			rsize = minBlockSize * 2 + gap;
			//按大的尺寸得出小尺寸
			img[_w > _h?"_w":"_h"] = rsize;
			img[_w > _h?"_h":"_w"] = rsize * ( _w > _h ? (_h / _w) : (_w / _h) );
		}else if( type === "big" || type === "img" || type === "mix" ){
			size = type === "big" ? bigImgLim : smallImgLim;
			rsize = type === "big" ? (minBlockSize * 2 + gap) : minBlockSize;
			//按小的尺寸得出大尺寸
			img[_w < _h?"_w":"_h"] = rsize;
			img[_w < _h?"_h":"_w"] = rsize * ( _w < _h ? (_h / _w) : (_w / _h) );
		}

		img._path = img.fpath.replace(/(\.[^\.]+)$/, '_' + size + 'x' + size + '$1' );
		return img;
	},
	adjustList = function( list ){
		var useableH = scaleH , _mins = minBlockSize , _maxh = minBlockSize*2+itemGap ,
			_minGap = minBlockSize + itemGap , _maxGap = _maxh + itemGap,
			item , res = "" , _img , mImg , blockType , _w , _h,
			_map = cacheMap , _mapi = _map.length-1 , _mapj = 0 ,
			_lenMapj = Math.floor( useableH / _minGap );
 		
		for( var i = 0 , leni = list.length ; i < leni ; i++ ){
			item = list[i];

			//若有图片
			if( item.images.length > 0 ){
				_img = $arrFind( item.images , function( img ) {//找到最先满足最小尺寸要求的块
					return img.width >= _mins && img.height >= _mins;
				},1);

				if( !_img ){//没有满足条件的图片
					blockType = "text";
				}else{
					item._img = _img;//获得默认图片
					_img.width = _w = parseInt( _img.width );
					_img.height = _h = parseInt( _img.height );
					if( _h / _w > 1.5 && _h >= bigImgLim &&
						_maxh * _w / _h > _mins ){//竖排
						blockType =  "ver";
					}else if( _w / _h > 1.5 && _w >= bigImgLim &&
						_h * _maxh / _w > _mins) {//横排
						blockType =  "hor";
					}else if( _w >= bigImgLim && _h >= bigImgLim && 
						( (_maxh * _w / _h >= _maxh) || 
						(_maxh * _h / _w >= _maxh) )){//大图
						blockType =  "big";
					}else if( _w >= smallImgLim && _h >= smallImgLim && item.subject ){//图文混排
						blockType =  "mix";
					}else{
						blockType = "img";
					}
				}
			}else{//纯文字
				blockType = "text";
			}

			/**********确定排版及块的定位*********/
			while( _map[_mapi][_mapj] ){//确定下一个可用块的位置
				_mapj++;
				if( _mapj >= _lenMapj ){
					_map[++_mapi] = [];
					_mapj = 0;
				}
			}
			//设置数据项的定位
			item._left = _mapi * _minGap;
			item._top = _mapj * _minGap;

			if( blockType === "big" || blockType === "ver" || blockType === "mix" ){
				if( _mapj + 1 < _lenMapj && !_map[_mapi][_mapj + 1] ){//有足够的格子
					_map[_mapi][_mapj] = 1;
					_map[_mapi][_mapj + 1] = 1;
					if( blockType === "big" ){
						if( !_map[_mapi + 1] ){
							_map[_mapi + 1] = [];
						}
						_map[_mapi + 1][_mapj] = 1;
						_map[_mapi + 1][_mapj + 1] = 1;
					}
					_mapj+=2;					
				}else{
					blockType = "img";
					_mapj++;
				}
			}else{
				if( blockType === "hor" ){
					if( !_map[_mapi + 1] ){
						_map[_mapi + 1] = [];
					}
					_map[_mapi + 1][_mapj] = 1;
				}
				_map[_mapi][_mapj] = 1;
				_mapj++;
			}

			if( _mapj >= _lenMapj ){
				_mapj = 0;
				_mapi++;
				if( !_map[_mapi] ){
					_map[_mapi] = [];
				}
			}

			_img && (item._img = makeImgUrl( _img , blockType ));
			item._blockType = blockType;
			makeItemBf && makeItemBf( item );
			res += createItemHtml( item );

		}
		container.append(res);
		totalWidth = _map.length * _minGap + listGap;
		//列表宽度变更回调
		widthChangeCb && widthChangeCb( totalWidth );
		//设置初始显示的位置
		baseScrollLeft && setScroll && setScroll( baseScrollLeft );
	},
	//生成单条数据的html
	createItemHtml = (function(){

		var tplList = $getTpl( templateId ) , tempFun , tempFunCache = {};

		return function( item ){
			if( tempFunCache[item._blockType] ){
				tempFun = tempFunCache[item._blockType];
			}else{
				tempFun = $formatTpl(tplList[item._blockType]);
				tempFunCache[item._blockType] = tempFun;
			}

			return tempFun( item );
		}

	})();

	return pageObj;

	//初始化方法
	function init(){
		if( baseIndex ){//存在初始索引
			getList( ids.slice( 0 , (curIndex = baseIndex + pageCount) ) , adjustList );
			
		}else{
			getOnePage();
		}		
		pageObj.inited = true;
	}

	//重新渲染列表
	function reRender(){
		resetList();
		getOnePage( cacheList );
	}

	//重设列表
	function resetList(){
		container.empty();
		cacheMap = [[]];
		curIndex = 0;
	}

	function setScale( w , h ){
		scaleW = w;
		scaleH = h;
	}

	function onScroll( scroll ){
		if( scroll >=  totalWidth - scaleW ){
			getOnePage();
		}
	}

	function getBaseIndex(){
		return curIndex;
	}

}
调用示例： 
_data.page = $iuni_articleList_metro({
	url: 'http://town.iuni.com/api/post/show/pids?dtype=jsonp',
	ids: bu_pageData.datacontext,
	makeItemBf: function(item) {
		var color = ['#de5a5a', '#a059df', '#3cb5d9', '#25a27f', '#7fbc37', '#e9b702'];

		item.backgroundColor = color[Math.round(Math.random() * (color.length - 1))];

		//标签
		item.resTags = $map(item.tags.split(/\s*,\s*/), function(tag) {
			tag = tag.split("\t");
			if (tag[1]) {
				return '<span>' + tag[1] + '</span>';
			} else {
				return '';
			}
		}).join('');

		//发表时间
		item.dateStr = $formatDate(new Date(parseInt(item.created)), {
			ftcustom: function(time) {
				var now = new Date(),
					tc = now.getTime() - time.getTime(),
					nmd = now.getTime() % 86400000;
				if (tc < nmd) {
					return '今天 H:N';
				} else if (tc < (86400000 + nmd)) {
					return '昨天 H:N';
				} else if (tc < (2 * 86400000 + nmd)) {
					return '前天 H:N';
				} else {
					return 'Y-M-D H:N';
				}
			}
		});

	},
	widthChangeCb: function(width) {
		$Event.trigger('requestSetViewLength', width);
	},
	setScroll: function(scroll) {
		$Event.trigger('requestSetViewScroll', scroll);
	},
	templateId: "item",
	container: "#conBody",
	baseIndex: baseIndex,
	baseScrollLeft: baseScrollLeft,
	itemGap: 1
});
依赖函数： 
$formatTpl$toJSON$getTpl$id$arrFind$jsonp$extend$getCookie$t33$isArray$addParamswww_iuni_com:$