/**
 * To configure webpack we need to know the 4 concepts: 1- entry point; 2- the output; 3- loaders; 4- plugins.
 * 1- Entry point: Where the webpack will start to bundling. It'll look for all the dependecies which it should bundle together.
 * 2- The output: Where to save the bundled file
 * 3- Loaders: Loaders in Webpack allow us to import or to load all kinds of different files. And more importantly, to also process them. Like converting SASS to CSS Code or covert ES6 code to ES5 JavaScript.
*/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['@babel/polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',    
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : 'css/style.css',
            chunkFilename: isDevelopment ? '[id].css' : 'css/[id].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDevelopment                            
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                loader: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment                            
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    }
    
};