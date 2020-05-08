const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		renderstresstest: './experiments/renderstresstest/main.ts',
		gltf: './experiments/gltf/main.ts',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif|svg|html|css|gltf|glb)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							regExp: /\/(?:src|experiments)\/(.*)/, //Will put the assets in the exact same sub folders starting from src or experiments
							name: '[1]',
						},
					},
				],
			},
		],
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin(),
	],
	output: {
		filename: '[name]/[name].js',
		path: path.resolve(__dirname, '../dist/experiments'),
	},
};