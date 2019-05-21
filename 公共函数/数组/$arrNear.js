函数名称：$arrNear
函数描述： 
从数组中查找最符合要求的元素

参数：
arr 要查找的数组
fn 数组元素调用函数，返回值越大表示越符合要求，小于等于0表示放弃
num 要查找的数量

返回：
如果查找的数量为1，返回符合要求的那个元素以及索引，否则返回按接近程度排序的符合要求的元素及索引数组
函数代码： 
/**
 * 从数组中查找最符合要求的元素
 * @param {Object} arr 要查找的数组
 * @param {Object} fn 数组元素调用函数，返回值越大表示越符合要求，小于等于0表示放弃
 * @param {Object} num 要查找的数量
 */
function $arrNear(arr,fn,num){
	num=num||-1;
	if(!arr||arr.length==0){
		return num==1?null:[];
	}
	var h=null,e=null,l=0;
	$each(arr,function(x,i){
		var d=fn(x);
		if(d>0){
			if(!h){
				h=e={p:null,n:null,o:x,d:d,i:i};
				l=1;
			}else{
				var c=e;
				while(c){
					if(c.d<d){
						c=c.p;
					}else{
						c.n={p:c,n:c.n,o:x,d:d,i:i};
						if(c.n.n){
							c.n.n.p=c.n;
						}else{
							e=c.n;
						}
						l++;
						break;
					}
				}
				if(!c){
					h.p={p:null,n:h,o:x,d:d,i:i};
					h=h.p;
					l++;
				}
				if(l>num){
					e=e.p;
					e.n.p=null;
					e.n=null;
				}
			}
		}
	});
	if(l==1){
		return h?{index:h.i,value:h.o}:null;
	}else{
		var arr=[];
		while(h){
			arr.push({index:h.i,value:h.o});
			h=h.n;
		}
		return arr;
	}
}
调用示例： 
/**
 * 返回数组中最接近9的3个数字
 */
//result的值应该为[{index: 5,value: 9},{index:0,value:8},{index:1:value:12}]
var result=$arrNear([8,12,1,45,37,9,4],function(num){
    return (num-9==0)?Number.MAX_VALUE:1/(Math.abs(num-9));
},3);
依赖函数： 
$each$break
被依赖函数： 
$arrMergePropertieswww_iuni_com:$iuni_articlePagewww_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articleListItem