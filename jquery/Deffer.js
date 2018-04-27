// Deferred对象是由.Deferred构造的，.Deferred被实现为简单的工厂模式。
 
// 　　$.Deferred的实现
// 创建三个$.Callbacks对象，分别表示成功done，失败fail，处理中process三种状态
// 对应了三种处理结果，resolve、reject、notify
// 创建了一个promise对象，具有state、always、then、primise方法
// 通过扩展primise对象生成最终的Deferred对象，是阻止其他代码来改变这个deferred对象的状态，deferred.promise() 改变不了 deferred 对象的状态，作用也不是保证目前的状态不变
// 　　上面提到Deferred里面的3个$.Callback()的实例，Deferred自身则围绕这三个对象进行更高层次的抽象。以下是Deferred对象的核心方法
 
// 　　1.done/fail/progress是callbacks.add，将回调函数增加到回调管理器
 
// 　　2.resolve/reject/notify是callback.fire，执行回调函数（或队列）
 
// 　　$.Deferred成员的方法
// 　　1.$.Deferred()
// 　　生成一个异步队列实例对象deferred
 
// 　　接受一个function参数，function里边可以使用this来调用当前的异步队列实例
 
// 　　2.deferred.done(fn)
// 　　成功时触发的回调fn
 
// 　　3.deferred.fail(fn)
 
// 　　失败时触发的回调
 
// 　　4.deferred.progress(fn)
 
// 　　处理中触发的回调
 
// 　　5.deferred.resolve/resolveWith([context],args)
 
// 　　这里等同$.Callbacks().(fire/fireWith)
 
// 　　在任务处理成功之后使用此方法触发成功事件，之前加入done队列的回调会被触发
 
// 　　6.deferred.reject/rejectWith([context],args)
 
// 　　这里等同$.Callbacks().(fire/fireWith)
 
// 　　在任务处理成功之后使用此方法触发成功事件，之前加入fail队列的回调会被触发
 
// 　　7.deferred.notify/notifyWith([context],args)
 
// 　　这里等同$.Callbacks().(fire/fireWith)
 
// 　　在任务处理中可以使用此方法触发正在处理的事件
 
// 　　8.deferred.promise()
 
// 　　deferred.promise() 只是阻止其他代码来改变这个 deferred 对象的状态，通过 deferred.promise() 方法返回的 deferred 对象，是没有 resolve ,reject, progress , resolveWith, rejectWith , progressWith 这些可以改变状态的方法
 
// 　　9.deferred.then([fnDone,fnFail,fnProgress])
 
// 　　可以直接传入三个回调函数，分别对应done|fail|progress三个状态的回调，例.when(.ajax("/main.php")).then(successFunc,failureFunc,proFunc)，第一个参数是done()方法的回调函数，第二个参数是fail方法的回调函数，第三个是progress的回调函数，也可以只传一个参数，则是done()方法的回调函数
 
// 　　10.deferred.always(fn)
 
// 　　不管最后是resolve还是reject，都会触发fn
 
// 　　11.$.when(mission1,[mission2,mission3,...])
 
// 　　这个事挂载在jQuery上的方法， 为多个操作指定回调函数，例.when(.ajax("test1.html",$.ajax("test2.html"))).done(fn).fail(fn)

// 使用方法
// var getLocation = function() {
        
//     var dif = $.Deferred();
//     setTimeout(function(data) {
//         alert(data);
//         dif.resolve(data);
//     },1000);
//     setTimeout(function() {
//         if (dif.state() == 'pending') {
//             alert('fail');
//             dif.reject();
//         }
//     }, 5000);
//     return dif.promise();
// }
// //then函数相当于
// getLocation().then(function(data){alert('1000wancheng')})
 
