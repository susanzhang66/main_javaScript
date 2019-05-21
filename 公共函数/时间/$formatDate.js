$formatDate
函数描述： 
格式化时间函数，返回格式化后的时间字符串

参数：
time 时间，Date对象
opt 选项，可以是格式化字符串，也可以是更多参数的选项
具体选项值参看代码注释
格式化参数
 * Y-年份，四位数字
 * y-年份，两位数字
 * M-月份，补零
 * m-月份，不补零
 * mc-月份，中文
 * me-月份，英文缩写月份
 * D-日，补零
 * d-日，不补零
 * w-周，数字
 * wc-周，中文字符
 * we-周，英文缩写周
 * H-24时，补零
 * h-12时，补零
 * Hz-24时，不补零
 * hz-12时，不补零
 * apc-上午，下午
 * ape- am,pm
 * N-分，补零
 * n-分，不补零
 * S-秒，补零
 * s-秒，不补零
 * I-毫秒，补零
 * i-毫秒，不补零
函数代码： 
/**
 * 格式化时间函数
 * @param {Object} time 时间，Date对象
 * @param {Object} opt 选项，可以是格式化字符串，也可以是更多参数的选项
 * 选项参数说明如下，判断优先级从上至下
 * ftin1d：如果存在，当要格式的时间和当前时间同一天内时，使用该格式化字符串
 * ftin1w：如果存在，当要格式的时间和当前时间同一周内时，使用该格式化字符串
 * ftlt1w：如果存在，当要格式的时间和当前时间小于一周时，使用该格式化字符串
 * ftin1m：如果存在，当要格式的时间和当前时间同一月内时，使用该格式化字符串
 * ftcustom：通过函数自定义格式化串，该参数为以上参数中最高优先级
 * 如：ftcustom:function(time){return time.getData()<10?'Y-M 上旬':time.getData()<20?'Y-M 中旬':'Y-M 下旬'}
 * ft：格式化字符串
 * 格式化参数
 * Y-年份，四位数字
 * y-年份，两位数字
 * M-月份，补零
 * m-月份，不补零
 * mc-月份，中文
 * me-月份，英文缩写月份
 * D-日，补零
 * d-日，不补零
 * w-周，数字
 * wc-周，中文字符
 * we-周，英文缩写周
 * H-24时，补零
 * h-12时，补零
 * Hz-24时，不补零
 * hz-12时，不补零
 * apc-上午，下午
 * ape- am,pm
 * N-分，补零
 * n-分，不补零
 * S-秒，补零
 * s-秒，不补零
 * I-毫秒，补零
 * i-毫秒，不补零
 * ftOpt:扩展格式化参数，定制化
 * 如：apc1:function(time){var h=time.getHour;return h<6?'凌晨':h<11?'上午':h<14?'中午':h<19?'下午':'晚上'}
 */
