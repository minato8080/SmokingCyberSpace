const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
dotenv.config();
// dotenv.config({ path: '.env.develop' });

module.exports = {
  entry: "./client/src/js/index.js", // エントリーポイント
  output: {
    filename: "index.js", // 出力ファイル名
    path: path.resolve(__dirname, "client/public/dist"), // 出力先ディレクトリ
    clean: true, // ビルド前にdistフォルダをクリーンアップ
  },
  resolve: {
    alias: {
      "@": __dirname, // '@'エイリアスをルートディレクトリに設定
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // 省略可能な拡張子
  },
  module: {
    rules: [
      {
        test: /\.css$/, // CSSファイルに対するルール
        use: ["style-loader", "css-loader"], // CSSを読み込むためのローダー
      },
      {
        test: /\.js$/, // JavaScriptファイルを対象
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Babelを使用してトランスパイル
          options: {                //Babelの設定
            presets: ['@babel/preset-env']
          }
        },
      },
    ],
  },
  plugins: [
    // 環境変数を読み込む
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    // htmlをdistフォルダにコピー
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "client/src/index.html",
          to: "",
          transform(content) {
            return content
              .toString()
              .replace(/%(.*)%/g, (match, p1) => process.env[p1] ?? match);
          },
        },
      ],
    }),
  ],
  mode: "development", // 開発モード
};
