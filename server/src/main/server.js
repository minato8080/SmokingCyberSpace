"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const pg = require("pg");
const { APP } = require("../common/const");
const { onConnection } = require("./onConnection");
const { timelog, datelog, weekhead } = require("../util/log");
const global = require("../common/global");

const app = express();
const server = http.Server(app);
global.io = socketIO(server);
global.pool = new pg.Pool({
  connectionString: process.env.POSTGERSS_KEY,
});

global.io.on("connection", onConnection);

setInterval(() => {
  Object.values(global.players).forEach((player) => {
    const movement = player.movement;
    if (movement.left) {
      player.move(-player.speed);
      player.angle = -1;
    }
    if (movement.right) {
      player.move(player.speed);
      player.angle = 1;
    }
    if (player.msgCountDown > 0) {
      player.msgCountDown--;
      if (player.msgCountDown === 0) player.msg = "";
    }
    if (player.smokeActionCountDown > 0) {
      player.smokeActionCountDown--;
      if (player.smokeActionCountDown % 6 === 0) player.smokeActionFrame++;
      if (player.smokeActionCountDown === 0) {
        player.isSmokeAction = false;
        player.smokeActionFrame = 0;
        player.smokingCountDown = 60 * APP.FPS;
      }
    }
    if (player.smokingCountDown > 0) {
      player.smokingCountDown--;
      if (player.smokingCountDown % 6 === 0) player.smokingFrame++;
      if (player.smokingCountDown === 0) {
        player.isSmoking = false;
        player.smokingFrame = 0;
      }
    }
  });
  global.io.sockets.emit("state", global.players);
}, 1000 / APP.FPS);

global.pool
  .query(
    "SELECT videoid,name FROM requestlist WHERE $1 <= date AND date <= $2",
    [weekhead(), datelog()]
  )
  .then((res) => {
    for (let i = 0; i < res.rows.length; i++) {
      requestlist.push(res.rows[i].videoid);
      whoserequest.push(res.rows[i].name);
    }
    console.log(requestlist);
  })
  .catch((e) => console.error(e.stack));

// distフォルダを静的に提供
app.use(express.static(path.join(APP.ROOT, "/dist")));

// ルートアクセスでindex.htmlを返す
app.get("/", (_request, response) => {
  console.log(__dirname);
  response.sendFile(path.join(APP.ROOT, "/dist/index.html"));
});

server.listen(process.env.PORT || 8080, function () {
  console.log(`Starting server on port ${process.env.PORT ?? 8080}`);
});
