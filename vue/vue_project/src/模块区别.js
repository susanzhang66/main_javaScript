// 基本配置
// 现在，让我们以某种方式打包这个 library，能够实现以下几个目标：

// 不打包 lodash，而是使用 externals 来 require 用户加载好的 lodash。
// 设置 library 的名称为 webpack-numbers.
// 将 library 暴露为一个名为 webpackNumbers的变量。
// 能够访问其他 Node.js 中的 library。

// ES2015 模块引入
import * as webpackNumbers from 'webpack-numbers';
// CommonJS 模块引入
var webpackNumbers = require('webpack-numbers');
// ...
// ES2015 和 CommonJS 模块调用
webpackNumbers.wordToNum('Two');
// ...
// AMD 模块引入
require(['webpackNumbers'], function ( webpackNumbers) {
  // ...
  // AMD 模块调用
  webpackNumbers.wordToNum('Two');
  // ...
});