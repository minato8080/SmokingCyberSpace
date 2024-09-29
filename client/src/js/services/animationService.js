import { helios, radio, state } from "../models/gameObjects";
import {
  Avatars,
  DisplayCenter,
  DisplayTop,
  movespeed,
  textcolor,
  textfont,
} from "../config/gameConfig";
import { mapImage, mapImageZ1, smoky } from "../config/elementConfig";
import { socket } from "./socketService";
import { smoke } from "../models/gameObjects";
import { clearCanvas } from "../utils/canvasHelper";
import { PlayerFrameChanger } from "../utils/animationFrameChanger";
import { ChatWriter, NameWriter } from "../utils/textUtils";

/**
 * 背景を描画する関数
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 */
export function drawBackground(context) {
  context.beginPath();
  context.fill();
  context.stroke();
}

/**
 * プレイヤーを描画する関数
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 * @param {Object} players - プレイヤーのオブジェクト
 */
function drawPlayers(canvas, context, players) {
  // プレイヤーの状態更新処理
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 10;
  context.beginPath();
  context.fillStyle = "rgb(62,12,15)";
  context.fill();
  context.stroke();

  Object.values(players).forEach((player) => {
    const isCurrentPlayer = player.socketId === socket.id;
    if (isCurrentPlayer) {
      state.myPlayerPos = player.x;
      context.drawImage(mapImage, -state.myPlayerPos * movespeed, +DisplayTop);
    }

    context.save();
    context.font = textfont;
    context.fillStyle = textcolor;

    if (isCurrentPlayer) {
      if (radio.isPlaying) ChatWriter(radio.whatPlaying());
      if (radio.radioOK(state.myPlayerPos) || state.isYtPlayerLoadVideoById)
        ChatWriter(radio);
      if (helios.heliosOK(state.myPlayerPos)) ChatWriter(helios);
    }

    ChatWriter(player);
    NameWriter(player);
    PlayerFrameChanger(player, state.frame8_4fps);

    const xPos = isCurrentPlayer
      ? DisplayCenter - 240
      : (player.x - state.myPlayerPos) * movespeed + DisplayCenter - 240;
    const yPos = isCurrentPlayer
      ? 960 - player.height - 10 + DisplayTop
      : 960 - player.height + DisplayTop;

    context.drawImage(
      Avatars[player.avatar],
      player.frameX,
      player.frameY,
      player.width,
      player.height,
      xPos,
      yPos,
      480,
      480
    );

    smoke.SmokeDrawer(context, smoky, player, socket);
    context.restore();
  });

  context.drawImage(mapImageZ1, -state.myPlayerPos * movespeed, +DisplayTop);
}

/**
 * レンダリングを初期化する関数
 * @param {Object} socket - ソケットオブジェクト
 * @param {HTMLCanvasElement} canvas - キャンバス要素
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 */
export function initializeRendering(socket, canvas, context) {
  socket.on("state", function (players) {
    clearCanvas(context, canvas);
    drawBackground(context);

    drawPlayers(canvas, context, players);
  });
}

/**
 * アニメーションループを初期化する関数
 */
export function initializeAnimationLoop() {
  setInterval(() => {
    state.age++;
    state.frame8_4fps++;
    if (state.age % 4 === 0) {
      state.frame4_1fps++;
      if (state.frame4_1fps === 4) {
        state.frame4_1fps = 0;
      }
      if (state.frame4_1fps > 1) {
        state.textFloater += 5;
      } else {
        state.textFloater -= 5;
      }

      if (state.age % 8 === 0) {
        state.frame8_4fps = 0;
      }
    }
  }, 1000 / 4);
}
