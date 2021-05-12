const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');

/* ========================================================================== */

function getPlugins(mode) {
	return mode === 'production'
		? [
				new CleanWebpackPlugin({
					cleanOnceBeforeBuildPatterns: ['**/*', '!.git/**']
				}),

				new MiniCssExtractPlugin({
					filename: 'css/main.[contenthash:8].css'
				}),

				new HtmlWebpackPlugin({
					inject: true,
					template: './src/index.html'
				})
		  ]
		: [
				new CleanWebpackPlugin(),

				new HtmlWebpackPlugin({
					inject: true,
					template: './src/index.html'
				})
		  ];
}

/* ========================================================================== */

module.exports = function build(env, args) {
	const devMode = args.mode !== 'production';
	console.log('IS IN DEV MODE? ', devMode);

	const entry = [
		require.resolve('./src/scripts/main.ts'),
		require.resolve('./src/styles/main.scss')
	];

	const plugins = getPlugins(args.mode);

	const config = {
		devServer: {
			compress: true,
			contentBase: path.join(__dirname, 'dist'),
			host: '0.0.0.0',
			hot: true,
			port: 1337,
			publicPath: path.resolve(__dirname, 'dist'),
			// Set watchContentBase to true to ensure HMR works when an included
			// HTML partial is changed.
			// watchContentBase: true,
			writeToDisk: true
		},

		devtool: devMode ? 'eval-source-map' : 'source-map',

		entry,

		mode: args.mode,

		module: {
			rules: [
				{
					exclude: /node_modules/,
					include: path.resolve(__dirname, 'src/styles'),
					test: /\.scss$/,
					use: [
						devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: devMode
							}
						}
					]
				},
				{
					exclude: /node_modules/,
					loader: 'babel-loader',
					test: /\.ts$/
				},
				{
					test: /\.html$/,
					use: [
						'html-loader',
						{
							loader: 'posthtml-loader',
							options: {
								plugins: [
									require('posthtml-include')({
										root: path.resolve(__dirname, 'src')
									})
								]
							}
						}
					]
				},
				{
					loader: 'url-loader',
					options: {
						limit: 8192
					},
					test: /\.ttf$/
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/,
					type: 'asset/resource'
				}
			]
		},

		output: {
			path: path.join(__dirname, 'dist'),
			chunkFilename: 'chunks/[id].js',
			filename: 'js/main.[contenthash:8].js',
			publicPath: ''
		},

		plugins,

		resolve: {
			extensions: ['.js', '.scss', '.ts'],
			modules: [
				path.resolve(__dirname, 'src'),
				path.resolve(__dirname, 'node_modules')
			],
			plugins: [new TsconfigPathsPlugin()]
		}
	};

	return config;
};
