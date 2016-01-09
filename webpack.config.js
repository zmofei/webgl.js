var path = require('path');

module.exports = {
    entry: {
        'index': './src/webgl.js',
        'example': './src/example.js',
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
}
