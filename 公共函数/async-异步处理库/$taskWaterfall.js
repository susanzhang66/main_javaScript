/**
 * 顺序执行任务,前一个任务的结果作为下一个任务的参数,提取自async组件
 * @param {Object} tasks,任务列表,每个任务为一个函数或对象,当为函数时,可以绑定context为this对象,为对象时,会调用对象的handle函数
 *  任务调用参数最后一个参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用参数第一个参数为错误信息,之后的为下一个任务接收到的参数
 *  如果调用wrap带有错误信息,那么下一个任务将不会被执行,而会直接调用完成所有任务后的callback回调,并且传入错误信息
 * @param {Function} callback,完成所有任务后回调,可选
 * @param {Object} context,绑定任务函数的this对象,可选
 说明:
任务调用接收的参数最后一个参数为下一个任务的迭代器wrap,如果该任务执行完毕需要执行下一个任务,则调用该wrap,调用wrap的参数第一个参数为错误信息,紧跟之后的为下一个任务接收到的参数
 */
function $taskWaterfall(tasks,callback,context){
	if(typeof callback!='function'){
		context=callback;
		callback=undefined;
	}
	if(!context){
		context=this;
	}
	callback=callback||function(){};
	if(!$isArray(tasks)){
		var err = new Error('First argument to waterfall must be an array of functions');
		return callback.call(context,err);
	}
	if(!tasks.length){
		return callback.call(context);
	}
	var slice=Array.prototype.slice;
	var wrapIterator = function(iterator) {
		return function(err) {
			if (err) {
				callback.apply(context, arguments);
				callback = function() {};
			} else {
				var args = slice.call(arguments, 1);
				var next = iterator.next();
				if (next) {
					args.push(wrapIterator(next));
				} else {
					args.push(callback);
				}
				setTimeout(function() {
					iterator.apply(context, args);
				});
			}
		};
	};
	wrapIterator($taskIterator(tasks))();
}

//依次执行下面任务列表你们的函数,并在执行完成后执行回调函数
/**
 * 输出结果为:
 * 1.1.1:  start
 * 1.1.2:  3
 * 1.1.3:  4
 * 1.1 err:  null
 * 1.1 result:  16
 */
$taskWaterfall([
    function(cb) { console.log('1.1.1: ', 'start'); cb(null, 3); },
    function(n, cb) { console.log('1.1.2: ',n); cb(null,n+1); },
    function(n, cb) { console.log('1.1.3: ',n); cb(null,n*n); }
], function (err, result) {
    console.log('1.1 err: ', err); // -> null
    console.log('1.1 result: ', result); // -> 16
});