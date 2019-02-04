const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: [
      "core-js/modules/es6.promise",
      "core-js/modules/es6.array.iterator",
      "@babel/polyfill",
      "./src/index.js"],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index_bundle.js',
        
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
        splitChunks: {
            chunks: 'all'
        }
      },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
                
            },
            {
                test: /\.(jpg | png | gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:{
                            name: '[path][name].[ext]',
                            context: '',
                            outputPath: './images'
                        }
                    },
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
         
        ]
    },
   
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html'
        }),
       /*  new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true
        }) */
    ]
}