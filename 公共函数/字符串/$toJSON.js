/*
函数名称：$toJSON
函数描述： 
将js对象转换为json字符串
参数：
obj-要转换的对象
*/
/**
 *将对象转化为json字符串 
 */
function $toJSON(obj) {
	var IS_DONTENUM_BUGGY = (function() {
		for (var p in {toString : 1}) {
			if (p === 'toString')
				return false;
		}
		return true;
	})();
	var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
	var _toString = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty, NULL_TYPE = 'Null', UNDEFINED_TYPE = 'Undefined', BOOLEAN_TYPE = 'Boolean', NUMBER_TYPE = 'Number', STRING_TYPE = 'String', OBJECT_TYPE = 'Object', FUNCTION_CLASS = '[object Function]', BOOLEAN_CLASS = '[object Boolean]', NUMBER_CLASS = '[object Number]', STRING_CLASS = '[object String]', ARRAY_CLASS = '[object Array]', DATE_CLASS = '[object Date]', NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON && typeof JSON.stringify === 'function' && JSON.stringify(0) === '0' && typeof JSON.stringify(function() {}) === 'undefined';
	return Str('', {'' : obj}, []);
	function Type(o) {
		switch(o) {
			case null:
				return NULL_TYPE;
			case (void 0):
				return UNDEFINED_TYPE;
		}
		var type = typeof o;
		switch(type) {
			case 'boolean':
				return BOOLEAN_TYPE;
			case 'number':
				return NUMBER_TYPE;
			case 'string':
				return STRING_TYPE;
		}
		return OBJECT_TYPE;
	}

	function Str(key, holder, stack) {
		var value = holder[key];
		if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}
		var _class = _toString.call(value);
		switch (_class) {
			case NUMBER_CLASS:
			case BOOLEAN_CLASS:
			case STRING_CLASS:
				value = value.valueOf();
		}
		switch (value) {
			case null:
				return 'null';
			case true:
				return 'true';
			case false:
				return 'false';
		}
		var type = typeof value;
		switch (type) {
			case 'string':
				return inspectStr(value, true);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'object':
				for (var i = 0, length = stack.length; i < length; i++) {
					if (stack[i] === value) {
						throw new TypeError("Cyclic reference to '" + value + "' in object");
					}
				}
				stack.push(value);
				var partial = [];
				if (_class === ARRAY_CLASS) {
					for (var i = 0, length = value.length; i < length; i++) {
						var str = Str(i, value, stack);
						partial.push( typeof str === 'undefined' ? 'null' : str);
					}
					partial = '[' + partial.join(',') + ']';
				} else {
					var keys = tokeys(value);
					for (var i = 0, length = keys.length; i < length; i++) {
						var key = keys[i], str = Str(key, value, stack);
						if ( typeof str !== "undefined") {
							partial.push(inspectStr(key,true) + ':' + str);
						}
					}
					partial = '{' + partial.join(',') + '}';
				}
				stack.pop();
				return partial;
		}
	}

	function inspectStr(str, useDoubleQuotes) {
		var specialChar = {
			'\b' : '\\b',
			'\t' : '\\t',
			'\n' : '\\n',
			'\f' : '\\f',
			'\r' : '\\r',
			'\\' : '\\\\'
		};
		var escapedString = str.replace(/[\x00-\x1f\\]/g, function(character) {
			if ( character in specialChar) {
				return specialChar[character];
			}
			return '\\u00' + toPaddedString(character.charCodeAt(), 2, 16);
		});
		if (useDoubleQuotes)
			return '"' + escapedString.replace(/"/g, '\\"') + '"';
		return "'" + escapedString.replace(/'/g, '\\\'') + "'";
	}

	function toPaddedString(num, length, radix) {
		var string = num.toString(radix || 10);
		return times('0', length - string.length) + string;
	}

	function times(str, count) {
		return count < 1 ? '' : new Array(count + 1).join(str);
	}

	function tokeys(object) {
		if (Type(object) !== OBJECT_TYPE) {
			throw new TypeError();
		}
		var results = [];
		for (var property in object) {
			if (_hasOwnProperty.call(object, property))
				results.push(property);
		}
		if (IS_DONTENUM_BUGGY) {
			for (var i = 0; property = DONT_ENUMS[i]; i++) {
				if (_hasOwnProperty.call(object, property))
					results.push(property);
			}
		}
		return results;
	}

}


/* =========================================
调用示例：  */
var json=$toJSON({a:1,b:false});
被依赖函数： 
$formatTpl$page