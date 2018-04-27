    var _Set;
    /* istanbul ignore if */
    if (typeof Set !== 'undefined' && isNative(Set)) {
        // use native Set when available.
        _Set = Set;
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        _Set = (function() {
            function Set() {
                this.set = Object.create(null);
            }
            Set.prototype.has = function has(key) {
                return this.set[key] === true
            };
            Set.prototype.add = function add(key) {
                this.set[key] = true;
            };
            Set.prototype.clear = function clear() {
                this.set = Object.create(null);
            };

            return Set;
        }());
    }

        /* istanbul ignore next */
    //这里判断 函数是否是系统函数, 比如 Function Object ExpReg window document 等等, 这些函数应该使用c/c++实现的
//这样可以区分 Symbol是系统函数, 还是用户自定义了一个Symbol, 下面这个函数可以看出来
    function isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }