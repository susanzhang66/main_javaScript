    var mount = Vue$3.prototype.$mount;
    //编译。  重写了$mount
    Vue$3.prototype.$mount = function(
        el,
        hydrating
    ) {
        el = el && query(el);

        /* istanbul ignore if */
        if (el === document.body || el === document.documentElement) {
            "development" !== 'production' && warn(
                "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            );
            return this
        }

        var options = this.$options;
        // resolve template/el and convert to render function
        if (!options.render) {
            var template = options.template;
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template);
                        /* istanbul ignore if */
                        if ("development" !== 'production' && !template) {
                            warn(
                                ("Template element not found or is empty: " + (options.template)),
                                this
                            );
                        }
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML;
                } else {
                    {
                        warn('invalid template option:' + template, this);
                    }
                    return this
                }
            } else if (el) {
                template = getOuterHTML(el);
            }
            
            if (template) {
                /* istanbul ignore if */
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile');
                }
                //得到 options.render 函数字符串, staticRenderFns
                var ref = compileToFunctions(template, {
                    shouldDecodeNewlines: shouldDecodeNewlines,
                    delimiters: options.delimiters
                }, this);
                //得到一个 渲染dom的函数
                var render = ref.render;
                var staticRenderFns = ref.staticRenderFns;
                options.render = render;
                options.staticRenderFns = staticRenderFns;

                /* istanbul ignore if */
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile end');
                    measure(((this._name) + " compile"), 'compile', 'compile end');
                }
            }
        }
        return mount.call(this, el, hydrating)
    };