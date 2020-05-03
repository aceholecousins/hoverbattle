const path = require('path');
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
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
};