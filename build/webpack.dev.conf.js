const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const env={
  NODE_ENV:JSON.stringify('development')
};
if(process.env.MOCK){
  env.MOCK = process.env.MOCK
}
const devConfig = merge(baseConfig, {
  plugins:[
    new webpack.DefinePlugin({
      'process.env':env
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
});

module.exports = devConfig;
