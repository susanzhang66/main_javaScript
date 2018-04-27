function createProxyFactory (fn) {
    var cache = [];
    return function () {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        cache[args] = fn.apply(this, arguments);
        return cache[args];
    };
}