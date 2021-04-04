
var path = require('path');

module.exports = {
	mode: "development",
	entry: "./src/game.js",
	output: {
		filename: "phaser-game1.js",
		path: path.resolve(__dirname, "./public"),
		libraryTarget: "umd"
	},
	devServer: {
		contentBase: path.resolve(__dirname, "./public"),
		compress: true,
		port: 9090
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				],
			},
		]
	}
}
