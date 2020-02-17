const path = require('path')

// 打包后自动生成index.html文件
const HtmlWebpackPlugin  = require('html-webpack-plugin')
//  将css文件单独打包
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 每次打包前会清除dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 导出webpack的配置对象，供其使用
module.exports = {
    "entry": './src/main.js',
    "output": {
        path: path.join(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    mode: 'development', // development or production

    // 配置loader，webpack只认识js和json
    module: {
        rules: [
            {
                // 实际处理顺序从右往左
                // css-loader让webpack能识别解析css文件
                // style-loader让解析后的css作用到页面上,通过js动态创建style标签插入到index.html的header中
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'],
                // 如果css文件很多或很大，会导致index.html文件很大，所以用mini-css-extract-plugin插件将css单独打包成一个文件
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    }, 
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [ 
                    {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../',
                    },
                }, 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {    
                        // url-loader如果不配置limit，会默认将所有图片都转换成base64字符串，会减少图片请求，但是如果图片太大，转成base64体积会增大30%
                        loader: 'url-loader',
                        options: {
                            // 小于8k的会转化成base64，大于8k的会单独发一次请求
                            limit: 8 * 1024,
                            name: '[name].[ext]',
                            // 打包输出路径
                            outputPath: 'images/',
                            // 静态资源的引用路径（css中访问图片）
                            publicPath: '../images/'
                        }
                    }
                ]
            },
            // 配置babel
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './public/index.html'}),
        new MiniCssExtractPlugin({filename: 'css/index.css'}),
        new CleanWebpackPlugin()
    ],
    devServer: {
        // 端口
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}