函数名称：$iuni_articleBlocksPage
函数描述： 
社区横向列表排版组件，说明后续补充
函数代码： 
function $iuni_articleBlocksPage(opt) {

	//id列表，数据列表,通过函数回调加载获得,固定不变
	var idList, dataList;
	//已经填充好的数据块(链表首,链表尾),定义数据块元素{isNew,changed,blockId,start,startIndex,end,endIndex,prevDistance,rows,prevBlock,nextBlock}
	var startFilledBlock, endFilledBlock, nextBlockId = 0;
	//视图宽度,滚动结束位置,总共输出列数,向前预输出列数,向后预输出列数,计算得出
	var viewWidth, scrollEnd, rowNum, prevRowNum, nextRowNum;
	//计算用数据,剩下最右侧未计算区域宽度,输出补边宽度,列模板函数
	var remainWidth, preViewPadding;
	//当前视图的开始位置索引,偏移量,用于重绘
	var baseIndex = 0, baseIndexOffset;
	//算法控制,扩展邻近块时判断最多额外加载的列数
	var useBlockDiffNum = 4;
	//可视视图宽度，可视视图高度，滚动开始位置,外界通知(变量)
	var visiableWidth, visiableHeight, scrollStart = 0,scrollOffset=0;
	//列宽间隙，元素间隙，列宽，列模版,外部设置(常量)
	var rowGap = opt.rowGap, itemGap = opt.itemGap, rowWidth = opt.rowWidth + rowGap,leftWidth=opt.leftWidth||0,rightWidth=opt.rightWidth;
	//回调(获取ID列表，获取数据，设置视图宽度,设置html,滚动控制),外部设置(常量)
	var getListCb = opt.onGetIdList, getDataCb = opt.onGetDatas, viewWidthCb = opt.onViewWidthChange, viewBlockCb = opt.onViewBlockChange, scrollCb = opt.onScrollChange;
	//运行数据,初始化,是否在渲染,是否需要下次渲染,是否正在设置滚动,运行时上下文
	var inited = false, rending = false, nextRending = false, inSetScroll = false, context;

	//页面对象
	var pageObj = {
		//总宽度变更时回调
		onViewWidth : function(callback) {
			viewWidthCb = callback;
		},
		//内容html输出回调
		onViewBlock : function(callback) {
			viewBlockCb = callback;
		},
		//内容重新定位滚动位置
		onReScroll : function(callback) {
			scrollCb = callback;
		},
		//请求数据回调
		onGetData : function(callback) {
			getDataCb = callback;
		},
		//请求数据Id列表使用
		onGetList : function(callback) {
			getListCb = callback;
		},
		//初始化加载
		init : function(id) {
			if (!inited) {
				//加载id列表
				getListCb(function(ids) {
					idList = ids;
					dataList = new Array(ids.length);
					//找到初始化元素
					for (var i = 0, len = ids.length; i < len; i++) {
						if (ids[i] == id) {
							baseIndex = i; 
							break;
						}
					}
					//重绘
					genHtml();
					inited = true;
				});
			}
		},
		init2 : function(index,offset) {      //id:索引位置；
			if (!inited) {
				//加载id列表
				getListCb(function(ids) {
					idList = ids;
					dataList = new Array(ids.length);
					//找到初始化元素
					baseIndex = index;
					baseIndexOffset=offset||0;
					//重绘
					genHtml();
					inited = true;
				});
			}
		},
		//页面滚动到位置
		scrollTo : function(scroll) {
			if (inSetScroll) {
				return;
			}
			//处理显示范围有边距的情况
			if(scroll<leftWidth){
				scrollOffset=scroll;
				scroll=0;
			}else{
				scrollOffset=leftWidth;
				scroll-=leftWidth;
			}
			
			if (scrollStart != scroll) {
				scrollStart = scroll;
				//重绘
				inited && genHtml();
			}
		},
		//设置页面可视尺寸
		setVisiableViewScale : function(width, height) {
			if (visiableWidth != width || visiableHeight != height) {
				visiableWidth = width;
				visiableHeight = height;
				//重绘
				inited && genHtml();
			}
		},
		reRender : function(){
			if( inited ){
				//清除链表
				startFilledBlock = endFilledBlock = null;
				genHtml();
			}			
		},
		getBaseIndex : function(){
			return [baseIndex,baseIndexOffset];
		}
	};

	return pageObj;

	/**
	 *计算需要渲染的列
	 */
	function calcRowNum() {
		if (!rowWidth || !visiableWidth) {
			prevRowNum = nextRowNum = 0;
		}
		//左扩展,右扩展
		prevRowNum = nextRowNum = Math.ceil(visiableWidth / rowWidth);
		rowNum = prevRowNum * 3;
		//补边
		preViewPadding = visiableWidth - prevRowNum * rowWidth;
	}

	/**
	 * 生成html
	 */
	function genHtml() {
		//保护措施,避免过多异步调用
		if (rending) {
			nextRending = true;
			return;
		}
		rending = true;
		//计算内容
		if (!context || context.scrollStart != scrollStart) {
			scrollEnd = scrollStart + visiableWidth;
		}
		if (!context || context.visiableWidth != visiableWidth) {
			calcRowNum();
		}
		if (!context || context.visiableHeight != visiableHeight) {
			//清除链表
			startFilledBlock = endFilledBlock = null;
		}
		//新建上下文，当前运行环境保护
		context = {
			visiableWidth : visiableWidth,
			visiableHeight : visiableHeight,
			scrollStart : scrollStart,
			lastTime : new Date().getTime()
		};
		//更新填充前的时间戳，用于判断块变更时间
		//填充列
		fillRows(function() {
			if (nextRending) {
				//不输出并重绘
				//设置渲染
				rending = false;
				//继续重绘
				nextRending = false;
				setTimeout(genHtml);
			} else {
				//重新排列高度
				autoAdjustBlockRows();
				//生成块缓存
				var allBlockIds = {}, hasChanged = false;
				var node = startFilledBlock;
				while (node) {
					if (node.changed) {
						hasChanged = true;
					}
					allBlockIds[node.blockId] = node;
					node = node.nextBlock;
				}
				if (hasChanged) {
					//重新定位
					resetScroll();
					//回调内容
					viewBlockCb(startFilledBlock, allBlockIds);
					//将所有块设置为未更改
					unchangeAllBlocks();
				}
				//设置渲染
				rending = false;
				//输出并重绘
				if (nextRending) {
					//继续重绘
					nextRending = false;
					setTimeout(genHtml);
				}
			}
		});
	}

	/**
	 * 计算基节点
	 */
	function calcBaseIndex(extendBlock) {
		if (extendBlock.isNew) {
			//新建节点
			var index = extendBlock.startIndex;
			var distance = context.scrollStart % rowWidth;
			distance = distance ? (distance - rowWidth) : 0;
		} else {
			if (extendBlock.start > scrollEnd) {
				//需要左扩展，判断第一个元素
				var index = extendBlock.startIndex;
				//相对显示区域距离
				var distance = extendBlock.start - context.scrollStart;
			} else if (extendBlock.end < context.scrollStart) {
				//需要右扩展，判断最后一个元素
				var index = extendBlock.endIndex;
				var distance = extendBlock.end - context.scrollStart;
			} else {
				//显示范围内，找到第一个显示的元素
				var rowLeft, rowRight, rowIndex = extendBlock.startIndex;
				for (var i = 0, len = extendBlock.rows.length; i < len; i++) {
					rowLeft = extendBlock.start + i * rowWidth;
					rowRight = rowLeft + rowWidth;
					if (rowLeft > context.scrollStart || rowRight > context.scrollStart) {
						var index = rowIndex;
						var distance = rowLeft - context.scrollStart;
						break;
					}
					rowIndex += extendBlock.rows[i].length;
				}
			}
		}
		//设定当前值
		context.baseIndex = index;
		context.baseOffset = distance;
		//设定全局值
		baseIndex = index;
		baseIndexOffset = distance;

	}

	/**
	 * 重新定位
	 */
	function resetScroll() {
		//查找block
		var node = startFilledBlock, curBaseIndex = context.baseIndex;
		while (node) {
			//查询当前定位位置
			if (node.endIndex < curBaseIndex) {
				node = node.nextBlock;
				continue;
			} else {
				var startIndex = node.startIndex, endIndex;
				for (var i = 0, len = node.rows.length; i < len; i++) {
					endIndex = startIndex + node.rows[i].length - 1;
					if (startIndex <= curBaseIndex && endIndex >= curBaseIndex) {
						curScroll = node.start + i * rowWidth - context.baseOffset;
						//重新设置宽度
						viewWidth = endFilledBlock.end + remainWidth;
						//重新设置滚动
						scrollStart = curScroll;
						//判断末尾
						if (scrollStart + context.visiableWidth > viewWidth) {
							scrollStart = viewWidth - context.visiableWidth;
						}
						//正在设置滚动，停止接收重绘信息
						inSetScroll = true;
						//通知宽度更改(加上边界宽)
						viewWidthCb(viewWidth+leftWidth);
						//通知滚动更改
						scrollCb(scrollStart+scrollOffset);
						//设置滚动完成，接收重绘信息
						inSetScroll = false;
						return;
					}
					startIndex = endIndex + 1;
				}
				return;
			}
		}
	}

	/**
	 * 自动重新调节列高
	 */
	function autoAdjustBlockRows() {
		var node = startFilledBlock;
		while (node) {
			for (var i = 0, len = node.rows.length; i < len; i++) {
				if (!node.rows[i].autoAdjusted) {
					autoAdjust(node.rows[i]);
					node.rows[i].autoAdjusted = true;
				}
			}
			node = node.nextBlock;
		}
	}

	/**
	 * 将所有块设置为未更改
	 */
	function unchangeAllBlocks() {
		var node = startFilledBlock;
		while (node) {
			node.isNew = false;
			node.changed = false;
			node = node.nextBlock;
		}
	}

	/**
	 * 查询滚动节点附近已经填充好的缓存数据块
	 */
	function findfilledBlocks() {
		var node = startFilledBlock;
		while (node) {
			//查询当前定位位置
			if (node.start <= context.scrollStart) {
				if (node.end < context.scrollStart) {
					//下一个节点
					node = node.nextBlock;
					continue;
				} else {
					//范围内,找到已经填充的数据块
					return node;
				}
			} else {
				//已经超出范围,返回距离最近的节点
				if (node.prevBlock) {
					return (context.scrollStart - node.prevBlock.end) <= (node.start - scrollEnd) ? node.prevBlock : node;
				}
				return node;
			}
		}
		//返回末尾节点
		return endFilledBlock;
	}

	/**
	 * 填充列
	 * @param callback 回调
	 */
	function fillRows(callback) {
		//查找当前位置填充好的块
		var nearBlock = findfilledBlocks();
		if (nearBlock) {
			var start = nearBlock.start, end = nearBlock.end;
			if (end < context.scrollStart) {
				//前节点向后扩展
				var diffNum = Math.floor((context.scrollStart - end) / rowWidth);
				if (diffNum <= useBlockDiffNum) {
					var fillNum = diffNum + rowNum - prevRowNum;
					//向后排
					return fillNext(nearBlock, fillNum, callback);
				} else {
					//新建当前位置空节点
					var
					//开始位置
					start = nearBlock.end,
					//结束位置
					end = nearBlock.nextBlock ? nearBlock.nextBlock.start : viewWidth,
					//开始索引
					startIndex = nearBlock.endIndex + 1,
					//结束索引
					endIndex = nearBlock.nextBlock ? nearBlock.nextBlock.startIndex - 1 : idList.length - 1,
					//总行
					totalNum = (end - start) / rowWidth,
					//当前索引
					curIndex = startIndex + Math.floor((endIndex - startIndex) * diffNum / totalNum);
					var newBlock = {
						isNew : true,
						blockId : nextBlockId++,
						startIndex : curIndex,
						endIndex : curIndex - 1,
						rows : [],
						prevBlock : nearBlock,
						nextBlock : nearBlock.nextBlock
					};
					//插入节点
					if (nearBlock.nextBlock) {
						nearBlock.nextBlock.prevBlock = newBlock;
					} else {
						endFilledBlock = newBlock;
					}
					nearBlock.nextBlock = newBlock;
					//两边扩展
					return fillBoth(newBlock, prevRowNum, rowNum - prevRowNum, callback);
				}
			} else if (start > scrollEnd) {
				//后节点向前扩展
				var diffNum = Math.ceil((start - scrollEnd) / rowWidth);
				if (diffNum <= useBlockDiffNum) {
					var fillNum = diffNum + rowNum - nextRowNum;
					//向前排
					return fillPrev(nearBlock, fillNum, callback);
				} else {
					//新建当前位置空节点
					var
					//第一个元素的行差
					diffStartNum = Math.ceil((start - scrollStart) / rowWidth),
					//开始位置
					start = nearBlock.prevBlock ? nearBlock.prevBlock.end : 0,
					//结束位置
					end = nearBlock.start,
					//开始索引
					startIndex = nearBlock.prevBlock ? nearBlock.prevBlock.endIndex + 1 : 0,
					//结束索引
					endIndex = nearBlock.startIndex - 1,
					//总行
					totalNum = (end - start) / rowWidth,
					//当前索引
					curIndex = endIndex - Math.ceil((endIndex - startIndex) * diffStartNum / totalNum);
					var newBlock = {
						isNew : true,
						blockId : nextBlockId++,
						startIndex : curIndex,
						endIndex : curIndex - 1,
						rows : [],
						prevBlock : nearBlock.prevBlock,
						nextBlock : nearBlock
					};
					//插入节点
					if (nearBlock.prevBlock) {
						nearBlock.prevBlock.nextBlock = newBlock;
					} else {
						startFilledBlock = newBlock;
					}
					nearBlock.prevBlock = newBlock;
					//两边扩展
					return fillBoth(newBlock, prevRowNum, rowNum - prevRowNum, callback);
				}
			} else {
				//当前节点
				//当前列,总列
				var curRow = Math.floor((context.scrollStart - nearBlock.start) / rowWidth), totalRow = nearBlock.rows.length;
				if (nearBlock.startIndex != 0 && curRow < prevRowNum) {
					//向前扩展
					//向前排
					var fillNum = prevRowNum - curRow;
					return fillPrev(nearBlock, fillNum, callback);
				} else if ((nearBlock.endIndex != idList.length - 1) && totalRow - curRow < rowNum - prevRowNum) {
					//向后扩展
					//向后排
					var fillNum = (rowNum - prevRowNum) - (totalRow - curRow);
					return fillNext(nearBlock, fillNum, callback);
				} else {
					//计算基点
					calcBaseIndex(nearBlock);
					//无需扩展
					return callback();
				}
			}
		} else {
			//新建第一个空节点
			//获取之前的基点和定位偏移
			var curBaseIndex = baseIndex;
			var curBaseIndexOffset = baseIndexOffset || 0;
			var newBlock = {
				isNew : true,
				blockId : nextBlockId++,
				startIndex : curBaseIndex,
				endIndex : curBaseIndex - 1,
				rows : [],
				prevBlock : null,
				nextBlock : null
			};
			//插入节点
			startFilledBlock = endFilledBlock = newBlock;
			//两边扩展
			return fillBoth(newBlock, prevRowNum, rowNum - prevRowNum, function() {
				//新建第一个节点时，需要对定位基点和偏移重新计算
				context.baseIndex = curBaseIndex;
				context.baseOffset = curBaseIndexOffset;
				//重设
				baseIndex = curBaseIndex;
				baseIndexOffset = curBaseIndexOffset;
				callback(curBaseIndex);
			});
		}
	}

	//向前扩展
	function fillPrev(node, num, callback) {
		//计算基点
		calcBaseIndex(node);
		//向前扩展N列
		fillRowsNum(node.startIndex - 1, num, false, function(rows, nextIndex) {
			if (nextIndex == -1) {
				//已经排到了最开头,改为从头往后排
				fillRowsUntil(0, node.endIndex, function(rows, nextIndex) {
					//更改链表结构,重新定义表头
					startFilledBlock = node;
					node.prevBlock = null;
					//设置数据
					node.rows = rows;
					node.startIndex = 0;
					node.endIndex = nextIndex - 1;
					node.changed = true;
					//检查链表并回调
					return checkBlockList(callback);
				});
			} else {
				node.rows = rows.concat(node.rows);
				node.startIndex = nextIndex + 1;
				node.changed = true;
				//检查链表并回调
				return checkBlockList(callback);
			}
		});
	}

	//向后扩展
	function fillNext(node, num, callback) {
		//计算基点
		calcBaseIndex(node);
		//向后扩展N列
		fillRowsNum(node.endIndex + 1, num, true, function(rows, nextIndex) {
			node.rows = node.rows.concat(rows);
			node.endIndex = nextIndex - 1;
			node.changed = true;
			//检查链表并回调
			return checkBlockList(callback);
		});
	}

	//两边扩展
	function fillBoth(node, leftNum, rightNum, callback) {
		//计算基点
		calcBaseIndex(node);
		fillRowsNum(node.startIndex - 1, leftNum, false, function(rows, nextIndex) {
			if (nextIndex == -1) {
				//已经排到了最开头,改为从头往后排
				fillRowsNum(0, leftNum + node.rows.length + rightNum, true, function(rows, nextIndex) {
					//更改链表结构,重新定义表头
					startFilledBlock = node;
					node.prevBlock = null;
					//设置数据
					node.rows = rows;
					node.startIndex = 0;
					node.endIndex = nextIndex - 1;
					node.changed = true;
					//检查链表并回调
					return checkBlockList(callback);
				});
			} else {
				node.rows = rows.concat(node.rows);
				node.startIndex = nextIndex + 1;
				fillRowsNum(node.endIndex + 1, rightNum, true, function(rows, nextIndex) {
					node.rows = node.rows.concat(rows);
					node.endIndex = nextIndex - 1;
					node.changed = true;
					//检查链表并回调
					return checkBlockList(callback);
				});
			}
		});
	}

	/**
	 * 检查链表顺序
	 */
	function checkBlockList(callback) {
		if (!startFilledBlock) {
			callback();
		}
		var node = startFilledBlock;
		while (node) {
			var next = node.nextBlock;
			if (next) {
				if (next.startIndex <= node.endIndex) {
					//链表删除next节点
					node.changed = true;
					node.nextBlock = next.nextBlock;
					if (node.nextBlock) {
						node.nextBlock.prevBlock = node;
					} else {
						endFilledBlock = node;
					}
					if (next.endIndex > node.endIndex) {
						//重排
						return fillRowsUntil(node.endIndex + 1, next.endIndex, function(rows, nextIndex) {
							node.rows = node.rows.concat(rows);
							node.endIndex = nextIndex - 1;
							//重新检查
							checkBlockList(callback);
						});
					} else {
						continue;
					}
				} else {
					if (next.startIndex == node.endIndex + 1) {
						//链表删除next节点
						node.changed = true;
						node.nextBlock = next.nextBlock;
						if (node.nextBlock) {
							node.nextBlock.prevBlock = node;
						} else {
							endFilledBlock = node;
						}
						//合并
						node.rows = node.rows.concat(next.rows);
						node.endIndex = next.endIndex;
					}
				}
			}
			node = next;
		}
		//重新计算链表位置
		calcBlockLink();
		callback();
	}

	/**
	 * 计算链表定位
	 */
	function calcBlockLink(node) {
		if (!startFilledBlock) {
			return;
		}
		var node = node || startFilledBlock, prev = node.prevBlock, next;
		while (node) {
			next = node.nextBlock;
			if (prev) {
				if (prev.changed || node.changed) {
					//前节点或本节点发生变更
					node.prevDistance = Math.ceil((node.startIndex - prev.endIndex - 1) * prev.rows.length / (prev.endIndex - prev.startIndex+1)) * rowWidth;
				}
				node.start = prev.end + node.prevDistance;
			} else {
				//因无前节点被删除情况，因此只需要判断本节点是否修改即可
				if (node.changed) {
					node.start = node.prevDistance = Math.ceil(node.startIndex * node.rows.length / (node.endIndex - node.startIndex+1)) * rowWidth;
				}
			}
			//计算末尾
			node.end = node.start + node.rows.length * rowWidth;
			prev = node;
			node = next;
		}
		//计算剩余位置
		if (prev && prev.endIndex < idList.length - 1) {
			//计算剩余宽度
			if (prev.changed) {
				remainWidth = Math.ceil((idList.length - prev.endIndex - 1) * prev.rows.length / (prev.endIndex - prev.startIndex+1)) * rowWidth;
			}
		} else {
			remainWidth = 0;
		}
	}

	/**
	 * 向后排序直到指定索引
	 * 同步或异步，如返回undefined，表示异步，否则为同步
	 */
	function fillRowsUntil(index, endIndex, callback) {
		//结束索引
		var endIndex = Math.min(idList.length - 1, endIndex);
		//列数组
		var rows = [];
		//填充
		return fill();
		function fill() {
			var result=arguments.length?arguments:null;
			while(result=result||fillRow(index, true,fill)){
				var row=result[0],nextIndex=result[1];
				rows.push(row);
				//设置起始索引
				index = nextIndex;
				if (index > endIndex) {
					//列数满足或到达尽头
					callback(rows, index);
					return;
				}
				result=null;
			}
		}
	}

	/**
	 * 填充N列
	 * 同步或异步，如返回undefined，表示异步，否则为同步
	 */
	function fillRowsNum(index, num, forward, callback) {
		//开始索引,结束索引
		var startIndex = 0, endIndex = idList.length - 1;
		//列数组
		var rows = [];
		//填充
		return fill();
		function fill() {
			var result=arguments.length?arguments:null;
			while(result=result||fillRow(index,forward,fill)){
				var row=result[0],nextIndex=result[1];
				forward ? rows.push(row) : rows.unshift(row);
				num--;
				//设置起始索引
				index = nextIndex;
				if (!num || index < startIndex || index > endIndex) {
					//列数满足或到达尽头
					callback(rows, index);
					return;
				}
				result=null;
			}
		}
	}

	/**
	 * 填充一列
	 * 同步或异步，如返回undefined，表示异步，否则为同步
	 */
	function fillRow(index, forward, callback) {
		var startIndex = 0, endIndex = idList.length - 1,async=false;
		//列
		var row = [], inc = forward ? 1 : -1,
		//高度
		height = context.visiableHeight,
		//默认高度,最小高度
		deHeight = 0, minHeight = 0;
		//开始填充
		return fill();
		//填充
		function fill() {
			var task=arguments.length?arguments[0]:null;
			while(task=task||getTaskData(index,fill)){
				if (task!=-1) {
					//最小高度
					var mh = task.getMinHeight(),
					//默认高度
					dh = task.getDefaultHeight();
					if ((minHeight += mh) <= height || row.length == 0) {
						//添加
						forward ? row.push(task) : row.unshift(task);
						//添加间隙高度
						minHeight += itemGap;
						deHeight += itemGap;
						if ((deHeight += dh) >= height) {
							//默认高度达到高度要求,回调
							if(async){
								callback(row, index + inc);
								return;
							}else{
								return [row, index + inc];
							}
						} else {
							//继续填充
							index += inc;
						}
					} else {
						if(async){
							callback(row, index);
							return;
						}else{
							return [row,index];
						}
					}
				} else {
					if(async){
						callback(row, index);
						return;
					}else{
						return [row,index];
					}
				}
				task=null;
			}
			//异步
			async=true;
		}

	}

	/**
	 * 获取任务数据
	 * 返回-1表示范围不合法，返回undefined为异步回调，其他为正常获取数据
	 */
	function getTaskData(index, callback) {
		//超出范围
		if(index<0||index>=idList.length){
			return -1;
		}else{
			if (dataList[index]) {
				//已存在数据,回调
				return dataList[index];
			} else {
				//加载多个数据
				var loadIds = [], loadIndexs = [];
				for (var i = Math.max(0, index - 25), max = Math.min(idList.length, index + 25); i < max; i++) {
					if (!dataList[i]) {
						loadIds.push(idList[i]);
						loadIndexs.push(i);
					}
				}
				//请求数据
				getDataCb(loadIds, function(datas) {
					//填充数据
					for (var i = loadIds.length; i--; ) {
						var id = loadIds[i];
						dataList[loadIndexs[i]] = datas[id];
					}
					//回调
					callback(dataList[index]);
				});
			}
		}
	}

	/**
	 * 自动调整列高
	 * @param {Object} row
	 */
	function autoAdjust(row) {
		var maxHeight = getMaxHeight(row), minHeight = getMinHeight(row), defaultHeight = getDefaultHeight(row), height = context.visiableHeight;
		if (defaultHeight == height) {
			//重置高度
			resetHeight(row);
		} else if (defaultHeight > height) {
			//压缩
			var needCompressHeight = defaultHeight - height, canCompressHeight = defaultHeight - minHeight;
			//每个元素压缩
			$each(row, function(task) {
				var dh = task.getDefaultHeight();
				if (canCompressHeight > 0) {
					var mh = task.getMinHeight();
					task.adjustHeightTo(dh - Math.ceil((dh - mh) * needCompressHeight / canCompressHeight));
					needCompressHeight -= dh - task.getHeight();
					canCompressHeight -= dh - mh;
				} else {
					task.adjustHeightTo(dh);
				}
			});
		} else {
			//延展
			var needExpendHeight = height - defaultHeight, canExpendHeight = maxHeight - defaultHeight;
			//每个元素延展
			$each(row, function(task) {
				var dh = task.getDefaultHeight();
				if (canExpendHeight > 0) {
					var mh = task.getMaxHeight();
					task.adjustHeightTo(dh + Math.ceil((mh - dh) * needExpendHeight / canExpendHeight));
					needExpendHeight -= task.getHeight() - dh;
					canExpendHeight -= mh - dh;
				} else {
					task.adjustHeightTo(dh);
				}
			});
		}
	}

	function getMaxHeight(row) {
		return (row.length - 1) * itemGap + $arrReduce(row, function(height, task) {
			return height + task.getMaxHeight();
		}, 0);
	}

	function getMinHeight(row) {
		return (row.length - 1) * itemGap + $arrReduce(row, function(height, task) {
			return height + task.getMinHeight();
		}, 0);
	}

	function getDefaultHeight(row) {
		return (row.length - 1) * itemGap + $arrReduce(row, function(height, task) {
			return height + task.getDefaultHeight();
		}, 0);
	}

	function resetHeight(row) {
		$each(row, function(task) {
			task.reset();
		});
	}
}
调用示例： 
//后续补充
依赖函数： 
$arrReduce$break$each$each