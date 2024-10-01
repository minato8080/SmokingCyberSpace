import { helios, radio, state } from "../models/gameObjects";
import {
  DisplayCenter,
  DisplayTop,
  movespeed,
  textcolor,
  textfont,
} from "../config/gameConfig";
import { avatars, mapImage, mapImageZ1, smokyImage } from "../config/elementConfig";
import { socket } from "./socketService";
import { smoke } from "../models/gameObjects";
import { clearCanvas } from "../utils/canvasHelper";
import { PlayerFrameChanger } from "../utils/animationFrameChanger";
import { ChatWriter, NameWriter } from "../utils/textUtils";

/**
 * @typedef {import('@/server/src/models/types/Player').Player} Player
 * @typedef {import('@/node_modules/socket.io-client/lib/socket')} Socket
 */

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
 * @param {Player} player - 描画するプレイヤーオブジェクト
 * @param {number} myPlayerPos - 自プレイヤーの位置
 */
function drawPlayer(context, player, myPlayerPos) {
  const avatarImage = avatars[player.avatar];
  const isMyPlayer = player.socketId === socket.id;
  const xPos = isMyPlayer
    ? DisplayCenter - 240
    : (player.x - myPlayerPos) * movespeed + DisplayCenter - 240;
  const yPos = isMyPlayer
    ? 960 - player.height - 10 + DisplayTop
    : 960 - player.height + DisplayTop;

  ChatWriter(player);
  NameWriter(player);
  PlayerFrameChanger(player, state.frame8_4fps);

  context.drawImage(
    avatarImage,
    player.frameX,
    player.frameY,
    player.width,
    player.height,
    xPos,
    yPos,
    480,
    480
  );
  smoke.SmokeDrawer(context, smokyImage, player, socket);
}

/**
 * プレイヤーを描画する関数
 * @param {HTMLCanvasElement} canvas - キャンバス要素
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 * @param {Record<string, Player>} players - プレイヤーのオブジェクト
 */
function drawScreen(canvas, context, players) {
  context.beginPath();
  context.fill();
  context.stroke();
  context.save();


  // プレイヤーの描画を始める前に状態を更新
  let myPlayer = null;
  for (const player of Object.values(players)) {
    if (player.socketId === socket.id) {
      myPlayer = player;
      state.myPlayerPos = player.x;
      break;
    }
  }
  const backgroundX = -state.myPlayerPos * movespeed;
  const backgroundY = DisplayTop;

  // 背景を描画
  context.drawImage(mapImage, backgroundX, backgroundY);
  
  // radioを描画
  if (radio.isPlaying) ChatWriter(radio.whatPlaying());
  if (radio.radioOK(state.myPlayerPos) || state.isYtPlayerLoadVideoById)
    ChatWriter(radio);

  // ヘリオス像を描画
  if (helios.heliosOK(state.myPlayerPos)) ChatWriter(helios);

  // 他のプレイヤーを描画
  Object.values(players).forEach((player) => {
    if (player.socketId !== socket.id) {
      drawPlayer(context, player, state.myPlayerPos);
    }
  });

  // 自分のプレイヤーを描画
  if (myPlayer) {
    drawPlayer(context, myPlayer, state.myPlayerPos);
  }

  // 前景を描画
  context.drawImage(mapImageZ1, backgroundX, backgroundY);
  context.restore();
}

/**
 * レンダリングを初期化する関数
 * @param {Socket} socket - ソケットオブジェクト
 * @param {HTMLCanvasElement} canvas - キャンバス要素
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 */
export function initializeRendering(socket, canvas, context) {
  context.font = textfont;
  context.fillStyle = textcolor;
  socket.on("state", function (players) {
    clearCanvas(context, canvas);
    drawScreen(canvas, context, players);
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
