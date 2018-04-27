/**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     *加入观察
     */
     // @Jane 创建 Observe,value._ob_ = Observe实例。
     // //@Jane 这里将每个 obj里的值，加入getter,setter
            // defineReactive$$1(obj, keys[i], obj[keys[i]]);
    function observe(value, asRootData) {
        if (!isObject(value)) {
            return
        }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (
            observerState.shouldConvert &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&   //只能是数组或对象才能创建监听
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            ob = new Observer(value);
        }
        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob
    }