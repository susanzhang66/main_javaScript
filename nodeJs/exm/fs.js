//readFile(path,[options],function(err,data){});

var fs= require("fs");
fs.readFile('./file.txt',function(err,data){
    if(err){
        console.log("bad")
    }else{
        console.log("ok");
        console.log(data);
        console.log(data.toString());
        }
})