
/**
 * 顺序遍历数组,迭代器异步执行,发生错误或者完成遍历后回调,类似于$asyncEach,不同点在于$asyncEachSeries是顺序遍历,下一个元素的迭代器执行需要等代上一个元素迭代器执行完成,而$asyncEach不需要等待
 * @param {Object} arr 需要遍历的数组
 * @param {Object} iterator 迭代器,支持2个参数,1:当前迭代的对象,2:迭代函数执行完毕的回调函数
 * @param {Object} callback 迭代完成回调函数,如果迭代过程出错会传入一个错误参数
 */
function $asyncEachSeries(arr, iterator, callback) {
	callback = callback ||function() {};
	if (!arr.length) {
		return callback();
	}
	var completed = 0;
	var iterate = function() {
		iterator(arr[completed], $limitCalls(function(err) {
			if (callback) {
				if (err) {
					callback(err);
					callback = null;
				} else {
					completed += 1;
					if (completed >= arr.length) {
						callback(null);
					} else {
						iterate();
					}
				}
			}
		}));
	};
	iterate();
}


 
/**
 * 遍历数组[1,2,3,4,5],针对每个数据等待N秒后返回
 * 将会依次输出以下内容,注意与$asyncEach示例代码输出的区别
 * (时间点T)
 * 我将等待1秒后完成
 * 我已经等待了1秒 
 * 我将等待2秒后完成
 * 我已经等待了2秒 
 * 我将等待3秒后完成
 * 我已经等待了3秒 
 * 我将等待4秒后完成
 * 我已经等待了4秒 
 * 我将等待5秒后完成 
 * 我已经等待了5秒 
 * 遍历执行完成
 */
$asyncEachSeries([1,2,3,4,5],function(x,callback){
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