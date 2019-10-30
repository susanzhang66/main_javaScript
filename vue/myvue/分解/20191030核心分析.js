            updateComponent = function() {
                //这里会渲染动作。。。_update相当于渲染，vm.__patch__，
                //当渲染动作涉及到了虚拟DOM节点，虚拟节点会遇到到相关的 变量的时候，读取变量的值，自动会通过prox代理函数，又去触发了
                // 变量的 Object.defineProperty,描述符的get,具体逻辑在defineReactive$$1这个函数。
                vm._update(vm._render(), hydrating);
            };
        }
        // 渲染动作 加入watcher
        vm._watcher = new Watcher(vm, updateComponent, noop);
initData() 时候 通过observer() 将每个data数据创建dep实例.以便后续管理对应的watcher。
init()->
vm._watcher = new Watcher(vm, updateComponent, noop); ->
updateComponent = function() {
    //这里会渲染动作。。。_update相当于渲染，vm.__patch__，
    //当渲染动作涉及到了虚拟DOM节点，虚拟节点会遇到到相关的 变量的时候，读取变量的值，自动会通过prox代理函数，又去触发了
    // 变量的 Object.defineProperty,描述符的get,具体逻辑在defineReactive$$1这个函数。
    vm._update(vm._render(), hydrating);
};
_update():这个是渲染dom的逻辑（具体逻辑可以看虚拟dom的相关文章），每到读取到相关data中的变量的时候，会触发变量的 Object.defineProperty,描述符的get,具体逻辑在defineReactive$$1这个函数。相关代码如下：

get: function reactiveGetter() {
    var value = getter ? getter.call(obj) : val;
    if (Dep.target) { //Dep.target 这个是当前watcher,
        dep.depend();  //将当前的 dep实例加入watcher
        if (childOb) {
            childOb.dep.depend();
        }
        if (Array.isArray(value)) {
            dependArray(value);
        }
    }
    return value
},
set: function reactiveSetter(newVal) {
    var value = getter ? getter.call(obj) : val;
    /* eslint-disable no-self-compare */
    if (newVal === value || (newVal !== newVal && value !== value)) {
        return
    }
    /* eslint-enable no-self-compare */
    if ("development" !== 'production' && customSetter) {
        customSetter();
    }
    if (setter) {
        setter.call(obj, newVal);
    } else {
        val = newVal;
    }
    childOb = observe(newVal);
    dep.notify();
}

Dep.target：当前的渲染函数相关的new watcher,实例，后面会将每个读取到的dep 加入相关的wather实例，以便后续更新数据可以调用。watcher也记录了相关的dep实例。

    /**
     * Define a reactive property on an Object.
     */
    //Object.defineProperty()的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性
    // 通过Object.defineProperty()为对象定义属性，有两种形式，且不能混合使用，分别为数据描述符，存取描述符，
    function defineReactive$$1(
        obj,
        key,
        val,
        customSetter
    ) {
        var dep = new Dep();
        //获取数据属性描述符
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get;
        var setter = property && property.set;

        var childOb = observe(val);
        Object.defineProperty(obj, key, {    
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) { //Dep.target 这个是当前watcher,
                    dep.depend();  //将当前的 dep实例加入watcher
                    if (childOb) {
                        childOb.dep.depend();
                    }
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if ("development" !== 'production' && customSetter) {
                    customSetter();
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                childOb = observe(newVal);
                dep.notify();
            }
        });
    }