net (网络)

net 模块提供了创建基于流的 TCP 或 IPC 服务器(net.createServer())和客户端(net.createConnection()) 的异步网络 API。

IPC(Inter-Process Communication)进程间通信，
提供了各种进程间通信的方法。在Linux C编程中有几种方法
(1) 半双工Unix管道
　　(2) FIFOs(命名管道)
　　(3) 消息队列
　　(4) 信号量
　　(5) 共享内存
　　(6) 网络Socket

net.Server 类
// 这个类用于创建 TCP 或 IPC server。
// net.Server is an EventEmitter实现了以下事件:
'close' 事件
'connection' 事件
'error' 事件
'listening' 事件



net.Socket 类  －－ EventEmitter。
// net.Socket可以被用户创建并直接与server通信。举个例子，它是通过net.createConnection()返回的，所以用户可以使用它来与server通信。
// 当一个连接被接收时，它也能被Node.js创建并传递给用户。比如，它是通过监听在一个net.Server上的'connection'事件触发而获得的，那么用户可以使用它来与客户端通信。

net.connect()

net.createConnection()

net.createServer([options][, connectionListener])

net.isIP(input)

net.isIPv4(input)

net.isIPv6(input)