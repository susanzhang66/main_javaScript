/*
函数名称：$addParam
函数描述： 
添加url参数
*/ 
/**
 * url添加参数
 * @param {Object} url 要处理的url
 * @param {Object} param 要添加的参数名
 * @param {Object} value 要添加的参数值，注意需要编码处理
 * @param {Object} replace 是否替换url中的同名参数
 */
function $addParam(url,param,value,replace){
	param+='=';
	var a=document.createElement('a');         //Jane：添加a.href的作用是 方便提取？号后面的？
	a.href=url;
	var search=a.search.replace(/^\?+/,'');   // jane: a.search 和  location.search 相同结果
	search=search?search.split('&'):[];
	if(replace){
		//替换相同参数，把原参数数据清除
		for(var i=search.length;i--;){
			if(search[i].indexOf(param)==0){
				search.splice(i,1);
			}
		}
	}
	search.push(param+value);
	a.search=search.join('&');
	return a.href;
}
/*
调用示例： 
//url添加参数a=3
var url=$addParam('http://www.iuni.com/test?a=1&b=2#12345','a','3');
//url替换参数a=3
var url=$addParam('http://www.iuni.com/test?a=1&b=2#12345','a','3',true);
被依赖函数： 
$addToken
=============================================================

*/
/*
函数名称：$addParams
函数描述： 
url添加参数

url 要处理的url
param 要添加的参数对象，名值对
replace 是否替换url中的同名参数
*/ 
/**
 * url添加参数
 * @param {Object} url 要处理的url
 * @param {Object} param 要添加的参数对象，名值对
 * @param {Object} replace 是否替换url中的同名参数
 */
function $addParams(url,param,replace){
	var a=document.createElement('a');
	a.href=url;
	var search=a.search.replace(/^\?+/,'');
	search=search?search.split('&'):[];
	//合并参数
	for(var i=0,len=search.length;i<len;i++){
		var p=search[i].split('='),p0=p[0],p1=typeof p[1]=='undefined'?'':p[1],t=typeof param[p0]!='undefined';
		if(t&&replace){
			continue;
		}
		if(t){
			if($isArray(param[p0])){
				param[p0].unshift(p1);
			}else{
				param[p0]=[p1,param[p0]];
			}
		}else{
			param[p0]=p1;
		}
	}
	//拼接参数
	var s=[];
	for(var p in param){
		var v=param[p];
		if($isArray(v)){
			for(var i=0,len=v.length;i<len;i++){
				s.push(p+'='+v[i]);
			}
		}else{
			s.push(p+'='+v);
		}
	}
	a.search=s.join('&');
	//返回
	return a.href;
}
/*
调用示例： 
//url值为http://www.iuni.com/?a=1&a=2&d=1&d=2&e=3&b=2&c=
var url=$addParams('http://www.iuni.com?a=1&b=2&c',{a:2,d:[1,2],e:3});

//url值为http://www.iuni.com/?a=2&d=1&d=2&e=3&b=2&c=
var url=$addParams('http://www.iuni.com?a=1&b=2&c',{a:2,d:[1,2],e:3},true);
依赖函数： 
$isArray
被依赖函数： 
$jsonp
=================================================================
*/
/*
函数名称：$addToken
函数描述： 
给url添加token标识，防csrf攻击用
*/
/**
 * 添加token标识，防csrf用
 * @param {Object} url 要添加标识的url
 * @param {Object} tokenname token参数名称，默认为tk，由接口确定
 * @param {Object} key token校验key，默认为tgt数据，由接口确定
 */
function $addToken(url, tokenname,key) {
	tokenname = tokenname || 'tk';
	var tgt;
	if (key||(tgt=$getCookie('tgt'))) {
		return $addParam(url, tokenname, key||$t33(tgt), true);
	}
	return url;
}
/*
调用示例： 
//给url添加token
var url=$addToken('http://www.iuni.com/api/test/testCsrf');
依赖函数： 
$t33,$addParam,$getCookie
====================================================================
*/
/*
函数名称：$parseUrl
函数描述： 
解析url，返回协议，域名，端口，url，路径，参数，锚点

参数：
url 要解析的url

返回：
返回一个包括url相关信息的对象
*/ 
/**
 * 解析url，返回协议，域名，端口，url，路径，参数，锚点
 * @param {Object} url
 */
function $parseUrl(url){
	var a=document.createElement('a');
	a.href=url;
	return {
		protocol:a.protocol,
		hostname:a.hostname,
		port:a.port,
		href:a.href,
		pathname:a.pathname,
		search:a.search,
		hash:a.hash
	};
}
/*
调用示例： 
//解析相对路径
var info=$parseUrl('../static/js/test.js?t=2222#nolink');
被依赖函数： 
$iuni_parseBBcode
============================================================
*/

/**
 * 获取url参数
 * @method  getParam
 * @param {string} name 需要获取的url参数名
 * @param {string} url  需要解析的url
 * @return decodeuri之后的参数值
 */

M.getParam=function(name,url) {
	var r=new RegExp("(\\?|#|&)"+name+"=(.*?)(#|&|$)")
	var m=(url||location.href).match(r);
	return decodeURIComponent(m?m[2]:'');
}
/**
 * 删除url参数
 * @method delParam
 * @param {string} name 需要删除的url参数名
 * @param {string} url  需要解析的url
 * @return 删除之后的url
 */

M.delParam = function(name, url){
    var r=new RegExp("(\\?|#|&)("+name+"=.*?)(#|&|$)");
    url=url||location.href;
    var m=url.match(r);
    if(m && (m.length >= 3) && m[2]){
        var matchstr = m[0],
            s = m[2];
        if( matchstr.charAt(0) == '&' ){
            s = '&' + s;
        }
        return url.replace(s, '');
    }else{
        return url;
    }
}


/**
 * 是否是一个可接受的URL串
 * 
 * @param {String}
 *            s 目标串
 * @return {Boolean} 结果
 */
function isURL(s) {
	var p = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;
	return p.test(s);
}
