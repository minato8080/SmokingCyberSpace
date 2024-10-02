// const pg = require("pg");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { Server } = require("socket.io");
const { createLog } = require("../util/log");
const Player = require("../models/Player");
const { global } = require("../common/global");
const { APP } = require("../common/const");
const {
  fetchRequests,
  saveRequest,
  logChat,
  logRoomEntry,
  logRoomExit,
} = require("../dbaccess/mongodbBusiness");
// ファイルシステムが有効な場合、fsモジュールをインポート
if (APP.IS_FS) {
  const fs = require("fs");
}
/** @type {import('socket.io').Server|null} io - Socket.IOサーバーインスタンス */
let socketIO = null;

/**
 * @typedef {import('mongodb').MongoClient} MongoClient
 * @typedef {import('pg').Pool} Pool
 */

/**
 * YouTubeの動画リクエストを処理する関数
 * @param {Player} player - リクエストを送信したプレイヤーオブジェクト
 * @param {MongoClient|Pool} dbAccessPool - データベース接続プール
 */
const checkRequest = async (player, dbAccessPool) => {
  let videoId;
  const msg = player.msg;
  const pcUrl = "https://www.youtube.com/watch?v=";
  const mobileUrl = "https://m.youtube.com/watch?feature=youtu.be&v=";
  const appUrl = "https://youtu.be/";

  try {
    // PC版のURLをチェック
    if (msg.indexOf(pcUrl) !== -1) {
      videoId = msg.split(pcUrl)[1];
    }
    // モバイルブラウザのURLをチェック
    else if (msg.indexOf(mobileUrl) !== -1) {
      videoId = msg.split(mobileUrl)[1];
    }
    // モバイルアプリのURLをチェック
    else if (msg.indexOf(appUrl) !== -1) {
      videoId = msg.split(appUrl)[1];
    } else {
      return;
    }

    // クエリパラメータを除去
    videoId = videoId.split(/[&?]/)[0];

    // 正しいURLの形式（11文字）の場合、リクエストを処理
    if (videoId.length === 11) {
      // グローバルリストにリクエストを追加
      global.requestlist.push(videoId);
      global.whoserequest.push(player.nickname);
      // 全クライアントに更新されたリクエストリストを送信
      socketIO.sockets.emit(
        "musicresponse",
        global.requestlist,
        global.whoserequest
      );

      // データベースにリクエストを保存
      await saveRequest(dbAccessPool, player, videoId);
    }
  } catch (error) {
    console.error("checkRequest error:", error.message);
  }
};

/**
 * 新しい接続があった時の処理
 * @param {Socket} socket - 接続されたソケット
 * @param {MongoClient|Pool} dbAccessPool - データベース接続プール
 */
const onConnection = (socket, dbAccessPool) => {
  let player = null;

  // ゲーム開始時の処理
  socket.on("game-start", async (config) => {
    try {
      // 新しいプレイヤーを作成
      player = new Player({
        IP: socket.conn.remoteAddress,
        socketId: socket.id,
        nickname: config.nickname,
        avatar: config.avatar,
      });
      // グローバルプレイヤーリストに追加
      global.players[player.id] = player;
      // 現在の音楽リクエストリストを送信
      socketIO.sockets.emit(
        "musicresponse",
        global.requestlist,
        global.whoserequest
      );
      // データベースに入室ログを記録
      await logRoomEntry(dbAccessPool, player);
    } catch (error) {
      console.error("game-start error:", error.message);
    }
  });

  // 切断時の処理
  socket.on("disconnect", async () => {
    if (!player || !global.players[player.id]) {
      return;
    }
    // ファイルシステムが有効な場合、ログを記録
    if (APP.IS_FS && player) {
      try {
        fs.writeFile(
          "log.txt",
          createLog(player) + APP.LOG_MSG.EXIT_ESC + "\n",
          options,
          (err) => {
            if (err) {
              console.log(err);
              throw err;
            }
          }
        );
      } catch (error) {
        console.error("writeFile error:", error.message);
      }
    }
    // データベースに退室ログを記録
    try {
      await logRoomExit(dbAccessPool, player);
    } catch (error) {
      console.error("logRoomExit error:", error.message);
    }
    // プレイヤーをグローバルリストから削除
    delete global.players[player.id];
    // メモリ解放
    player = null;
  });

  // プレイヤーの移動処理
  socket.on("movement", (movement, isMove) => {
    if (!player) return;
    if (!player.isSmokeAction) {
      player.movement = movement;
      if (movement > 0) {
        player.angle = 1;
      } else if (movement < 0) {
        player.angle = -1;
      }
      player.isMove = isMove;
    } else {
      player.movement.right = false;
      player.movement.left = false;
      player.isMove = false;
    }
  });

  // タバコを吸う動作の開始処理
  socket.on("smoke", () => {
    if (!player) return;
    if (player.isSmoking) {
      player.smokingFrame = 1;
    } else {
      player.movement.right = false;
      player.movement.left = false;
      player.isMove = false;
      player.isSmokeAction = true;
      player.isSmoking = true;
      player.smokeActionCountDown = 6 * APP.FPS;
    }
  });

  // タバコを吸う動作の終了処理
  socket.on("smokeend", () => {
    if (!player) return;
    if (player.isSmokeAction) return;
    else if (player.isSmoking) {
      player.smokeActionCountDown = 0;
      player.smokingFrame = 0;
      player.isSmoking = false;
    }
  });

  // チャットメッセージ処理
  socket.on("message", async (msg) => {
    if (!msg) return;
    player.msg = msg;
    await checkRequest(player, dbAccessPool);
    player.msgCountDown = 30 * APP.FPS;
    // ファイルシステムが有効な場合、ログを記録
    if (APP.IS_FS) {
      if (msg !== "") {
        try {
          fs.writeFile(
            "log.txt",
            createLog(this) + msg + "\n",
            options,
            (err) => {
              if (err) {
                console.log(err);
                throw err;
              } else {
                APP.LOG_MSG.SUCCESS;
              }
            }
          );
        } catch (error) {
          console.error("writeFile error:", error.message);
        }
      }
      console.log(msg);
    }
    // データベースにチャットログを記録
    try {
      await logChat(dbAccessPool, player);
    } catch (error) {
      console.error("logChat error:", error.message);
    }
  });
};

/**
 * 現在のプレイヤーの状態を全クライアントに送信する関数
 * @param {import('@/server/src/models/types/Player').Player} players
 */
exports.emitState = (players) => {
  try {
    socketIO.sockets.emit("state", players);
  } catch (error) {
    console.error("emitState error:", error.message);
  }
};

/**
 * Socket.IO接続サービスを初期化する関数
 * @param {import('http').Server} server - Socket.IOをアタッチするサーバーインスタンス
 * @returns {MongoClient} - MongoDB接続クライアント
 */
exports.initializeConnectionService = async (server) => {
  // Socket.IOをサーバーにアタッチ
  socketIO = new Server(server);

  // PostgreSQLデータベース接続プールを作成
  // const dbAccessPool = new pg.Pool({ connectionString: process.env.POSTGERSS_KEY });

  // MongoDBデータベース接続プールを作成
  const dbAccessPool = new MongoClient(process.env.MONGODB_KEY, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  // データベースからリクエストリストを取得
  await fetchRequests(dbAccessPool);

  // 新しい接続があった時のイベントハンドラを設定
  socketIO.on("connection", (socket) => onConnection(socket, dbAccessPool));
  return dbAccessPool;
};
