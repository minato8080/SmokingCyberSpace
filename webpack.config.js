const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
dotenv.config(); // .envファイルから環境変数を読み込む

module.exports = {
  entry: "/client/src/js/index.js", // エントリーポイント
  output: {
    filename: "index.js", // 出力ファイル名
    path: path.resolve(__dirname, "dist"), // 出力先ディレクトリ
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
        },
      },
    ],
  },

  plugins: [
    // 環境変数を読み込む
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    // publicフォルダの内容をdistフォルダにコピー
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "client/public",
          to: "",
          transform(content) {
            return content
              .toString()
              .replace(/\%(.*)\%/g, (_match, p1) => process.env[p1]);
          },
        },
      ],
    }),
  ],
  mode: "development", // 開発モード
};
