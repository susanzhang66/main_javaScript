/**
 * 自动处理依赖顺序,处理有依赖关系的多个任务的执行,比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。
 * @param {Object} tasks 任务map,任务名-任务数据对,任务数据是一个数组,数组前几项内容为依赖任务名,最后一项为任务,任务可以为函数或者带有handle函数的对象
 * @param {Object} callback 任务完成回调,可选,callback支持2个参数,错误参数和处理结果.如果有任务中途出错，则会把该错误传给最终callback
 * @param {Object} context 绑定任务函数的this对象,可选
 */
function $taskAuto(tasks, callback, context) {
	
	var results={},taskStatus={},remainNum=0,slice = Array.prototype.slice,sync=true;
	
	//预处理
	for(var name in tasks){
		remainNum++;
		var task=tasks[name];
		if(!$isArray(task)){
			tasks[name]=[task];
		}
	}
	
	//开始执行任务
	return exec();
	
	//获取可执行的任务
	function getExecableTask(){
		var execTasks=[];
		for(var name in tasks){
			if(!taskStatus[name]){
				var task=tasks[name];
				if(task.length==1){
					execTasks.push(name);
				}else{
					var execable=true;
					for(var i=task.length-1;i--;){
						var requireName=task[i];
						if(taskStatus[requireName]!=2){
							execable=false;
							break;
						}
					}
					execable&&execTasks.push(name);
				}
			}
		}
		return execTasks;
	}
	
	//执行任务
	function exec(){
		while(true){
			if(remainNum){
				var execTasks=getExecableTask();
				if(execTasks.length>0){
					var syncComplete=0;
					for(var i=execTasks.length;i--;){
						var taskName=execTasks[i],task=tasks[taskName],taskFn=task[task.length-1],taskType=typeof taskFn,v;
						//获得执行任务回调
						var taskCallback=$limitCalls($curry(function(tname,err){
							if(taskStatus[tname]==2){
								//已经同步设置，无需异步回调设值
								return;
							}
							var args = slice.call(arguments, 2);
							if (args.length <= 1) {
								args = args[0];
							}
							results[tname] = args;
							taskStatus[tname] = 2;
							if (err) {
								//发生错误
								if (callback) {
									//任务发生错误,处理以完成的任务,并回调.
									callback(err, $clone(results));
									callback=null;
								}
							} else {
								//任务完成成功
								remainNum--;
								//回调
								exec();
							}
						},taskName));
						
						//开始执行任务
						taskStatus[taskName] = 1;
						if (taskType == 'function') {
							v=taskFn.call(context, taskCallback, results);
						} else if (taskType == 'object' && taskFn.handle) {
							v=taskFn.handle(taskCallback, results);
						}
						if($isArray(v)){
							//任务直接返回数据，同步模式
							syncComplete++;
							var err=v[0],args=slice.call(v, 1);
							if (args.length <= 1) {
								args = args[0];
							}
							results[taskName] = args;
							taskStatus[taskName] = 2;
							if (err) {
								//发生错误
								if(callback){
									callback(null,$clone(results));
									callback=null;
								}
								if(sync){
									return [null,$clone(results)];
								}else{
									return;
								}
							} else {
								//任务完成成功
								remainNum--;
							}
						}else{
							sync=false;
						}
					}
					if(syncComplete>0){
						//有同步执行完成任务，继续
						continue;
					}else{
						return;
					}
				}else{
					return;
				}
			}else{
				if(callback){
					callback(null,results);
					callback=null;
				}
				if(sync){
					return [null,results];
				}else{
					return;
				}
			}
			
		}
	}
}