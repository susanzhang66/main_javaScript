    //延迟执行的一个函数。即1）创建一个可变参数的函数 2）和 延迟执行的 函数数组。3）还可以随时删除要运行的函数
    function createFnInvoker(fns) {
        function invoker() {
            var arguments$1 = arguments;

            var fns = invoker.fns;
            if (Array.isArray(fns)) {
                for (var i = 0; i < fns.length; i++) {
                    fns[i].apply(null, arguments$1);
                }
            } else {
                // return handler return value for single handlers
                return fns.apply(null, arguments)
            }
        }
        invoker.fns = fns;
        return invoker
    }


    invoker = createFnInvoker([oldHook, wrappedHook]);


        /*  */

    function mergeVNodeHook(def, hookKey, hook) {
        var invoker;
        var oldHook = def[hookKey];

        function wrappedHook() {
            hook.apply(this, arguments);
            // important: remove merged hook to ensure it's called only once
            // and prevent memory leak
            //可以只被执行一次。
            //按照下面的 数组remove 如果单个函数的话，会报错哦。
            remove(invoker.fns, wrappedHook);
        }

        if (isUndef(oldHook)) {
            // no existing hook
            invoker = createFnInvoker([wrappedHook]);
        } else {
            /* istanbul ignore if */
            if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
                // already a merged invoker
                invoker = oldHook;
                invoker.fns.push(wrappedHook);
            } else {
                // existing plain hook
                invoker = createFnInvoker([oldHook, wrappedHook]);
            }
        }

        invoker.merged = true;
        def[hookKey] = invoker;
    }

    /**
     * Remove an item from an array
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }