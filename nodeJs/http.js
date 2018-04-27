http.Agent 类
http.ClientRequest 类
http.Server 类
http.ServerResponse 类
http.IncomingMessage 类

http.METHODS
http.STATUS_CODES
http.createServer([requestListener])
http.get(options[, callback])
http.globalAgent
http.request(options[, callback])



// http.Agent 类
// Agent 负责为 HTTP 客户端管理连接的持续与复用。
// 它为一个给定的主机与端口维护着一个等待请求的队列，且为每个请求重复使用一个单一的 socket 连接直到队列为空，此时 socket 会被销毁或被放入一个连接池中，在连接池中等待被有着相同主机与端口的请求再次使用。 是否被销毁或被放入连接池取决于 keepAlive 选项。

// 当 socket 触发 'close' 事件或 'agentRemove' 事件时，它会被移出代理。



http.get(options, (res) => {
  // 处理事情
}).on('socket', (socket) => {
	//移除代理
  socket.emit('agentRemove');
});


http.get({
	hostname:'',
	port: 80,
	path: '/',
	agent: false   //一次性使用的 Agent
}, ( res ) => {
   //响应请求。
})


// options <Object> 代理的配置选项。有以下字段：
// keepAlive <boolean> 保持 socket 可用即使没有请求，以便它们可被将来的请求使用而无需重新建立一个 TCP 连接。默认为 false。
// keepAliveMsecs <number> 当使用了 keepAlive 选项时，该选项指定 TCP Keep-Alive 数据包的 初始延迟。 当 keepAlive 选项为 false 或 undefined 时，该选项无效。 默认为 1000。
// maxSockets <number> 每个主机允许的最大 socket 数量。 默认为 Infinity。
// maxFreeSockets <number> 在空闲状态下允许打开的最大 socket 数量。 仅当 keepAlive 为 true 时才有效。 默认为 256。

// 若要配置以上选项 要自定义 Agent实例

const http = require('http');
const keepAliveAgent = new http.Agent({keepAlive: true});

options.agent = keepAliveAgent;

http.request( options, onResponseCallback )

//createConnection 创建一个用于 HTTP 请求的 socket 或流。该函数类似于 net.createConnection()
agent.createConnection(options[, callback])

// keepSocketAlive 在 socket 被请求分离的时候调用, 可能被代理持续使用. 默认行为:
agent.keepSocketAlive(socket)

// 销毁当前正被代理使用的任何 socket。
agent.destroy()
agent.maxSockets
// 返回一个对象，包含还未被分配到 socket 的请求队列。 不要修改。
agent.requests
// 返回一个对象，包含当前正被代理使用的 socket 数组。 不要修改。
agent.sockets





http.ClientRequest 类
// 该对象在 http.request() 内部被创建并返回。
// 注意： Node.js 不会检查 Content-Length 与已传输的请求主体的长度是否相等。
// 该请求实现了 可写流 接口。 它是一个包含以下事件的 EventEmitter：
'abort' 事件
// 每当服务器响应 CONNECT 请求时触发。 如果该事件未被监听，则接收到 CONNECT 方法的客户端会关闭连接。
'connect' 事件

'continue' 事件

'response' 事件

// 当 socket 被分配到请求后触发。
'socket' 事件

// 每当服务器响应 upgrade 请求时触发。 如果该事件未被监听，则接收到 upgrade 请求头的客户端会关闭连接。
'upgrade' 事件


还有request方法：

request.flushHeaders()





http.Server类（该类继承自 net.Server，且具有以下额外的事件：）
（  该类继承自 net.Server，且具有以下额外的事件：  ）

'checkContinue' 事件  
// －－－ 每当接收到一个带有 HTTP Expect: 100-continue 请求头的请求时触发。如果该事件未被监听，则服务器会自动响应 100 Continue。
// 注意，当该事件被触发且处理后，'request' 事件不会被触发。

'checkExpectation' 事件
// 每当接收到一个带有 HTTP Expect 请求头（值不为 100-continue）的请求时触发。 如果该事件未被监听，则服务器会自动响应 417 Expectation Failed。
'clientError' 事件

'close' 事件
// 当服务器关闭时触发。



http.ServerResponse 类
（该对象在 HTTP 服务器内部被创建。 它作为第二个参数被传入 'request' 事件。）
它是一个有以下事件的 EventEmitter：
'close' 事件
'finish' 事件

response.finished
返回一个布尔值，表示响应是否已完成。 默认为 false。 执行 response.end() 之后，该值会变为 true。


http.IncomingMessage 类
IncomingMessage 对象由 http.Server 或 http.ClientRequest 创建，并作为第一个参数分别递给 'request' 和 'response' 事件。 它可以用来访问响应状态、消息头、以及数据。
