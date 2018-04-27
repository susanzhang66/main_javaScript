const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');  // 清理 /dist 文件夹

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');   //精简代码 js

// vue-loader 的配置
var vueLoaderConfig = require('./vue-loader-conf')

module.exports = {
  devtool: 'inline-source-map',   //开发调试 选项 ,eval-source-map
  // devtool: 'inline-source-map',  JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。只适用于开发环境哦。
  // entry:  __dirname + "/src/index.js",//已多次提及的唯一入口文件
    entry: {
      app: './src/index.js',     //这种好处是在 可以生成对应的 js，而不必生成一个混合不好调试的js.bundel.js
      // print: './src/print.js',
      vendor: [   // 缓存，－－ 常不该动的 配置。比如 第三方库。
       'lodash'   
     ]
    },
    output: {
      chunkFilename: '[name].bundle.js',  //动态导入。import,  require-ensure
      filename: '[name].[hash].js',  //[name].[hash].js 解决缓存问题 每次文件名会发生变化。[name].bundle.js
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'    //会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
    },
  // output: {
  //   path: __dirname + "/dist",//打包后的文件存放的地方
  //   filename: "bundle.js"//打包后输出文件的文件名
  //   // publicPath: process.env.NODE_ENV === 'production'  publicPath 这个字段是 使用 CDN 和资源 hash 的复杂示例：
  //   //   ? config.build.assetsPublicPath
  //   //   : config.dev.assetsPublicPath
  // },
// 注：“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
  devServer: {   //devServer 这个是本地服务器选项
  	port: "8081",
    contentBase: "./dist",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    hot: true     // Hot Module Replacement实时刷新插件
  },
  module: {   //这里是 处理 loader, Babel的。 一个javescript编译功能。
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    // options: {      这一块配置babel的信息，抽离出来另一个模块了。
                    //     presets: [
                    //         "es2015", "react"
                    //     ]
                    // }
                },
                exclude: /node_modules/
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: vueLoaderConfig
            },
            {
                test: /\.css$/,   //处理babel功能的  样式
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true     //这个选项配置，可以用于 css当作模块化引用。import命令引入。
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,   //js,css引入的import 图片，会自动处理图片的路径，
                use: [
                    'file-loader'    //js,css引入的import 图片，会自动处理图片的路径，
                ]
            },
            {
                 test: /\.(woff|woff2|eot|ttf|otf)$/,   //加载字体。
                 use: [
                   'file-loader'
                 ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),  // 清理 /dist 文件夹
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html",//new 一个这个插件的实例，并传入相关的参数,利用了模板。
            title: 'Output Management'     //暂时没发现 有什么作用了。。
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({  //缓存，－－ 常不该动的 配置。比如 第三方库。
           name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({   //CommonsChunkPlugin可以用于将模块分离到单独的文件中,能够在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中：
           name: 'runtime'  //提取出来的是runtime....** js
        }),
        // new UglifyJSPlugin(),   //压缩
        new webpack.HotModuleReplacementPlugin()//热加载插件 , 这个要加上webpack的api可能才能有功效。待跟进。
        
    ], 
}
//HtmlWebpackPlugin简化了HTML文件的创建，以便为您的webpack包提供服务。 这对于在文件名中包含每次会随着变异会发生变化的哈希的webpack bundle尤其有用。 您可以让插件为您生成一个HTML文件，使用lodash模板提供您自己的模板，或使用您自己的loader。

// 清理 /dist 文件夹