// 　　$.Deferred源码结构
 
    /**
    Deferred 委托人对象，对委托人管理
    */
    jQuery.extend({
        /**
        创建一个Deferred对象,"延迟"到未来某个点再执行。我们称之为Deferred,也就是委托人,回调函数就是观察者
        方式：在函数内部，创建一个deferred，为deferred添加一些方法，通过func.call(deferred,deferred)方式把这个deferred对象插入到func函数参数中
        目的：处理耗时操作的问题（回调函数），为了对这些操作更好的控制，提供了统一的编程接口(API)。
        * @param {Function} func    回调函数 (使用call方式，将deferred代入到函数的参数中)
        * @return {Object} deferred 延迟对象        
        */
        Deferred: function (func) {
            /**
             * 创建一个数据元组集
             * 每个元组分别包含一些与当前委托人(deferred)相关的信息: 
             * 
             Deferred自身则围绕这三个对象进行更高层次的抽象
                    通知(触发回调函数列表执行(函数名))
                    观察者(添加回调函数（函数名）)
                    观察者对象（jQuery.Callbacks对象）
                    委托人状态（第三组数据除外）
             * 总体而言，三个元组会有对应的三个callbacklist对应于doneList, failList, processList
             * resolve  委托人接到通知，告诉观察者执行“已完成”操作(deferred对象的执行状态从“未完成”变为“已完成”，触发done（侦听器））
             * reject   委托人接到通知，告诉观察者执行“已拒绝”操作，deferred对象的执行状态,从“未完成”变为“已失败”,触发fail(侦听器)
             * notify   委托人接到通知，告诉观察者执行“还在进行中,或者未完成”操作
             * done     成功（回调函数）
             * fail     失败（回调函数）
             * progress 未完成
             * resolved 完成状态
             * rejected 失败状态
             */
            var tuples = [
 
                    // action 执行状态, add listener 添加侦听器（事件处理函数）,listener list 侦听器列表(事件处理函数列表),final state 最终状态  
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.Callbacks("memory")]
            ],
            // 委托人三种状态，（deferred的状态）分为三种：pending(挂起状态) resolved(完成状态) rejected（失败状态）  
                state = "pending",
                
                /**
                * 创建一个promise对象 也就是一个受限制的委托人,只能执行观察者，不能通知观察者
                * 作用：1.在初始化deferred对象时，promise对象里的方法会被extend到deferred中去，作为引用
                *       2.保护deferred对象，使其无法改变deferred对象的执行状态，要想改变执行状态，只能操作原来的deferred对象,仅支持done，fail，progress方法
                */
                promise = {
                    /**
                    返回委托人状态
                    * return {String} 返回委托人状态(外面只读)
                    */
                    state: function () {
                        return state;
                    },
                    /**
                    不管最后是resolve还是reject，都会触发fn
                    不管委托人发出什么样的通知都会去执行观察者
                    同时在doneList和failList的list里添加回调函数（引用）,不管deferred对象的执行状态成功还是失败,回调函数都会被执行 
                    * return {Object} 返回当前委托人                  
                    */
                    always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    /**
                    接受三个参数，对应3种状态的回调函数，这三个回调函数，必须返回deferred对象
                    * @param {Function} fnDone 成功的观察者,done()方法的回调函数
                    * @param {Function} fnFail 失败的观察者,fail()方法的回调函数
                    * @param {Function} fnProgress 打酱油的观察者,progress()方法的回调函数   
                    * @return {Object} 返回一个受到限制的委托人
                    */
                    then: function ( /* fnDone, fnFail, fnProgress */) {
                        // 声明一个变量，并把参数引用赋值给funs
                        var fns = arguments;
                        // newDefer 创建一个新的委托人
                        return jQuery.Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                // i     当前tuples的下标
                                // tuple 当前tuples[i]的值                                
                                var action = tuple[0],// 当前委托人状态 tuple[0]对应三种最终状态resolve，reject，notify
                                    fn = jQuery.isFunction(fns[i]) && fns[i];// 当前观察者
 
                                /**
                                老版的委托人发出的通知绑定不同的观察者                               
                                * deferred指老版的委托人
                                * tuple[1]指[done | fail | progress]
                                * fn 老版委托人的观察者
                                * 分别为deferred的三个callbacklist(状态)添加回调函数，根据fn的是否是函数，分为两种情况：
                                * 1. fn不是函数,(例如：undefined和null),直接链接到newDefer的通知（[resolve | reject | notify]方法），也就是说新的委托人newDefer的通知依赖外层调用者(老版委托人)deferred执行的观察者（done,fail,progress）
                                * 2. fn是函数,根据返回值（ret）是否为委托人deferred对象，分为两种情况:
                                *    a) 返回值是deferred对象，那么将新委托人newDefer的通知([resolve | reject | notify]方法)添加到ret对象对应的观察者上,也就说newDefer的执行依赖ret的状态
                                *    b) 返回值不是deferred对象，那么将ret作为newDefer的参数，判断this是否为老版委托人deferred，是则将newDefer作为上下文环境，不是将this作为上下文执行环境，然后执行对应的回调函数列表，Ps：此时newDefer的执行(通知)依赖外层的调用者deferred的状态(观察者)。
                                */
                                //相当于deferred.done,deferred.fail,deferred.progess三种状态;
                                // deferred[tuple[1]]  : callback.add函数。
                                deferred[tuple[1]](function () {
                                    // 执行老版委托人传递的参数（回调函数）
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise()
                                            .done(newDefer.resolve)
                                            .fail(newDefer.reject)
                                            .progress(newDefer.notify);
                                    } else {
                                        newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                    }
                                });
                            });
                            // 清空变量，内存回收
                            fns = null;
                        }).promise();//返回一个受到限制的委托人
                    },
 
                    /**
                    为委托人加入一些限制(为deferred添加一个promise方法)       
                    * @param  {Object}  委托人或空值
                    * @return {Object}  假如对象存在，将promise添加到这个对象中，不存在返回promise对象
                    */
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                // 声明变量 创建一个委托人
                deferred = {};
 
            // 添加一个方法名pipe与then相同,一般使用pipe进行filter操作
            promise.pipe = promise.then;
 
            
            jQuery.each(tuples, function (i, tuple) {
                //声明一个局部变量，将观察器对象引用给list，3个$.Callback()的实例 
                var list = tuple[2],
                    stateString = tuple[3]; //委托人的最终状态 resolved，rejected
 
                // 为观察者对象添加函数(回调函数)
                // promise[done|fail|progress]=list.add;
                // 这三个方法分别引用三个不同的观察者对象的add方法,往观察者对象回调函数列表list添加回调函数[done|fail|progress],互不打扰
                promise[tuple[1]] = list.add;
 
                /*
                观察者对象
                * add  添加回调函数  
                * fire 调用fireWidth
                * fireWidth  去执行回调函数
                */
                // 检测stateString是否有值,progress没有值，所以预先向[done|fail]添加一些定义好的回调函数
                // 定义好的回调函数:1.修改委托人的状态；2.禁用相反的观察者对象；3.加锁(挂起)正在进行的观察者对象
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        // 修改最新的委托人状态
                        state = stateString;
                         //禁用对立的那条队列
                        //注意 0^1 = 1   1^1 = 0
                        //即是成功的时候，把失败那条队列禁用
                        //即是成功的时候，把成功那条队列禁用
                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                // 将委托人的通知和观察者对象的执行回调函数(观察者函数) 联系起来
                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });
 
 
            // 为委托人添加一个被限制的委托人对象 （将promise对象extend到deferred中）
            promise.promise(deferred);
 
 
            // 检测func是否存在，存在将生成的委托人对象作为这个函数的默认参数，以及将this指向这个委托人
            if (func) {
                func.call(deferred, deferred);
            }
 
 
            // 返回委托人对象
            return deferred;
        },
 
        //注意到$.when是多任务的
        //当一个任务失败的时候，代表整个都失败了。
        //任务是Deferred实例，成为异步任务
        //任务是普通function时，成为同步任务
        when: function (subordinate /* , ..., subordinateN */) {
            var i = 0,
                //arguments是多个任务
                resolveValues = core_slice.call(arguments),
                length = resolveValues.length,
                
                //还没完成的异步任务数
                //subordinate && jQuery.isFunction(subordinate.promise)判断subordinate是不是Deferred的实例对象
                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
 
                 //只有一个异步任务的时候
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
                
                //用于更新 成功|处理 中两个状态
                //这里不考虑失败的状态是因为：
                //当一个任务失败的时候，代表整个都失败了。
                updateFunc = function (i, contexts, values) {
                    return function (value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
                        
                        //处理中，派发正在处理事件
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!(--remaining)) {
                          //成功，并且最后剩余的异步任务为0了
                          //说明所有任务都成功了，派发成功事件出去
                          //事件包含的上下文是当前任务前边的所有任务的一个集合                        
                            deferred.resolveWith(contexts, values);
                        }
                    };
                },
 
                progressValues, progressContexts, resolveContexts;
 
             //如果只有一个任务，可以不用做维护状态的处理了
            //只有大于1个任务才需要维护任务的状态
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                //事件包含的上下文是当前任务前边的所有任务的一个集合，逐步更新
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                     //如果是异步任务
                        resolveValues[i].promise()
                             //成功的时候不断更新自己的状态
                            .done(updateFunc(i, resolveContexts, resolveValues))
                             //当一个任务失败的时候，代表整个都失败了。直接派发一个失败即可
                            .fail(deferred.reject)
                            //正在处理的时候也要不断更新自己的状态
                            .progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        //如果是同步任务，则remain不应该计它在内
                        --remaining;
                    }
                }
            }
 
            //传进来的任务都是同步任务
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
 
            return deferred.promise();
        }
    });


