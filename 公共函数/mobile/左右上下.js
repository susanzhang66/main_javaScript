iuni.mobile.goods.parts_detail.swipe=(function(dom,param){

    _fun = {
        clone: function(object) {
            function f() {}
            f.prototype = object;
            return new f;

        }

    };

    var commonSwipejs = {

        _initCommon: function(core, param) {
            // 作用：初始化
            var that = this;
            this.core = core;
            this.startX = 0;
            this.startY = 0;
            this.startFlag = false;
            this.direction = param.direction || 'swipeUp';
            this.moveFun = param.moveFun;
            this.touchEndFun = param.touchEndFun;

            that._bind("touchstart");
            that._bind("touchmove");
            that._bind("touchend");

        },
        unbindFun :function(){
            this._unBind("touchstart");
            this._unBind("touchmove");
            this._unBind("touchend");
        },
        handleEvent: function(e) {
            // 作用：简化addEventListener的事件绑定
            switch (e.type) {
                case "touchstart":
                this._start(e);
                break;
                case "touchmove":
                this._move(e);
                break;
                case "touchend":
                case "touchcancel":
                this._end(e);
                break;
            }

        },
        _bind: function(type, boole) {
            // 作用：事件绑定
            this.core.addEventListener(type, this, !!boole);

        },
        _unBind: function(type, boole) {
            // 作用：事件移除
            this.core.removeEventListener(type, this, !!boole);

        }

    };
    var swipe = _fun.clone(commonSwipejs);
    swipe._start = function(e){
        e.preventDefault();
        e = e.touches[0];
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.startFlag = true;

    };
    swipe._move = function(e){
        e.preventDefault();
        var flag = this._moveShare(e);
        if(this.direction == 'swipeUp' || this.direction == 'swipeDown' && flag ){  //竖向
            this.moveFun && this.moveFun();
        }
        if(this.direction == 'swipeLeft' || this.direction == 'swipeRight' && this.startFlag && !flag){
            this.moveFun && this.moveFun();
        }
    };
    swipe._end = function(e){
        e.preventDefault();
        this.startFlag = false;
        this.touchEndFun();

    };
    swipe.init = function(dom,param){

        this._initCommon(dom,param);


    };
    swipe._moveShare = function(e){
        e.preventDefault();
        this._dis_x = e.pageX - this.startX;
        this._dis_y = e.pageY - this.startY;
        return this.startFlag && !!(Math.abs(this._dis_x) < Math.abs(this._dis_y));
    };

    return swipe;

})()