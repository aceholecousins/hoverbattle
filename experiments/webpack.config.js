const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		renderstresstest: './experiments/renderstresstest/main.ts',
		gltf: './experiments/gltf/main.ts',
		overridecolor: './experiments/overridecolor/main.ts'
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
	devtool: 'source-map',
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: '**/*.(png|jpe?g|gif|svg|html|css|gltf|glb|ico)',
					context: 'experiments/'
				}
			],
		}),
	],
	output: {
		filename: '[name]/[name].js',
		path: path.resolve(__dirname, '../dist/experiments'),
	},
};