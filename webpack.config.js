const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const path = require('path');

const package = require('./package.json');

module.exports = {
    entry: {
        "annihilation": './src/annihilation.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: "ejs-loader",
                        options: {
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
					{
						loader: 'css-loader',
					},
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.ejs",
            scriptLoading: "blocking",
            inject: "head",
            minify: false,
            templateParameters: {
                name: package.name,
                version: package.version
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/favicon.ico', to: 'favicon.ico' },
                { from: './src/assets', to: 'assets' },
            ]
        })
    ]
};