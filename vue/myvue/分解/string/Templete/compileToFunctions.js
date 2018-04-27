       /*  */

    var baseOptions = {
        expectHTML: true,
        modules: modules$1,
        directives: directives$1,
        isPreTag: isPreTag,
        isUnaryTag: isUnaryTag,
        mustUseProp: mustUseProp,
        canBeLeftOpenTag: canBeLeftOpenTag,
        isReservedTag: isReservedTag,
        getTagNamespace: getTagNamespace,
        staticKeys: genStaticKeys(modules$1)
    };

    function createCompiler(baseOptions) {
        var functionCompileCache = Object.create(null);

        function compile(
            template,
            options
        ) {
            var finalOptions = Object.create(baseOptions);
            var errors = [];
            var tips = [];
            finalOptions.warn = function(msg, tip$$1) {
                (tip$$1 ? tips : errors).push(msg);
            };

            if (options) {
                // merge custom modules
                if (options.modules) {
                    finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
                }
                // merge custom directives
                if (options.directives) {
                    finalOptions.directives = extend(
                        Object.create(baseOptions.directives),
                        options.directives
                    );
                }
                // copy other options
                for (var key in options) {
                    if (key !== 'modules' && key !== 'directives') {
                        finalOptions[key] = options[key];
                    }
                }
            }
            //compiled 编译模版，render
            var compiled = baseCompile(template, finalOptions); {
                errors.push.apply(errors, detectErrors(compiled.ast));
            }
            compiled.errors = errors;
            compiled.tips = tips;
            return compiled
        }
        //编译 render示例如下：
        // render = (function() {
        //     with(this) {
        //         return _c('div', {
        //             attrs: {
        //                 "id": "app"
        //             }
        //         }, [_c('child', {
        //             attrs: {
        //                 "message": "bushi a !"
        //             }
        //         })], 1)
        //     }
        // })
        function compileToFunctions(
            template,
            options,
            vm
        ) {
            options = options || {};

            /* istanbul ignore if */
            {
                // detect possible CSP restriction
                try {
                    new Function('return 1');
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn(
                            'It seems you are using the standalone build of Vue.js in an ' +
                            'environment with Content Security Policy that prohibits unsafe-eval. ' +
                            'The template compiler cannot work in this environment. Consider ' +
                            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                            'templates into render functions.'
                        );
                    }
                }
            }

            // check cache
            var key = options.delimiters ? String(options.delimiters) + template : template;
            if (functionCompileCache[key]) {
                return functionCompileCache[key]
            }

            // compile   
            var compiled = compile(template, options);

            // check compilation errors/tips
            {
                if (compiled.errors && compiled.errors.length) {
                    warn(
                        "Error compiling template:\n\n" + template + "\n\n" +
                        compiled.errors.map(function(e) {
                            return ("- " + e);
                        }).join('\n') + '\n',
                        vm
                    );
                }
                if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(function(msg) {
                        return tip(msg, vm);
                    });
                }
            }

            // turn code into functions
            var res = {};
            var fnGenErrors = [];
            // .Jane...... 函数字符串 变成 函数  new Function....
            res.render = makeFunction(compiled.render, fnGenErrors);
            var l = compiled.staticRenderFns.length;
            res.staticRenderFns = new Array(l);
            for (var i = 0; i < l; i++) {
                res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
            }

            // check function generation errors.
            // this should only happen if there is a bug in the compiler itself.
            // mostly for codegen development use
            /* istanbul ignore if */
            {
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn(
                        "Failed to generate render function:\n\n" +
                        fnGenErrors.map(function(ref) {
                            var err = ref.err;
                            var code = ref.code;

                            return ((err.toString()) + " in\n\n" + code + "\n");
                        }).join('\n'),
                        vm
                    );
                }
            }

            return (functionCompileCache[key] = res)
        }

        return {
            compile: compile,
            compileToFunctions: compileToFunctions
        }
    }


        /*  */
    // 编译字符串。。。
    function baseCompile(
        template,
        options
    ) {
        var ast = parse(template.trim(), options);
        optimize(ast, options);
        var code = generate(ast, options);
        return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    }

    function makeFunction(code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({
                err: err,
                code: code
            });
            return noop
        }
    }

