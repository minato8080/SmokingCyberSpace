import {
  movespeed,
  DisplayTop,
  DisplayCenter,
  textMargin,
  textOneline,
} from "../config/gameConfig";
import {
  chatboxMiddle,
  chatboxTop,
  chatboxUnder,
  context
} from "../config/elementConfig";
import { socket } from "../services/socketService";
import { state } from "../models/gameObjects";

/**
 * 半角文字かどうかを判定する関数
 * @param {number} chr - 文字のUnicode値
 * @returns {boolean} 半角文字の場合はtrue、それ以外はfalse
 */
const isHalfWidthChar = (chr) => {
  return (
    (chr >= 0x00 && chr < 0x81) ||
    chr === 0xf8f0 ||
    (chr >= 0xff61 && chr < 0xffa0) ||
    (chr >= 0xf8f1 && chr < 0xf8f4)
  );
};

/**
 * 文字列の先頭または末尾のスペースを削除する関数
 * @param {string} str - 対象の文字列
 * @param {number} bufferSize - バッファサイズ
 * @returns {string} スペースが削除された文字列
 */
const SpaceCut = (str, bufferSize) => {
  if (str.slice(-1) === " ") {
    //末尾
    str = str.slice(0, -1);
    bufferSize -= 0.5;
    return SpaceCut(str, bufferSize);
  } else if (str.slice(-1) === "　") {
    str = str.slice(0, -1);
    bufferSize -= 1.0;
    return SpaceCut(str, bufferSize);
  } else if (str.slice(0, 1) === " ") {
    //先頭
    str = str.slice(1);
    bufferSize -= 0.5;
    return SpaceCut(str, bufferSize);
  } else if (str.slice(0, 1) === "　") {
    str = str.slice(1);
    bufferSize -= 1.0;
    return SpaceCut(str, bufferSize);
  }
  return str;
};

/**
 * バッファを配列に追加する関数
 * @param {string} buffer - 追加するバッファ
 * @param {number} bufferSize - バッファサイズ
 * @param {Array} chatarray - チャットメッセージの配列
 * @param {Array} lineSizeArray - 各行のサイズを格納する配列
 */
const addLineToArrays = (buffer, bufferSize, chatarray, lineSizeArray) => {
  buffer = SpaceCut(buffer, bufferSize);
  lineSizeArray.push(bufferSize);
  chatarray.push(buffer);
};

/**
 * チャットボックスを描画する関数
 * @param {number} num - X座標
 * @param {number} y - Y座標
 * @param {number} lineCount - 行数
 */
const drawChatBox = (num, y, lineCount) => {
  context.drawImage(
    chatboxMiddle,
    0,
    0,
    290,
    35,
    num + DisplayCenter - textOneline * 20 - 20,
    y - textMargin - 35 - lineCount * 40 + state.textFloater,
    290,
    lineCount * 40
  );
  context.drawImage(
    chatboxTop,
    num + DisplayCenter - textOneline * 20 - 20,
    y - textMargin - lineCount * 40 - 30 - 15 - 5 + state.textFloater
  );
  context.drawImage(
    chatboxUnder,
    num + DisplayCenter - textOneline * 20 - 20,
    y - textMargin - 30 - 5 + state.textFloater
  );
};

/**
 * チャットテキストを描画する関数
 * @param {number} num - X座標
 * @param {number} y - Y座標
 * @param {Array} chatarray - チャットメッセージの配列
 * @param {Array} lineSizeArray - 各行のサイズを格納する配列
 */
const drawChatText = (num, y, chatarray, lineSizeArray) => {
  for (let i = 0; i < chatarray.length; i++) {
    context.fillText(
      chatarray[i],
      num + DisplayCenter - lineSizeArray[i] * 20,
      y - textMargin + DisplayTop - (chatarray.length - i) * 40 + state.textFloater
    );
  }
};

/**
 * チャットメッセージを描画する関数
 * @param {Object} player - プレイヤーオブジェクト
 */
export const ChatWriter = (player) => {
  if (player.msg === "") {
    return;
  }
  const num =
    player.socketId !== socket.id
      ? (player.x - state.myPlayerPos) * movespeed
      : 0;

  const len = player.msg.length;
  const chatarray = [];
  const lineSizeArray = [];
  let buffer = "";
  let bufferSize = 0;

  for (let i = 0, buffer_i = 0; i < len; i++) {
    buffer += player.msg.charAt(i);
    const chr = buffer.charCodeAt(buffer_i);

    if (chr === 92 && player.msg.charAt(i + 1) === "n") {
      i++;
      buffer = buffer.slice(0, -1);
      addLineToArrays(buffer, bufferSize, chatarray, lineSizeArray);
      buffer = "";
      bufferSize = 0;
      buffer_i = 0;
    } else {
      bufferSize += isHalfWidthChar(chr) ? 0.5 : 1.0;
      buffer_i++;

      if (bufferSize >= textOneline && i !== len - 1) {
        addLineToArrays(buffer, bufferSize, chatarray, lineSizeArray);
        buffer = "";
        bufferSize = 0;
        buffer_i = 0;
      }
    }
  }

  addLineToArrays(buffer, bufferSize, chatarray, lineSizeArray);

  drawChatBox(num, player.y, chatarray.length);
  drawChatText(num, player.y, chatarray, lineSizeArray);
};

/**
 * プレイヤーのニックネームを描画する関数
 * @param {Object} player - プレイヤーオブジェクト
 */
export const NameWriter = (player) => {
  const num =
    player.socketId !== socket.id
      ? (player.x - state.myPlayerPos) * movespeed
      : 0;
  let bufferSize = 0;

  for (let i = 0; i < player.nickname.length; i++) {
    const chr = player.nickname.charCodeAt(i);
    bufferSize += isHalfWidthChar(chr) ? 0.5 : 1.0;
  }

  context.fillText(
    "＠" + player.nickname,
    num + DisplayCenter - (Math.ceil(bufferSize) + 1) * 20,
    player.y - 30 + DisplayTop + state.textFloater
  );
};
