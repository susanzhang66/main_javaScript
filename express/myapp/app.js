// 这个是express应用生成器生成的 脚手架 http://www.expressjs.com.cn/starter/generator.html

//这个应该是单独的 服务器中间件。
//这个一般是处理 返回的状态码
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// 存放模板的地方
app.set('views', path.join(__dirname, 'views'));
// 模板引擎
app.set('view engine', 'jade');
//https://www.cnblogs.com/chyingp/p/node-learning-guide-express-morgan.html  morgan的使用
//这里访问网站的时候，会在stdout中输出日志。
app.use(logger('dev'));
// 本函数返回只解析JSON的中间件,并且只作用于Content-Type请求头与type选项匹配的请求。此解析器可接收任何编码格式的body,支持自动解压gzip和压缩deflate编码。
// 此方法支持Express4.16.0及更新的版本，用于取代body-parser
// 在进过此中间件处理后，request对象中会添加body属性（如req.body
app.use(express.json());
//https://segmentfault.com/a/1190000012854696, 4.x的中文翻译。
// 进过此中间件处理后，会返回response对象中将包含body对象
app.use(express.urlencoded({ extended: false }));
//Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
