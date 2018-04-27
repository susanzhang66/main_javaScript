const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./express_devWebpackConfig.js');
const compiler = webpack(config);

var { StaticServlet } = require('./StaticServlet')

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

var sevlet = new StaticServlet();
// app.use('/mockData/*', sevlet.handleRequest);
//这个我处理 ajax,的mock数据。
app.use('/mockData/*', function(req, res) {

  req.url = req.originalUrl;
  // path.join(__dirname, '..', '/mockData');
  req.url = sevlet.parseUrl_(req.url);

  sevlet.handleRequest(req, res);

});

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});