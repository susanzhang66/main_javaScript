/**
 * 并行执行多个任务,在所有任务执行完成或某个任务出错后进行回调
 * @param {Array} tasks 任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 * @param {Function} callback 完成所有任务后回调,可选
 * @param {Object} context 绑定任务函数的this对象,可选
 * 
 * 注:任务函数接收一个callback回调函数的参数,该回调函数在任务执行完成后或出错时调用,出错时传入错误信息

 依赖函数： 
$asyncMap,$each,$map,$limitCalls,$each,$break,$asyncEach
 */
function $taskParallel(tasks, callback,context) {
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback=callback||function(){};
	var slice=Array.prototype.slice;
	$asyncMap(tasks,function(fn, callback) {
		var type=typeof fn,cb=function(err) {
			var args = slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			callback.call(null, err, args);
		};
		if(type=='function'){
			fn.call(context, cb);
		}else if(type=='object'&&t.handle){
			fn.handle(cb);
		}
	},callback);
}


/**
 * 并行执行5个任务,每个任务在随机等待0-10000毫秒后完成
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
$taskParallel([task,task,task,task,task],function(err,result){
	if(err){
		console.log('任务执行出错,当前完成信息',result);
	}else{
		console.log('任务执行完成,返回数据',result);
	}
});