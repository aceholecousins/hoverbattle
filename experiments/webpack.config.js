const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		'alphamix/main.js': './experiments/alphamix/main.ts',
		'renderstresstest/main.js': './experiments/renderstresstest/main.ts',
		'gltf/main.js': './experiments/gltf/main.ts',
		'overridecolor/main.js': './experiments/overridecolor/main.ts',
		'pbr/main.js': './experiments/pbr/main.ts',
		'tint/main.js': './experiments/tint/main.ts',
		'buggy/main.js': './experiments/buggy/main.ts',
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
					from: '**/*.(png|jpg|jpeg|gif|svg|html|css|gltf|glb|ico|js)',
					context: 'experiments/'
				}
			],
		}),
	],
	output: {
		filename: '[name]',
		path: path.resolve(__dirname, '../dist/experiments'),
		clean: true,
	},
};