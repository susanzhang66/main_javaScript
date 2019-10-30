   // 　new Vue的初始执行。 Vue.prototype._init。。。。
// 实例化vue的 执行第一步
    function initMixin(Vue) {
        Vue.prototype._init = function(options) {
            var vm = this;
            // a uid
            vm._uid = uid$1++;

            var startTag, endTag;
            /* istanbul ignore if */
            if ("development" !== 'production' && config.performance && mark) {
                startTag = "vue-perf-init:" + (vm._uid);
                endTag = "vue-perf-end:" + (vm._uid);
                mark(startTag);
            }

            // a flag to avoid this being observed
            vm._isVue = true;
            // merge options
            if (options && options._isComponent) {
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                initInternalComponent(vm, options);
            } else {
                //Merge two option objects into a new one.   Core utility used in both instantiation and inheritance.
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                );
            }
            /* istanbul ignore else */
            // @Jane vm._renderProxy  加入这个属性 －－ render 前的代理函数
            {
                initProxy(vm);
            }
            // expose real self
            vm._self = vm;
            initLifecycle(vm);
            initEvents(vm);
            initRender(vm);
            callHook(vm, 'beforeCreate');
            initInjections(vm); // resolve injections before data/props
            // @Jane  props，methods, data(监听／setter/getter ), computed,watched 初始
            initState(vm);
            initProvide(vm); // resolve provide after data/props
            callHook(vm, 'created');

            /* istanbul ignore if */
            if ("development" !== 'production' && config.performance && mark) {
                vm._name = formatComponentName(vm, false);
                mark(endTag);
                measure(((vm._name) + " init"), startTag, endTag);
            }
            //编译
            if (vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
        };
    }