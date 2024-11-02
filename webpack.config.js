const path = require('path');
const webpack = require('webpack');
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
			new CopyPlugin({
				patterns: [
					{ from: 'src/index.html', to: 'index.html' },
					{ from: 'assets/**/*' },
					{
						from: 'arenas/**/*.(png|jpg|jpeg|gif|svg|html|css|gltf|glb|ico)',
						context: 'src/'
					}
				],
			}),
		],
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
		},
		optimization: {
			splitChunks: {
				chunks: 'initial',
				name: 'acechase'
			},
		}
	}
}