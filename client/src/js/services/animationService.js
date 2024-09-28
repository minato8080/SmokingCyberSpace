import { helios, radio, state } from "../models/gameObjects";
import {
  PlayerFrameChanger,
  updateAnimationFrames,
} from "../utils/animationFrameChanger";
import { ChatWriter, NameWriter } from "../utils/textUtils";
import {
  Avatars,
  DisplayCenter,
  DisplayTop,
  movespeed,
  textcolor,
  textfont,
} from "../config/gameConfig";
import { socket } from "./socketService";
import { smoke } from "../models/gameObjects";
import { isDone } from "./musicService";
import { clearCanvas } from "../utils/canvasHelper";
import { mapImage, mapImageZ1, smoky } from "./uiService";

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
      state.myplayerpos = player.x;
      context.drawImage(mapImage, -state.myplayerpos * movespeed, +DisplayTop);
    }

    context.save();
    context.font = textfont;
    context.fillStyle = textcolor;

    if (isCurrentPlayer) {
      if (radio.isPlaying) ChatWriter(radio.whatPlaying());
      if (radio.radioOK(state.myplayerpos) || isDone) ChatWriter(radio);
      if (helios.heliosOK(state.myplayerpos)) ChatWriter(helios);
    }

    ChatWriter(player);
    NameWriter(player);
    PlayerFrameChanger(player);

    const xPos = isCurrentPlayer
      ? DisplayCenter - 240
      : (player.x - state.myplayerpos) * movespeed + DisplayCenter - 240;
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

  context.drawImage(mapImageZ1, -state.myplayerpos * movespeed, +DisplayTop);
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

export const loop = {
  age: 0,
  frame4_1fps: 0,
  frame8_4fps: 0,
  textfloater: 0,
};
/**
 * アニメーションループを初期化する関数
 */
export function initializeAnimationLoop() {
  setInterval(() => {
    loop.age++;
    loop.frame8_4fps++;
    if (loop.age % 4 === 0) {
      loop.frame4_1fps++;
      if (loop.frame4_1fps === 4) {
        loop.frame4_1fps = 0;
      }
      if (loop.frame4_1fps > 1) {
        loop.textfloater += 5;
      } else {
        loop.textfloater -= 5;
      }

      if (loop.age % 8 === 0) {
        loop.frame8_4fps = 0;
      }
    }
  }, 1000 / 4);
}
