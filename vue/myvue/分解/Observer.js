    /*
    只对数组和对象做处理，然后分别做如下处理：
    @Jane 这里将每个 obj里的值，加入watcher 监听了。加入getter,setter
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
    */


    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However when passing down props,
     * we don't want to force conversion because the value may be a nested value
     * under a frozen data structure. Converting it would defeat the optimization.
     */
    var observerState = {
        shouldConvert: true,
        isSettingProps: false
    };

    /**
     * 收集依赖和分发更新操作。加入getter,setter
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     */
    var Observer = function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        //Define a property.
        // function def(obj, key, val, enumerable) {
        //     Object.defineProperty(obj, key, {
        //         value: val,
        //         enumerable: !!enumerable,
        //         writable: true,
        //         configurable: true
        //     });
        // }
        def(value, '__ob__', this);
        //设置属性 描述值，加setter／getter
        if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    };

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
             //@Jane 这里将每个 obj里的值。加入getter,setter
            defineReactive$$1(obj, keys[i], obj[keys[i]]);
        }
    };

    /**
     * Observe a list of Array items.  
     * 这里也是 需要   //@Jane 这里将每个 obj里的值。加入getter,setter，不同的是处理数组。
     */
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    };


    //功能函数

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
                if (Dep.target) {
                    //dep,watcher互相 加入。
                    dep.depend();
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