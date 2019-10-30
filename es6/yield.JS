yield 关键字用来暂停和恢复一个生成器函数（(function* 或遗留的生成器函数）。
	[rv] = yield [expression];

expression
定义通过迭代器协议从生成器函数返回的值。如果省略，则返回undefined。
rv
返回传递给生成器的next()方法的可选值，以恢复其执行。

一旦遇到 yield 表达式，生成器的代码将被暂停运行，直到生成器的 next() 方法被调用。每次调用生成器的next()方法时，生成器都会恢复执行，直到达到以下某个值：

function* countAppleSales () {
  var saleList = [3, 7, 5];
  for (var i = 0; i < saleList.length; i++) {
    yield saleList[i];
  }
}

var appleStore = countAppleSales(); // Generator { }
console.log(appleStore.next()); // { value: 3, done: false }
console.log(appleStore.next()); // { value: 7, done: false }
console.log(appleStore.next()); // { value: 5, done: false }
console.log(appleStore.next()); // { value: undefined, done: true }