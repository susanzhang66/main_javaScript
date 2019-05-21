函数名称：$t33
函数描述： 
time33 hash算法 
function $t33(str) {
	for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
		hash += (hash << 5) + str.charAt(i).charCodeAt();
	};
	return hash & 0x7fffffff;
}
调用示例：
$hash=$t33('TGT-6-ZWKAys02CG7o5HjBLXxw2co9e0ZkYA3QpzfA1yuS24vi3wbAxa-sso');

被依赖函数： 
$addToken$jsonpwww_iuni_com:$iuni_articleList_metrowww_iuni_com:$iuni_dialogManager$getToken