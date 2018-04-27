    //渲染的函数 加入watcher
    function mountComponent(
        vm,
        el,
        hydrating
    ) {
        vm.$el = el;
        //vm.$options.render  已经将字符串template编译好的函数。
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode; {
                /* istanbul ignore if */
                if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                    vm.$options.el || el) {
                    warn(
                        'You are using the runtime-only build of Vue where the template ' +
                        'compiler is not available. Either pre-compile the templates into ' +
                        'render functions, or use the compiler-included build.',
                        vm
                    );
                } else {
                    warn(
                        'Failed to mount component: template or render function not defined.',
                        vm
                    );
                }
            }
        }
        callHook(vm, 'beforeMount');

        var updateComponent;
        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
            updateComponent = function() {
                var name = vm._name;
                var id = vm._uid;
                var startTag = "vue-perf-start:" + id;
                var endTag = "vue-perf-end:" + id;

                mark(startTag);
                var vnode = vm._render();
                mark(endTag);
                measure((name + " render"), startTag, endTag);

                mark(startTag);
                vm._update(vnode, hydrating);
                mark(endTag);
                measure((name + " patch"), startTag, endTag);
            };
        } else {
            updateComponent = function() {
                //这里会渲染动作。。。
                vm._update(vm._render(), hydrating);
            };
        }
        // 渲染动作 加入watcher
        vm._watcher = new Watcher(vm, updateComponent, noop);
        hydrating = false;

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        if (vm.$vnode == null) {
            vm._isMounted = true;
            callHook(vm, 'mounted');
        }
        return vm
    }