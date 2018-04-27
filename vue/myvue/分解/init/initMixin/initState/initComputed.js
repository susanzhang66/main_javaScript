    var computedWatcherOptions = {
        lazy: true
    };
    // 初始 computed 属性  
    //@computed,是 options.computed
    function initComputed(vm, computed) {
        var watchers = vm._computedWatchers = Object.create(null);

        for (var key in computed) {
            var userDef = computed[key];
            var getter = typeof userDef === 'function' ? userDef : userDef.get; {
                if (getter === undefined) {
                    warn(
                        ("No getter function has been defined for computed property \"" + key + "\"."),
                        vm
                    );
                    getter = noop;
                }
            }
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

            // component-defined computed properties are already defined on the
            // component prototype. We only need to define computed properties defined
            // at instantiation here.
            if (!(key in vm)) {
                defineComputed(vm, key, userDef);
            } else {
                if (key in vm.$data) {
                    warn(("The computed property \"" + key + "\" is already defined in data."), vm);
                } else if (vm.$options.props && key in vm.$options.props) {
                    warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
                }
            }
        }
    }

    function defineComputed(target, key, userDef) {
        if (typeof userDef === 'function') {
            sharedPropertyDefinition.get = createComputedGetter(key);
            sharedPropertyDefinition.set = noop;
        } else {
            sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
            sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
        }
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }

    function createComputedGetter(key) {
        return function computedGetter() {
            var watcher = this._computedWatchers && this._computedWatchers[key];
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (Dep.target) {
                    watcher.depend();
                }
                return watcher.value
            }
        }
    }
