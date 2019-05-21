 
解析排版文字代码，支持BBCODE：img和url标签，配合$iuni_typeset做文章排版输出功能

参数：
text 文章内容
customCodes,自定义标签定义对象，如需自定义标签对象，可定制化该参数，内容为customCode:function(arg,data){return codeObject};

返回：
解析好的数组，内容为文字，图片，链接
函数代码： 
/**
 * 解析bbcode
 * @param text,要解析的文章文本
 * @param customCodes,自定义标签定义对象
 */
function $iuni_parseBBcode(text,customCodes){
	if(!$iuni_parseBBcode.feature_split_normal){
		$iuni_parseBBcode.feature_split_normal='1,2'.split(/(,)/g).length==3;
	}
	customCodes=customCodes||{};
	//转换html标签包围符号<>
	text=text.replace(/[<>\t]/ig,function($0){
		return {
			'<':'&lt;',
			'>':'&gt;',
			'\t':'    '//转换制表符\t为4个空格
		}[$0];
	});
	//统一换行符,\r\n->\n(windows),\r->\n(apple),\n\r->\n(未知)
	text=text.replace(/(\r\n)|(\n\r)|(\r)/g,'\n');
	//去除控制转义字符
	text=text.replace(/[\r\f\v\b]/g,'');
	//根据bbcode切分
	var reg=/\[(\w+)(=[^ \f\n\r\t\v\[\]]*)?\]([^\[\]]*)\[\/\1\]/g,arr=text.split(reg);
	//IE7及以下版本 String.prototype.split 正则bug
	if(!$iuni_parseBBcode.feature_split_normal){
		var __bugfixed0=0;
		$each(text.match(reg)||[],function(bbcode,i){
			var fl=bbcode.indexOf(']'),tag=bbcode.substring(1,fl),code2,tag,eq,t,eqIndex,insertIndex;
			if((eqIndex=tag.indexOf('='))!=-1){
				eq=tag.substring(eqIndex);
				tag=tag.substring(0,eqIndex);
			}
			t=bbcode.substring(fl+1,bbcode.length-(tag.length+3));
			if((typeof arr[i*4]=='undefined')||(arr[i*4]!=text.substring(__bugfixed0,__bugfixed0+arr[i*4].length))){
				//补齐空缺，bug，空内容会被忽略
				arr.splice(i*4,0,'');
			}
			insertIndex=i*4+1;
			__bugfixed0+=arr[i*4].length+bbcode.length;
			arr.splice(insertIndex,0,tag,eq,t);
		});
	}
	//允许的bbcode
	var allowedBBcode={
		//img标签解析
		img:function(arg,data){
			if(!arg){
				return false;
			}
			arg=arg.replace(/\s+/g,'');
			//尺寸
			if(!arg.match(/^(\d+\*\d+;)*(\d+\*\d+);?$/)){
				return false;
			}
			var sizes=$map(arg.split(';'),function(s,i){
				if(!s){
					return null;
				}
				var size=s.split('*');
				return [parseInt(size[0]),parseInt(size[1])];
			});
			$arrRemove(sizes,null);
			var urls=$map(data.split(';'),function(d){
				if(!d){
					return null;
				}
				return $parseUrl(d).href;
			});
			$arrRemove(urls,null);
			if(sizes.length!=urls.length){
				return false;
			}
			return {
				type:'img',
				sizes:sizes,
				urls:urls
			};
		},
		//url标签解析
		url:function(arg,data){
			var text=$strTrim(data);
			if(!text){
				//空内容，返回
				return false;
			}
			var urlInfo=$parseUrl(arg);
			return {
				type:'url',
				href:urlInfo.href,
				text:text
			};
		}
	};
	//遍历拆分数据，处理bbcode
	var codeArr=[],code,arg;
	for(var i=0,len=arr.length;i<len;i++){
		var data=arr[i];
		switch(i%4){
			case 0://文本内容
					//还原
					if(codeArr.length&&codeArr[codeArr.length-1].type=='text'){
						codeArr[codeArr.length-1].data+=data||'';
					}else{
						//img标签
						codeArr.push({type:'text',data:data});
					}
				break;
			case 1://bbcode
				code=data;
				break;
			case 2://arg
				arg=data?data.substring(1):null;
				break;
			case 3://data
				var data=customCodes[code]?customCodes[code](arg,data):allowedBBcode[code]&&allowedBBcode[code](arg,data);
				if(data){
					//解析正确则放入数组
					data&&codeArr.push({type:'bbcode',data:data});
				}else if(!allowedBBcode[code]){
					data=$parseStr('[{#code#}{#arg#}]{#data#}[/{#code#}]',{code:code,arg:arg===null?'':'='+arg,data:data||''});
					//还原
					if(codeArr.length&&codeArr[codeArr.length-1].type=='text'){
						codeArr[codeArr.length-1].data+=data||'';
					}else{
						codeArr.push({type:'text',data:data});
					}
				}
				break;
		}
	}
	return codeArr;
}
调用示例： 
/**
 * 解析文章内容，返回对应的bbcode数组，给到$iuni_typeset函数做排版输出
 */
var bbcodes=$iuni_parseBBcode('这是一段测试图片：[img=80*60;120*90;480*360]http://static.iuniimg.com/pics/80_60/test.jpg;http://static.iuniimg.com/pics/120_90/test.jpg;http://static.iuniimg.com/pics/480*360/test.jpg[/img]\n这是一个测试链接：[url=http://www.baidu.com]去搜索[/url]');
依赖函数： 
$parseStr$strTrim$parseUrl$arrRemove$map$break$each$each
被依赖函数： 
www_iuni_com:$iuni_articleListItemwww_iuni_com:$iuni_articlePage