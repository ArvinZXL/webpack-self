const path = require("path");
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除文件

const isProd = process.env.NODE_ENV === 'production';//判断是开发环境还是生产环境
const cssDev = ["style-loader","css-loader","postcss-loader","sass-loader"];//开发环境css配置
const cssProd = ExtractTextPlugin.extract({//生产环境css配置
    fallback: "style-loader",
    use:["css-loader","postcss-loader","sass-loader"]
})
const cssConfig = isProd?cssProd:cssDev;

module.exports = {
	//__dirname是nodejs里的一个全局变量，它指向的是我们项目的根目录
	//入口文件的位置
	entry: {
		main: './main.js',
        content: './content.js'
	},
	output: {
		//打包后的文件名称
		filename: '[name].[hash].js',
		//打包后的文件存放位置
		path: path.resolve(__dirname, './dist'), 
		//`path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径。
	},
	module: {
		rules: [
			// {
			// 	//用正则表达式匹配要用该Loader转换的文件
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		{
			// 			loader: 'css-loader',
			// 			options: {
			// 				minimize:true,//高速Loader要开启Css压缩
			// 			}
			// 		}
			// 	],
			// },
			{
				//用正则表达式匹配要用该Loader转换的文件
				test: /\.json$/,
				use: ['json-loader'],
			},
            {
                test: /\.scss$/,
                use: cssConfig
			},
            {
                test: /\.pug/,
                use: ['raw-loader', 'pug-html-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            }
		]
	},
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new htmlWebpackPlugin({
        	/*当指定了chunks属性，webpack会按照这个属性定义的数组，
        	将数组中所有片段完成打包，并用script标签将打包的js插入到生成的页面中，
        	没有在数组中的片段，则不插入页面,数组定义为”entry“定义的数组名称！*/
            chunks:['main'],
            filename:'index.html',//生成的文件名称
            template:'./index.tmpl.html', //html模板路径
            title:'webpack is good',
            minify:{
            	collapseWhitespace:false//网页去除空格
            },
            hash:true//用于文件不被缓存
        }),
        new htmlWebpackPlugin({
            chunks:['content'],
            filename:'content.html',//生成的文件名称
            template:'./content.tmpl.html', //html模板路径
            title:'webpack is content',
            minify:{
                collapseWhitespace:false//网页去除空格
            },
            hash:true//用于文件不被缓存
        }),
        new htmlWebpackPlugin({//用于pug
            chunks:['content'],
            filename:'pug.html',//生成的文件名称
            template:'./pug.pug', //html模板路径
            title:'webpack is pug',
            minify:{
                collapseWhitespace:false//网页去除空格
            },
            hash:true//用于文件不被缓存
        }),
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: !isProd,//是否开启
        }),
        new CleanWebpackPlugin(['./dist']),//清除文件
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer:{
    	contentBase:'./dist',//本地服务器加载的页面所在的目录
    	inline:true,//设置实时刷新
        hot:true
    }
};