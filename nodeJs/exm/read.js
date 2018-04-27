// 注意，多次对同一文件使用 fs.write 且不等待回调，是不安全的。 对于这种情况，强烈推荐使用 fs.createWriteStream。
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// 写入 buffer 到 fd 指定的文件。
// offset 决定 buffer 中被写入的部分，length 是一个整数，指定要写入的字节数。

// position 指向从文件开始写入数据的位置的偏移量。 如果 typeof position !== 'number'，则数据从当前位置写入。详见 pwrite(2)。

// 回调有三个参数 (err, bytesWritten, buffer)，其中 bytesWritten 指定从 buffer 写入了多少字节。
var fs = require('fs');
// fs.open(path, flags[, mode], callback)
    // path <string> | <Buffer> | <URL>
    // flags <string> | <number>
    // mode <integer> Default: 0o666
    // callback <Function>
    // err <Error>
    // fd <integer>
// fs.open('./file.txt','r',function(err,fd){
//     if( err ){
//         console.log(err);
//     }
//     // var buf = new Buffer(225);
//     //读取fd文件内容到buf缓存区, 093:0:决定 buffer 中被写入的部分， 9:指定要写入的字节数。3:从文件开始写入数据的位置的偏移量
//     // fs.read(fd,buf,0,9,3,function(err,bytesRead,buffer){
//     //     console.log(buf.slice(0,bytesRead).toString());
//     // }); 
//     // var buff = new Buffer(225);
//     // //位置设置为null会默认从文件当前位置读取
//     // fs.read(fd,buff,0,3,null,function(err,bytesRead,buffer){
//     //     console.log(buff.slice(0,bytesRead).toString());
//     // });

//     var buffer = new Buffer(225);
//     //同步方法读取文件
//     var bytesRead = fs.readFileSync(fd,buffer,0,9,3);
//     console.log(bytesRead);
//     console.log(buffer.slice(0,bytesRead).toString());
// });
// -------------------------
// 这个会自动生成。log.txt
// var log = fs.createWriteStream('log.txt', {'flags': 'a'});
// // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
// log.end("this is a message");

// --------------
// fs.appendFile('message.txt', 'data to append', function (err) {

// });

//  同步地读取一个文件的全部内容。
// fs.readFileSync(path[, options])
//         path <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符
//         options <Object> | <string>
//         encoding <string> | <null> 默认 = null
//         flag <string> 默认 = 'r'

var a = fs.readFileSync('file2.txt', 'utf8');

console.log( process.config )
