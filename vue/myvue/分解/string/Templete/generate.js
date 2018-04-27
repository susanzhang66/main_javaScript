    /*  */

    // Jane generate函数  在baseCompile()里。

    // configurable state
    var warn$3;
    var transforms$1;
    var dataGenFns;
    var platformDirectives$1;
    var isPlatformReservedTag$1;
    var staticRenderFns;
    var onceCount;
    var currentOptions;

    function generate(
        ast,
        options
    ) {
        // save previous staticRenderFns so generate calls can be nested
        var prevStaticRenderFns = staticRenderFns;
        var currentStaticRenderFns = staticRenderFns = [];
        var prevOnceCount = onceCount;
        onceCount = 0;
        currentOptions = options;
        warn$3 = options.warn || baseWarn;
        transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
        dataGenFns = pluckModuleFunction(options.modules, 'genData');
        platformDirectives$1 = options.directives || {};
        isPlatformReservedTag$1 = options.isReservedTag || no;
        var code = ast ? genElement(ast) : '_c("div")';
        staticRenderFns = prevStaticRenderFns;
        onceCount = prevOnceCount;
        return {
            render: ("with(this){return " + code + "}"),
            staticRenderFns: currentStaticRenderFns
        }
    }
    //处理 文本内容的 自定义变量。。
    function genElement(el) {
        if (el.staticRoot && !el.staticProcessed) {
            return genStatic(el)
        } else if (el.once && !el.onceProcessed) {
            return genOnce(el)
        } else if (el.for && !el.forProcessed) {
            return genFor(el)
        } else if (el.if && !el.ifProcessed) {
            return genIf(el)
        } else if (el.tag === 'template' && !el.slotTarget) {
            return genChildren(el) || 'void 0'
        } else if (el.tag === 'slot') {
            return genSlot(el)
        } else {
            // component or element
            var code;
            if (el.component) {
                code = genComponent(el.component, el);
            } else {
                var data = el.plain ? undefined : genData(el);

                var children = el.inlineTemplate ? null : genChildren(el, true);
                code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
            }
            // module transforms
            for (var i = 0; i < transforms$1.length; i++) {
                code = transforms$1[i](el, code);
            }
            return code
        }
    }

    // hoist static sub-trees out
    function genStatic(el) {
        el.staticProcessed = true;
        staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
        return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
    }

    // v-once
    function genOnce(el) {
        el.onceProcessed = true;
        if (el.if && !el.ifProcessed) {
            return genIf(el)
        } else if (el.staticInFor) {
            var key = '';
            var parent = el.parent;
            while (parent) {
                if (parent.for) {
                    key = parent.key;
                    break
                }
                parent = parent.parent;
            }
            if (!key) {
                "development" !== 'production' && warn$3(
                    "v-once can only be used inside v-for that is keyed. "
                );
                return genElement(el)
            }
            return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
        } else {
            return genStatic(el)
        }
    }

    function genIf(el) {
        el.ifProcessed = true; // avoid recursion
        return genIfConditions(el.ifConditions.slice())
    }

    function genIfConditions(conditions) {
        if (!conditions.length) {
            return '_e()'
        }

        var condition = conditions.shift();
        if (condition.exp) {
            return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
        } else {
            return ("" + (genTernaryExp(condition.block)))
        }

        // v-if with v-once should generate code like (a)?_m(0):_m(1)
        function genTernaryExp(el) {
            return el.once ? genOnce(el) : genElement(el)
        }
    }

    function genFor(el) {
        var exp = el.for;
        var alias = el.alias;
        var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
        var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

        if (
            "development" !== 'production' &&
            maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key
        ) {
            warn$3(
                "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
                "v-for should have explicit keys. " +
                "See https://vuejs.org/guide/list.html#key for more info.",
                true /* tip */
            );
        }

        el.forProcessed = true; // avoid recursion
        return "_l((" + exp + ")," +
            "function(" + alias + iterator1 + iterator2 + "){" +
            "return " + (genElement(el)) +
            '})'
    }

    function genData(el) {
        var data = '{';

        // directives first.
        // directives may mutate the el's other properties before they are generated.
        var dirs = genDirectives(el);
        if (dirs) {
            data += dirs + ',';
        }

        // key
        if (el.key) {
            data += "key:" + (el.key) + ",";
        }
        // ref
        if (el.ref) {
            data += "ref:" + (el.ref) + ",";
        }
        if (el.refInFor) {
            data += "refInFor:true,";
        }
        // pre
        if (el.pre) {
            data += "pre:true,";
        }
        // record original tag name for components using "is" attribute
        if (el.component) {
            data += "tag:\"" + (el.tag) + "\",";
        }
        // module data generation functions   
        // Jane 处理 style，和 css
        for (var i = 0; i < dataGenFns.length; i++) {
            data += dataGenFns[i](el);
        }
        // attributes
        if (el.attrs) {
            data += "attrs:{" + (genProps(el.attrs)) + "},";
        }
        // DOM props
        if (el.props) {
            data += "domProps:{" + (genProps(el.props)) + "},";
        }
        // event handlers
        if (el.events) {
            data += (genHandlers(el.events, false, warn$3)) + ",";
        }
        if (el.nativeEvents) {
            data += (genHandlers(el.nativeEvents, true, warn$3)) + ",";
        }
        // slot target
        if (el.slotTarget) {
            data += "slot:" + (el.slotTarget) + ",";
        }
        // scoped slots
        if (el.scopedSlots) {
            data += (genScopedSlots(el.scopedSlots)) + ",";
        }
        // component v-model
        if (el.model) {
            data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
        }
        // inline-template
        if (el.inlineTemplate) {
            var inlineTemplate = genInlineTemplate(el);
            if (inlineTemplate) {
                data += inlineTemplate + ",";
            }
        }
        data = data.replace(/,$/, '') + '}';
        // v-bind data wrap
        if (el.wrapData) {
            data = el.wrapData(data);
        }
        return data
    }

    function genDirectives(el) {
        var dirs = el.directives;
        if (!dirs) {
            return
        }
        var res = 'directives:[';
        var hasRuntime = false;
        var i, l, dir, needRuntime;
        for (i = 0, l = dirs.length; i < l; i++) {
            dir = dirs[i];
            needRuntime = true;
            var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
            if (gen) {
                // compile-time directive that manipulates AST.
                // returns true if it also needs a runtime counterpart.
                needRuntime = !!gen(el, dir, warn$3);
            }
            if (needRuntime) {
                hasRuntime = true;
                res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
            }
        }
        if (hasRuntime) {
            return res.slice(0, -1) + ']'
        }
    }

    function genInlineTemplate(el) {
        var ast = el.children[0];
        if ("development" !== 'production' && (
                el.children.length > 1 || ast.type !== 1
            )) {
            warn$3('Inline-template components must have exactly one child element.');
        }
        if (ast.type === 1) {
            var inlineRenderFns = generate(ast, currentOptions);
            return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function(code) {
                return ("function(){" + code + "}");
            }).join(',')) + "]}")
        }
    }

    function genScopedSlots(slots) {
        return ("scopedSlots:_u([" + (Object.keys(slots).map(function(key) {
            return genScopedSlot(key, slots[key]);
        }).join(',')) + "])")
    }

    function genScopedSlot(key, el) {
        return "[" + key + ",function(" + (String(el.attrsMap.scope)) + "){" +
            "return " + (el.tag === 'template' ? genChildren(el) || 'void 0' : genElement(el)) + "}]"
    }

    function genChildren(el, checkSkip) {
        var children = el.children;
        if (children.length) {
            var el$1 = children[0];
            // optimize single v-for
            if (children.length === 1 &&
                el$1.for &&
                el$1.tag !== 'template' &&
                el$1.tag !== 'slot') {
                return genElement(el$1)
            }
            var normalizationType = checkSkip ? getNormalizationType(children) : 0;
            return ("[" + (children.map(genNode).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
        }
    }
    // determine the normalization needed for the children array.
    // 0: no normalization needed
    // 1: simple normalization needed (possible 1-level deep nested array)
    // 2: full normalization needed
    function getNormalizationType(children) {
        var res = 0;
        for (var i = 0; i < children.length; i++) {
            var el = children[i];
            if (el.type !== 1) {
                continue
            }
            if (needsNormalization(el) ||
                (el.ifConditions && el.ifConditions.some(function(c) {
                    return needsNormalization(c.block);
                }))) {
                res = 2;
                break
            }
            if (maybeComponent(el) ||
                (el.ifConditions && el.ifConditions.some(function(c) {
                    return maybeComponent(c.block);
                }))) {
                res = 1;
            }
        }
        return res
    }

    function needsNormalization(el) {
        return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
    }

    function maybeComponent(el) {
        return !isPlatformReservedTag$1(el.tag)
    }

    function genNode(node) {
        if (node.type === 1) {
            return genElement(node)
        } else {
            return genText(node)
        }
    }

    function genText(text) {
        return ("_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
            : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
    }

    function genSlot(el) {
        var slotName = el.slotName || '"default"';
        var children = genChildren(el);
        var res = "_t(" + slotName + (children ? ("," + children) : '');
        var attrs = el.attrs && ("{" + (el.attrs.map(function(a) {
            return ((camelize(a.name)) + ":" + (a.value));
        }).join(',')) + "}");
        var bind$$1 = el.attrsMap['v-bind'];
        if ((attrs || bind$$1) && !children) {
            res += ",null";
        }
        if (attrs) {
            res += "," + attrs;
        }
        if (bind$$1) {
            res += (attrs ? '' : ',null') + "," + bind$$1;
        }
        return res + ')'
    }

    // componentName is el.component, take it as argument to shun flow's pessimistic refinement
    function genComponent(componentName, el) {
        var children = el.inlineTemplate ? null : genChildren(el, true);
        return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
    }

    function genProps(props) {
        var res = '';
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
        }
        return res.slice(0, -1)
    }

    // #3895, #4268
    function transformSpecialNewlines(text) {
        return text
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')
    }