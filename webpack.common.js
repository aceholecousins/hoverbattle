const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		acechase_ui: './src/ui_main.ts',
		acechase_engine: './src/engine_main.ts', 
		assets: './src/assets.ts',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif|svg|html|css)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							regExp: /.*\/src\/(.*)/, //Will put the assets in the exact same sub folders starting from src
							name: '[1]',
						},
					},
				],
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
        })
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