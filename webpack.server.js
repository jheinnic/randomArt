// webpack.config.js 
 
module.exports = {
    entry: './server/server.js',
    output: {
        path: __dirname,
        filename: 'build/server/server.js'
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' } // Be careful, the JSON loader is required 
        ]
    }
};
