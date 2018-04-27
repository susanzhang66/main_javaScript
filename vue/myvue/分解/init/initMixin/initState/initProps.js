    function initProps(vm, propsOptions) {
        var propsData = vm.$options.propsData || {};
        var props = vm._props = {};
        // cache prop keys so that future props updates can iterate using Array
        // instead of dynamic object key enumeration.
        var keys = vm.$options._propKeys = [];
        var isRoot = !vm.$parent;
        // root instance props should be converted
        observerState.shouldConvert = isRoot;
        var loop = function(key) {
            keys.push(key);
             /* 检测props合法性 */
            var value = validateProp(key, propsOptions, propsData, vm);
            /* istanbul ignore else */
            {
                if (isReservedProp[key] || config.isReservedAttr(key)) {
                    warn(
                        ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
                        vm
                    );
                }
                defineReactive$$1(props, key, value, function() {
                    if (vm.$parent && !observerState.isSettingProps) {
                        warn(
                            "Avoid mutating a prop directly since the value will be " +
                            "overwritten whenever the parent component re-renders. " +
                            "Instead, use a data or computed property based on the prop's " +
                            "value. Prop being mutated: \"" + key + "\"",
                            vm
                        );
                    }
                });
            }
            // static props are already proxied on the component's prototype
            // during Vue.extend(). We only need to proxy props defined at
            // instantiation here.
            if (!(key in vm)) {
                proxy(vm, "_props", key);
            }
        };

        for (var key in propsOptions) loop(key);
        observerState.shouldConvert = true;
    }


        /* 检测props合法性 */

    function validateProp(
        key,
        propOptions,
        propsData,
        vm
    ) {
        var prop = propOptions[key];
        var absent = !hasOwn(propsData, key);
        var value = propsData[key];
        // handle boolean props
        if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, 'default')) {
                value = false;
            } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
                value = true;
            }
        }
        // check default value
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key);
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldConvert = observerState.shouldConvert;
            observerState.shouldConvert = true;
            observe(value);
            observerState.shouldConvert = prevShouldConvert;
        } {
            assertProp(prop, key, value, vm, absent);
        }
        return value
    }