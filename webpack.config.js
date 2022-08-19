const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.join(__dirname, 'examples', 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.dev.json'
        },
      }
    ],
  },
  devServer: {
    static: ['./examples/public'],
    historyApiFallback: true
  },
  resolve: {
    alias: {
      'smart-react-routing': path.join(__dirname, 'src')
    },
    modules: ['node_modules', path.join(__dirname, 'src'), path.join(__dirname, 'examples')],
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/public/index.html',
    }),
  ]
};
