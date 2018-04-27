// zlib
// zlib模块提供通过 Gzip 和 Deflate/Inflate 实现的压缩功能
// 压缩或者解压数据流(例如一个文件)通过zlib流将源数据流传输到目标流中来完成。


const zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');
const inp = fs.createReadStream('./tem/input');
const out = fs.createWriteStream('./tem/input.gz');

inp.pipe(gzip).pipe(out);