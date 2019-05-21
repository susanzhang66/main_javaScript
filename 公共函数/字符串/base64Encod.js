function base64Encode(a){
	var d,e,f,g,h,i,j,m,n,b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c="",k=0,l=a.replace(/\r\n/g,"\n");for(a="",m=0;m<l.length;m++)n=l.charCodeAt(m),128>n?a+=String.fromCharCode(n):n>127&&2048>n?(a+=String.fromCharCode(192|n>>6),a+=String.fromCharCode(128|63&n)):(a+=String.fromCharCode(224|n>>12),a+=String.fromCharCode(128|63&n>>6),a+=String.fromCharCode(128|63&n));for(;k<a.length;)d=a.charCodeAt(k++),e=a.charCodeAt(k++),f=a.charCodeAt(k++),g=d>>2,h=(3&d)<<4|e>>4,i=(15&e)<<2|f>>6,j=63&f,isNaN(e)?i=j=64:isNaN(f)&&(j=64),c=c+b.charAt(g)+b.charAt(h)+b.charAt(i)+b.charAt(j);
	return c;
};
//base64Encode('起点.终点')