/*
$getOffset
函数描述： 
获取相对浏览器的位置，同jquery的offset()
函数代码： 
*/
function $getOffset (ele,oRefer){//oRefer是定位参照物。可以不写，不写就是和浏览器的绝对位置
	//注意：oRefer必须是ele的offset祖先，要不然取到的值是ele距离body的绝对偏移量
		oRefer=oRefer||document.body;
		var x=ele.offsetLeft;
		var y=ele.offsetTop;
		p=ele.offsetParent;//重在理解好offsetParent      //属性相对的父元素。
		
		while(p!=oRefer&&p!=document.body){
			 
			if(window.navigator.userAgent.indexOf('MSIE 8.0')>-1){//ie8有个bug（边框问题）
				x+=p.offsetLeft;
				y+=p.offsetTop;
			}else{
				x+=p.offsetLeft+p.clientLeft;
				y+=p.offsetTop+p.clientTop;
			}		
			p=p.offsetParent;
			
		}
		var obj={};
		obj.left=x;
		obj.top=y;
		return obj;
	}
调用示例： 
$getOffset().left;
被依赖函数： 
$sliderBar