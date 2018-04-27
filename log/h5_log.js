/**

 * 
 */
define(function() {
	'use strict';

	var LEVELS = ['debug', 'info', 'warn', 'error'],
		THRESHOLD_LEV = -1,							//低于该级别的日志不会被记录
		DEFAULT_LEV = 1,
		ALL_LEV = 6,
		MAX_SIZE = 1 * 1024 * 1024,					//日志最大限制1M
		CURRENT_SIZE = 0,
		POOL = [],									//日志容器
		STORAGE_KEY = 'H5LOG_LOCALSTORAGE_KEY',
		SUBSCRIBERS = [];							//日志变化订阅者

	/**
	 * 日志对象
	 * @param {number | string} lev     级别
	 * @param {object} tag     标记
	 * @param {object} content 内容
	 * @param {number} time    时间戳
	 *
	 */
	function Entity(lev, tag, content, time) {
		this.lev = lev;
		this.tag = typeof tag === 'string' ? tag : JSON.stringify(tag);
		this.content = typeof content === 'string' ? content : JSON.stringify(content);
		this.time = time;

		//计算中英文混合字节数
		//81为转json后多出的字符数
		this.bytesSize = getStrBtSize(this.tag) + getStrBtSize(this.content) + 81;
		this.bytesSize += this.bytesSize.toString().length;
	}

	/**
	 * 按UTF-8编码计算字符串所占字节数
	 * @param  {string} s 需要计算的字符日
	 * @return {number}   字符串所占字节数
	 */
	function getStrBtSize(s) {
		var totalLength = 0,
			i,
			charCode;
		for (i = 0; i < s.length; i ++) {
			charCode = s.charCodeAt(i);
			if (charCode < 0x007f) {
				totalLength = totalLength + 1;
			} else if (0x0080 <= charCode && charCode <= 0x07ff) {
				totalLength += 2;
			} else if (0x0800 <= charCode && charCode <= 0xffff) {
				totalLength += 3;
			}
		}
		
		return totalLength;
	}

	/**
	 * 记录日志
	 * @param  {number} lev     日志级别
	 * @param  {object} tag     日志标签
	 * @param  {object} content 日志内容
	 * 
	 */
	function log(lev, tag, content) {
		var l = -1;
		//参数校验 lev 需要对应级别
		if (arguments.length === 3) {
			if (isNaN(lev)) {
				l = LEVELS.indexOf(lev);
			} else {
				l = parseInt(lev);
			}
		} else if (arguments.length === 2) {
			l = DEFAULT_LEV;
		}

		//级别不够 或参数为空
		if (l < THRESHOLD_LEV || !tag) {
			return;
		}

		// 异步记录日志
		setTimeout(function(){
			save(l, tag, content || '');
		}, 1);
	}

	/**
	 * 存储符合条件的日志
	 * @param  {number} lev     级别
	 * @param  {object} tag     标记
	 * @param  {object} content 内容
	 *
	 */
	function save(lev, tag, content) {
		var entity = new Entity(lev, tag, content, Date.now()),		//日志
			diffValue = MAX_SIZE - CURRENT_SIZE - entity.bytesSize,	//剩余可存储字节数
			tmp;													//临时对象

		//保证日志字节数小于限制
		while (diffValue < 0 && POOL.length) {
			tmp = POOL.pop();

			diffValue += tmp.bytesSize;
			CURRENT_SIZE -= tmp.bytesSize;
		}
		//最后一个对象字节数大于限制
		if (diffValue < 0) {
			return;
		}

		//update CURRENT_SIZE
		CURRENT_SIZE += entity.bytesSize;
		//save memory
		POOL.unshift(entity);
		//publish
		SUBSCRIBERS.forEach(function(it){
			it(entity);
		});

		if (!localStorage) return;

		//save cache
		//localStorage[STORAGE_KEY] = JSON.stringify(POOL);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(POOL));
	}

	/**
	 * 读取日志
	 * @param  {int | string} 	lev     日志级别 6：所有级别，级别不做过滤条件
	 * @param  {string} 		keyword 关键字 过滤出tag、content中含关键字的日志
	 * @return {array}         			过滤后的数组
	 */
	function readLog(lev, keyword) {
		var l,
			reg = new RegExp(keyword || '', 'i');	//忽略大小写

		if (lev === undefined) {
			return POOL.slice(0);					//return copy
		}

		if (isNaN(lev)) {
			l = LEVELS.indexOf(lev);
		} else {
			l = parseInt(lev);
		}
		
		return POOL.filter(function(it) {
			//按lev、tag、content过滤  级别为6忽略
			return (l === ALL_LEV || l === it.lev) && (~it.tag.search(reg) || ~it.content.search(reg));
		});
	}

	function debug (tag, content) {
		log(0, tag, content);
	}
	function info (tag, content) {
		log(1, tag, content);
	}
	function warn (tag, content) {
		log(2, tag, content);
	}
	function error (tag, content) {
		log(3, tag, content);
	}

	/**
	 * 设置阀值  低于阀值的级别不会被记录
	 * @param {number | string} v [日志级别]
	 *
	 */
	function setThreshold (v) {
		THRESHOLD_LEV = isNaN(v) ? LEVELS.indexOf(v) : parseInt(v);
	}

	/**
	 * 设置日志最大字节数
	 * @param {number} v 最大值
	 *
	 */
	function setMaxSize(v) {
		if (!isNaN(v)) {
			MAX_SIZE = Number(v);
		}
	}

	function getCurrentSize() {
		return CURRENT_SIZE;
	}

	/**
	 * 提供新增日志订阅
	 * @param  {Function} fn 回调
	 */
	function subscribe(fn) {
		if (typeof fn === 'function') {
			SUBSCRIBERS.push(fn);
		}
	}

	//initialize
	(function() {
		if (!localStorage) return;
		
		var logStr = localStorage.getItem(STORAGE_KEY);
		if (logStr) {
			try {
				POOL = JSON.parse(logStr);
				POOL.forEach(function(it) {
					CURRENT_SIZE += it.bytesSize;
				});
			} catch (e) {
				POOL = [];
				error('h5_log', '读取日志失败！日志已被重置。\n' + e.stack);
			}
		}
	})();

	var H5Log = {
		ALL_LEV: ALL_LEV,				//所有级别 6 = 1 + 2 + 3
		debug: debug,					//插入一条debug级别日志
		info: info,						
		warn: warn,
		error: error,
		readLog: readLog,				//读取日志 按关键字筛选
		subscribe: subscribe,			//日志变化订阅
		setThreshold: setThreshold,		//设置阀值  低于阀值的级别不会被记录
		setMaxSize: setMaxSize,			//设置日志最大占用空间（localStorage默认5M）
		getCurrentSize: getCurrentSize		//日志当前占用localStorage字节数
	};

	if (window) {
		window.H5Log = H5Log;
	}

	return H5Log;
});