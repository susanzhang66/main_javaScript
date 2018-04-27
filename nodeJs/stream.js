// const声明一个只读的常量。一旦声明，常量的值就不能改变。
// const http = require('http');

// const server = http.createServer( (req, res) => {
// 	// req 是 http.IncomingMessage 的实例，这是一个 Readable Stream
//   	// res 是 http.ServerResponse 的实例，这是一个 Writable Stream

//   	let body = '';
//   	// 接收数据为 utf8 字符串，
//     // 如果没有设置字符编码，将接收到 Buffer 对象。
//   	req.setEncoding('utf8');
//   	// 如果监听了 'data' 事件，Readable streams 触发 'data' 事件 
//   	req.on('data', ( chunk ) => {
//   		body += chunk;
//   	})

//   	req.on('end', ()=>{
//   		try {
//   			const data = JSON.parse(body);

//   			res.write(typeof data);
//   			res.end();
//   		}catch( er ){
//   			res.statusCode = 400;
//   			return res.end(`error:${er.message}`);
//   		}
//   	})
// })

// server.listen( 1337 );

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token o in JSON at position 1

// 'drain' 事件
// 如果调用 stream.write(chunk) 方法返回 false，流将在适当的时机触发 'drain' 事件，这时才可以继续向流中写入数据。

// 向可写流中写入数据一百万次。
// 需要注意背压 （back-pressure）。
// function writeOneMillionTimes(writer, data, encoding, callback) {
//   let i = 1000000;
//   write();
//   function write() {
//     let ok = true;
//     do {
//       i--;
//       if (i === 0) {
//         // 最后 一次
//         writer.write(data, encoding, callback);
//       } else {
//         // 检查是否可以继续写入。 
//         // 这里不要传递 callback， 因为写入还没有结束！   ok 还未处于drain状态，会返回false.
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       // 这里提前停下了， 
//       // 'drain' 事件触发后才可以继续写入  
//       writer.once('drain', write);
//     }
//   }
// }

// 'pipe' 事件

// const writer = getWritableStreamSomehow();
// const reader = getReadableStreamSomehow();
// writer.on('pipe', (src) => {
//   console.error('something is piping into the writer');
//   assert.equal(src, reader);
// });
// reader.pipe(writer);
// reader.unpipe(writer);  // 这个会触发 unpipe事件


//－－－－－－－－－可读流三种状态：
// const { PassThrough, Writable } = require('stream');
// const pass = new PassThrough();
// const writable = new Writable();

// pass.pipe(writable);
// pass.unpipe(writable);
// // flowing 现在为 false

// pass.on('data', (chunk) => { console.log(chunk.toString()); });
// pass.write('ok'); // 不会触发 'data' 事件
// pass.resume(); // 只有被调用了才会触发 'data' 事件


//----stream.Readable 类,readable.pipe 将数据写入目标。

// const fs = require('fs');
// const readable = getReadableStreamSomehow();
// const writable = fs.createWriteStream('file.txt');
// // readable 中的所有数据都传给了 'file.txt'
// readable.pipe(writable);
// // -----------------
// reader.pipe(writer, { end: false });
// reader.on('end', () => {
//   writer.end('Goodbye\n');
// });

// -----------readable.unpipe([destination]) ------将之前通过stream.pipe()方法绑定的流分离
// const readable = getReadableStreamSomehow();     //  todo.......getReadableStreamSomehow这个函数干嘛呢。
// const writable = fs.createWriteStream('file.txt');
// // All the data from readable goes into 'file.txt',
// // but only for the first second
// readable.pipe(writable);
// setTimeout(() => {
//   console.log('Stop writing to file.txt');
//   readable.unpipe(writable);
//   console.log('Manually close the file stream');
//   writable.end();
// }, 1000);



//-----------一个数流的例子--------------------

const { Readable } = require('stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = '' + i;
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}