function $formatDate(time,opt){
	if(!$formatDate.__data){
		//基础字段
		$formatDate.__data={
			Y:function(time){return time.getFullYear();},
			y:function(time){return time.getFullYear().substring(2);},
			M:function(time){return fillZero(time.getMonth()+1,2);},
			m:function(time){return time.getMonth()+1;},
			mc:function(time){return ['一','二','三','四','五','六','七','八','九','十','十一','十二'][time.getMonth()];},
			me:function(time){return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][time.getMonth()];},
			D:function(time){return fillZero(time.getDate(),2);},
			d:function(time){return time.getDate();},
			w:function(time){return time.getDay();},
			wc:function(time){return ['日','一','二','三','四','五','六'][time.getDay()];},
			we:function(time){return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][time.getDay()];},
			H:function(time){return fillZero(time.getHours(),2);},
			h:function(time){return fillZero(time.getHours(),2);},
			Hz:function(time){return time.getHours();},
			hz:function(time){return time.getHours();},
			apc:function(time){return time.getHours()<12?'上午':'下午';},
			ape:function(time){return time.getHours()<12?'am':'pm';},
			N:function(time){return fillZero(time.getMinutes(),2);},
			n:function(time){return time.getMinutes();},
			S:function(time){return fillZero(time.getSeconds(),2);},
			s:function(time){return time.getSeconds();},
			I:function(time){return fillZero(time.getMilliseconds(),3);},
			i:function(time){return time.getMilliseconds();}
		};
		$formatDate.__compData=genCompData($formatDate.__data);
	}
	//初始化选项
	if(typeof opt=='string'){
		opt={
			ft:opt
		};
	}
	if(!opt||(!opt.ft&&!opt.ftcustom)){
		opt={
			ft:'Y-M-D H:N:S'
		};
	}
	if(!time){
		time=new Date();
	}
	//选择时间格式化字段
	var now=new Date(),tc=now.getTime()-time.getTime(),ft;
	if(opt.ftcustom){
		//自定义时间格式
		ft=opt.ftcustom(time);
	}else if(opt.ftin1d&&tc<86400000&&now.getDate()==time.getDate()){
		//同一日内
		ft=opt.ftin1d;
	}else if(opt.ftin1w&&tc<604800000&&(now.getDay()>time.getDay()||tc<86400000)){
		//同一周内
		ft=opt.ftin1w;
	}else if(opt.ftlt1w&&tc<604800000){
		//小于一周
		ft=opt.ftlt1w;
	}else if(opt.ftin1m&&tc<2678400000&&now.getMonth()==time.getMonth()){
		//同一月内
		ft=opt.ftlt1w;
	}else{
		//其他
		ft=opt.ft;
	}
	//自定义格式化字段
	var compData=$formatDate.__compData,curCompData={};
	if(opt.ftOpt){
		curCompData=genCompData(opt.ftOpt);
	}
	//生成格式化内容
	var result=[],last='',texts={},next=false;
	for(var i=0,len=ft.length;i<=len;i++){
		if(i<len){
			var c=ft.charAt(i);
			if(next){
				//转义字符
				result.push(c);
				next=false;
				continue;
			}else{
				if(c=='\\'){
					//进入转义
					if(!last){
						next=true;
						continue;
					}else{
						var testText=last+c,c1=compData[testText],c2=curCompData[testText];
					}
				}else{
					var testText=last+c,c1=compData[testText],c2=curCompData[testText];
				}
			}
		}else{
			c=testText=c1=c2=null;
		}
		if(i<len&&(c1||c2)){
			//有匹配到的内容,尝试继续匹配
			last=testText;
		}else{
			//无匹配到内容
			if(last){
				var text;
				//有历史匹配内容
				if(texts[last]){
					text=texts[last];
					//回溯1
					c&&i--;
				}else if(curCompData[last]&&curCompData[last][0]){
					text=texts[last]=curCompData[last][0](time);
					//回溯1
					c&&i--;
				}else if(compData[last]&&compData[last][0]){
					text=texts[last]=compData[last][0](time);
					//回溯1
					c&&i--;
				}else{
					text=last.substring(0,1);
					//无对应数据,回溯全部
					i-=last.length;
				}
				result.push(text);
				last='';
			}else{
				//无历史匹配内容
				c&&result.push(c);
				continue;
			}
		}
	}
	//返回结果
	return result.join('');
	//生成比较数据
	function genCompData(data){
		var testObj={};
		for(var k in data){
			for(var i=k.length;i;i--){
				var s=k.substring(0,i);
				if(!testObj[s]){
					testObj[s]=[0,0];
				}
				if(i==k.length){
					testObj[s][0]=data[k];
				}else{
					testObj[s][1]=1;
				}
			}
		}
		return testObj;
	}
	//填零函数
	function fillZero(d,len){
		d=d.toString();
		for(var i=len-d.length;i-->0;){
			d='0'+d;
		}
		return d;
	}
}
调用示例： 
//2014-02-12 13:22:33
var timeStr=$formatDate();
被依赖函数： 
www_iuni_com:$iuni_dialogManagerwww_iuni_com:$iuni_getArticleItems