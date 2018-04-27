/**
     * Make a map and return a function for checking if a key
     * is in that map.
     * 检查是否在str字符串里面的值。返回函数。
     */
    function makeMap(
        str,
        expectsLowerCase
    ) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase ? function(val) {
            return map[val.toLowerCase()];
        } : function(val) {
            return map[val];
        }
    }