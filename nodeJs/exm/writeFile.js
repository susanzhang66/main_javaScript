// writeFile(filename,data,[options],callback)

// wrtieFileSync(filename,data,[options])

// filename：要写入的文件

// data：写入文件的数据可以是字符串，可以是buffer

// options：flag：对写入文件的操作默认为w，encoding：编码，mode：权限

// callback：回调函数



//writeFile 异步地写入数据到文件，如果文件已经存在，则替代文件。 data 可以是一个字符串或一个 buffer。

// 如果 data 是一个 buffer，则忽略 encoding 选项。它默认为 'utf8'。


// 注意，多次对同一文件使用 fs.writeFile 且不等待回调，是不安全的。 对于这种情况，强烈推荐使用 fs.createWriteStream。


// var fs = require("fs");
// var data="这个文字会覆盖原来的文字。";
// fs.writeFile('./wfile.txt',data,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
//      if(err){
//          console.log("文件写入失败");
//      }else{
//          console.log("文件写入成功");

//      }

// }) 


//--------------------------
// var fs = require("fs");
// var data="这个在文档后面追加文字。-追加";
// fs.writeFile('./wfile.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
//      if(err){
//          console.log("文件写入失败")
//      }else{
//          console.log("文件追加成功");

//      }

// }) 


// 添加数据
var fs = require("fs");
fs.appendFile('wfile.txt', '添加数据，默认 utf8 格式', function (err) {
  if (err) throw err;
  console.log('添加完成');
});



