const gitRevision = require('git-revision');

const path = require('path');
//每次构建前都清楚 dist 文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//公共插件 使用模板生成html文件, 这个html文件会自动引用出口文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
//生产模式使用分离css代码插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 


let ROOT_PATH = path.resolve(__dirname, '../');

let fs = require('fs');
let pages = require(`${ROOT_PATH}/pages.js`);
// console.log('pages--', pages);
//定义一个 entrys 动态添加入口文件
const entrys = {}; 
//定义一个 htmlCfg 动态添加入口文件配置
const htmlCfgs = []; 

//遍历扫描到的页面模板路径
pages.forEach((page) => { 
    let name  = page.name;
    //动态配置入口文件路径
    entrys[name] = './src/modules/' + name + '/' + name + '.js'; 
    htmlCfgs.push( //动态配置入口文件插件
        new HtmlWebpackPlugin({
            //本地模板文件的位置
            template: `${ROOT_PATH}/template.ejs`, 
            //允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的chunk注入到模板中。
            //在配置多个页面时，每个页面注入的chunk应该是不相同的，需要通过该配置为不同页面注入不同的chunk；
            chunks: [name , 'commons'], 
            //输出文件的文件名称
            filename: `${name}.html`,
            //模版信息
            name: name,
            title: page.title,
            favicon: './src/assets/favicon.ico',
            banner: {
                branch: gitRevision('branch'),
                tag: gitRevision('tag'),
                date: new Date().toLocaleString(),
            },
        })
    )
});
//最后把要使用的插件放进去
htmlCfgs.push(
    new CleanWebpackPlugin()
); 

// console.log('process.env.NODE_ENV--：', process.env.NODE_ENV);
// console.log('htmlCfgs--：', htmlCfgs);

module.exports = {
    mode: process.env.NODE_ENV ? 'production' : 'development',
    entry: entrys,
    output: {
        path: path.join(__dirname, '../dist'),
        //根据入口文件分为不同出口文件
        filename: process.env.NODE_ENV ? 'js/[name].[chunkhash].js' : 'js/[name].js', 
        //基本上都是在require.ensure去加载模块的时候才会出现，chunkFileName，
        //个人理解是cmd和amd异步加载，而且没有给入口文件时，会生成了no-name的chunk，
        //chunkFileName一般都会是[id].[chunkhash].js,也就是这种chunk的命名一般都会是0.a5898fnub6.js.
        //http://react-china.org/t/webpack-output-filename-output-chunkfilename/2256/2；
        //https://segmentfault.com/q/1010000017880203
        chunkFilename : process.env.NODE_ENV ? 'js/[id].[chunkhash].js' : 'js/[id].js',
    },
    resolve:{
        // 数组 可以配置多个 强制指定寻找第三方模块的目录 使得查找更快
        modules:[path.resolve('node_modules')],  
        //别名配置  import xxx from 'src/xxx' ---> import xxx from '@/xxx'
        alias:{  
            '@': `${ROOT_PATH}/src`,
            '@commons': `${ROOT_PATH}/src/commons`,
        },
        // 自动添加后缀   加载模块时候依次添加后缀 直到找到为止
        extensions:['.css','.js','.json','.jsx'] 
    },
    module: {
        //公共配置加载器
        rules: [ 
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules|packages/,  exclude代表不需要进行 loader 的目录
                //include代表需要进行 loader 的目录
                include: path.resolve(__dirname, "../src"), 
                use: 'babel-loader'
            },
            {
                test: /\.less$/,
                //include代表需要进行 loader 的目录
                include: path.resolve(__dirname, "../src"), 
                use: [
                    //生产模式使用分离代码插件, 开发模式不使用
                    process.env.NODE_ENV ? MiniCssExtractPlugin.loader : 'style-loader', 
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: htmlCfgs
};