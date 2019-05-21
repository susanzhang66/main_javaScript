函数名称：$iuni_articleListItem
函数描述： 
对返回的文章列表数据进行任务处理
函数代码： 
/**
 * iuni 文章列表单元对象
 * @param {Object} opt
 */
function $iuni_articleListItem(articles , callback , typesetTask , config , chaCache) {
	if( !typesetTask ){return}

	//配置
	config = $extend({
			//宽度
			width : 280,
			//最小主图宽度
			minMainImgWidth : 280,
			//最大主图高度，高过部分切除
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
			titleFont : {
				fontFamily : "'Microsoft Yahei'",
				fontSize : '16px',
				lineHeight : '24px',
				whiteSpace : 'pre',
				margin : 0,
				padding : 15,
				border : 0,
				display : 'block'
			},
			//标题行高
			titleLineHeight : 24,
			//最大内容行数
			maxContentLine : 6,
			//最小内容行数
			minContentLine : 3,
			//默认内容行数
			defaultContentLine : 5,
			//内容文字样式
			contentFont : {
				fontFamily : "'Microsoft Yahei'",
				fontSize : '12px',
				lineHeight : '18px',
				whiteSpace : 'pre',
				margin : 0,
				padding : 0,
				border : 0,
				display : 'block'
			},
			//内容行高
			contentLineHeight : 18,
			infoHeight : 102
		}, config);	

	//标题文字尺寸缓存
	var titleFontSizeCache = (chaCache && chaCache.titleFontSizeCache) || {},
		contentFontSizeCache = (chaCache && chaCache.contentFontSizeCache) || {},
		//排版数据
		_typesetTask = $extend( {
			//主图片任务，返回输出文章排版主图html的函数
			'mainImgDom' : ['mainImg',
			function(cb, result) {
				var html = '' , height = 0 , mheight = height;
				if ( result.mainImg ) {
					var img = this.article._images[0] , width = config.minMainImgWidth,
						//封面图尺寸对象
						sizeData = result.mainImg[0] , marginTop = 0,
						size = sizeData.value, url = img[sizeData.index];

					mheight = height = Math.round(size[1] * width / size[0]);
					if (height > config.maxMainImgHeight) {
						mheight = config.maxMainImgHeight;
						marginTop = Math.round((height - mheight ) / 2);
					}

					html = $parseStr('<div class="itm_pics" style="height:{#mheight#}px;overflow:hidden"><a href="#"><img src="{#url#}" width="{#width#}" style="margin-top:{#marginTop#}px"/></a></div>', {
						url : url,
						width : width,
						mheight : mheight,
						marginTop : marginTop
					});
				}
				cb(null, {
					//获得html
					getHtml : function() {
						return html;
					},
					//获得高度
					getHeight : function() {
						return mheight;
					}
				});
			}],
			//小图列表任务，返回内容为文章排版小图列表html
			'imgListDom' : ['imgList',
			function(cb, result) {
				var html = '', height = 0;
				if (result.imgList) {
					var h = ['<div class="list_box ui_rel cf"><ul class="cf">'], ih = 90, iw = 90;
					$each(result.imgList, function(img) {
						//获得最接近展示的图片尺寸
						var sizeData = $arrNear(bbcode.data.sizes, function(size) {
							var o;
							if (size[0] * ih < size[1] * iw) {
								o = size[0] - iw;
							} else {
								o = size[1] - ih;
							}
							return o == 0 ? Number.MAX_VALUE : 1 / (Math.abs(o));
						}, 1);
						//获得高度和url数据
						var dataset = $map($arrMergeProperties({
							size : data.sizes,
							url : data.urls
						}), function(d) {
							return d.size[0] + ',' + d.size[1] + ',' + d.url;
						});
						//处理高度
						var size = sizeData.value, url = bbcode.data.urls[sizeData.index];
						//图片html
						if (size[0] * ih > size[1] * iw) {
							var ciw = Math.round(size[1] * ih / size[0]);
							h.push($parseStr('<li><img src="{#url#}" style="width:{#width#}px;height:{#height#}px;margin-left:{#offset#}px" dataset="{#dataset#}"/></li>', {
								url : url,
								width : ciw,
								height : ih,
								offset : -1 * Math.round((size[0] - size[1]) * ih / (2 * size[1])),
								dataset : dataset.join('#')
							}));
						} else {
							var cih = Math.round(size[1] * iw / size[0]);
							h.push($parseStr('<li><img src="{#url#}" style="width:{#width#}px;height:{#height#}px;margin-top:{#offset#}px;" dataset="{#dataset#}"/></li>', {
								url : url,
								width : iw,
								height : cih,
								offset : -1 * Math.round((size[1] - size[0]) * iw / (2 * size[0])),
								dataset : dataset.join('#')
							}));
						}
					});
					h.push('</ul></div>');
					html = h.join('');
					height = ih;
				}
				cb(null, {
					//获得html
					getHtml : function() {
						return html;
					},
					//获得高度
					getHeight : function() {
						return height;
					}
				});
			}],
			//标题任务，返回内容为文章排版标题内容html
			'titleDom' : ['title',
			function(cb, result) {
				var title = result.title, maxLine = Math.min(title.length, config.maxTitleLine), line = title.length;
				cb(null, {
					//设置显示行
					setLine : function(l) {
						if (l > maxLine) {
							l = maxLine;
						}
						if (l < 0) {
							l = 0;
						}
						line = l;
					},
					getMaxLine : function() {
						return maxLine;
					},
					//获得显示行
					getLine : function() {
						return line;
					},
					//获得html
					getHtml : function() {
						var t = title.slice(0, line);
						if (t.length == 0) {
							return '';
						}
						return ' <h3 class="ati_tt"><a href="#">' + t.join('') + '</a></h3>';
					},
					//获得高度
					getHeight : function() {
						var _config = config;
						return _config.titleLineHeight * line + _config.titleFont.padding + _config.titleFont.margin + _config.titleFont.border;
					}
				});
			}],
			//内容任务，返回内容为文章排版内容html
			'contentDom' : ['content',
			function(cb, result) {
				var content = result.content, maxLine = Math.min(content.length, config.maxContentLine), line = maxLine;
				cb(null, {
					//设置显示行
					setLine : function(l) {
						if (l > maxLine) {
							l = maxLine;
						}
						if (l < 0) {
							l = 0;
						}
						line = l;
					},
					getMaxLine : function() {
						return maxLine;
					},
					//获得显示行
					getLine : function() {
						return line;
					},
					//获得html
					getHtml : function() {
						var c = content.slice(0, line);
						if (c.length == 0) {
							return '';
						}
						return '<div class="text_box">' + c.join('') + '</div>';
					},
					//获得高度
					getHeight : function() {
						return config.contentLineHeight * line;
					}
				});
			}],
			//主图内容
			'mainImg' : ['allImgs',
			function(cb, result) {
				var minMainImgWidth = config.minMainImgWidth,
					//约定第一张为封面图片
					mainImg = result.allImgs[0];
				//获取第一个宽度满足最小宽度的图片。
				var mainImgCode = $arrNear( mainImg , function( w ) {
					return w[0] >= minMainImgWidth;
				}, 1);
				cb(null, mainImgCode);
			}],
			//图片列表
			'imgList' : ['mainImg',
			function(cb, result) {
				var imgListLenth = config.imgListLenth, mainImg = result.mainImg;
				//获取三个不为主图的图片。
				var imgListCode = $arrFind(result.allImgs, function(bbcode) {
					return bbcode != mainImg;
				}, imgListLenth);
				cb(null, imgListCode.length == 3 ? imgListCode : null);
			}],
			//内容处理，文字转换为行
			'content' : ['allTexts',
			function(cb, result) {
				$parseTypesetText(result.allTexts, {
					width : config.width
				}, config.contentFont, function(lines) {
					cb(null, lines);
				}, this.contentFontSizeCache);
			}],
			//解析BBCODE
			'bbcodes' : function(cb) {
				//var _article = article;
				var bbcodes = $iuni_parseBBcode( this.article.summary );
				cb(null, bbcodes);
			},
			//所有图片
			'allImgs' : function(cb, result) {
				var imgs = this.article._images,
					reg = /_(\d+)x(\d+)\./,
					result = [] , sizeList;

				imgs && $each( imgs , function( items , i ){
					//重定义图片宽度数组
					sizeList = [];
					$each( items , function( item , j ){
						var obj = item.match( reg );
						//截取尺寸值width,height
						sizeList.push( obj? [obj[1] , obj[2]] : [0,0] );
					});
					result.push( sizeList );
				});
				cb(null, result);
			},
			//所有文字内容
			'allTexts' : function(cb, result) {
				var bbcodes = result.bbcodes;
				var text = [];
				$each(bbcodes, function(code) {
					if (code.type == 'bbcode') {
						var data = code.data;
						if (data.type == 'url') {
							text.push(data.text);
						}
					} else {
						text.push(code.data);
					}
				});
				cb(null, text.join(''));
			},
			//标题处理，文字转换为行
			'title' : function(cb, result) {
				var title = $strTrim( this.article.subject );
				if (title) {
					$parseTypesetText( title , {
						width : config.width
					}, config.titleFont, function(lines) {
						cb(null, lines);
					}, this.titleFontSizeCache);
				} else {
					cb(null, []);
				}
			},
			//文章信息任务，返回内容为文章排版文章信息内容html
			'infoDom' : function(cb, result) {

				var article = this.article,
					date , _tags = article.tags.split(","),
					resTags = '';

				date = new Date(article.created*1000);

				//对标签处理
				$each( _tags , function( item ){
					var tag = item.split("\t");
					resTags += '<a href="#">'+ tag[1] +'</a> '
				});console.log(resTags,resTag);
                                if(resTag!=''){
                                   resTag='<span class=" infor_from">来自 <em class="color_green1">'+ resTag+'</em></span>';
                                }else{
                                   resTag='';
                                }

				//对发表时间处理
				article.created = getFriendDate( date );
				article.tags = resTags;

				function getFriendDate( date ){
					var tdate = new Date(),
						dName = ["今天","昨天","前天"];

					if( date.getFullYear() === tdate.getFullYear() &&
						date.getMonth() === tdate.getMonth() &&
						(tdate.getDate() - date.getDate() < 2)){
						return dName[date.getDate() - tdate.getDate()] + 
							'<span>'+date.getHours() + '：' + date.getMinutes() +'</span>';
					}else{
						return [date.getFullYear(),date.getMonth(),date.getDate()].join('-');
					}
				}
				cb(null, {
					
					//获得html
					getHtml : function() {
						return $parseStr('<div data-id="{#pid#}" class="author_infor"><a href="#" class="imgbox"><img src="{#uid_avatar#}"></a><div class="infor_box"><a href="#" title="">{#uid_nick#}</a><p>{#created#}{#tags#} </p><div class="tow_icon cf"><span class="ht_box"> <i></i> <em>{#favorites#}</em></span><span class="xx_box"> <i></i><em>{#replies#}</em></span></div></div></div>',
						article);
					},
					//获得高度
					getHeight : function() {
						return config.infoHeight;
					}
				});

			}

		} , typesetTask ),
		//解析任务
		tasks = {} , resultList = [];



	for (var tname in _typesetTask) {
		var list = _typesetTask[tname];
		if (!$isArray(list)) {
			list = [list];
		}
		var last = list.length - 1, tl = [];
		$each(list, function(t, i) {
			if (i != last) {
				tl.push(t);
			} else {
				tl.push(getRrenderTplTask(t));
			}
		});
		tasks[tname] = tl;
	}

	//获取渲染模版任务
	function getRrenderTplTask(tpl) {
		if ( typeof tpl == 'string') {
			var fn = $formatTpl(tpl);
			return function(cb, result) {
				try {
					var html = $parseStr(fn(result), result);
					cb(null, html);
				} catch(e) {
					cb(e, null);
				}
			};
		} else {
			return tpl;
		}
	}

	//对象
	var obj = {
		state : 'loading',
		onload : null
	},
	completeCount = 0;
	for( var i = 0 , len = articles.length ; i < len ; i++ ){
		//执行并输出内容
		$taskAuto( tasks , function(err, result) {
			if (err) {
				throw err;
				//obj.state = 'failure';
			} else {
				completeCount ++ ;
				resultList.push(result.main);
				obj.state = 'complete';
				obj.main = result.main;
					
				if( len === completeCount ){
					callback && callback( resultList );
				}
			}
		} , {
			article : articles[i] , config : config , 
			titleFontSizeCache : titleFontSizeCache , 
			contentFontSizeCache : contentFontSizeCache
		});
	}

	return obj;
}
调用示例： 
$iuni_articleListItem( list , initPage , options.typesetTask , options.config );
依赖函数： 
$taskAuto$isArray$limitCalls$curry$isArray$clone$formatTpl$toJSON$isArray$strTrimwww_iuni_com:$iuni_parseBBcode$each$each$break$map$arrRemove$parseUrl$strTrim$parseStr$parseTypesetText$extend$whilst$setStyles$map$keys$isAllowedUnicode$getCharArray$isArray$each$extend$getCharWidth$each$isEscapeSequense$isAllowedUnicode$each$getCharArray$arrFind$arrMergeProperties$keys$each$arrNear$each$map$arrNear$each$parseStr$extend
被依赖函数： 
www_iuni_com:$iuni_articlePage