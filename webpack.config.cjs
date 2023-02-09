const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './client/src/index.tsx'), 
  mode: 'production',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './client/src/index.html' 
    })
  ],

  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'] 
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', ["@babel/preset-react", {"runtime": "automatic"}], '@babel/preset-typescript']
            }
        }
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: ["file-loader"],
    },
    ]
  },
  devServer: {
    static: {
      publicPath: '/dist',
      directory: path.resolve(__dirname, 'dist')
    },
    proxy: {
      '/api': 'http://localhost:3000',
      '/graphql': 'http://localhost:3000',
      '/clearCache': 'http://localhost:3000/',
			'/redis': 'http://localhost:3000/'
    }
  },
  performance: {
    hints: false
  },
  resolve: {
    fallback: {
      "fs": false
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.react.js'],
},
}