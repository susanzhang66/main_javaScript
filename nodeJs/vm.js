// vm 虚拟机

// vm 模块提供了一系列 API 用于在 V8 虚拟机环境中编译和运行代码。

// JavaScript 代码可以被编译并立即运行，或编译、保存然后再运行。


// const util = require('util');
// const vm = require('vm');

// const sandbox = {
//   animal: 'cat',
//   count: 2
// };

// const script = new vm.Script('count += 1; name = "kitty";');

// const context = vm.createContext(sandbox);
// for (let i = 0; i < 10; ++i) {
//   script.runInContext(context);
// }

// console.log(util.inspect(sandbox));

// { animal: 'cat', count: 12, name: 'kitty' }

// ------------------分割线－－－－－－－－－－
// const util = require('util');
// const vm = require('vm');

// const script = new vm.Script('globalVar = "set"');

// const sandboxes = [{}, {}, {}];
// sandboxes.forEach((sandbox) => {
//   script.runInNewContext(sandbox);   // todo..  与 runInContext 区别是什么？？？
// });

// console.log(util.inspect(sandboxes));

// [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

//---------分割线-------------------------

// const vm = require('vm');
// let localVar = 'initial value';

// const vmResult = vm.runInThisContext('localVar = "vm";');
// console.log('vmResult:', vmResult);
// console.log('localVar:', localVar);

// const evalResult = eval('localVar = "eval";');
// console.log('evalResult:', evalResult);
// console.log('localVar:', localVar);

// vmResult: 'vm', localVar: 'initial value'
// evalResult: 'eval', localVar: 'eval'


//---------分割线-------------------------

'use strict';
const vm = require('vm');

const code = `
(function(require) {
  const http = require('http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);


//---------分割线-------------------------




