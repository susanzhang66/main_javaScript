/**
 * 顺序执行任务,前一个任务的结果执行完成下一个任务才会开始,提取自async组件
 * @param {Object} tasks,任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 *  任务调用参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用参数第一个参数为错误信息,之后的为当前任务的结果数据
 *  如果调用wrap带有错误信息,那么下一个任务将不会被执行,而会直接调用完成所有任务后的callback回调,并且传入错误信息和已经执行完成的结果
 * @param {Function} callback,完成所有任务后回调,可选
 * @param {Object} context,绑定任务函数的this对象,可选


 注:任务函数接收一个callback回调函数的参数,该回调函数在任务执行完成后或出错时调用,传入参数为错误信息和执行结果
说明:
任务调用参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用参数第一个参数为错误信息,之后的为当前任务的结果数据
如果调用wrap带有错误信息,那么下一个任务将不会被执行,而会直接调用完成所有任务后的callback回调,并且传入错误信息和已经执行完成的结果

依赖函数： 
$keys,$asyncEachSeries,$limitCalls,$asyncMapSeries,$each,$break,$map$asyncEachSeries,$isArray
 */
function $taskSeries(tasks, callback,context) {
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback = callback ||function() {};
	var slice = Array.prototype.slice;
	if ($isArray(tasks)) {
		$asyncMapSeries(tasks, function(fn, callback) {
			if (fn) {
				var type=typeof fn,cb=function(err) {
					var args = slice.call(arguments, 1);
					if (args.length <= 1) {
						args = args[0];
					}
					callback(err, args);
				};
				if(type=='function'){
					fn.call(this, cb);
				}else if(type=='object'&&fn.handle){
					fn.handle(cb);
				}
			}
		}, callback);
	} else {
		var results = {};
		$asyncEachSeries($keys(tasks), function(k, callback) {
			var fn=tasks[k],type=typeof fn,cb=function(err) {
				var args = slice.call(arguments, 1);
				if (args.length <= 1) {
					args = args[0];
				}
				results[k] = args;
				callback(err);
			};
			if(type=='function'){
				fn.call(this, cb);
			}else if(type=='object'&&fn.handle){
				fn.handle(cb);
			}
		}, function(err) {
			callback(err, results);
		});
	}
}


/**
 * 顺序执行5个任务,每个任务在随机等待0-10000毫秒后完成,注意和$taskParallel的区别
 * 在所有任务完成后输出完成信息(随机等待的时间数组)
 * 示例输出如下:
 * 当前任务在8222毫秒后完成 
 * 当前任务在6967毫秒后完成 
 * 当前任务在6869毫秒后完成 
 * 当前任务在4138毫秒后完成 
 * 当前任务在2959毫秒后完成 
 * 任务执行完成,返回数据 [8222, 6967, 6869, 4138, 2959] 
 */
var task=function(callback){
	//等待随机时间后完成任务
	var t=Math.floor(Math.random()*10000);
	console.log('当前任务在'+t+'毫秒后完成');
	setTimeout(function(){
		callback(null,t);
	},t);
};
$taskSeries([task,task,task,task,task],function(err,result){
	if(err){
		console.log('任务执行出错,当前完成信息',result);
	}else{
		console.log('任务执行完成,返回数据',result);
	}
});