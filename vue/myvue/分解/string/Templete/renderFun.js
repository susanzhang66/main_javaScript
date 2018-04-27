    /*  */

    function initRender(vm) {
        vm._vnode = null; // the root of the child tree
        vm._staticTrees = null;
        var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
        var renderContext = parentVnode && parentVnode.context;
        vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
        vm.$scopedSlots = emptyObject;
        // bind the createElement fn to this instance
        // so that we get proper render context inside it.
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates
        vm._c = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, false);
        };
        // normalization is always applied for the public version, used in
        // user-written render functions.
        vm.$createElement = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, true);
        };
    }
    function renderMixin(Vue) {
        Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
        };

        Vue.prototype._render = function() {
            var vm = this;
            var ref = vm.$options;
            var render = ref.render;
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
/*------------------以下  功能函数----------------------------------------------*/

    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     */
    function markOnce(
        tree,
        index,
        key
    ) {
        markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
        return tree
    }

    function markStatic(
        tree,
        key,
        isOnce
    ) {
        if (Array.isArray(tree)) {
            for (var i = 0; i < tree.length; i++) {
                if (tree[i] && typeof tree[i] !== 'string') {
                    markStaticNode(tree[i], (key + "_" + i), isOnce);
                }
            }
        } else {
            markStaticNode(tree, key, isOnce);
        }
    }

    function markStaticNode(node, key, isOnce) {
        node.isStatic = true;
        node.key = key;
        node.isOnce = isOnce;
    }


    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function _toString(val) {
        return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)
    }


        /*  */

    /**
     * Runtime helper for rendering v-for lists.
     */
    function renderList(
        val,
        render
    ) {
        var ret, i, l, keys, key;
        if (Array.isArray(val) || typeof val === 'string') {
            ret = new Array(val.length);
            for (i = 0, l = val.length; i < l; i++) {
                ret[i] = render(val[i], i);
            }
        } else if (typeof val === 'number') {
            ret = new Array(val);
            for (i = 0; i < val; i++) {
                ret[i] = render(i + 1, i);
            }
        } else if (isObject(val)) {
            keys = Object.keys(val);
            ret = new Array(keys.length);
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                ret[i] = render(val[key], key, i);
            }
        }
        return ret
    }


        /*  */

    /**
     * Runtime helper for rendering <slot>
     */
    function renderSlot(
        name,
        fallback,
        props,
        bindObject
    ) {
        var scopedSlotFn = this.$scopedSlots[name];
        if (scopedSlotFn) { // scoped slot
            props = props || {};
            if (bindObject) {
                extend(props, bindObject);
            }
            return scopedSlotFn(props) || fallback
        } else {
            var slotNodes = this.$slots[name];
            // warn duplicate slot usage
            if (slotNodes && "development" !== 'production') {
                slotNodes._rendered && warn(
                    "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
                    "- this will likely cause render errors.",
                    this
                );
                slotNodes._rendered = true;
            }
            return slotNodes || fallback
        }
    }
        /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     */
    function looseEqual(a, b) {
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {
            try {
                return JSON.stringify(a) === JSON.stringify(b)
            } catch (e) {
                // possible circular reference
                return a === b
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
        } else {
            return false
        }
    }
    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
                return i
            }
        }
        return -1
    }
    /*  */

    /**
     * Runtime helper for rendering static trees.
     */
    function renderStatic(
        index,
        isInFor
    ) {
        var tree = this._staticTrees[index];
        // if has already-rendered static tree and not inside v-for,
        // we can reuse the same tree by doing a shallow clone.
        if (tree && !isInFor) {
            return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree)
        }
        // otherwise, render a fresh tree.
        tree = this._staticTrees[index] =
            this.$options.staticRenderFns[index].call(this._renderProxy);
        markStatic(tree, ("__static__" + index), false);
        return tree
    }
    /*  */

    /**
     * Runtime helper for resolving filters
     */
    function resolveFilter(id) {
        return resolveAsset(this.$options, 'filters', id, true) || identity
    }

    /*  */

    /**
     * Runtime helper for checking keyCodes from config.
     */
    function checkKeyCodes(
        eventKeyCode,
        key,
        builtInAlias
    ) {
        var keyCodes = config.keyCodes[key] || builtInAlias;
        if (Array.isArray(keyCodes)) {
            return keyCodes.indexOf(eventKeyCode) === -1
        } else {
            return keyCodes !== eventKeyCode
        }
    }
        /*  */

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     */
    function bindObjectProps(
        data,
        tag,
        value,
        asProp
    ) {
        if (value) {
            if (!isObject(value)) {
                "development" !== 'production' && warn(
                    'v-bind without argument expects an Object or Array value',
                    this
                );
            } else {
                if (Array.isArray(value)) {
                    value = toObject(value);
                }
                var hash;
                for (var key in value) {
                    if (key === 'class' || key === 'style') {
                        hash = data;
                    } else {
                        var type = data.attrs && data.attrs.type;
                        hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
                    }
                    if (!(key in hash)) {
                        hash[key] = value[key];
                    }
                }
            }
        }
        return data
    }
    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }
    var createEmptyVNode = function() {
        var node = new VNode();
        node.text = '';
        node.isComment = true;
        return node
    };
    function resolveScopedSlots(
        fns
    ) {
        var res = {};
        for (var i = 0; i < fns.length; i++) {
            res[fns[i][0]] = fns[i][1];
        }
        return res
    }