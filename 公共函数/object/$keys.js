
/**
 * 获取对象的属性名集合
 */
function $keys(obj) {
	if(typeof obj!='object'){
		return null;
	}
	if (Object.keys) {
		return Object.keys(obj);
	}
	var keys = [];
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			keys.push(k);
		}
	}
	return keys;
}