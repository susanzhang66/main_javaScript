(function($) {

    function Reflection(img, reflHeight, opacity) {             
        
        var reflection, cntx, imageWidth = img.width, imageHeight = img.width, gradient, parent;
    
        parent = $(img.parentNode);
        this.element = reflection = parent.append("<canvas class='reflection' style='position:absolute'/>").find(':last')[0];
        if ( !reflection.getContext &&  $.browser.msie) {
            this.element = reflection = parent.append("<img class='reflection' style='position:absolute'/>").find(':last')[0];                  
            reflection.src = img.src;           
            reflection.style.filter = "flipv progid:DXImageTransform.Microsoft.Alpha(opacity=" + (opacity * 100) + ", style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=" + (reflHeight / imageHeight * 100) + ")";  
            
        } else {                            
            cntx = reflection.getContext("2d");
            try {
                
                
                $(reflection).attr({width: imageWidth, height: reflHeight});
                cntx.save();
                cntx.translate(0, imageHeight-1);
                cntx.scale(1, -1);              
                cntx.drawImage(img, 0, 0, imageWidth, imageHeight);             
                cntx.restore();
                cntx.globalCompositeOperation = "destination-out";
                gradient = cntx.createLinearGradient(0, 0, 0, reflHeight);
                gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - opacity) + ")");
                gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
                cntx.fillStyle = gradient;
                cntx.fillRect(0, 0, imageWidth, reflHeight);                
            } catch(e) {            
                return;
            }       
        }
        // Store a copy of the alt and title attrs into the reflection
        $(reflection).attr({ 'alt': $(img).attr('alt'), title: $(img).attr('title')} ); 
                
    }  
    var Item = function(imgIn, options)

    {                             
        this.orgWidth = imgIn.width;            
        this.orgHeight = imgIn.height;      
        this.image = imgIn;
        this.reflection = null;                 
        this.alt = imgIn.alt;
        this.title = imgIn.title;
        this.imageOK = false;       
        this.options = options;             
                        
        this.imageOK = true;    
   
        
        if (this.options.reflHeight > 0)
        {                                                   
            this.reflection = new Reflection(this.image, this.options.reflHeight, this.options.reflOpacity);                    
        }
        $(this.image).css('position','absolute');   
    };
    
    
    
    var Controller = function(container, images, options)
    {                      
        var items = [], funcSin = Math.sin, funcCos = Math.cos, ctx=this; 
        var bigimgs = $("#bigimgs").children(),phoneid = $("#phoneid").children(),bname = $("#bname"),btext = $("#btext");
        // var maptext = [['MJ','经典无法替代'],['BIGBANG','为舞台而生'],['陈奕迅','K歌之王'],['邓紫棋',' 铁肺唱将'],['林俊杰','歌声里藏着酒窝']];
        var maptext = [['MJ','经典无法替代'],['陈奕迅','K歌之王'],['BIGBANG','为舞台而生'],['林俊杰','歌声里藏着酒窝'],['邓紫棋',' 铁肺唱将'],['周杰伦','无与伦比'],['TAYLOR SWIFT','乡村音乐女神'],['TFBOYS','青春的气息'],['中国好声音','放胆追逐音乐梦想'],['WINNER',' 颜值实力并存']
        ];
        this.controlTimer = 0;
        this.stopped = false;
        //this.imagesLoaded = 0;
        this.container = container;
        this.xRadius = options.xRadius;
        this.yRadius = options.yRadius;
        this.showFrontTextTimer = 0;
        this.autoRotateTimer = 0;
        if (options.xRadius === 0)
        {
            this.xRadius = ($(container).width()/2.3);
        }
        if (options.yRadius === 0)
        {
            this.yRadius = ($(container).height()/6);
        }

        this.xCentre = options.xPos;
        this.yCentre = options.yPos;
        this.frontIndex = 0;    // Index of the item at the front
        this.currentIndex = 0;
        
      
        this.rotation = this.destRotation = Math.PI/2;
        this.timeDelay = 1000/options.FPS;
                                
        
        if(options.altBox !== null)
        {
            $(options.altBox).css('display','block');   
            $(options.titleBox).css('display','block'); 
        }
        // Turn on relative position for container to allow absolutely positioned elements
        // within it to work.
        $(container).css({ position:'relative', overflow:'hidden'} );
    
        $(options.buttonLeft).css('display','inline');
        $(options.buttonRight).css('display','inline');
        
        // Setup the buttons.
        $(options.buttonLeft).bind('mouseup',this,function(event){
            event.data.rotate(-1);  
            return false;
        });
        $(options.buttonRight).bind('mouseup',this,function(event){                                                         
            event.data.rotate(1);   
            return false;
        });
        
      
        if (options.mouseWheel)
        {
            $(container).bind('mousewheel',this,function(event, delta) {                     
                     event.data.rotate(delta);
                     return false;
                 });
        }
        $(container).bind('mouseover click',this,function(event){
            
            clearInterval(event.data.autoRotateTimer);     
            var text = $(event.target).attr('alt');     
            var etarge = event.target,etargetname = etarge.nodeName.toLowerCase(),$target = $(event.target);
            
            if( etargetname == 'img'){
                if ( event.type == 'click' )                
                {
                
                    var idx = $(event.target).data('itemIndex');    
                    var frontIndex = event.data.frontIndex;
                       
                    var diff = (idx - frontIndex) % images.length;
                    if (Math.abs(diff) > images.length / 2) {
                        diff += (diff > 0 ? -images.length : images.length);
                    }
                    
                    event.data.rotate(-diff);
                }
            }
        });
        

        $(container).bind('mouseout',this,function(event){
                var context = event.data;               
                clearTimeout(context.showFrontTextTimer);               
                context.showFrontTextTimer = setTimeout( function(){context.showFrontText();},200);
                context.autoRotate();  
        });

    
        $(container).bind('mousedown',this,function(event){ 
            
            event.data.container.focus();
            return false;
        });
        container.onselectstart = function () { return false; };        // For IE.

        this.innerWrapper = $(container).wrapInner('<div style="position:absolute;width:100%;height:100%;"/>').children()[0];
    
   
        this.showFrontText = function()
        {   
            
            var index = Math.abs(this.currentIndex);
            // console.log(items);
            // var selfimg = items[ index ].image,$selfimg = $(selfimg);

            for(var i=0,len=images.length;i<len;i++){
                var chile = $(images[i]);
                if( i == index ){
                    chile.addClass('slider__pic--current')
                }else{
                    chile.removeClass('slider__pic--current')
                }
            }
                    
            // var srcimg = $selfimg.attr('phoneimg');
            bigimgs.eq(index).show().siblings().hide();
            phoneid.eq(index).show().css('display','inline').siblings().hide();
            bname.text( maptext[index][0] );
            btext.text( maptext[index][1] );

        };
                        
        this.go = function()
        {               
            if(this.controlTimer !== 0) { return; }
            var context = this;
            this.controlTimer = setTimeout( function(){context.updateAll();},this.timeDelay);                   
        };
        
        this.stop = function()
        {
            clearTimeout(this.controlTimer);
            this.controlTimer = 0;              
        };
        

        this.rotate = function(direction)
        {   
            this.frontIndex -= direction;
            this.frontIndex %= items.length;    
            
            this.destRotation += ( Math.PI / items.length ) * ( 2*direction );
            
            this.currentIndex -= direction;
            if (this.currentIndex < 0) {
                this.currentIndex = items.length-1;
            } else if (this.currentIndex >= items.length) {
                this.currentIndex = 0;
            }
            
            this.showFrontText();
            this.go();          
        };
        
        
        this.autoRotate = function()
        {           
            if ( options.autoRotate !== 'no' )
            {
                var dir = (options.autoRotate === 'right')? 1 : -1;
                this.autoRotateTimer = setInterval( function(){ctx.rotate(dir); }, options.autoRotateDelay );
            }
        };
        
        this.updateAll = function()
        {                                       
            
            var minScale = options.minScale;    
            var smallRange = (1-minScale) * 0.5;
            var w,h,x,y,scale,item,sinVal;
            
            var change = (this.destRotation - this.rotation);               
            var absChange = Math.abs(change);
    
            this.rotation += change * options.speed;
            if ( absChange < 0.001 ) { this.rotation = this.destRotation; }         
            var itemsLen = items.length;
            var spacing = (Math.PI / itemsLen) * 2; 
            //var   wrapStyle = null;
            var radians = this.rotation;
            var isMSIE = $.browser.msie;

            this.innerWrapper.style.display = 'none';       
            
            var style;
            var px = 'px', reflHeight;  
            var context = this;
            for (var i = 0; i<itemsLen ;i++)
            {
                item = items[i];
                                
                sinVal = funcSin(radians);
                
                scale = ((sinVal+1) * smallRange) + minScale;
                
                x = this.xCentre + (( (funcCos(radians) * this.xRadius) - (item.orgWidth*0.5)) * scale);
                y = this.yCentre + (( (sinVal * this.yRadius)  ) * scale);      
        
                if (item.imageOK)
                {
                    var img = item.image;
                    w = img.width = item.orgWidth * scale;                  
                    h = img.height = item.orgHeight * scale;
                    img.style.left = x + px ;
                    img.style.top = y + px;
                    img.style.zIndex = "" + (scale * 100)>>0;  
                    if (item.reflection !== null)
                    {                                                                                                       
                        reflHeight = options.reflHeight * scale;                        
                        style = item.reflection.element.style;
                        style.left = x + px;
                        style.top = y + h + options.reflGap * scale + px;
                        style.width = w + px;                               
                        if (isMSIE)
                        {                                           
                            style.filter.finishy = (reflHeight / h * 100);              
                        }else
                        {                               
                            style.height = reflHeight + px;                                                         
                        }                                                                                                                   
                    }                   
                }
                radians += spacing;
            }
                  
            this.innerWrapper.style.display = 'block';
            if ( absChange >= 0.001 )
            {               
                this.controlTimer = setTimeout( function(){context.updateAll();},this.timeDelay);       
            }else
            {
   
                this.stop();
            }
        }; 

        this.checkImagesLoaded = function()
        {
            var i;
            for(i=0;i<images.length;i++) {
                if ( (images[i].width === undefined) || ( (images[i].complete !== undefined) && (!images[i].complete)  ))
                {
                    return;                 
                }               
            }
            for(i=0;i<images.length;i++) { 
             
                 items.push( new Item( images[i], options ) );  
                 $(images[i]).data('itemIndex',i);
            }
            clearInterval(this.tt);
            this.showFrontText();
            this.autoRotate();  
            this.updateAll();
            
        };

        this.tt = setInterval( function(){ctx.checkImagesLoaded();},50);    
    }; // END Controller object

    $.fn.CloudCarousel = function(options) {
            
        this.each( function() {         
            
            options = $.extend({}, {
               reflHeight:0,
               reflOpacity:0.5,
               reflGap:0,
               minScale:0.5,
               xPos:0,
               yPos:0,
               xRadius:0,
               yRadius:0,
               altBox:null,
               titleBox:null,
               FPS: 30,
               autoRotate: 'no',
               autoRotateDelay: 1500,
               speed:0.2,
               mouseWheel: false,
               bringToFront: false
            },options );                                    

            $(this).data('cloudcarousel', new Controller( this, $('.slider__pic',$(this)), options) );
        });             
        return this;
    };

})(jQuery);

