// options

// flag：文件的操作情况，r表示这个文件只读，w表示写入文件，a追加文件（常用的三个）

// encoding:读取文件用的编码，utf-8，base64，ascii我们不指定编码，那么返回的data为一个buffer

var fs= require("fs");
fs.readFile('./file.txt',{flag:'r+',encoding:'utf-8'},function(err,data){
    if(err){
        console.log("bad")
    }else{
        console.log("读取第一个文件成功");
        console.log(data);
        fs.readFile('./file2.txt','utf-8',function(err,data){
            if(err){
               console.log("读取第二个文件失败");
            }
            if(data){
                console.log("读取第2个文件成功");
                console.log(data);
            }
        })
        }
})