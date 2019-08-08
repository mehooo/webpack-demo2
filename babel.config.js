let alias = require('./webpack.alias.js');

module.exports = {
    "presets": ["@babel/preset-react", "@babel/preset-env"],
    "plugins": ["@babel/plugin-transform-runtime"]
}
