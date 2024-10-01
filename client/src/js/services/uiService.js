/**
 * UIサービスモジュール
 *
 * このモジュールは、ゲームのUIに関連する機能を提供します。
 * ユーザーのニックネームを保存し、ゲームの開始やメッセージの送信を管理します。
 */

import {
  nicknameInput,
  gameStartButton,
  startScreen,
  messageForm,
  inputMsg,
  sousinButton,
} from "../config/elementConfig";
import { emitGameStart, emitMessage } from "./socketService";

/**
 * UIを初期化する関数
 */
export function initializeUI() {
  $(function () {
    if (
      $.cookie("SCS_user_nickname") !== "undefined" &&
      $.cookie("SCS_user_nickname") !== null
    )
      nicknameInput.val($.cookie("SCS_user_nickname"));
  });

  gameStartButton.on("click", function () {
    $.cookie("SCS_user_nickname", nicknameInput.val());
    emitGameStart(nicknameInput.val(), document.getElementById("avatarArea").avatar.value);
    startScreen.hide();
  });

  messageForm.submit(function () {
    emitMessage(inputMsg.val());
    inputMsg.val("");
    return false;
  });

  sousinButton.on("click", function () {
    emitMessage(inputMsg.val());
    inputMsg.val("");
    return false;
  });
}