$('#imgslide').CloudCarousel({
    xPos: 255,
    yPos: 0,
    yRadius: 5,
    minScale: 0.7,
    xRadius: 0,
    FPS: 30,
    autoRotate:'right',
    autoRotateDelay: 2000,
    buttonLeft: $('#leftbtn'),
    buttonRight: $('#rightbtn')
    //altBox: $('#alt-text'),
    // titleBox: $('#title-text')
});

// 参数详解：现在显示的值就为默认值。

reflHeight:0, //倒影的高度，单位是像素 
reflOpacity:0.5, //倒影透明度（0-1） 
reflGap:0, //图片与倒影之间的间隙，单位是像素 
minScale:0.5, //缩放比例 
xPos:0, //X轴偏移，一般设置成外框的一半，也就是实例中“#carousel1”的宽度的一半 
yPos:0, //Y轴偏移，这个可以自己调试看看，很直观的 
xRadius:0, //旋转幅度的水平半径，这个是猜的 
yRadius:0, //旋转幅度的垂直半径，这个是猜的，因为旋转的路径是个椭圆，你明白的 
altBox:null, //显示图片alt属性的样式名称 
titleBox:null, //显示图片title属性的样式名称 
FPS: 30, //我猜是旋转运动的步长 
autoRotate: ‘no’, //是否自动播放，设置“left”或者“right”即可自动播放 
autoRotateDelay: 1500, //播放延时 
speed:0.2, //播放速度（0.1 ~ 0.3之间） 
mouseWheel: false, //是否支持滑轮，需要加在jQuery滑轮插件，官方的地址不见了，可以用百度“jquery.mousewheel”即可 
bringToFront: false, //这个参数设置为true，就是表示点击相应的图片，滚动到当前展示，一般是不打开自动播放时 
buttonLeft: ”, //控制向左的按钮 
buttonRight: ” //控制向右的按钮
官网地址：  http://www.professorcloud.com/mainsite/carousel.htm


