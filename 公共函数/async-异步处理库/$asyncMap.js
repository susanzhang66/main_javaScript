/**
 * 类似于$asyncEach,但在执行完毕时会返回每个执行的结果.如果其中一个执行出现错误,返回的数组中将仅包含已经成功执行了的结果
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代函数,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数,回调函数允许传递2个参数,分别是错误信息和结果信息
 * @param {Object} callback 完成或错误后的回调,带有2个参数,1:错误信息,无错误则为空,2:已经成功执行了的结果数组
 依赖函数： 
$asyncEach,$break,$each,$limitCalls,$map$each
 */
function $asyncMap(arr, iterator, callback) {
	var results = [];
	arr = $map(arr, function(x, i) {
		return {
			index : i,
			value : x
		};
	});
	$asyncEach(arr, function(x, callback) {
		iterator(x.value, function(err, v) {
			results[x.index] = v;
			callback(err);
		});
	}, function(err) {
		callback(err, results);
	});
}


/**
 * 遍历数组[1,2,3,4,5],针对每个数据等待N秒后返回(非顺序执行)
 * 将会依次输出
 * (时间点T)
 * 我将等待1秒后完成
 * 我将等待2秒后完成
 * 我将等待3秒后完成
 * 我将等待4秒后完成
 * 我将等待5秒后完成 
 * 我已经等待了1秒 (T之后1秒输出)
 * 我已经等待了2秒 (T之后2秒输出)
 * 我已经等待了3秒 (T之后3秒输出)
 * 我已经等待了4秒 (T之后4秒输出)
 * 我已经等待了5秒 (T之后5秒输出)
 * 遍历执行完成,返回结果 [1, 4, 9, 16, 25]
 */
$asyncMap([1,2,3,4,5],function(x,callback){
	console.log('我将等待'+x+'秒后完成');
	//等待x秒后完成
	setTimeout(function(){
		console.log('我已经等待了'+x+'秒');
		callback(null,x*x);
	},x*1000);
},function(err,result){
	if(err){
		console.log('遍历过程有错',err);
	}else{
		console.log('遍历执行完成,返回结果',result);
	}
});