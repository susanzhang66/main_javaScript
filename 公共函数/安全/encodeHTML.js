/**
* 实体替换，把经过html等编码的字符串还原
*
* @param {}
*
* @return {String}
*/
String.prototype.entityReplace=function(){
     return this.replace(/&#38;?/g,"&amp;").replace(/&amp;/g,"&").replace(/&#(\d+);?/g,function(a,b){return String.fromCharCode(b)}).replace(/′/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&acute;/gi,"'").replace(/&nbsp;/g," ").replace(/&#13;/g,"\n").replace(/(&#10;)|(&#x\w*;)/g,"").replace(/&amp;/g,"&");
}

/**
* 对字符串中的单引号和双引号转换成对应的中文字符
*
* @return {String}
*/
String.prototype.myEncode=function(){
     return this.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\'/g,"’").replace(/\"/g,"“").replace(/&#39;/g,"’").replace(/&quot;/g,"“").replace(/&acute;/g,"’").replace(/\%/g,"％").replace(/\(/g,"（").replace(/\)/g,"）");
}

function encodeHTML(sStr) {

     return sStr.entityReplace().myEncode();
};