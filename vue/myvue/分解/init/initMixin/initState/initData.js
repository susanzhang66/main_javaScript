    //处理 data属性值。和props， 对data里的属性不是$或_开头的话 设置成实例属性。
    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
        if (!isPlainObject(data)) {
            data = {};
            "development" !== 'production' && warn(
                'data functions should return an object:\n' +
                'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
                vm
            );
        }
        // proxy data on instance
        var keys = Object.keys(data);
        var props = vm.$options.props;
        var i = keys.length;
        while (i--) {
            //data的key值不能和props的key值一样
            if (props && hasOwn(props, keys[i])) {
                "development" !== 'production' && warn(
                    "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
                    "Use prop default value instead.",
                    vm
                );
            // @Jane isReserved : Check if a string starts with $ or _
            } else if (!isReserved(keys[i])) {
            //@Jane   vm.keys[i]即是在vm._data里取
                proxy(vm, "_data", keys[i]);
            }
        }
        // observe data, @Jane 对数据data ,vm._data监听，defineReactive$$1
        observe(data, true /* asRootData */ );
    }