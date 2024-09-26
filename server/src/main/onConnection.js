const { LogWriter, timelog, datelog } = require("../util/log");
const Player = require("../lib/Player");
const global = require("../common/global");
const { APP } = require("../common/const");
if (APP.IS_FS) {
  const fs = require("fs");
}

const RequestChecker = function (player) {
  let videoId;
  const msg = player.msg;
  // PC版のURL
  if (msg.indexOf("https:// www.youtube.com/watch?v=") !== -1) {
    videoId = msg.split("https:// www.youtube.com/watch?v=")[1];
  }
  // モバイルブラウザのURL
  else if (
    msg.indexOf("https:// m.youtube.com/watch?feature=youtu.be&v=") !== -1
  ) {
    videoId = msg.split("https:// m.youtube.com/watch?feature=youtu.be&v=")[1];
  }
  // モバイルアプリ
  else if (msg.indexOf("https:// youtu.be/") !== -1) {
    videoId = msg.split("https:// youtu.be/")[1];
  } else {
    return;
  }
  // &=クエリパラーメターがついていることがあるので取り除く
  let ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition != -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  // ?クエリパラーメターがついていることがあるので取り除く
  let questionPosition = videoId.indexOf("?");
  if (questionPosition != -1) {
    videoId = videoId.substring(0, questionPosition);
  }
  // 正しいurlの形式だったとき送信
  if (videoId.length === 11) {
    global.requestlist.push(videoId);
    global.whoserequest.push(player.nickname);
    global.io.sockets.emit(
      "musicresponse",
      global.requestlist,
      global.whoserequest
    );
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

exports.onConnection = (socket) => {
  let player = null;
  socket.on("game-start", (config) => {
    player = new Player({
      IP: socket.conn.remoteAddress,
      socketId: socket.id,
      nickname: config.nickname,
      avatar: config.avatar,
    });
    global.players[player.id] = player;
    global.io.sockets.emit(
      "musicresponse",
      global.requestlist,
      global.whoserequest
    );
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
  socket.on("disconnect", () => {
    if (!player) {
      return;
    }
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
    global.pool
      .query(
        "INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [timelog(), player.IP, player.id.toString(32), player.nickname, "OUT"]
      )
      .then((res) => {
        console.log(res.rows[0]);
      })
      .catch((e) => console.error(e.stack));
    delete players[player.id];
    player = null;
  });
  //------------------------------------
  //ユーザーアクション
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
  socket.on("smokeend", () => {
    if (!player) return;
    if (player.isSmokeAction) return;
    else if (player.isSmoking) {
      player.smokeActionCountDown = 0;
      player.smokingFrame = 0;
      player.isSmoking = false;
    }
  });
  //チャット処理
  socket.on("message", (msg) => {
    if (!msg) return;
    player.msg = msg;
    RequestChecker(player);
    player.msgCountDown = 30 * fps;
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
