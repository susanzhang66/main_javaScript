// new Console(stdout[, stderr])

const { Console } = require('console');

const fs = require('fs');

// const output = fs.createWriteStream('./stdout.log');

// const errorOut =  fs.createWriteStream('./errorOut.log');

// const logger = new Console( output, errorOut );

// const count = 5;

// logger.log('count: %d', count);


//下面循环语句运行的时间。
// console.time启动一个定时器，用以计算一个操作的持续时间。
console.time('100-elements');    
for (let i = 0; i < 100; i++) {}
console.timeEnd('100-elements');


