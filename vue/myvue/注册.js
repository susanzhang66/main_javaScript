   vue.js截取的。注册插件。。
    function initUse(Vue) {
        Vue.use = function(plugin) {
            /* istanbul ignore if */
            if (plugin.installed) {
                return
            }
            // additional parameters
            var args = toArray(arguments, 1);
            args.unshift(this);
            if (typeof plugin.install === 'function') {
                plugin.install.apply(plugin, args);
            } else if (typeof plugin === 'function') {
                plugin.apply(null, args);
            }
            plugin.installed = true;
            return this
        };
    }