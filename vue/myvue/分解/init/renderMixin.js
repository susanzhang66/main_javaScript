    function renderMixin(Vue) {
        Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
        };

        Vue.prototype._render = function() {
            var vm = this;
            var ref = vm.$options;
            var render = ref.render;  //这个是 compileToFunctions 编译好的 字符串函数
            var staticRenderFns = ref.staticRenderFns;
            var _parentVnode = ref._parentVnode;

            if (vm._isMounted) {
                // clone slot nodes on re-renders
                for (var key in vm.$slots) {
                    vm.$slots[key] = cloneVNodes(vm.$slots[key]);
                }
            }

            vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

            if (staticRenderFns && !vm._staticTrees) {
                vm._staticTrees = [];
            }
            // set parent vnode. this allows render functions to have access
            // to the data on the placeholder node.
            vm.$vnode = _parentVnode;
            // render self
            var vnode;
            try {
                // Jane 这个创建了 已经编译，处理好的函数 的 虚拟节点。
                vnode = render.call(vm._renderProxy, vm.$createElement);
            } catch (e) {
                handleError(e, vm, "render function");
                // return error render result,
                // or previous vnode to prevent render error causing blank component
                /* istanbul ignore else */
                {
                    vnode = vm.$options.renderError ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e) : vm._vnode;
                }
            }
            // return empty vnode in case the render function errored out
            if (!(vnode instanceof VNode)) {
                if ("development" !== 'production' && Array.isArray(vnode)) {
                    warn(
                        'Multiple root nodes returned from render function. Render function ' +
                        'should return a single root node.',
                        vm
                    );
                }
                vnode = createEmptyVNode();
            }
            // set parent
            vnode.parent = _parentVnode;
            return vnode
        };

        // internal render helpers.
        // these are exposed on the instance prototype to reduce generated render
        // code size.
        Vue.prototype._o = markOnce;
        Vue.prototype._n = toNumber;
        Vue.prototype._s = _toString;
        Vue.prototype._l = renderList;
        Vue.prototype._t = renderSlot;
        Vue.prototype._q = looseEqual;
        Vue.prototype._i = looseIndexOf;
        Vue.prototype._m = renderStatic;
        Vue.prototype._f = resolveFilter;
        Vue.prototype._k = checkKeyCodes;
        Vue.prototype._b = bindObjectProps;
        Vue.prototype._v = createTextVNode;
        Vue.prototype._e = createEmptyVNode;
        Vue.prototype._u = resolveScopedSlots;
    }