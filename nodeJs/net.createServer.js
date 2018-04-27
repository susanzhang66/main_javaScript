const net = require('net');
const server = net.createServer((c) => {  // new net.Server()
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound', server.address() );
});

// Server.listen():以下可能的参数：
// server.listen(handle[, backlog][, callback])
// server.listen(options[, callback])
// server.listen(path[, backlog][, callback]) for IPC servers
// server.listen([port][, host][, backlog][, callback]) for TCP servers