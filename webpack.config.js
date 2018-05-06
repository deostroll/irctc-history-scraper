var path = require('path');
var absolutify = p => path.resolve(path.join(__dirname, p));
var mode = 'development';
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
    {
        mode,
        entry: './src/sidebar/main.js',
        output: {
            path: absolutify('./dist/sidebar')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['env']
                    }
                },
                {
                    test: /\.scss$/,
                    loader: 'style-loader!css-loader!sass-loader'
                },                
            ]
        },        
        devtool: 'cheap-source-map',

    },
    {
        mode,
        
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: absolutify('src/sidebar/main.html'),
                    to: absolutify('dist/sidebar')
                }
            ])
        ],

    },
    {
        mode,
        
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: absolutify('src/manifest.json'),
                    dist: absolutify('dist/mainfest.json')
                }
            ])
        ],

    }
];