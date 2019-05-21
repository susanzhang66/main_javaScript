函数名称：$get_file_size
函数描述： 
根据单位获取文件字节数
函数代码： 
function $get_file_size( unit, amount ){
	return ( { 'K': 1024, 'M': 1024 * 1024, 'G': 1024 * 1024 * 1024 }[ unit ] || 1 ) * amount;
}
调用示例： 
$get_file_size( 'M', 5 )