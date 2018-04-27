    /*  */

    var onRE = /^@|^v-on:/;
    var dirRE = /^v-|^@|^:/;
    var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
    var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

    var argRE = /:(.*)$/;
    var bindRE = /^:|^v-bind:/;
    var modifierRE = /\.[^.]+/g;

    var decodeHTMLCached = cached(decode);

    // configurable state
    var warn$2;
    var delimiters;
    var transforms;
    var preTransforms;
    var postTransforms;
    var platformIsPreTag;
    var platformMustUseProp;
    var platformGetTagNamespace;
    /**
     * Convert HTML string to AST.
     */
    function parse(
        template,
        options
    ) {
        warn$2 = options.warn || baseWarn;
        platformGetTagNamespace = options.getTagNamespace || no;
        platformMustUseProp = options.mustUseProp || no;
        //是否是pre元素标签 的判断函数
        platformIsPreTag = options.isPreTag || no;
        preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
        delimiters = options.delimiters;

        var stack = [];  //需要闭合的 元素标签 如下
        // var element = {
        //             type: 1,
        //             tag: tag,
        //             attrsList: attrs,
        //             //这里处理格式化 开始标签里的 属性 对象。
        //             attrsMap: makeAttrsMap(attrs),
        //             parent: currentParent,
        //             children: []
        //         };
        var preserveWhitespace = options.preserveWhitespace !== false;
        var root;
        var currentParent;
        var inVPre = false;
        var inPre = false;
        var warned = false;

        function warnOnce(msg) {
            if (!warned) {
                warned = true;
                warn$2(msg);
            }
        }

        function endPre(element) {
            // check pre state
            if (element.pre) {
                inVPre = false;
            }
            if (platformIsPreTag(element.tag)) {
                inPre = false;
            }
        }

        parseHTML(template, {
            warn: warn$2,
            expectHTML: options.expectHTML,
            isUnaryTag: options.isUnaryTag,
            canBeLeftOpenTag: options.canBeLeftOpenTag,
            shouldDecodeNewlines: options.shouldDecodeNewlines,
            // start：初始化元素关系 包括元素的父子节点。和model事件
            start: function start(tag, attrs, unary) {
                // check namespace.
                // inherit parent ns if there is one
                var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

                // handle IE svg bug
                /* istanbul ignore if */
                if (isIE && ns === 'svg') {
                    attrs = guardIESVGBug(attrs);
                }

                var element = {
                    type: 1,
                    tag: tag,
                    attrsList: attrs,
                    //这里处理格式化 开始标签里的 属性 对象。
                    attrsMap: makeAttrsMap(attrs),
                    parent: currentParent,
                    children: []
                };
                if (ns) {
                    element.ns = ns;
                }
                // isForbiddenTag： style, script 不能
                if (isForbiddenTag(element) && !isServerRendering()) {
                    element.forbidden = true;
                    "development" !== 'production' && warn$2(
                        'Templates should only be responsible for mapping the state to the ' +
                        'UI. Avoid placing tags with side-effects in your templates, such as ' +
                        "<" + tag + ">" + ', as they will not be parsed.'
                    );
                }

                // apply pre-transforms
                for (var i = 0; i < preTransforms.length; i++) {
                    preTransforms[i](element, options);
                }

                if (!inVPre) {
                    processPre(element);
                    if (element.pre) {
                        inVPre = true;
                    }
                }
                //是否 pre
                if (platformIsPreTag(element.tag)) {
                    inPre = true;
                }
                if (inVPre) {
                    processRawAttrs(element);
                } else {
                    // 形式化处理 v-for，处理好的 在element属性上了。
                    processFor(element);
                    // 处理v-if
                    processIf(element);
                    //处理 v-once
                    processOnce(element);
                    //检查 key值，的有效性。
                    processKey(element);

                    // determine whether this is a plain element after
                    // removing structural attributes
                    element.plain = !element.key && !attrs.length;
                    // 处理 ref；
                    processRef(element);
                    //@Jane 判断是<slot>元素或属性，元素的话slotName的值加入element
                    processSlot(element);
                    //处理 is, inline-template
                    processComponent(element);
                    //处理 style, class
                    for (var i$1 = 0; i$1 < transforms.length; i$1++) {
                        transforms[i$1](element, options);
                    }
                    processAttrs(element);
                }

                function checkRootConstraints(el) {
                    {
                        if (el.tag === 'slot' || el.tag === 'template') {
                            warnOnce(
                                "Cannot use <" + (el.tag) + "> as component root element because it may " +
                                'contain multiple nodes.'
                            );
                        }
                        if (el.attrsMap.hasOwnProperty('v-for')) {
                            warnOnce(
                                'Cannot use v-for on stateful component root element because ' +
                                'it renders multiple elements.'
                            );
                        }
                    }
                }

                // tree management
                if (!root) {
                    root = element;
                    checkRootConstraints(root);
                } else if (!stack.length) {
                    // allow root elements with v-if, v-else-if and v-else
                    if (root.if && (element.elseif || element.else)) {
                        checkRootConstraints(element);
                        addIfCondition(root, {
                            exp: element.elseif,
                            block: element
                        });
                    } else {
                        warnOnce(
                            "Component template should contain exactly one root element. " +
                            "If you are using v-if on multiple elements, " +
                            "use v-else-if to chain them instead."
                        );
                    }
                }
                if (currentParent && !element.forbidden) {
                    if (element.elseif || element.else) {
                        processIfConditions(element, currentParent);
                    } else if (element.slotScope) { // scoped slot
                        currentParent.plain = false;
                        var name = element.slotTarget || '"default"';
                        (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                    } else {
                        currentParent.children.push(element);
                        element.parent = currentParent;
                    }
                }
                // !unary 需要闭合的 元素的 标签。
                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                } else {
                    endPre(element);
                }
                // apply post-transforms
                for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
                    postTransforms[i$2](element, options);
                }
            },

            end: function end() {
                // remove trailing whitespace
                var element = stack[stack.length - 1];
                var lastNode = element.children[element.children.length - 1];
                if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
                    element.children.pop();
                }
                // pop stack
                stack.length -= 1;
                currentParent = stack[stack.length - 1];
                endPre(element);
            },
            //todo。。。。。。处理文本和子节点。包括 变量。
            chars: function chars(text) {
                if (!currentParent) {
                    {
                        if (text === template) {
                            warnOnce(
                                'Component template requires a root element, rather than just text.'
                            );
                        } else if ((text = text.trim())) {
                            warnOnce(
                                ("text \"" + text + "\" outside root element will be ignored.")
                            );
                        }
                    }
                    return
                }
                // IE textarea placeholder bug
                /* istanbul ignore if */
                if (isIE &&
                    currentParent.tag === 'textarea' &&
                    currentParent.attrsMap.placeholder === text) {
                    return
                }
                var children = currentParent.children;
                // Jane // isTextTag: for script (e.g. type="x/template") or style, do not decode content
                text = inPre || text.trim() ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
                    // only preserve whitespace if its not right after a starting tag
                    : preserveWhitespace && children.length ? ' ' : '';
                if (text) {
                    var expression;
                    if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
                        children.push({
                            type: 2,
                            expression: expression,
                            text: text
                        });
                    } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
                        children.push({
                            type: 3,
                            text: text
                        });
                    }
                }
            }
        });
        return root
    }

    function pluckModuleFunction(
        modules,
        key
    ) {
        return modules ? modules.map(function(m) {
            return m[key];
        }).filter(function(_) {
            return _;
        }) : []
    }

    function makeAttrsMap(attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
            if (
                "development" !== 'production' &&
                map[attrs[i].name] && !isIE && !isEdge
            ) {
                warn$2('duplicate attribute: ' + attrs[i].name);
            }
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

    // 模版中 获取特定需要监听的事件  ？？监听事件？
    function processAttrs(el) {
        var list = el.attrsList;
        var i, l, name, rawName, value, modifiers, isProp;
        for (i = 0, l = list.length; i < l; i++) {
            name = rawName = list[i].name;
            value = list[i].value;
            // var dirRE = /^v-|^@|^:/;  @Jane: 检测是 自定义命令。 
            if (dirRE.test(name)) {
                // mark element as dynamic
                el.hasBindings = true;
                // modifiers
                modifiers = parseModifiers(name);
                if (modifiers) {
                    name = name.replace(modifierRE, '');
                }
                if (bindRE.test(name)) { // v-bind
                    name = name.replace(bindRE, '');
                    value = parseFilters(value);
                    isProp = false;
                    if (modifiers) {
                        if (modifiers.prop) {
                            isProp = true;
                            name = camelize(name);
                            if (name === 'innerHtml') {
                                name = 'innerHTML';
                            }
                        }
                        if (modifiers.camel) {
                            name = camelize(name);
                        }
                        if (modifiers.sync) {
                            addHandler(
                                el,
                                ("update:" + (camelize(name))),
                                genAssignmentCode(value, "$event")
                            );
                        }
                    }
                    if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
                        addProp(el, name, value);
                    } else {
                        //attrs, 将name,value 键值对 加入el.attrs数组。 如：:title="message"
                        addAttr(el, name, value);
                    }
                } else if (onRE.test(name)) { // v-on
                    name = name.replace(onRE, '');
                    addHandler(el, name, value, modifiers, false, warn$2);
                } else { // normal directives
                    name = name.replace(dirRE, '');
                    // parse arg
                    var argMatch = name.match(argRE);
                    var arg = argMatch && argMatch[1];
                    if (arg) {
                        name = name.slice(0, -(arg.length + 1));
                    }
                    addDirective(el, name, rawName, value, arg, modifiers);
                    if ("development" !== 'production' && name === 'model') {
                        checkForAliasModel(el, value);
                    }
                }
            } else {
                // literal attribute
                {
                    var expression = parseText(value, delimiters);
                    if (expression) {
                        warn$2(
                            name + "=\"" + value + "\": " +
                            'Interpolation inside attributes has been removed. ' +
                            'Use v-bind or the colon shorthand instead. For example, ' +
                            'instead of <div id="{{ val }}">, use <div :id="val">.'
                        );
                    }
                }
                addAttr(el, name, JSON.stringify(value));
            }
        }
    }



    /*  */

    // Jane 处理 节点文本的 变量

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;   //变量的 规定符号
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

    var buildRegex = cached(function(delimiters) {
        var open = delimiters[0].replace(regexEscapeRE, '\\$&');
        var close = delimiters[1].replace(regexEscapeRE, '\\$&');
        return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
    });

    function parseText(
        text,
        delimiters
    ) {
        var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
        if (!tagRE.test(text)) {
            return
        }
        var tokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index;
        while ((match = tagRE.exec(text))) {
            index = match.index;
            // push text token
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            // tag token
            var exp = parseFilters(match[1].trim());
            tokens.push(("_s(" + exp + ")"));
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return tokens.join('+')
    }