http://y.qq.com/vip/charater/index.html

<div class="slider_control">
    <a href="javascript:;" class="slider_ctrl_l" id="leftbtn" style="display: inline;"></a>
    <div class="slider_person" id="imgslide" style="position: relative; overflow: hidden;"><div style="position: absolute; width: 100%; height: 100%; display: block;">
        <a href="javascript:;" class="slider_item slider_item--current">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_mj.jpg?max_age=604800" phoneimg="mj" class="slider__pic" width="138" height="96" alt="" style="position: absolute; left: 351.521997123178px; top: -1.26772396590509px; z-index: 80;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_eason.jpg?max_age=604800" phoneimg="eason" class="slider__pic" width="153" height="107" alt="" style="position: absolute; left: 363.541740477999px; top: 1.35246490064986px; z-index: 89;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_bigbang.jpg?max_age=604800" phoneimg="bigbang" class="slider__pic" width="166" height="116" alt="" style="position: absolute; left: 296.789161039079px; top: 3.90583826518041px; z-index: 97;">
        </a>                        
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_jj.jpg?max_age=604800" phoneimg="jj" class="slider__pic slider__pic--current" width="171" height="119" alt="" style="position: absolute; left: 170.575105336478px; top: 4.99984913319937px; z-index: 99;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_gem.jpg?max_age=604800" phoneimg="gem" width="167" height="116" class="slider__pic" alt="" style="position: absolute; left: 48.4505647141079px; top: 3.95236418135188px; z-index: 97;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_jay.jpg?max_age=604800" phoneimg="jay" width="154" height="107" class="slider__pic" alt="" style="position: absolute; left: -7.26909138434615px; top: 1.41741156802863px; z-index: 89;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_taylor.jpg?max_age=604800" phoneimg="taylor" width="138" height="96" class="slider__pic" alt="" style="position: absolute; left: 19.0409629356676px; top: -1.21555063507702px; z-index: 80;">
        </a>

        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_tfboys.jpg?max_age=604800" phoneimg="tfboys" width="125" height="87" class="slider__pic" alt="" style="position: absolute; left: 98.1662823323375px; top: -2.93443368919719px; z-index: 72;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_voice.jpg?max_age=604800" phoneimg="voice" width="120" height="84" class="slider__pic" alt="" style="position: absolute; left: 193.697314187947px; top: -3.49992784554949px; z-index: 70;">
        </a>
        <a href="javascript:;" class="slider_item">
            <img src="http://imgcache.gtimg.cn/mediastyle/event/20150914_dakazhuang/img/view_winner.jpg?max_age=604800" phoneimg="winner" width="125" height="87" class="slider__pic" alt="" style="position: absolute; left: 284.485963237496px; top: -2.96029191268032px; z-index: 72;">
        </a>
    </div></div>
    <a href="javascript:;" class="slider_ctrl_r" id="rightbtn" style="display: inline;"></a>
</div>