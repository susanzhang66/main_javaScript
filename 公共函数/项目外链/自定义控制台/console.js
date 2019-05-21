/**
 *自定义控制台
 *@svenzeng
 *LICENSE: DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 */
(function () {

    /**
     *consoleMode: 1为使用, 0为禁用
     *displayDefault: 是否自动显示, 'show', 'hide'
     *exports: 全局
     *checkSpecialExecType: 是否用户主动输入的console.log
     */


    var consoleMode = 1,
        displayDefault = 'hide',
        width = 340,
        height = 380,
        CustomEvent,
        Ui,
        Event,
        triggerClear,
        Move,
        global = this,
        cache,
        specialExecType,
        getConsoleContainer,
        convertArgs,
        convertType,
        tree,
        set_funcs,
        isPlainObject,
        isEmptyObj,
        each,
        grep,
        _console = {},
        clear,
        recovery,
        zoom,
        histories = [],
        getSingle,
        event;


    if (consoleMode === 0) {
        _console.log = _console.error = _console.warn = _console.debug = _console.dir = function() {};
        return _console;
    }

    each = function( ary, callback ){
        for ( var i = 0, l = ary.length; i < l; i++ ){
            var c = ary[i];
            if ( callback.call( c, i , c ) === false ){
                return false;
            }
        }
    };

    grep = function( ary, callback ){
        var newAry = [];
        each( ary, function(i, n){
            newAry.push( callback.call( n, i, n ) );
        });
        return newAry;
    };

    specialExecType = function() {
        var ary = ['_console.log', '_console.error', '_console.warn', '_console.debug'];
        return function(key) {
            for (var i = 0, c; c = ary[i++];) {
                if (key.indexOf(c) >= 0) {
                    return true;
                }
            }
            return false;
        };
    }();


    cache = function(){
        var stack = {},
            set,
            _each;

        set = function( key, value ){
            if ( !stack[ key ] ){
                stack[ key ] = [];
            }
            stack[key].push( value );
        };

        _each = function( key, fn ){
            var data = stack[ key ];

            if ( !data || data.length === 0 ){
                return;
            }
            each( data, fn );
        };

        eachAll = function(fn){
            for ( var i in stack ){
                if ( i === 'log' || i === 'error' || i === 'warn' || i === 'debug' || i === 'dir' ){
                    var c = stack[i];
                    _each( i, fn );
                }
            }
        };

        return{
            set: set,
            each: _each,
            eachAll: eachAll
        };

    }();


    /*
     **  自定义事件
     */


    CustomEvent = function() {

        var obj = {}, __this = this;

        var listen = function(key, eventfn) {
            if (!obj[key]) {
                obj[key] = [];
            }
            obj[key].push(eventfn);
        };

        var trigger = function() {
            var key = Array.prototype.shift.call(arguments),
                args = arguments,
                queue = obj[key],
                ret;

            if (!queue || !queue.length) return;

            each( queue, function(){
                ret = this.apply(this, args);
                if ( ret === false ){
                    return false;
                }
            });

            return ret;
        };

        return {
            listen: listen,
            trigger: trigger
        };

    };

    /*
     *  是否字面量对象
     */

    isPlainObject = function( obj ){
        if ( !obj || typeof obj !== "object" || obj.nodeType ) {
            return false;
        }

        try {
            if ( obj.constructor &&
                !Object.prototype.hasOwnProperty.call(obj, "constructor") &&
                !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }

        var key;
        for ( key in obj ) {}

        return key === undefined || Object.prototype.hasOwnProperty.call( obj, key );

    };


    /*
     *  是否空对象
     */

    isEmptyObj = function( obj ){

        if ( !isPlainObject(obj) ){
            return false;
        }
        for ( var i in obj ){
            return false;
        }
        return true;
    };


    /**
     *获取单例
     */

    getSingle = function(fn) {
        var ret;
        return function() {
            return ret || (ret = fn.apply(this, arguments));
        };
    };


    /**
     *Ui渲染
     */

    Ui = function() {

        var event = CustomEvent(),
            logConfigMap,
            append,
            bind,
            container,
            header,
            title,
            main,
            ul,
            input,
            Ready,
            _cssText;

        _cssText = '\
                            .consoleBox{\
                                display:none;\
                                position:fixed;\
                                _position: absolute;\
                                right: 5px;\
                                bottom: 5px;\
                                z-index: 10000000;\
                                border: 2px solid #bbb;\
                                padding: 5px;\
                                width: '+width+'px;\
                                height:'+height+'px;\
                                background: #000;\
                                box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.75);\
                                filter: Alpha(opacity:95);\
                                font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                                font-size: 12px;\
                                color: #fff;\
                                border-radius: 5px;\
                            }\
                            \
                            html.webkit .consoleBox{\
                                background: rgba(0,0,0,0.75);\
                            }\
                            \
                            .consoleBoxHead{\
                                height:20px;\
                                background: rgba(255,255,255,0.15);\
                                overflow:hidden;\
                                cursor:default;\
                                padding: 2px;\
                            }\
                            \
                            .consoleBoxHead .title{\
                                margin:0;\
                                padding: 0 0 0 3px;\
                                height:20px;\
                                line-height:20px;\
                                font-family: Verdana;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton, .consoleBoxHead .consoleClearButton, .consoleBoxHead .consoleRecoveryButton, .consoleBoxHead .consoleReloadButton, .consoleBoxHead .consoleHelpButton{\
                                float:right;\
                                border:0px solid #000;\
                                width:20px;\
                                height:18px;\
                                line-height:16px;\
                                background: white;\
                                margin:1px 1px;\
                                padding:0px;\
                                color:#666;\
                                font-family: Verdana;\
                                font-weight:bold;\
                                cursor:pointer;\
                                border-radius:3px;\
                                -moz-border-radius:3px;\
                                -webkit-border-radius:3px;\
                                text-align:center;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleCloseButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleClearButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            .consoleBoxHead .consoleHelpButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            .consoleBoxHead .consoleReloadButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            .consoleBoxHead .consoleRecoveryButton:hover{\
                                background: orange;\
                                color:white;\
                                text-decoration:none;\
                            }\
                            \
                            #consoleRecoveryButton:hover{\
                                background: red;\
                            }\
                            \
                            .consoleMain{\
                                position:relative;\
                                top:2px;\
                                bottom:0px;\
                                width:100%;\
                                height:86%;\
                                overflow:auto;\
                            }\
                            html.mobileSafari .consoleMain{\
                                overflow:hidden;\
                            }\
                            \
                            ul.consoleOutput{\
                                display:block;\
                                margin:0;\
                                padding:0;\
                                width:100%;\
                                list-style:none;\
                            }\
                            \
                            ul.consoleOutput li{\
                                list-style:none;\
                                padding:3px;\
                                border-bottom:1px solid #333333;\
                                word-break: break-all;\
                                word-wrap: break-word;\
                                overflow: hidden;\
                                zoom: 1;\
                            }\
                            \
                            .consoleOutput .log_icon{\
                                width:13px;\
                                height:13px;\
                                background:#fff;\
                                overflow:hidden;\
                                float:left;\
                                margin-top:consoleCloseButton2px;\
                                font-weight:bold;\
                                text-align:center;\
                                font-size:12px;\
                                color:#8B8B8B;\
                                line-height:135%;\
                                cursor:default;\
                                border-radius:3px;\
                                -moz-border-radius:3px;\
                                -webkit-border-radius:3px;\
                            }\
                            \
                            .consoleOutput .log_text{\
                                margin: 0px 0px 0px 20px;\
                                line-height:150%;\
                                zoom: 1;\
                            }\
                            \
                            .log_error_type{}\
                            \
                            .log_error_type .log_icon{\
                                background:#FF0000;\
                                color:#660000;\
                            }\
                            \
                            .log_error_type .log_text{\
                                color:#FF0000;\
                            }\
                            \
                            .log_warning_type{}\
                            \
                            .log_warning_type .log_icon{\
                                background:#FFFF00;\
                                color:#8C7E00;\
                            }\
                            \
                            .log_warning_type .log_text{\
                                color:#FFFF00;\
                            }\
                            \
                            .log_debug_type{}\
                            \
                            .log_debug_type .log_icon{\
                                background:#33CC00;\
                                color:#006600;\
                            }\
                            \
                            .log_debug_type .log_text{\
                                color:#33cc00;\
                            }\
                            \
                            .log_info_type{}\
                            \
                            .log_info_type .log_icon{\
                                background:#0066FF;\
                                color:#000066\
                            }\
                            \
                            .log_info_type .log_text{\
                                color:#0066FF;\
                            }\
                            \
                            .log_profile_type{}\
                            \
                            .log_profile_type .log_icon{\
                            }\
                            \
                            .log_profile_type .log_text{\
                                color:white;\
                            }\
                            \
                            .WeiyunConsole .consoleInputBox{\
                                font-family: Verdana;\
                                font-size:12px;\
                                margin:5px 0 0 0;\
                                padding:2px 0 0 0 ;\
                                border-top:1px solid #aaa;\
                                width:100%;\
                                height:20px;\
                                line-height:20px;\
                                color:#CCFF00;\
                                position:relative;\
                            }\
                            \
                            .WeiyunConsole  input.consoleInput{\
                                border:0px solid #666;\
                                background:transparent;\
                                color:#CCFF00;\
                                font-family: "Courier New", Consolas, "LucidaConsole", Monaco, monospace;\
                                font-size:12px;\
                                display:block;\
                                width:100%;\
                                height:100%;\
                                line-height:100%;\
                                _padding-top: 7px;\
                                *padding-top: 7px;\
                                vtical-align:middle;\
                                outline:none;\
                                position:absolute;\
                                left:0;\
                                top:0;\
                                text-indent:10px;\
                            }\
                             ';


        createNode = function() {

            var _attr,
            _css,
            _getParam,
            _setOpacity,
            _fadeOut,
            _fadeIn,
            interval;

            _attr = function(attrs) {
                for (var i in attrs) {
                    if (i === '_class') {
                        this.className = attrs[i];
                    } else {
                        this.setAttribute(i, attrs[i]);
                    }
                }
                return this;
            };

            _css = function(styles) {
                for (var i in styles) {
                    this.style[i] = styles[i];
                }
                return this;
            };

            _getParam = function(key, value) {
                var _param = {};
                if (value) {
                    _param[key] = value;
                    return _param;
                }
                return key;
            };

            _setOpacity = function(el, number) {
                if (el.filters) {
                    el.style.filter = 'alpha(opacity=' + number + ')';
                } else {
                    el.style.opacity = number / 100;
                }
                return number;
            };


            _fadeOut = function() {
                var locked = false;

                return function(el) {
                    if (locked === true || el.style.display === 'hide') {
                        return false;
                    }
                    var _opacity = 100;
                    locked = true;
                    clearInterval(interval);
                    interval = setInterval(function() {
                        if (_setOpacity(el, _opacity -= 10) <= 0) {
                            clearInterval(interval);
                            el.style.display = 'none';
                            locked = false;
                        }
                    }, 19);
                }
            }();

            _fadeIn = function(el) {
                if (el.style.display === 'block') {
                    return false;
                }
                var _opacity = 0;
                clearInterval(interval);
                _setOpacity(el, _opacity);
                el.style.display = 'block';
                interval = setInterval(function() {
                    if (_setOpacity(el, _opacity += 7) >= 100) {
                        clearInterval(interval);
                    }
                }, 19);
            }

            return function(tagName, parent) {

                var el = document.createElement(tagName);
                (parent || document.body).appendChild(el);

                return {
                    el: el,
                    attr: function() {
                        return _attr.call(el, _getParam.apply(this, arguments));
                    },
                    css: function() {
                        return _css.apply(el, _getParam.apply(this, arguments));
                    },
                    show: function() {
                        el.style.display = 'block';
                        return el;
                    },
                    hide: function() {
                        el.style.display = 'none';
                        return el;
                    },
                    fadeOut: function() {
                        _fadeOut(el);
                    },
                    fadeIn: function() {
                        _fadeIn(el);
                    }
                };
            };

        }();


        event.listen('initConsole', getSingle(function() {
            Event.init();
            return Event.drag(title.el, container.el);
        }));


        event.listen('renderContainer', function() {
            var close,
            reload,
            prepend;

            prepend = function(parent, node) {
                if (!parent.firstChild) {
                    return parent.appendChild(node);
                }
                return parent.insertBefore(node, parent.firstChild);
            }

            var div = document.createElement("div");

            div.innerHTML = '&nbsp;<style type="text/css">' + _cssText + '</style>';
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(div);

            head.replaceChild(div.getElementsByTagName("style")[0], div);

            container = createNode('div');

            container.attr('_class', 'WeiyunConsole consoleBox');

            header = createNode('div', container.el);
            header.attr('_class', 'consoleBoxHead');


            main = createNode('div', container.el);
            main.attr('_class', 'consoleMain');

            ul = createNode('ul', main.el);
            ul.attr('_class', 'consoleOutput');



            close = createNode('a', header.el);
            close.attr({
                href: 'javascript:void(0)',
                _class: 'consoleCloseButton',
                title: '关闭'
            });
            close.el.innerHTML = 'X';

            Event.close.call(close, container);

            clear = createNode('a', header.el);
            clear.attr({
                href: 'javascript:void(0)',
                _class: 'consoleClearButton',
                title: '清除所有日志'
            });
            clear.el.innerHTML = 'C';

            triggerClear = Event.clear.call(clear, ul.el);

            recovery = createNode('a', header.el);
            recovery.attr({
                href: 'javascript:void(0)',
                _class: 'consoleRecoveryButton',
                title: '还原所有日志'
            });

            recovery.el.innerHTML = 'R';

            Event.recovery.call(recovery);


            zoom = createNode('a', header.el);
            zoom.attr({
                href: 'javascript:void(0)',
                _class: 'consoleHelpButton',
                title: '放大'
            });
            zoom.el.innerHTML = 'H';

            Event.zoom.call(zoom, container.el);


            reload = createNode('a', header.el);
            reload.attr({
                href: 'javascript:void(0)',
                _class: 'consoleReloadButton',
                title: '刷新'
            });
            reload.el.innerHTML = 'S';

            Event.reload.call(reload);


            title = createNode('h5', header.el);
            title.attr({
                _class: 'title',
                title: '控制台'
            });
            title.el.innerHTML = 'Console';
            /**
             *  控制台body部分
             */


            input_container = createNode('div', container.el);
            input_container.attr('_class', 'consoleInputBox');
            input_container.el.innerHTML = '&gt';

            input = createNode('input', input_container.el);
            input.attr({
                _class: 'consoleInput',
                title: '请输入控制台指令或者Javascript语句...'
            });


            Event.exec.call(input, main.el);

            return container;
        });


        logConfigMap = {
            "log": {
                "icon": '└',
                "className": 'log_profile_type'
            },
            "error": {
                "icon": 'x',
                "className": 'log_error_type'
            },
            "warn": {
                "icon": '!',
                "className": 'log_warning_type'
            },
            "debug": {
                "icon": '√',
                "className": 'log_debug_type'
            },
            "dir": {
                "icon": 'dir',
                "className": 'log_profile_type'
            }
        };

        /**
         *添加log
         */

        tree = function(){
            return function( obj ){
                var str = '';
                for ( var i in obj ){
                    var c = obj[i];
                    str += i + ': ' + c;
                }
                return str;
            }
        }();

        convertType = function( info ){
           return grep( info, function(i, n){
                if ( Object.prototype.toString.call(n)  === '[object String]' ){
                    return '"' + n + '"';
                }
                if ( isEmptyObj( n ) ){
                    return '{}';
                }

                if ( n === void 0 ){
                     return 'undefined';
                }
                if ( n === null ){
                    return 'null';
                }
                if ( Object.prototype.toString.call( n ) === '[object Array]' ){
                    return '[' + convertType(n) + ']';
                }
                if ( isPlainObject( n ) ){
                    return tree(n);
                }
                return n;
            });

        }

        event.listen('addField', function(logType, info, _namespace) {

            var li,
            log_icon,
            log_text,
            logConfig = logConfigMap[logType];

            ul.show();

            info = convertType( info ).join(', ');

            li = createNode('li', ul.el);
            li.attr('_class', logConfig.className);

            log_icon = createNode('div', li.el);
            log_icon.attr('_class', 'log_icon');
            log_icon.el.innerHTML = logConfig.icon;

            log_text = createNode('div', li.el);
            log_text.attr('_class', 'log_text');
            log_text.el.innerHTML = (_namespace ? '<span style="color:orange">' + _namespace + '     </span> ' : '') + info;

        });

        /**
         *执行控制台输入
         */
        event.listen('execScript', function(val, ret) {
            var li = createNode('li', ul.el);
            li.el.innerHTML = '<span style="color:#ccff00">' + val + '</span><br>' + ret;
        });

        return {
            event: event
        }

    }();


    /*
     ** 绑定Ui相关事件
     */


    Event = (function() {

        var bind,
        off,
        init,
        close,
        clear,
        zoom,
        reload,
        recovery,
        exec,
        canRecovery = false;


        bind = function() {
            var _bind = document.addEventListener ? function(type, fn) {
                    this.addEventListener(type, fn, false);
                    return fn;
                } : function(type, fn) {
                    var _self = this;
                    this.attachEvent('on' + type, function(){
                        return fn.apply(_self, arguments);
                    });
                    return fn;
                };
            return function(el, type, fn) {
                var _fn = function(e) {
                    var _event = e || window.event,
                        event = {};

                    event.stopPropagation = function() {
                        return _event.stopPropagation ? _event.stopPropagation() : _event.cancelBubble = true;
                    };

                    event.preventDefault = function() {
                        return _event.preventDefault ? _event.preventDefault() : event.returnValue = false;
                    };

                    event.clientX = _event.clientX;
                    event.clientY = _event.clientY;
                    event.metaKey = _event.metaKey;
                    event.ctrlKey = _event.ctrlKey;
                    event.shiftKey = _event.shiftKey;
                    event.which = _event.which || _event.keyCode;

                    if (fn.call(this, event) === false) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
                return _bind.call(el, type, _fn);
            };
        }();

        off = function() {
            var _off = document.removeEventListener ? function(type, fn) {
                    return this.removeEventListener(type, fn, false);
                } : function(type, fn) {
                    return this.detachEvent('on' + type, fn);
                }
            return function(el, type, fn) {
                return _off.call(el, type, fn);
            }
        }();


        init = function() {
            container = Ui.event.trigger('renderContainer');
            container[displayDefault]();

            return container;
        };


        clear = function(el) {
            var fn = function() {
                canRecovery = true; //可以还原
                el.innerHTML = '';
                return false;
            };
            bind(this.el, 'click', fn );
            return fn;
        };


        recovery = function() {
            bind(this.el, 'click', function() {
                if (canRecovery === false) return;
                triggerClear();
                cache.eachAll(function(){
                    Ui.event.trigger('addField', this[0], this[1], this[2]);
                })
                canRecovery = false;
                return false;
            });
        };


        zoom = function() {

            var origLeft,
                origTop,
                mode = 0; //0为正常, 1为放大之后

            return function(el) {
                var _self = this;
                bind(_self.el, 'click', function() {
                    if (mode === 0) {
                        origLeft = el.offsetLeft,
                        origTop = el.offsetTop;
                        el.style.width = document.body.clientWidth - 40 + 'px';
                        el.style.height = document.body.clientHeight - 40 + 'px';
                        el.style.left = '10px';
                        el.style.top = '10px';
                        _self.el.innerHTML = 'M';
                        _self.el.title = '缩小'
                        mode = 1;
                    } else {
                        el.style.width = width + 'px';
                        el.style.height = height + 'px';
                        _self.el.innerHTML = 'H';
                        el.style.left = origLeft + 'px';
                        el.style.top = origTop + 'px';
                        _self.el.title = '放大'
                        mode = 0;
                    }
                    return false;
                });
            };

        }();


        reload = function() {
            bind(this.el, 'click', function() {
                return window.location.reload(true);
            });
        };


        exec = function(el) {
            var custom_histroy = [],
                histroy_index,
                history_value,
                go_history,
                trim,
                interCommand;

            trim = function( str ){
                return ( str || '' ).replace(/(^\s*)|(\s*$)/g, '');
            }

            interCommand = function(){
                var g = {
                    'filter log': 'log',
                    'filter warn': 'warn',
                    'filter error': 'error',
                    'filter debug': 'debug',
                    'filter dir': 'dir',
                    'filter all': 'all',
                };

                return function( command ){
                    var _command = trim( command ),
                        callback = function(){
                            Ui.event.trigger('addField', this[0], this[1], this[2]);
                        };

                    if ( _command.indexOf( 'filter namespace' ) >= 0 ){
                        triggerClear();
                        _namespace = _command.substr( 17, _command.length );
                        _namespace = trim( _namespace );
                        cache.each( 'namespace_' + _namespace, callback );
                        return true;
                    }

                    _command = g[ command ];

                    if ( _command ){
                        return (function(){

                            triggerClear && triggerClear();

                            if ( command === 'filter all' ){
                                cache.eachAll( callback );
                            }else{
                                cache.each( _command, callback ); 
                            }
                            return canRecovery = true;
                        })();
                    }
                    return false;
                }
            }();

            go_history = function(key) {
                var index,
                _temp_index;

                if (key !== 38 && key !== 40) {
                    return;
                }

                if (histroy_index === void 0) {
                    index = custom_histroy.length || 0;
                } else {
                    index = histroy_index;
                }

                _temp_index = index + key - 39;

                if (_temp_index < 0 || _temp_index >= custom_histroy.length) {
                    return;
                }

                this.value = custom_histroy[_temp_index];

                histroy_index = _temp_index;
            }

            bind(this.el, 'keydown', function(event) {
                var special,
                type,
                ret,
                value,
                k = event.which;

                go_history.call(this, k);

                if (k !== 13) {
                    return event.stopPropagation();
                }    

                custom_histroy.push(this.value);

                value = this.value.replace(/;/g, ' ');

                if ( interCommand( value ) === true ){
                    return event.stopPropagation();
                }

                try {
                    ret = eval('(' + value + ')');
                } catch (e) {
                    ret = void 0;
                }

                special = specialExecType(value); //如果是用户自己输入的console.log, 已经被eval执行过，不用再添加log

                setTimeout(function() {
                    el.scrollTop = 100000;
                }, 0);

                if (special) {
                    return false;
                }

                Ui.event.trigger('execScript', this.value, ret);

                histroy_index = void 0;

                this.value = '';

                event.stopPropagation();
            });
        };


        drag = function(el, container) {
            return Drag.init(el, container);
        };


        close = function(container) {
            bind(this.el, 'click', function() {
                container.fadeOut();
                return false;
            });
        }


        return {
            bind: bind,
            off: off,
            init: init,
            clear: clear,
            zoom: zoom,
            exec: exec,
            reload: reload,
            recovery: recovery,
            drag: drag,
            close: close
        }


    })();



    Drag = (function() {

        var init,
        move,
        _left,
        _top,
        start,
        bindMoveEvent,
        stop,
        throttle;

        MoveEvent = (function() {
            var _el,
            _drag_el,
            _move_event,
            _select_event,
            move;

            move = function(e) {

                var left = e.clientX - _left,
                    top = e.clientY - _top;

                left = Math.max(0, left);
                top = Math.max(0, top);

                left = Math.min(document.body.clientWidth - _drag_el.offsetWidth, left);
                top = Math.min(document.body.clientHeight - _drag_el.offsetHeight, top);

                _drag_el.style.left = left + 'px';
                _drag_el.style.top = top + 'px';

                e.stopPropagation();
                e.preventDefault();

            };

            var on = function(e, drag_el, el) {
                off(el);
                _drag_el = drag_el;
                _left = e.clientX - drag_el.offsetLeft, //差值
                _top = e.clientY - drag_el.offsetTop; //差值
                _move_event = Event.bind(document, 'mousemove', move);
                _select_event = Event.bind(document, 'selectstart', function() {
                    return false;
                });
            }

            var off = function(el) {
                if (_move_event) {
                    Event.off(document, 'mousemove', _move_event);
                }
                if (_select_event) {
                    Event.off(document, 'selectstart', _select_event);
                }
            }

            return {
                on: on,
                off: off
            }

        })();


        init = function(el, drag_el) {

            Event.bind(el, 'mousedown', function(e) {
                MoveEvent.on(e, drag_el, el);
                e.stopPropagation();
            });

            Event.bind(el, 'mouseup', function(e) {
                MoveEvent.off(el);
                e.stopPropagation();
            });

            Event.bind(el, 'selectstart', function(e) {
                return false;
            });

            return true;
        }

        return {
            init: init
        }


    })();



    Ready = function() {

        var isReady = false,
            readyList = [],
            t,
            run,
            startInterval,

            startInterval = function() {
                if (t) {
                    return;
                }
                t = setInterval(function() {
                    if (document.body) {
                        clearTimeout(t);
                        t = null;
                        while (readyList.length > 0){
                            readyList.shift()();
                        }
                        isReady = true;
                    }
                }, 13);
            };

        add = function(fn) {
            if (isReady) {
                return fn();
            }
            return readyList.push(fn);
        };

        run = function(){
            if ( isReady ){
                return;
            }
            if ( !document.body ){  //如果body还没加载好.
                return startInterval();
            }
            while (readyList.length > 0){
                readyList.shift()();
            }
            isReady = true;
        }

        return {
            add: add,
            run: run
        }

    }();


    set_funcs = function(_console, _namespace) {
        var __namespace;
        if ( _namespace ){
            __namespace = '【' + _namespace + '】';
            _console = {};
        }
        each( 'log,error,warn,debug,dir'.split(','), function(i, n){
            _console[n] = function() {
                var args = Array.prototype.slice.call(arguments);
                Ready.add(function() {
                    Ui.event.trigger('initConsole');
                    cache.set(n, [n, args, __namespace]);
                    if ( _namespace ){
                        cache.set( 'namespace_' + _namespace, [n, args, __namespace] );
                    }
                    return Ui.event.trigger('addField', n, args, __namespace);
                });
            }
        });
        return _console;

    }

    set_funcs(_console);

    _console.namespace = function(_namespace) {
        try{
            return set_funcs( _console, _namespace );
        }catch(e){
            return _console;
        }
    }





    Event.bind(document, 'keydown', function(e) {

        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.which === 192) {
            Event.init();
            Ready.run();
            container && container.fadeIn();
        }
        e.stopPropagation();
    });


    _console.show = function(){
        Event.init();
        Ready.run();
        container.show();
    };

    return global._console = _console;

}).call(this);

