/**
 * 自动处理依赖顺序,处理有依赖关系的多个任务的执行,比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。
 * @param {Object} tasks 任务map,任务名-任务数据对,任务数据是一个数组,数组前几项内容为依赖任务名,最后一项为任务,任务可以为函数或者带有handle函数的对象
 * @param {Object} callback 任务完成回调,可选,callback支持2个参数,错误参数和处理结果.如果有任务中途出错，则会把该错误传给最终callback
 * @param {Object} context 绑定任务函数的this对象,可选
 注:非依赖任务会并行执行

 被依赖函数： 
$taskSeries,$taskAuto,$getCharWidth,$iuni_typeset
 */
function $taskAuto(tasks, callback, context) {
	callback = callback || function() {};
	var keys = $keys(tasks);
	var slice = Array.prototype.slice;
	if (!keys.length) {
		return callback(null);
	}
	var results = {};
	var listeners = [];
	var addListener = function(fn) {
		listeners.unshift(fn);
	};
	var removeListener = function(fn) {
		for (var i = 0; i < listeners.length; i += 1) {
			if (listeners[i] === fn) {
				listeners.splice(i, 1);
				return;
			}
		}
	};
	var taskComplete = function() {
		$each(listeners.slice(0), function(fn) {
			fn();
		});
	};

	addListener(function() {
		if (callback) {
			if ($keys(results).length === keys.length) {
				callback(null, results);
				callback = null;
			}
		}
	});

	$each(keys, function(k) {
		var task = $isArray(tasks[k]) ? tasks[k] : [tasks[k]], taskFn = task[task.length - 1], taskType = typeof taskFn;
		//任务完成回调
		var taskCallback = $limitCalls(function(err) {
			var args = slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			if (err) {
				if (callback) {
					//任务发生错误,处理以完成的任务,并回调.
					var safeResults = {};
					$each($keys(results), function(rkey) {
						safeResults[rkey] = results[rkey];
					});
					safeResults[k] = args;
					callback(err, safeResults);
					callback = null;
				}
			} else {
				//任务完成成功,设置值,并触发完成事件
				results[k] = args;
				setTimeout(taskComplete, 0);
			}
		});
		//任务开始
		var startTask = function() {
			//当前任务开始
			if (taskType == 'function') {
				taskFn.call(context, taskCallback, results);
			} else if (taskType == 'object' && taskFn.handle) {
				taskFn.handle(taskCallback, results);
			} else {
				taskCallback('任务错误,无可用任务');
			}
		};
		var requires = task.slice(0, task.length - 1) || [];
		//检查依赖任务已经准备齐全并且当前任务未开始
		var ready = function() {
			return $arrReduce(requires, function(a, x) {
				return (a && results.hasOwnProperty(x));
			}, true) && !results.hasOwnProperty(k);
		};
		if (ready()) {
			startTask();
		} else {
			//添加任务完成监听器
			var listener = function() {
				if (ready()) {
					//移除监听器,并开始任务
					removeListener(listener);
					startTask();
				}
			};
			addListener(listener);
		}
	});
}


 
/**
 * 这里假设我要写一个程序，它要完成以下几件事：
 * 从某处取得数据
 * 在硬盘上建立一个新的目录
 * 将数据写入到目录下某文件
 * 发送邮件，将文件以附件形式发送给其它人。
 * 分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。
 * 
 */
$taskAuto({
    getData: function (callback) {
        setTimeout(function(){
            console.log('1.1: got data');
            callback();
        }, 300);
    },
    makeFolder: function (callback) {
        setTimeout(function(){
            console.log('1.1: made folder');
            callback();
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(callback) {
        setTimeout(function(){
            console.log('1.1: wrote file');
            callback(null, 'myfile');
        }, 300);
    }],
    emailFiles: ['writeFile', function(callback, results) {
        console.log('1.1: emailed file: ', results.writeFile); // -> myfile
        callback(null, results.writeFile);
    }]
}, function(err, results) {
    console.log('1.1: err: ', err); // -> null
    console.log('1.1: results: ', results); // -> { makeFolder: undefined,
                                    //      getData: undefined,
                                    //      writeFile: 'myfile',
                                    //      emailFiles: 'myfile' }
});