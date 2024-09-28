const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: '/client/src/js/index.js',  // エントリーポイント
  output: {
    filename: 'index.js',  // 出力ファイル名
    path: path.resolve(__dirname, 'dist'),  // 出力先ディレクトリ
    clean: true,  // ビルド前にdistフォルダをクリーンアップ
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // '@'エイリアスを'src'フォルダに設定
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 省略可能な拡張子
  },
  module: {
    rules: [
      {
        test: /\.css$/,  // CSSファイルに対するルール
        use: ['style-loader', 'css-loader'],  // CSSを読み込むためのローダー
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'client/public', to: '' },  // publicフォルダの内容をdistフォルダにコピー
      ],
    }),
  ],
  mode: 'development',  // 開発モード
};
