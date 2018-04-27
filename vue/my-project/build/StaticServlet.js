var fs = require('fs')
var url = require('url')
var path = require('path')

function StaticServlet() {}

StaticServlet.MimeMap = {
  'txt': 'text/plain',
  'html': 'text/html',
  'htm': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
};

var Default="index.html";
// StaticServlet属于处理输出
StaticServlet.prototype.handleRequest = function(req, res) {
  var self = this;
  console.log(req.path);
  var path = ('./' + req.url.pathname).replace('//','/').replace(/%(..)/g, function(match, hex){
    return String.fromCharCode(parseInt(hex, 16));
  });
  var parts = path.split('/');
  if (parts[parts.length-1].charAt(0) === '.')
    return self.sendForbidden_(req, res, path);
  //stat 文件的创建，修改，访问时间
  fs.stat(path, function(err, stat) {
    if (err)
      return self.sendMissing_(req, res, path);
    //目录
    if (stat.isDirectory()){
      //fs.exists通过检查文件系统来测试给定的路径是否存在。然后使用 true 或 false 为参数调用 callback。
      //推荐使用 fs.access() 代替 fs.exists()。
      fs.exists(path + Default,function(exists){
        if(exists){
          return self.sendFile_(req, res, path + Default);
        }else{
          return self.sendDirectory_(req, res, path);
        }
      });
      //文件
    }else{
      return self.sendFile_(req, res, path);
    }
  });
}
StaticServlet.prototype.parseUrl_ = function(urlString) {
  //url.parse() 方法会解析一个 URL 字符串并返回一个 URL 对象。
  var parsed = url.parse(urlString);
  // resolve：正确的URL地址。
  parsed.pathname = url.resolve('/', parsed.pathname);
  // format：返回一个WHATWG URL对象的可自定义序列化的URL字符串表达。
  return url.parse(url.format(parsed), true);
};


StaticServlet.prototype.sendError_ = function(req, res, error) {
  res.writeHead(500, {
    'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>Internal Server Error</title>\n');
  res.write('<h1>Internal Server Error</h1>');
  res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
  console.log('500 Internal Server Error');
  console.log(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function(req, res, path) {
  path = path.substring(1);
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>404 Not Found</title>\n');
  res.write('<h1>Not Found</h1>');
  res.write(
      '<p>The requested URL ' +
      escapeHtml(path) +
      ' was not found on this server.</p>'
  );
  res.end();
  console.log('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function(req, res, path) {
  path = path.substring(1);
  res.writeHead(403, {
    'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>403 Forbidden</title>\n');
  res.write('<h1>Forbidden</h1>');
  res.write(
      '<p>You do not have permission to access ' +
      escapeHtml(path) + ' on this server.</p>'
  );
  res.end();
  console.log('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendRedirect_ = function(req, res, redirectUrl) {
  res.writeHead(301, {
    'Content-Type': 'text/html',
    'Location': redirectUrl
  });
  res.write('<!doctype html>\n');
  res.write('<title>301 Moved Permanently</title>\n');
  res.write('<h1>Moved Permanently</h1>');
  res.write(
      '<p>The document has moved <a href="' +
      redirectUrl +
      '">here</a>.</p>'
  );
  res.end();
  console.log('301 Moved Permanently: ' + redirectUrl);
};

StaticServlet.prototype.sendFile_ = function(req, res, path) {
  var self = this;
  var file = fs.createReadStream(path);
  res.writeHead(200, {
    'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'application/json'
  });
  if (req.method === 'HEAD') {
    res.end();
  } else {
    file.on('data', res.write.bind(res));
    file.on('close', function() {
      res.end();
    });
    file.on('error', function(error) {
      self.sendError_(req, res, error);
    });
  }
};

StaticServlet.prototype.sendDirectory_ = function(req, res, path) {
  var self = this;
  if (path.match(/[^\/]$/)) {
    req.url.pathname += '/';
    var redirectUrl = url.format(url.parse(url.format(req.url)));
    return self.sendRedirect_(req, res, redirectUrl);
  }
  fs.readdir(path, function(err, files) {
    if (err)
      return self.sendError_(req, res, error);

    if (!files.length)
      return self.writeDirectoryIndex_(req, res, path, []);

    var remaining = files.length;
    files.forEach(function(fileName, index) {
      fs.stat(path + '/' + fileName, function(err, stat) {
        if (err)
          return self.sendError_(req, res, err);
        if (stat.isDirectory()) {
          files[index] = fileName + '/';
        }
        if (!(--remaining))
          return self.writeDirectoryIndex_(req, res, path, files);
      });
    });
  });
};

StaticServlet.prototype.writeDirectoryIndex_ = function(req, res, path, files) {
  path = path.substring(1);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  res.write('<!doctype html>\n');
  res.write('<title>' + escapeHtml(path) + '</title>\n');
  res.write('<style>\n');
  res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
  res.write('</style>\n');
  res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
  res.write('<ol>');
  files.forEach(function(fileName) {
    if (fileName.charAt(0) !== '.') {
      res.write('<li><a href="' +
          escapeHtml(fileName) + '">' +
          escapeHtml(fileName) + '</a></li>');
    }
  });
  res.write('</ol>');
  res.end();
};
function escapeHtml(value) {
  return value.toString().
      replace('<', '&lt;').
      replace('>', '&gt;').
      replace('"', '&quot;');
}

module.exports = {
    StaticServlet: StaticServlet
}