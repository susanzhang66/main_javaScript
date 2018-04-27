// 'connect' 事件，

const http = require('http');
const net = require('net');
const url = require('url');

//创建一个http 代理服务器
const proxy = http.createServer( (req, res) => {
	 res.writeHead(200, { 'Content-Type': 'text/plain' });
  	 res.end('okay');
})

proxy.on('connect', (req, cltSocket, head) => {
		 // 连接到一个服务器
	 const srvUrl = url.parse(`http://${req.url}`);

	 console.log( srvUrl );

	 //输出： Url {
		//   protocol: 'http:',
		//   slashes: true,
		//   auth: null,
		//   host: 'localhost',
		//   port: null,
		//   hostname: 'localhost',
		//   hash: null,
		//   search: null,
		//   query: null,
		//   pathname: '/',
		//   path: '/',
		//   href: 'http://localhost/' }
	 const srvSocket = net.connect(80, srvUrl.hostname, () => {
	 	//cltSocket， srvSocket 什么意思？？
	    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
	                    'Proxy-agent: Node.js-Proxy\r\n' +
	                    '\r\n');
	    srvSocket.write(head);
	    srvSocket.pipe(cltSocket);
	    cltSocket.pipe(srvSocket);
	});
})

proxy.listen(1337, '127.0.0.1', ()=> {
	 // 发送一个请求到代理服务器
	const options = {
	    port: 1337,
	    hostname: '127.0.0.1',
	    method: 'CONNECT',
	    path: 'localhost'
	};
	const req = http.request( options );
	req.end();

	req.on('connect', ( res, socket, head) => {
		console.log('已连接！');
		//通过代理服务器发送一个请求。
		socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.baidu.com\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');

		socket.on('data', (chunk) => {
			console.log('张彩凤张彩凤');
			console.log(chunk.toString());
		})
		socket.on('end', () => {
			proxy.close();
		})
	})
})





