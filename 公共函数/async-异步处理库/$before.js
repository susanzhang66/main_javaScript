//在一个函数A之前执行另一个函数B, 函数B返回false表示不再执行函数A.
function $before(before, fn) {
     return function () {
	if (fn.apply(this, arguments) === false) {
		 return false;
	}
	 return before.apply(this, arguments);
      }
 }


 var a = function(){
  alert (1);
}

var b = function(){
  alert (2);
}

a = $before(a,b);