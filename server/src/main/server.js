"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const pg = require("pg");

const { APP } = require("../common/const");
const global = require("../common/global");
const onConnection = require("../controller/onConnection");
const setUpdateFrame = require("../controller/setUpdateFrame");
const { datelog, weekhead } = require("../util/log");

// 環境変数を読み込む
require('dotenv').config();
// Expressアプリケーションを作成
const app = express();
// HTTPサーバーを作成
const server = http.Server(app);
// Socket.IOをサーバーにアタッチ
global.io = socketIO(server);
// PostgreSQLデータベース接続プールを作成
global.pool = new pg.Pool({ connectionString: process.env.POSTGERSS_KEY });

// 新しい接続があった時のイベントハンドラを設定
global.io.on("connection", onConnection);

// ゲームの更新フレームを設定
setUpdateFrame();

// データベースからリクエストリストを取得
global.pool
  .query(
    "SELECT videoid,name FROM requestlist WHERE $1 <= date AND date <= $2",
    [weekhead(), datelog()]
  )
  .then((res) => {
    // 取得したデータをグローバル変数に格納
    for (let i = 0; i < res.rows.length; i++) {
      global.requestlist.push(res.rows[i].videoid);
      global.whoserequest.push(res.rows[i].name);
    }
    console.log(global.requestlist);
  })
  .catch((e) => {
    // エラーハンドリング
    console.error("クエリエラー:", e.message);
    console.error(e.stack);
  });

// distフォルダを静的ファイルとして提供
app.use(express.static(path.join(APP.ROOT, "/dist")));

// ルートパスへのGETリクエストに対するハンドラ
app.get("/", (_request, response) => {
  console.log(__dirname);
  response.sendFile(path.join(APP.ROOT, "/dist/index.html"));
});

// サーバーを指定されたポートで起動
server.listen(process.env.PORT ?? 8080, function () {
  console.log(`Starting server on port ${process.env.PORT ?? 8080}`);
});
