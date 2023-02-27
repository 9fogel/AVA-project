const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    // devtool: 'eval-source-map',
    devServer: {
        static: path.resolve(__dirname, '../dist'),
    },
};
