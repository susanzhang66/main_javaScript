//dep相当于是，虚拟节点遇到的数据，每个数据一个dep。应该是一个watcher对应多个dep。                                                                                            管理器。。

    var uid = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     * 统一的行为(update() )，不同的实现，update
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
            // 这个是触发watcher的update();
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


//这个函数是 代理函数，当虚拟节点中 有取了data里面的值时，触发，data的defineProperty
    function proxy (target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter () {
            return this[sourceKey][key]
        };
        sharedPropertyDefinition.set = function proxySetter (val) {
            this[sourceKey][key] = val;
        };
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }