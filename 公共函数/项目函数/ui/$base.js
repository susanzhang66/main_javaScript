
var $base = (function(){

    function $throttle( fn, _interval ) {       

        var __self = fn,
            timer,
            firstTime = true,
            interval = _interval || 500;

        return function () {

            var args = arguments,
                __me = this;

            if (firstTime) {
                __self.apply(__me, args);
                return firstTime = false;
            }

            if (timer) {
                return false;
            }

            timer = setTimeout(function () {

                clearTimeout(timer);
                timer = null;

                __self.apply(__me, args);

            }, interval);

        };

    }
    function $after(fn, after) {
        return function () {
            var ret = fn.apply(this, arguments);
            if (ret === false) {
                return false;
            }
            after.apply(this, arguments);
            return ret;
        };
    };

    function $getSingle( fn ) {
        var ret;
        return function () {
            return ret || ( ret = fn.apply(this, arguments) );
        };
    };

    $Class = function() {

        var create = function(fn, methods, parent) {   

          fn = fn || function() {};

          var _initialize, _instances = [],
            instance, _unique = 0,
            ret, temp_class = function() {};

          _initialize = function(args) {
            fn.apply(this, args);
          };

          if (parent) {
            temp_class.prototype = parent.prototype;
            _initialize.prototype = new temp_class();
            _initialize.prototype.constructor = _initialize;
            _initialize.prototype.superClass = temp_class.prototype;
          }

          for (var i in methods) {
            _initialize.prototype[i] = methods[i];
          }

          _initialize.prototype.implement = function() {
            var fns = arguments[0].split('.'),
              args = Array.prototype.slice.call(arguments, 1),
              fn = this;
            for (var i = 0, c; c = fns[i++];){
              fn = fn[c];
              if (!fn) {
                throw new Error('接口未实现');
              }
            }
            return fn.apply(this, args);
          };

          var getInstance = function() {   //获取类的一个实例对象
            var args = Array.prototype.slice.call(arguments, 0),
              __instance = new _initialize(args);

            __instance.constructor = ret;

            _instances[_unique++] = __instance;

            return _instances[_unique - 1];
          };

          var empty = function() { 

            for (var i = 0, c; c = _instances[i++];) {
              c = null;
            }
            _instances = [];
            _instances.length = 0;
            _unique = 0;
          };

          var getCount = function() { 
            return _unique;
          };

          var getPrototype = function() {  
            return _initialize.prototype;
          };

          var sub = function(fn, methods) {  
            var a = $Class.create(fn, methods, _initialize);
            return a;
          };

          var interface = function(key, fn, a) { 

            if (!_initialize) {
              return;
            }

            var keys = key.split('.'),
              __proto = _initialize.prototype,
              last_key = keys.pop(),
              __namespace;

            if (keys.length) {
              __namespace = keys[0];

              if (!_initialize.prototype.hasOwnProperty(__namespace)) {
                _initialize.prototype[__namespace] = {};
              }

              _initialize.prototype[__namespace][last_key] = fn;

            } else {
              _initialize.prototype[last_key] = fn;
            }

          };

          ret = {
            interface: interface,  
            getInstance: getInstance, 
            getInstances: function() {  
              return _instances;
            },
            empty: empty,   
            getCount: getCount,  
            getPrototype: getPrototype,  
            sub: sub,  
            initialize: _initialize 
          };

          return ret;

        };

        return {
          create: create    
        };
    }();

	var get_black_layer = $getSingle( function(){
		return $( '<div style="display:none;width:100%;height: 100%;background:#000;position:fixed;_position:absolute;z-index:9998;top:0px;left:0px;opacity:0.5;filter:alpha(opacity=50)"></div>' ).appendTo( $( 'body' ) );
	}),

	_id = 0,

	is_empty_obj = function( obj ){
		for ( var i in obj ){
			return false;
		}
		return true;
	},

	use_black_layer_count = {};

    var base = $Class.create( function( tpl ){       
        this.tpl = tpl;            
        this.parent = null;       
        this.submitBtn = null;     
        this.closeBtn = null;     
        this.cancelBtn = null;    
        this.black_layer = false;  
        this.remove = false;    
        this.no_close_btn = false;	
        this.o_scroll_top = 0;
        this.revise_top = 0;             
    });

    base.interface( 'checkKeyCancel', function(){    

        var stack = [],
            old_win_scroll = window.onscroll,         
            old_key_down = document.onkeydown;

        return function( obj, mode ){
            
            if ( mode === 'add' ){
                stack.push( obj );
            }else{

                for ( var l = stack.length - 1; l >= 0; l-- ){
                    if ( stack[ l ] === obj ){
                        stack.splice( l, 1 );
                    }
                }
            }

            if ( stack.length ){
                document.onkeydown = $after( old_key_down || function(){}, function( ev ){       
                    var ev = ev || window.event;
                    if ( ev.keyCode === 27 ){
                        $.each( stack, function( i, n ){
                        	try{
                        		n.no_close_btn || n.hide();
                        	}catch(e){

                        	}
                            
                        });
                    }
                });

                $( window ).off().on( 'resize', $throttle( function(){       
                    $.each( stack, function( i, n ){
                        n.position();
                    });
                }, 100 ) );


                window.onscroll = $after( old_win_scroll || function(){}, function(){            
                    $.each( stack, function( i, n ){
                        if ( n.black_layer ){                             
                            $( window ).scrollTop( n.o_scroll_top );
                        }
                    });
                });

                return;
            }

            document.onkeydown = old_key_down;
            window.onscroll = old_win_scroll;
            $( window ).off( 'resize' );

        }

    }() );

    base.interface( 'init', function(){      

        var me = this;     

        this.parent = this.render().appendTo( $( 'body' ) ).hide();  //创建父节点容器

        this.closeBtn = this.parent.find( '[data-action="closeBtn"]' );
        this.cancelBtn = this.parent.find( '[data-action=cancelBtn]' );
        this.submitBtn = this.parent.find( '[data-action="submitBtn"]' );
        this.title = this.parent.find( '[data-action="title"]' );   //标题容器
        this.content = this.parent.find( '[data-action="content"]' );  //内容容器

        this.closeBtn.on( 'click', function(){
            me.hide();
        });

        this.cancelBtn.on( 'click', function(){
            me.hide();
        });

        this.id = ++_id;

    });

    base.interface( 'render', function(){    

        var parent;

        this.target = $( this.tpl ).css({
            position: 'absolute',
            zIndex: 9999
        });;


        return this.target.wrap( '<div></div>' ).parent().prepend( '<div></div>' );

    });

    base.interface( 'position', function( type ){

        var winWidth = $(window).width(),
            winHeight = $(window).height(),
            width = this.target.width(),
            height = this.target.height(),
            winScrollLeft = $(window).scrollLeft(), 
            winScrollTop = $(window).scrollTop(), 
            top = this.target.css( 'top' ),
            marginLeft = parseInt( this.target.css( 'margineft' ) ),
            paddingLeft = parseInt( this.target.css( 'paddingLeft' ) ),
            marginTop = parseInt( this.target.css( 'marginTop' ) ),
            paddingTop = parseInt( this.target.css( 'paddingTop' ) ),
            o_offset,
            o_left,
            o_top,
            n_left,
            n_top,
            black_layer,
            time;

            marginLeft = isNaN( marginLeft ) ? 0 : marginLeft;
            paddingLeft = isNaN( paddingLeft ) ? 0 : paddingLeft;
            marginTop = isNaN( marginTop ) ? 0 : marginTop;
            paddingTop = isNaN( paddingTop ) ? 0 : paddingTop;

        if ( !$.support.fixedPosition && this.black_layer ){    
        	black_layer = get_black_layer();
           	black_layer.css( 'width', winWidth + winScrollLeft );     
           	black_layer.css( 'height', winHeight + winScrollTop );
        }
        
        width = width + paddingLeft * 2 + marginLeft * 2;
        height = height + paddingTop * 2 + marginTop * 2;

        o_offset = this.target.offset();
        o_left = o_offset.left;
        n_top = o_offset.top;

        n_left = winWidth / 2 - width / 2 + winScrollLeft;
        n_top = winHeight / 2 - height / 2 +  winScrollTop - 10 + ( this.revise_top || 0 );


        time = Math.abs( n_left - o_left ) / 3 * 2;
        var me = this;

        this.o_scroll_top = $( window ).scrollTop();

        if ( type === 'show' || type === 'position' ){   
            this.target.css( 'left', n_left );
            this.target.css( 'top', n_top );

            if ( type === 'show' ){
            	setTimeout(function(){
                	me.position( 'position' );
            	}, 0);
            }
           
            return false;
        }

        this.target.stop().animate( { left:n_left, top:n_top }, time, 'swing' );

    });

    base.interface( 'show', function(){

        var me = this;

        me.position( 'show' );

        if ( this.black_layer ){
        	get_black_layer().fadeIn( 200 );
        	use_black_layer_count[ this.id ] = true;
        }else{
        	get_black_layer().hide();
        }

        this.parent.fadeIn( 200 );

        this.checkKeyCancel( this, 'add' );
        this.submitBtn.focus();
    });


    base.interface( 'hide', function(){

    	if ( this.black_layer ){
    		delete use_black_layer_count[ this.id ];

    		if ( is_empty_obj( use_black_layer_count ) ){
    			get_black_layer().fadeOut( 300 );
    		}

    	}

        this.parent.fadeOut( 250 );

        this.checkKeyCancel( this, 'del' );
        if ( this.remove ){
            this.parent.off().remove();
        }
    });

    return base;

})();

