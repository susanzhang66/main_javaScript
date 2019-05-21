/**
 * 获得一个任务数组的执行迭代器
 * @param {Object} tasks 任务列表,任务为函数或拥有handle执行方法的对象.

 返回:
fn-生成的迭代器
fn()执行游标当前指向的任务,并返回游标指向下一个任务的迭代器,如果已经到到任务数组末尾,返回空
fn.next()返回游标指向下一个任务的迭代器,如果当前游标指向数组末尾时,返回空
 */
function $taskIterator(tasks) {
	var makeCallback = function(index) {
		var fn = function() {
			if (tasks.length) {
				var t=tasks[index],type=typeof t;
				if(type=='function'){
					t.apply(this, arguments);
				}else if(type=='object'&&t.handle){
					t.handle.apply(t,arguments);
				}
			}
			return fn.next();
		};
		fn.next = function() {
			return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
		};
		return fn;
	};
	return makeCallback(0);
}


//创建一个任务列表迭代器,游标指向第一个
var iterator=$taskIterator([
    function(){
        console.log('log 1');
    },
    function(){
        console.log('log 2'+this.i);
    },
    function(i){
        console.log('log 3'+i);
    },
]);

//执行第一个任务,输出 log 1
iterator=iterator();
//执行第二个任务,输出 log 2_1
iterator=iterator.apply({i:'_1'});
//执行第三个任务,输出 log 3_1
iterator=iterator('_1');
//游标已经到达最后一个,iterator应该为null,输出true
console.log(iterator===null);