Set 和 Map 数据结构


Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 结构的实例有以下属性。

Set.prototype.constructor：构造函数，默认就是Set函数。
Set.prototype.size：返回Set实例的成员总数。
－－－－－－－－－－
set的操作方法：
add(value)：添加某个值，返回 Set 结构本身。
delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
has(value)：返回一个布尔值，表示该值是否为Set的成员。
clear()：清除所有成员，没有返回值。
－－－－－－－－－－－－
set的遍历方法：
keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员


let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

// 上面代码向 Set 实例添加了两个NaN，但是只能加入一个。这表明，在 Set 内部，两个NaN是相等。


2.weakSet
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值。如下：

const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set

WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。


3.Map
它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

属性和操作方法：
（1）size 属性  size属性返回 Map 结构的成员总数。
（2）set(key, value) set方法设置键名key对应的键值为value，然后返回整个 Map 结构。
（3）get(key)  get方法读取key对应的键值，如果找不到key，返回undefined。
（4）has(key)  has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
（5）delete(key)  delete方法删除某个键，返回true。如果删除失败，返回false。
（6）clear()  clear方法清除所有成员，没有返回值。

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

keys()：返回键名的遍历器。
values()：返回键值的遍历器。
entries()：返回所有成员的遍历器。
forEach()：遍历 Map 的所有成员。

4.WeakMap
WeakMap结构与Map结构类似，也是用于生成键值对的集合。

WeakMap与Map的区别有两点。

首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。

WeakMap只有四个方法可用：get()、set()、has()、delete()。

