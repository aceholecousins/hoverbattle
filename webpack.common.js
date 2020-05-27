const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		acechase_ui: './src/ui_main.ts',
		acechase_engine: './src/engine_main.ts',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin(),
		//This is necessary in order to import the common lib into the worker file
		new webpack.BannerPlugin({
			banner: `var window = self;importScripts("./acechase_lib.js");`,
			raw: true,
			entryOnly: true,
			test: "acechase_engine.js"
		}),
		new CopyPlugin({
			patterns: [
				{
					from: '**/*.(png|jpe?g|gif|svg|html|css|gltf|glb|ico)',
					context: 'src/'
				}
			],
		}),
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		splitChunks: {
			chunks: 'initial',
			name: 'acechase_lib'
		},
	},
};