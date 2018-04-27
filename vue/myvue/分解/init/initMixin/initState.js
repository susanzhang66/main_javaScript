    //
    function initState(vm) {
        vm._watchers = [];
        var opts = vm.$options;
        if (opts.props) {
            initProps(vm, opts.props);
        }
        if (opts.methods) {
            initMethods(vm, opts.methods);
        }
        // 这里 对应props 和 data里的值 联系上,并将值 让watcher监听，加入setter,getter.
        if (opts.data) {
            initData(vm);
        } else {
            observe(vm._data = {}, true /* asRootData */ );
        }
        if (opts.computed) {
            initComputed(vm, opts.computed);
        }
        if (opts.watch) {
            initWatch(vm, opts.watch);
        }
    }