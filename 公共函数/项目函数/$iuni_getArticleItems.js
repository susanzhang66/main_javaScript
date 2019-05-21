$iuni_getArticleItems
函数描述： 
获得页面文章对象
稍后补充
函数代码： 
/**
 * 获得页面文章对象
 * @param {Object} articles
 * @param {Object} callback
 * @param {Object} typesetTask
 * @param {Object} config
 * @param {Object} syncTask 是否都是同步任务
 */
function $iuni_getArticleItems(articles, callback, typesetTask, config, syncTask) {
	//下面为系统提供默认任务
	//配置任务，给到配置数据
	var configTask=[function(cb){
		return [null,config];
	}];
	
	//所有图片任务，从文章数据中提取所有图片，依赖文章数据任务
	var allImgTask=['article',function(cb, result){
		//文章数据
		var article=result.article;
		//所有图片数据
		var imgs = article.images,imgList=[];
		if($isArray(imgs)){
			$each(imgs, function(img) {
				//重定义图片宽度数组
				var width=img.width,height=img.height,url=img.fpath,sizes = [[width,height]],urls=[url];
				//处理缩略图
				if(img.thumbs){
					$each(img.thumbs.split(','), function(thumb) {
						//缩略图url
						var thumbUrl=url.replace(/(\.[^\.]+)$/,'_'+thumb+'$1');
						urls.push(thumbUrl);
						//缩略图尺寸
						var thumbSize=thumb.split('x');
						//等比缩放
						if(width>height){
							thumbSize[0]*=1;
							thumbSize[1]=Math.round(thumbSize[0]*height/width);
						}else if(height>width){
							thumbSize[0]=Math.round(thumbSize[1]*width/height);
							thumbSize[1]*=1;
						}
						sizes.push(thumbSize);
					});
				}
				//重设图片数据
				img.sizes=sizes;
				img.urls=urls;
				//加入数组
				imgList.push(img);
			});
		}
		//返回
		return [null, imgList];
	}];
	
	//主图任务，从文章所有图片中选出一张合适尺寸的图片作为主图，依赖配置，所有图片任务
	var mainImgTask=['config','allImg',function(cb,result){
		//最小图片尺寸需求
		var minMainImgWidth = result.config.minMainImgWidth;
		//第一个宽度满足最小宽度的图片。
		var mainImg = $arrFind(result.allImg, function(img) {
			return img.width >= minMainImgWidth;
		},1);
		//回调
		return [null, mainImg];
	}];
	
	//图片列表任务，从所有图片中选出3张合适尺寸的图片作为图片列表，依赖配置，主图任务
	var imgListTask=['config','mainImg',function(cb, result){
		//主图
		var mainImg = result.mainImg;
		//获取N个不为主图的图片。
		var imgList = $arrFind(result.allImg, function(img) {
			return img != mainImg;
		}, result.config.imgListLenth);
		//回调
		return [null, imgList.length == 3 ? imgList : null];
	}];
	
	//标题任务，将文章标题内容进行排版排行处理，依赖配置，文章数据任务
	var titleTask=['config','article',function(cb, result){
		//文章数据
		var article=result.article;
		//标题内容
		var title = $strTrim(article.subject);
		if (title) {
			//对标题进行排版
			var lines=$parseTypesetTextSync(title, {width : result.config.textWidth}, result.config.titleFontSizeCache );
			return [null, lines];
		} else {
			return [null, null];
		}
	}];
	
	//内容任务，将文章内容进行排版排行处理，依赖配置，文章数据任务
	var contentTask=['config','article',function(cb,result){
		//文章数据
		var article=result.article;
		//内容
		var content = article.summary;
		if(content){
			//对内容进行排版
			var lines=$parseTypesetTextSync(content, {width : config.textWidth}, result.config.contentFontSizeCache);
			return [null, lines];
		}else{
			return [null, null];
		}
	}];
	
	//主图dom节点任务，生成主图dom结构HTML，依赖配置，主图任务
	var mainImgDomTask=['config','article','mainImg',function(cb,result){
		var config=result.config,article=result.article,mainImg=result.mainImg,html = '', height = 0,width=config.width,heightExt=config.mainImgHeightExt;
		if (mainImg) {
			//尺寸，url
			var size,url;
			//找出合适的url
			var sizes=mainImg.sizes,urls=mainImg.urls,s,v,t;
			for(var i=0,len=sizes.length;i<len;i++){
				s=sizes[i];
				t=Math.abs(s[0]-width);
				if(!v||t<v){
					v=t;
					size=s;
					url=urls[i];
				}
			}
			//进行缩放，算出实际高度
			height=Math.round(size[1]*width/size[0]);
			//限制主图显示最大高度
			var maxHeight = config.maxMainImgHeight,marginTop=0;
			if(height>maxHeight){
				//限高
				height=maxHeight;
				marginTop=-1*Math.round((maxHeight-height)/2);
			}
			//主图HTML，主图输出格式为div-img，img为压缩后的尺寸，div限高
			html = $parseStr('<div class="itm_pics" style="width:{#width#}px;height:{#height#}px;overflow:hidden;"><a href="http://town.iuni.com/post/{#pid#}"><img src="{#url#}" style="width:{#width#}px;margin-top:{#marginTop#}px"/></a></div>', {
				url : url,
				width : width,
				height : height,
				marginTop : marginTop,
				pid:article.pid
			});
			//高度修正
			height+=heightExt;
		}
		return [null, {
			//获得高度
			getHeight : function() {
				return height;
			},
			//获得html
			getHtml : function() {
				return html;
			}
		}];
	}];
	
	//图片列表dom节点任务，生成图片列表dom结构html，依赖配置，图片列表任务
	var imgListDomTask=['config','article','imgList',function(cb,result){
		var config=result.config,article=result.article,imgList=result.imgList,html = '', height = 0,ih=config.imgListHeight,iw=config.imgListWidth,heightExt=config.imgListHeightExt;
		if (imgList) {
			//重设高度
			height=ih;
			var h = ['<a href="http://town.iuni.com/post/'+article.pid+'"><div class="list_box ui_rel cf"><ul class="cf">'];
			//尺寸，url
			var size,url;
			for(var i=0,len=imgList.length;i<len;i++){
				//遍历每一张图片
				var img=imgList[i];
				//找出合适的url
				var sizes=img.sizes,urls=img.urls,s , v = 0 , t;
				for(var j=0,lenj=sizes.length;j<lenj;j++){
					s=sizes[j];
					t=Math.abs(s[0]-iw);
					if(!v||t<v){
						v=t;
						size=s;
						url=urls[j];
					}
				}
				//限制高宽
				var marginTop=marginLeft=0;
				//进行缩放，算出实际尺寸
				if(size[0]>size[1]){
					//宽大于高，以高度为标准，宽度切割
					size[0]=Math.round(size[0]*ih/size[1]);
					size[1]=ih;
					marginLeft=-1*Math.ceil((size[0]-iw)/2);
				}else if(size[0]<size[1]){
					//高大于宽，以宽度为标准，高度切割
					size[1]=Math.round(size[1]*iw/size[0]);
					size[0]=iw;
					marginTop=-1*Math.ceil((size[1]-ih)/2);
				}
				//添加单个图片的html，输出格式为li-div-img，img为压缩后的尺寸，div限宽高
				h.push($parseStr('<li class="{#last#}"><div class="itm_pics" style="width:{#width#}px;height:{#height#}px;overflow:hidden;"><img src="{#url#}" style="width:{#imgWidth#}px;height:{#imgHeight#}px;margin:{#marginTop#}px 0 {#marginTop#}px 0;"/></div></li>', {
					url : url,
					width : iw,
					height : ih,
					imgWidth : size[0],
					imgHeight : size[1],
					marginTop : marginTop,
					marginLeft : marginLeft,
					last:(i==len-1)?'last':''
				}));

			}
			h.push('</ul></a></div>');
			html = h.join('');
			//高度修正
			height+=heightExt;
		}
		return [null, {
			//获得高度
			getHeight : function() {
				return height;
			},
			//获得html
			getHtml : function() {
				return html;
			}
		}];
	}];
	
	//标题dom节点任务，生成标题dom结构html，依赖配置，标题任务
	var titleDomTask=['config','article','title',function(cb,result){
		var config=result.config,article=result.article,title = result.title,maxLine=0,minLine=0,line=0,linHeight=config.titleLineHeight,heightExt=config.titleHeightExt;
		if(title&&title.length){
			maxLine = Math.min(title.length, config.maxTitleLine);
			minLine = config.minTitleLine;
			if(maxLine<minLine){
				minLine=maxLine=0;
			}else{
				line=maxLine;
			}
		}
		return [null, {
			//设置显示行
			setLine : function(l) {
				if (l > maxLine) {
					l = maxLine;
				}
				if (l < minLine) {
					l = minLine;
				}
				line = l;
			},
			getMaxLine : function() {
				return maxLine;
			},
			getMinLine : function(){
				return minLine;
			},
			//获得显示行
			getLine : function() {
				return line;
			},
			getHeightExt:function(){
				return heightExt;
			},
			//获得html
			getHtml : function() {
				return line?('<h3 class="ati_tt"><a href="http://town.iuni.com/post/'+article.pid+'">' + title.slice(0, line).join('') + '</a></h3>'):'';
			},
			//获得高度
			getHeight : function() {
				return line?(linHeight * line+heightExt):0;
			}
		}];
	}];
	
	//内容dom节点任务，生成内容dom结构html，依赖配置，内容任务
	var contentDomTask=['config','article','content',function(cb,result){
		var config=result.config,article=result.article,content = result.content,maxLine=0,minLine=0,defaultLine=0,line=0,linHeight=config.contentLineHeight,heightExt=config.contentHeightExt;
		if(content&&content.length){
			maxLine = Math.min(content.length, config.maxContentLine);
			minLine = config.minContentLine;
			if(maxLine<minLine){
				minLine=maxLine=defaultLine=0;
			}else{
				line=defaultLine=Math.min(maxLine,config.defaultContentLine);
			}
		}
		return [null, {
			//设置显示行
			setLine : function(l) {
				if (l > maxLine) {
					l = maxLine;
				}
				if (l < minLine) {
					l = minLine;
				}
				line = l;
			},
			getMaxLine : function() {
				return maxLine;
			},
			getMinLine : function(){
				return minLine;
			},
			//获得显示行
			getLine : function() {
				return line;
			},
			getHeightExt:function(){
				return heightExt;
			},
			//获得html
			getHtml : function() {
				return line?('<div class="text_box"><a href="http://town.iuni.com/post/'+article.pid+'" class="text_summary">' + content.slice(0, line).join('') + '</a></div>'):'';
			},
			//获得高度
			getHeight : function() {
				return line?(linHeight * line+heightExt):0;
			}
		}];
	}];
	
	//信息dom节点任务，生成信息dom结构html，依赖配置，文章数据任务
	var infoDomTask=['config','article',function(cb,result){
		var config=result.config,article = result.article,html,height=config.infoHeight,
			likedPids = config.likedPids , isLike , pid = article.pid;
		//标签
                article.resTags=$map(article.tags.split(/\s*,\s*/), function(tag) {
			tag = tag.split("\t");
                        if(tag[1]){
			   return '<a href="/tag/posts/'+tag[0]+'">' + tag[1] + '</a> ';
                        }else{
                           return '';
                        }
		    }).join('');

               if(article.resTags!=''){
                   article.resTags='<span class="infor_from">来自 <em class="color_green1">'+article.resTags+'</em></span>';
               }

		//发表时间
		article.dateStr = $formatDate(new Date(parseInt(article.created)),{
			ftcustom:function(time){
				var now=new Date(),tc=now.getTime()-time.getTime(),nmd=now.getTime()%86400000;
				if(tc<nmd){
					return '今天 H:N';
				}else if(tc<(86400000+nmd)){
					return '昨天 H:N';
				}else if(tc<(2*86400000+nmd)){
					return '前天 H:N';
				}else{
					return 'Y-M-D H:N';
				}
			}
		});
		//是否已喜欢
		if( likedPids ){
			for( var i = likedPids.length - 1 ; i >= 0 ; i-- ){
				if( likedPids[i] === pid ){
					isLike = 1;
				}
			}
		}

		article.avatarUrl=$iuni_getAvatar(article.uid_avatar,'small');
		article.userPage='http://town.iuni.com/user/record/'+article.uid;
		article.isLike = isLike ? 'bright' : '';
		//生成html
		html=$parseStr(
			'<div data-id="{#pid#}" class="author_infor"><a href="{#userPage#}" class="imgbox"><img src="{#avatarUrl#}"></a>'+
			'<div class="infor_box"><a href="{#userPage#}">{#uid_nick#}</a><p class="infor_box_limit" data="{#created#}">{#dateStr#}{#resTags#}</p><div class="tow_icon cf"><span class="ht_box"><i class="{#isLike#}"></i><em>{#favorites#}</em></span><span class="xx_box"><i></i><em>{#replies#}</em></span></div></div></div>', article);
		return [null, {
			//获得高度
			getHeight : function() {
				return height;
			},
			//获得html
			getHtml : function() {
				return html;
			}
		}];
	}];
	
	//扩展默认配置
	config = $extend({
		//总宽度
		width : 280,
		//文本宽度
		textWidth:250,
		//主图高度补充修正
		mainImgHeightExt: 0,
		//图片列表高度补充修正
		imgListHeightExt:5,
		//标题高度补充修正
		titleHeightExt:0,
		//内容高度补充修正
		contentHeightExt:0,
		//最小主图宽度
		minMainImgWidth : 280,
		//最大主图高度
		maxMainImgHeight : 280,
		//图片列表数量
		imgListLenth : 3,
		//图片列表高度
		imgListHeight : 90,
		//图片列表单张图片宽度
		imgListWidth : 90,
		//最大标题行数
		maxTitleLine : 2,
		//最小标题函数
		minTitleLine : 1,
		//标题文字样式
		titleFont : {},
		//标题行高
		titleLineHeight : 24,
		//最大内容行数
		maxContentLine : 6,
		//最小内容行数
		minContentLine : 1,
		//默认内容行数
		defaultContentLine : 5,
		//内容文字样式
		contentFont : {},
		//内容行高
		contentLineHeight : 18,
		infoHeight : 102,
		titleFontSizeCache:{},
		contentFontSizeCache:{}
	}, config);
	//扩展默认任务模版
	typesetTask = $extend({
		config:configTask,//提供配置数据
		mainImgDom:mainImgDomTask,//主图dom任务
		imgListDom:imgListDomTask,//图列表dom任务
		titleDom:titleDomTask,//标题dom任务
		contentDom:contentDomTask,//内容dom任务
		infoDom:infoDomTask,//信息dom任务
		mainImg:mainImgTask,//主图任务
		imgList:imgListTask,//图列表任务
		allImg:allImgTask,//所有图片任务
		title:titleTask,//标题任务
		content:contentTask//内容任务
	}, typesetTask);
	
	//开始执行
	preCalcCha(execTasks);
	
	/**
	 * 预处理文本数据
	 */
	function preCalcCha(callback){
		//预处理文本数据，批量计算文字宽度，提高性能
		var titleChaCache=config.titleFontSizeCache, contentChaChache=config.contentFontSizeCache;
		var titleFontStyle=config.titleFont, contentFontStyle=config.contentFont;
		//将所有的标题字符串合并和内容字符串合并
		var titleText = [], contentText = [];
		$each(articles, function(article) {
			titleText.push(article.subject||'');
			contentText.push(article.summary||'');
		});
		//一次性计算字符串宽度，最大化提高效率
		$taskSeries([
		function(cb) {
			//计算标题宽度
			$getCharWidth(titleText.join(''), {
				fontStyles : titleFontStyle,
				chaWidth : titleChaCache,
				callback : function() {
					cb();
				}
			});
		},
		function(cb) {
			//计算内容宽度
			$getCharWidth(contentText.join(''), {
				fontStyles : contentFontStyle,
				chaWidth : contentChaChache,
				callback : function() {
					cb();
				}
			});
		}], function(err){
			//执行完成，进行下一步处理
			callback();
		});
	}
	
	/**
	 * 执行任务
	 */
	function execTasks(){
		if(syncTask){
			$map(articles,function(article,cb){
				var articleTask=[function(cb,result){
					return [null,article];
				}];
				//复制任务
				var task=$clone(typesetTask);
				//加入文章数据任务
				task.article=articleTask;
				//执行任务
				var result=$taskAuto(task);
				return result[1];
			});
			//回调列表
			callback(result);
		}else{
			//序列执行任务
			$asyncMapSeries(articles,function(article,cb){
				var articleTask=[function(cb,result){
					return [null,article];
				}];
				//复制任务
				var task=$clone(typesetTask);
				//加入文章数据任务
				task.article=articleTask;
				//执行任务
				$taskAuto(task,function(err,result){
					//返回main任务内容
					cb(null,result.main);
				});
			},function(err,result){
				//回调列表
				callback(result);
			});
		}
	}
}
调用示例： 
//稍后补充
依赖函数： 
$asyncMapSeries$each$break$map$limitCalls$asyncEachSeries$taskAuto$isArray$limitCalls$curry$isArray$clone$clone$getCharWidth$extend$each$isArray$isEscapeSequense$isAllowedUnicode$each$getCharArray$isAllowedUnicode$keys$map$setStyles$whilst$taskSeries$isArray$asyncMapSeries$asyncEachSeries$keys$extendwww_iuni_com:$iuni_getAvatar$formatDate$map$parseStr$parseTypesetTextSync$extend$each$getCharArray$strTrim$arrFind$each$isArray