对象的扩展

1.属性的简洁表示法
2.属性名表达式
3。方法的 name 属性
4.Object.is()
5.Object.assign()
6.属性的可枚举性和遍历
7.Object.getOwnPropertyDescriptors()
8.__proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
9.super 关键字
10.Object.keys()，Object.values()，Object.entries()
11.对象的扩展运算符


1.
变量：
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};

函数：
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};
插入对象里的简写：
let birth = '2000/01/01';

const Person = {

  name: '张三',

  //等同于birth: birth
  birth,

  // 等同于hello: function ()...
  hello() { console.log('我的名字是', this.name); }

};

11.
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }
// －－－－－－－－－－－－－
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);

// －－－－－－－－－－－－－


var a = {"a":1}
var b = {"b":2}
function c(a,b){ return {a,b}}
var d = {...c(a,b)}