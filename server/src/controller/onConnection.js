const { LogWriter, timelog, datelog } = require("../util/log");
const Player = require("../lib/Player");
const global = require("../common/global");
const { APP } = require("../common/const");
// ファイルシステムが有効な場合、fsモジュールをインポート
if (APP.IS_FS) {
  const fs = require("fs");
}

/**
 * YouTubeの動画リクエストを処理する関数
 * @param {Player} player - リクエストを送信したプレイヤーオブジェクト
 */
const RequestChecker = function (player) {
  let videoId;
  const msg = player.msg;
  const pcUrl = "https://www.youtube.com/watch?v=";
  const mobileUrl = "https://m.youtube.com/watch?feature=youtu.be&v=";
  const appUrl = "https://youtu.be/";

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
    global.io.sockets.emit(
      "musicresponse",
      global.requestlist,
      global.whoserequest
    );

    // データベースにリクエストを保存
    global.pool
      .query(
        "INSERT INTO requestlist(date,ip,id,name,videoid) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [datelog(), player.IP, player.id.toString(32), player.nickname, videoId]
      )
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
  }
};

/**
 * 新しい接続があった時の処理
 * @param {Socket} socket - 接続されたソケット
 */
const onConnection = (socket) => {
  let player = null;

  // ゲーム開始時の処理
  socket.on("game-start", (config) => {
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
    global.io.sockets.emit(
      "musicresponse",
      global.requestlist,
      global.whoserequest
    );
    // データベースに入室ログを記録
    global.pool
      .query(
        "INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [timelog(), player.IP, player.id.toString(32), player.nickname, "IN"]
      )
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
  });

  // 切断時の処理
  socket.on("disconnect", () => {
    if (!player || !global.players[player.id]) {
      return;
    }
    // ファイルシステムが有効な場合、ログを記録
    if (APP.IS_FS && player) {
      fs.writeFile(
        "log.txt",
        LogWriter(player) + APP.LOG_MSG.EXIT_ESC + "\n",
        options,
        (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    // データベースに退室ログを記録
    global.pool
      .query(
        "INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [timelog(), player.IP, player.id.toString(32), player.nickname, "OUT"]
      )
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
    // プレイヤーをグローバルリストから削除
    delete global.players[player.id];
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
  socket.on("message", (msg) => {
    if (!msg) return;
    player.msg = msg;
    RequestChecker(player);
    player.msgCountDown = 30 * fps;
    // ファイルシステムが有効な場合、ログを記録
    if (APP.IS_FS) {
      if (msg !== "")
        fs.writeFile(
          "log.txt",
          LogWriter(this) + msg + "\n",
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
      console.log(msg);
    }
    // データベースにチャットログを記録
    pool
      .query(
        "INSERT INTO chatlogs(time,ip,id,name,message) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [
          timelog(),
          player.IP,
          player.id.toString(32),
          player.nickname,
          player.msg,
        ]
      )
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
  });
};
module.exports = onConnection;