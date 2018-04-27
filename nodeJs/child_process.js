// 当父进程和子进程之间建立了一个 IPC 通道时（例如，使用 child_process.fork()），subprocess.send() 方法可用于发送消息到子进程。 当子进程是一个 Node.js 实例时，消息可以通过 process.on('message') 事件接收。

const subprocess = require('child_process').fork('subprocess.js');

const server = require('net').creatServer();

server.on('connetion', (socket) => {
	subprocess.send('server', server);
})

// 子进程接收 server 对象如下：

subprocess.on('message', (m, server) => {

	if( m === 'server' ){
		server.on('connetion', ( socket ) => {

			socket.end('被子进程处理');

		})
	}

})