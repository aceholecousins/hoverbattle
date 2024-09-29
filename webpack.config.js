const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
	return {
		entry: {
			acechase: './src/main.ts',
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
		mode: argv.mode,
		devtool: 'source-map',
		resolve: {
			modules: [
				path.resolve(__dirname, 'src'),
				'node_modules'
			],
			extensions: ['.tsx', '.ts', '.js'],
		},
		plugins: [
			new CleanWebpackPlugin(),
			new CopyPlugin({
				patterns: [
					{
						from: '**/*.(png|jpg|jpeg|gif|svg|html|css|gltf|glb|ico|js|ogg)',
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
				name: 'acechase'
			},
		}
	}
}