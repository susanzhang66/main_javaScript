    /* 给到了 mergeOptions函数 引用了， parent,child参数
    例如：
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
    );

     */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     */
    var strats = config.optionMergeStrategies;

    /**
     * Options with restrictions
     */
    {
        strats.el = strats.propsData = function(parent, child, vm, key) {
            if (!vm) {
                warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                );
            }
            return defaultStrat(parent, child)
        };
    }

    /**
     * Helper that recursively merges two data objects together.
     *深度复制从from 给到 to...
     */
    function mergeData(to, from) {
        if (!from) {
            return to
        }
        var key, toVal, fromVal;
        var keys = Object.keys(from);
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            toVal = to[key];
            fromVal = from[key];
            if (!hasOwn(to, key)) {
                set(to, key, fromVal);
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                mergeData(toVal, fromVal);
            }
        }
        return to
    }

    /**
     * Data
     */
    strats.data = function(
        parentVal,
        childVal,
        vm
    ) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
                return parentVal
            }
            if (typeof childVal !== 'function') {
                "development" !== 'production' && warn(
                    'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                    vm
                );
                return parentVal
            }
            if (!parentVal) {
                return childVal
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn() {
                return mergeData(
                    childVal.call(this),
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
                // instance merge
                var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
                var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
                if (instanceData) {
                    return mergeData(instanceData, defaultData)
                } else {
                    return defaultData
                }
            }
        }
    };

    /**
     * Hooks and props are merged as arrays.
     * Jane 如果有 parentVal，要将childVal，一起合并起来。
     */
    function mergeHook(
        parentVal,
        childVal
    ) {
        return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal
    }

    LIFECYCLE_HOOKS.forEach(function(hook) {
        strats[hook] = mergeHook;
    });


    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */
    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null);
        return childVal ? extend(res, childVal) : res
    }

    ASSET_TYPES.forEach(function(type) {
        strats[type + 's'] = mergeAssets;
    });

    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */
    strats.watch = function(parentVal, childVal) {
        /* istanbul ignore if */
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = {};
        extend(ret, parentVal);
        for (var key in childVal) {
            var parent = ret[key];
            var child = childVal[key];
            if (parent && !Array.isArray(parent)) {
                parent = [parent];
            }
            ret[key] = parent ? parent.concat(child) : [child];
        }
        return ret
    };

    /**
     * Other object hashes.
     */
    strats.props =
        strats.methods =
        strats.computed = function(parentVal, childVal) {
            if (!childVal) {
                return Object.create(parentVal || null)
            }
            if (!parentVal) {
                return childVal
            }
            var ret = Object.create(null);
            extend(ret, parentVal);
            extend(ret, childVal);
            return ret
        };

    /**
     * Default strategy.
     */
    var defaultStrat = function(parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal
    };




    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     */
    function mergeOptions(
        parent,
        child,
        vm
    ) {
        {
            //检验 组件的名字规范
            checkComponents(child);
        }

        if (typeof child === 'function') {
            child = child.options;
        }
        // Ensure all props option syntax are normalized into the * Object-based format.
        //Jane, 形式化props,
        normalizeProps(child);
        //Normalize raw function directives into object format.
        //Jane, 形式化 options.directives ,
        normalizeDirectives(child);
        var extendsFrom = child.extends;
        if (extendsFrom) {
            parent = mergeOptions(parent, extendsFrom, vm);
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
        var options = {};
        var key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }
        //todo.....
        function mergeField(key) {
            //defaultStrat:优先返回第二个参数值。否则返回第一个。
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options
    }