import * as io from "socket.io-client";
import { radio } from "../models/gameObjects";

export const socket = io();

export function initializeSocket() {
  socket.on("dead", () => {
    $("#start-screen").show();
  });

  socket.on("musicresponse", function (list, name) {
    radio.playList = list;
    radio.whoserequest = name;
    radio.radioPageUpdate();
  });

  return socket;
}

export function emitGameStart(nickname, avatar) {
  socket.emit("game-start", {
    nickname: nickname,
    avatar: avatar,
  });
}

export function emitMessage(message) {
  socket.emit("message", message);
}

export function emitMovement(movement, isMove) {
  socket.emit("movement", movement, isMove);
}

export function emitSmoke() {
  socket.emit("smoke");
}

export function emitSmokeEnd() {
  socket.emit("smokeend");
}
