// readline

// require('readline') 模块提供了一个接口，用于从可读流（如 process.stdin）读取数据，每次读取一行。

// Interface 类
// readline.Interface 类的实例是使用 readline.createInterface() 方法构造的。 每个实例都关联一个 input 可读流和一个 output 可写流。 output 流用于为到达的用户输入打印提示，且从 input 流读取。

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('你认为 Node.js 中文网怎么样？', (answer) => {
  // 对答案进行处理
  console.log(`多谢你的反馈：${answer}`);

  // rl.close();  // 多种情况可以触发 关闭。比如 用户收到关闭到，
  // 注意：当调用该代码时，Node.js 程序不会终止，直到 readline.Interface 被关闭，因为接口在等待 input 流中要被接收的数据。
});

rl.on('line', (input) => {
  console.log(`接收到：${input}`);
});

rl.close(); 
