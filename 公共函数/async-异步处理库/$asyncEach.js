/**
 * 遍历数组,迭代器异步执行,发生错误或者完成遍历后回调
 * @param {Array} arr 需要遍历的数组
 * @param {Function} iterator 迭代器,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数
 * @param {Function} callback 迭代完成回调函数,如果迭代过程出错会传入一个错误参数
 */
function $asyncEach(arr, iterator, callback) {
	callback = callback ||function() {};
	if (!arr.length) {
		return callback();
	}
	var completed = 0;
	$each(arr, function(x) {
		iterator(x, $limitCalls(function(err) {
			if(callback){
				if (err) {
					callback(err);
					callback = null;
				} else {
					if (++completed >= arr.length) {
						callback(null);
					}
				}
			}
		}));
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
 * 遍历执行完成
 */
$asyncEach([1,2,3,4,5],function(x,callback){
	console.log('我将等待'+x+'秒后完成');
	//等待x秒后完成
	setTimeout(function(){
		console.log('我已经等待了'+x+'秒');
		callback();
	},x*1000);
},function(err){
	if(err){
		console.log('遍历过程有错',err);
	}else{
		console.log('遍历执行完成');
	}
});