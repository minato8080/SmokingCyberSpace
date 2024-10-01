import {
  buttonA,
  buttonB,
  leftButton,
  rightButton,
} from "../config/elementConfig";
import { movement, state, radio } from "../models/gameObjects";
import {
  emitSmoke,
  emitSmokeEnd,
  emitMovement,
} from "../services/socketService";

/**
 * ダブルタッチを防止する関数
 *
 * この関数は、短時間内の連続したタッチイベントを防ぐために使用されます。
 * 主にモバイルデバイスでの意図しない操作を防ぐために実装されています。
 *
 * @function
 * @name preventEvent
 * @returns {void}
 */
function preventEvent() {
  let lastTouchTime = 0; // 最後のタッチ時間を記録

  // ダブルタッチを無効化するためのイベントリスナー
  document.addEventListener("touchstart", (e) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastTouchTime <= 300) {
      // 300ms以内のタッチを無効化
      e.preventDefault();
    }
    lastTouchTime = currentTime;
  }, { passive: false }); // passiveをfalseに設定

  document.addEventListener("gesturestart", (e) => {
    e.preventDefault(); // ジェスチャーによる拡大縮小を無効化
  }, { passive: false }); // passiveをfalseに設定

  document.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
      e.preventDefault(); // Ctrl + ホイールによる拡大縮小を無効化
    }
  }, { passive: false }); // passiveをfalseに設定
}

/**
 * UIコントローラーを初期化する
 *
 * この関数は、ユーザーインターフェイスの各要素に対してイベントリスナーを設定し、
 * デバイスタイプ（スマートフォンまたはデスクトップ）に応じて適切な動作を実装します。
 *
 * 主な機能:
 * - デバイスタイプの検出
 * - タッチイベントまたはマウスイベントの設定
 * - 移動ボタンの制御
 * - スモーク機能の制御
 * - ダブルタッチ防止（スマートフォンの場合）
 *
 * @function
 * @name initializeUIController
 * @returns {void}
 */
export function initializeUIController() {
  // ユーザーエージェントを小文字に変換
  const userAgent = navigator.userAgent.toLowerCase();
  // スマートフォンかどうかを判定
  const isSmartPhone = /iphone|ipod|ipad|android/.test(userAgent);
  // デバイスに応じてイベントタイプを設定
  const eventStart = isSmartPhone ? "touchstart" : "mousedown";
  const eventEnd = isSmartPhone ? "touchend" : "mouseup";
  const eventLeave = isSmartPhone ? "touchmove" : "mouseleave";

  preventEvent();

  // 左右の移動ボタンのイベントリスナーを設定
  // 各ボタンに対して、タッチ開始、終了、移動時のイベントを処理
  [leftButton, rightButton].forEach((button, index) => {
    const isLeft = index === 0;
    button[0].addEventListener(eventStart, (e) => {
      e.preventDefault();
      movement.right = !isLeft;
      movement.left = isLeft;
      state.isMove = true;
      emitMovement(movement, state.isMove);
    });
    button[0].addEventListener(eventEnd, (e) => {
      e.preventDefault();
      movement.right = movement.left = false;
      state.isMove = false;
      emitMovement(movement, state.isMove);
    });
    button[0].addEventListener(eventLeave, (e) => {
      e.preventDefault();
      const elem = isSmartPhone
        ? document.elementFromPoint(
            e.touches?.[0].clientX,
            e.touches?.[0].clientY
          )
        : button;
      if (!isSmartPhone || elem !== button) {
        movement.right = movement.left = false;
        state.isMove = false;
        emitMovement(movement, state.isMove);
      }
    });
  });

  buttonA.click(function () {
    emitSmoke();
  });

  buttonB.click(function () {
    if (radio.radioOK(state.myPlayerPos)) {
      radio.radioMessenger();
    } else {
      emitSmokeEnd();
    }
  });
}
