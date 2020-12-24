const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    node: 'current'
                }
            }
        ]
    ],
    babelrc: false,
    configFile: false
});