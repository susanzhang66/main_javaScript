/**
 * 异步的类似于do...while的操作
 * @param {Object} iterator 异步执行函数,条件测试为true时调用,传入一个callback的函数参数,当语句执行完成后回调callback表示当前执行完成,执行下一步
 * @param {Object} test 条件测试函数,测试while条件是否成立
 * @param {Object} callback 完成条件循环后进行回调,正常回调时无传入参数,错误时传入一个错误参数
 * 
 * 注:iterator类似于do...while语句中的需要执行的代码部分,由于是异步的,使用callback回调表示执行完成
 * 如果执行出现错误,可在callback回调添加一个错误参数,那么循环将会终止,并直接回调执行完成函数
 */
function $doWhilst(iterator, test, callback) {
	iterator(function(err) {
		if (err) {
			return callback(err);
		}
		if (test()) {
			$doWhilst(iterator, test, callback);
		} else {
			callback();
		}
	});
}


 
/**
 * 以下示例代码类似于
 * var i=0,len=10; 
 * do{
 *     console.log(i);
 *     i++;
 *     sleep(1000);//伪代码,js进程无法进行sleep,因此使用setTimeout来实现
 * }while(i<len);
 */
var i=0,len=10;
$doWhilst(function(callback){
    //条件执行代码
    //输出i
    console.log(i);
    //i自增
    i++;
    //等待1秒钟后完成执行过程,回调
    setTimeout(callback,1000);
},function(){
    //测试判断,i<len时成立
    return i<len;
},function(err){
    //完成循环后调用
    if(err){
        console.log('条件循环过程中出现错误',err);
    }else{
        console.log('条件循环完成');
    }
});