import {
  movespeed,
  DisplayTop,
  DisplayCenter,
  margin,
  oneline,
} from "../config/gameConfig";
import { socket } from "../services/socketService";
import {
  chatboxMiddle,
  chatboxTop,
  chatboxUnder,
  context,
} from "../services/uiService";
import { state } from "../models/gameObjects";

const isHalfWidthChar = (chr) => {
  return (
    (chr >= 0x00 && chr < 0x81) ||
    chr === 0xf8f0 ||
    (chr >= 0xff61 && chr < 0xffa0) ||
    (chr >= 0xf8f1 && chr < 0xf8f4)
  );
};

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
  } else if (str.slice(0, 1) === " ") {
    str = str.slice(1);
    bufferSize -= 1.0;
    return SpaceCut(str, bufferSize);
  }
  return str;
};

const addLineToArrays = (buffer, bufferSize, chatarray, lineSizeArray) => {
  buffer = SpaceCut(buffer, bufferSize);
  lineSizeArray.push(bufferSize);
  chatarray.push(buffer);
};

const drawChatBox = (num, y, lineCount) => {
  context.drawImage(
    chatboxMiddle,
    0,
    0,
    290,
    35,
    num + DisplayCenter - oneline * 20 - 20,
    y - margin - 35 - lineCount * 40 + state.textfloater,
    290,
    lineCount * 40
  );
  context.drawImage(
    chatboxTop,
    num + DisplayCenter - oneline * 20 - 20,
    y - margin - lineCount * 40 - 30 - 15 - 5 + state.textfloater
  );
  context.drawImage(
    chatboxUnder,
    num + DisplayCenter - oneline * 20 - 20,
    y - margin - 30 - 5 + state.textfloater
  );
};

const drawChatText = (num, y, chatarray, lineSizeArray) => {
  for (let i = 0; i < chatarray.length; i++) {
    context.fillText(
      chatarray[i],
      num + DisplayCenter - lineSizeArray[i] * 20,
      y - margin + DisplayTop - (chatarray.length - i) * 40 + state.textfloater
    );
  }
};

export const ChatWriter = (player) => {
  if (player.msg === "") {
    return;
  }
  const num =
    player.socketId !== socket.id
      ? (player.x - state.myplayerpos) * movespeed
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

      if (bufferSize >= oneline && i !== len - 1) {
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

export const NameWriter = (player) => {
  const num =
    player.socketId !== socket.id
      ? (player.x - state.myplayerpos) * movespeed
      : 0;
  let bufferSize = 0;

  for (let i = 0; i < player.nickname.length; i++) {
    const chr = player.nickname.charCodeAt(i);
    bufferSize += isHalfWidthChar(chr) ? 0.5 : 1.0;
  }

  context.fillText(
    "＠" + player.nickname,
    num + DisplayCenter - (Math.ceil(bufferSize) + 1) * 20,
    player.y - 30 + DisplayTop + state.textfloater
  );
};
