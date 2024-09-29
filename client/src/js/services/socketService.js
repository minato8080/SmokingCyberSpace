/**
 * socket.ioサービスモジュール
 *
 * このモジュールは、Socket.IOを使用してサーバーとの通信を管理します。
 * ・ゲーム開始
 * ・メッセージ送信
 * ・プレイヤーの位置情報
 * ・喫煙アクション
 */

import * as io from "socket.io-client";
import { radio } from "../models/gameObjects";
import { startScreen } from "../config/elementConfig";

// Socket.IOのインスタンスを作成
export const socket = io();

/**
 * ソケットの初期化を行う関数
 *
 * サーバーからのイベントをリッスンし、適切な処理を行います。
 * - "dead"イベント: スタート画面を表示
 * - "musicresponse"イベント: 音楽リストとリクエスト者の情報を更新
 *
 * @returns {Object} socket - Socket.IOのインスタンス
 */
export function initializeSocket() {
  socket.on("dead", () => {
    startScreen.show();
  });

  socket.on("musicresponse", function (list, name) {
    radio.playList = list;
    radio.whoserequest = name;
    radio.radioPageUpdate();
  });

  return socket;
}

/**
 * ゲーム開始をサーバーに通知する関数
 *
 * @param {string} nickname - プレイヤーのニックネーム
 * @param {string} avatar - プレイヤーのアバター
 */
export function emitGameStart(nickname, avatar) {
  socket.emit("game-start", {
    nickname: nickname,
    avatar: avatar,
  });
}

/**
 * メッセージをサーバーに送信する関数
 *
 * @param {string} message - 送信するメッセージ
 */
export function emitMessage(message) {
  socket.emit("message", message);
}

/**
 * プレイヤーの動きをサーバーに送信する関数
 *
 * @param {Object} movement - プレイヤーの動きの情報
 * @param {boolean} isMove - 動いているかどうかのフラグ
 */
export function emitMovement(movement, isMove) {
  socket.emit("movement", movement, isMove);
}

/**
 * 喫煙アクション開始をサーバーにエミッションする関数
 */
export function emitSmoke() {
  socket.emit("smoke");
}

/**
 * 喫煙アクション終了をサーバーにエミッションする関数
 */
export function emitSmokeEnd() {
  socket.emit("smokeend");
}
