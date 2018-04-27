     /**
     * Not type-checking this file because it's mostly vendor code.
     */

    /*!
     * HTML Parser By John Resig (ejohn.org)
     * Modified by Juriy "kangax" Zaytsev
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     */

    // Regular Expressions for parsing tags and attributes
    var singleAttrIdentifier = /([^\s"'<>/=]+)/;
    var singleAttrAssign = /(?:=)/;   // =号
    var singleAttrValues = [
        // attr value double quotes
        /"([^"]*)"+/.source,   //匹配双引号的
        // attr value, single quotes
        /'([^']*)'+/.source,   //匹配单引号的
        // attr value, no quotes
        /([^\s"'=<>`]+)/.source   //没有引号的。
    ];
    //attribute.source:  "^\s* ([^\s"'<>\/=]+) (?:\s* ((?:=)) \s*(?: "([^"]*)"+ | '([^']*)'+ | ([^\s"'=<>`]+) ))?"
    var attribute = new RegExp(       //匹配key=value形式
        '^\\s*' + singleAttrIdentifier.source +
        '(?:\\s*(' + singleAttrAssign.source + ')' +
        '\\s*(?:' + singleAttrValues.join('|') + '))?'
    );

    
    // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
    // but for Vue templates we can enforce a simple charset
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';   //字母开头的 － xx.
    var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';  // name:name  兼容xml命名空间的元素。
    var startTagOpen = new RegExp('^<' + qnameCapture);
    var startTagClose = /^\s*(\/?)>/;  //<(name:)name /> 或者 <(name:)name > 两种情况闭合标签。
    var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');  //</name> 闭合元素
    var doctype = /^<!DOCTYPE [^>]+>/i;
    var comment = /^<!--/;
    var conditionalComment = /^<!\[/;   //有条件注释

    var IS_REGEX_CAPTURING_BROKEN = false;
    'x'.replace(/x(.)?/g, function(m, g) {
        IS_REGEX_CAPTURING_BROKEN = g === '';
    });

    // Special Elements (can contain anything)
    var isPlainTextElement = makeMap('script,style,textarea', true);
    var reCache = {};

    var decodingMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&#10;': '\n'
    };
    var encodedAttr = /&(?:lt|gt|quot|amp);/g;
    var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

    function decodeAttr(value, shouldDecodeNewlines) {
        var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
        return value.replace(re, function(match) {
            return decodingMap[match];
        })
    }
    function parseHTML(html, options) {
        var stack = [];  // 需要闭合 元素标签 数组
        var expectHTML = options.expectHTML;   //baseOptions 这里写死的。
        var isUnaryTag$$1 = options.isUnaryTag || no;
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
        var index = 0;
        var last, lastTag;   //lastTag:最后一个元素标签。
        //验证模版的 有效性。。和 处理 attr
        while (html) {
            last = html;
            // Make sure we're not in a plaintext content element like script/style
            // 非 script/style 这些元素
            if (!lastTag || !isPlainTextElement(lastTag)) {
                var textEnd = html.indexOf('<');
                //元素开始标签部分,这里相对复杂，需要处理属性和自定义指令。样式等。
                if (textEnd === 0) {
                    // Comment:  如果是注释部分 跳过注释
                    if (comment.test(html)) {
                        var commentEnd = html.indexOf('-->');

                        if (commentEnd >= 0) {
                            advance(commentEnd + 3);
                            continue
                        }
                    }

                    // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                    //跳过 有条件 注释语句
                    if (conditionalComment.test(html)) {
                        var conditionalEnd = html.indexOf(']>');

                        if (conditionalEnd >= 0) {
                            advance(conditionalEnd + 2);
                            continue
                        }
                    }

                    // Doctype:  文档声明语句
                    var doctypeMatch = html.match(doctype);
                    if (doctypeMatch) {
                        advance(doctypeMatch[0].length);
                        continue
                    }

                    // End tag:
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        var curIndex = index;
                        advance(endTagMatch[0].length);
                        //endTagMatch[1]: 闭合元素
                        
                        parseEndTag(endTagMatch[1], curIndex, index);
                        continue
                    }

                    // Start tag:  @Jane 获取到开始标签元素，处理 开始标签的 自定义命令。
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        continue
                    }
                }

                var text = (void 0),
                    rest$1 = (void 0),
                    next = (void 0);
                 //开始标签 在中间。   
                if (textEnd >= 0) {
                    rest$1 = html.slice(textEnd);
                    //非闭合元素，非开始元素，非（注释，有条件注释）。处理空格元素里面的 < 这个 扰乱html的东东
                    while (!endTag.test(rest$1) &&
                        !startTagOpen.test(rest$1) &&
                        !comment.test(rest$1) &&
                        !conditionalComment.test(rest$1)
                    ) {
                        // < in plain text, be forgiving and treat it as text
                        next = rest$1.indexOf('<', 1);
                        if (next < 0) {
                            break
                        }
                        textEnd += next;
                        rest$1 = html.slice(textEnd);
                    }
                    //开始标签< 遇到。 文字类里面的 < 字符串。
                    text = html.substring(0, textEnd);
                    advance(textEnd);
                }
                //没有开始标签 情况。
                if (textEnd < 0) {
                    text = html; 
                    html = '';
                }
                // children.push({
                //     type: 2,
                //     expression: expression,
                //     text: text
                // });
                // todo.....  处理 元素的 孩子元素。文本节点或其它。比如变量。
                if (options.chars && text) {
                    options.chars(text);
                }
            } else {
                var stackedTag = lastTag.toLowerCase();
                var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
                var endTagLength = 0;
                var rest = html.replace(reStackedTag, function(all, text, endTag) {
                    endTagLength = endTag.length;
                    if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                        text = text
                            .replace(/<!--([\s\S]*?)-->/g, '$1')
                            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                    }
                    if (options.chars) {
                        options.chars(text);
                    }
                    return ''
                });
                index += html.length - rest.length;
                html = rest;
                parseEndTag(stackedTag, index - endTagLength, index);
            }

            if (html === last) {
                options.chars && options.chars(html);
                if ("development" !== 'production' && !stack.length && options.warn) {
                    options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
                }
                break
            }
        }

        // Clean up any remaining tags
        parseEndTag();

        function advance(n) {
            index += n;
            html = html.substring(n);
        }
        // @Jane 获取到开始标签元素，处理 开始标签的 自定义命令。得到以下的对象。
        // var match = {
        //             tagName: start[1],
        //             attrs: [],
        //             start: index
        //         };
        function parseStartTag() {
            var start = html.match(startTagOpen);
            if (start) {
                var match = {
                    tagName: start[1],
                    attrs: [],
                    start: index
                };
                advance(start[0].length);
                var end, attr;
                //直到 开始元素 标签结束。 －－》获取开始标签的 属性值。
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    match.attrs.push(attr);
                }
                if (end) {
                    match.unarySlash = end[1]; //为空则是正常标签，即需要有闭合元素标签。 否则不需要。
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }
        // var match = {
        //     tagName: start[1],
        //     attrs: [],
        //     start: index
        // };
        function handleStartTag(match) {
            var tagName = match.tagName;
            //是否有 关闭标签元素。 ‘’空为有。
            var unarySlash = match.unarySlash;

            if (expectHTML) {
                if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                    parseEndTag(lastTag);
                }
                if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
                    parseEndTag(tagName);
                }
            }
            //排除 不需要 闭合元素标签 需要为false, 不需要为true
            var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

            var l = match.attrs.length;
            var attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
                if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
                    if (args[3] === '') {
                        delete args[3];
                    }
                    if (args[4] === '') {
                        delete args[4];
                    }
                    if (args[5] === '') {
                        delete args[5];
                    }
                }
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: decodeAttr(
                        value,
                        options.shouldDecodeNewlines
                    )
                };
            }
            
            if (!unary) {
            //stack 需要闭合标签元素 集合。 lastTag ＝ 最后一个闭合元素。
                stack.push({
                    tag: tagName,
                    lowerCasedTag: tagName.toLowerCase(),
                    attrs: attrs
                });
                lastTag = tagName;
            }

            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }
        //处理结束标签
        function parseEndTag(tagName, start, end) {
            var pos, lowerCasedTagName;
            if (start == null) {
                start = index;
            }
            if (end == null) {
                end = index;
            }

            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
            }

            // Find the closest opened tag of the same type
            if (tagName) {
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                // If no tag name is provided, clean shop
                pos = 0;
            }

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (var i = stack.length - 1; i >= pos; i--) {
                    if ("development" !== 'production' &&
                        (i > pos || !tagName) &&
                        options.warn) {
                        options.warn(
                            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
                        );
                    }
                    // 处理 parse里的stack里面的 元素，去掉。
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }

                // Remove the open elements from the stack
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag;
            } else if (lowerCasedTagName === 'br') {
                if (options.start) {
                    options.start(tagName, [], true, start, end);
                }
            } else if (lowerCasedTagName === 'p') {
                if (options.start) {
                    options.start(tagName, [], false, start, end);
                }
                if (options.end) {
                    options.end(tagName, start, end);
                }
            }
        }
    }

    // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
    // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
    var isNonPhrasingTag = makeMap(
        'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
        'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
        'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
        'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
        'title,tr,track'
    );
    //不用闭合元素标签。。
    var isUnaryTag = makeMap(
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr'
    );