"use strict";

// 環境変数を読み込む
const dotenv = require("dotenv");
dotenv.config();
// dotenv.config({ path: '.env.develop' });

const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const helmet = require("helmet");

const { APP } = require("../common/const");
const { initializeConnectionService } = require("../services/connectionService");
const { initializeFrameService } = require("../services/frameService");
const { fetchRequests } = require("../dbaccess/mongodbBusiness");

// Expressアプリケーションを作成
const app = express();
// HTTPサーバーを作成
const server = createServer(app);

// 新しい接続があった時のイベントハンドラを設定
const dbAccessPool = initializeConnectionService(server);

// ゲームの更新フレームを設定
initializeFrameService();

// データベースからリクエストリストを取得
fetchRequests(dbAccessPool);

// CSP設定
// Node.jsのバージョンを確認
const nodeVersion = process.versions.node;
const requiredVersion = "18.0.0";
if (nodeVersion > requiredVersion) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "https:"],
          connectSrc: ["'self'", "data:", "https://www.youtube.com/"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "https:", "'unsafe-eval'"],
        },
      },
    })
  );
} else {
  console.error(
    `Node.js ${requiredVersion} 以上が必要です。現在のバージョン: ${nodeVersion}`
  );
}

// publicフォルダを静的ファイルとして提供
app.use(express.static(path.join(APP.ROOT, "client/public")));

// ルートパスへのGETリクエスト
app.get("/", (_request, response) => {
  console.log(__dirname);
  response.sendFile(path.join(APP.ROOT, "client/public/dist/index.html"));
});

// サーバーを指定されたポートで起動
server.listen(process.env.PORT ?? 8080, function () {
  console.log(`Starting server on port ${process.env.PORT ?? 8080}`);
});
