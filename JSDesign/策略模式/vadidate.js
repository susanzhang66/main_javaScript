function validate() {

    var Validator = function (opt) {
        this.cache = [];
        this.strategies = {
            isNonEmpty: function (value, errorMsg) {
                if (value === '') {
                    return errorMsg;
                }
            },
            minLength: function (value, length, errorMsg) {
                if (value.length < length) {
                    return errorMsg;
                }
            },
            isMobile: function (value, errorMsg) {
                if (!Utils.RegexMap.MobileNo.test(value)) {
                    return errorMsg;
                }
            },
            isIdNo: function (value, errorMsg) {
                if (!Utils.RegexMap.CardNo.test(value)) {
                    return errorMsg;
                }
            }
        };
        for (var i in opt) {
            this.strategies[i] = opt[i];
        }
    };
    Validator.prototype.add = function (dom, rules) {
        var that = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function (rule) {
                var ary = rule.ruleName.split(':');
                var errorMsg = rule.errorMsg;
                that.cache.push(function () {
                    var ruleName = ary.shift();
                    ary.unshift(dom.value);
                    ary.push(errorMsg);
                    return that.strategies[ruleName].apply(dom, ary);
                });
            })(rule);
        }
    };
    Validator.prototype.start = function () {
        for (var i = 0, vlidatorFunc; vlidatorFunc = this.cache[i++];) {
            var errorMsg = vlidatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };

    return Validator;
}