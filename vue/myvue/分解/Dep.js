//Watcher 的集合、                                                                                               管理器。。

    var uid = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */
    var Dep = function Dep() {
        this.id = uid++;
        this.subs = []; //watcher集合
    };
    // 加入 watcher,
    Dep.prototype.addSub = function addSub(sub) {
        this.subs.push(sub);
    };

    Dep.prototype.removeSub = function removeSub(sub) {
        remove(this.subs, sub);
    };

    Dep.prototype.depend = function depend() {
        if (Dep.target) {
            //@Jane Watcher.addDep..
            Dep.target.addDep(this);
        }
    };

    Dep.prototype.notify = function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    };

    /**
     * Remove an item from an array
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }
    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.
    //提供的一个  在Watcher.prototype.get 这里会调用一次。
    Dep.target = null;
    var targetStack = [];
    //_target 这个是 watcher对象。
    function pushTarget(_target) {
        if (Dep.target) {
            targetStack.push(Dep.target);
        }
        Dep.target = _target;
    }

    function popTarget() {
        Dep.target = targetStack.pop();
    }