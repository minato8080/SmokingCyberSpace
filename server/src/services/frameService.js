const { global } = require("../common/global");
const { APP } = require("../common/const");
const { emitState } = require("./connectionService");

/**
 * ゲームの更新フレームを設定する関数
 */
exports.initializeFrameService = () => {
  // 一定間隔で実行されるタイマーを設定
  setInterval(() => {
    // すべてのプレイヤーに対して処理を行う
    /** @type {import('@/server/src/models/types/Player').Player[]} */
    const players = Object.values(global.players);
    players.forEach((player) => {
      const movement = player.movement;

      // プレイヤーの左右移動を処理
      if (movement.left) {
        player.move(-player.speed);
        player.angle = -1;
      }
      if (movement.right) {
        player.move(player.speed);
        player.angle = 1;
      }

      // メッセージの表示時間を管理
      if (player.msgCountDown > 0) {
        player.msgCountDown--;
        if (player.msgCountDown === 0) player.msg = "";
      }

      // タバコを吸う動作のアニメーションを管理
      if (player.smokeActionCountDown > 0) {
        player.smokeActionCountDown--;
        if (player.smokeActionCountDown % 6 === 0) player.smokeActionFrame++;
        if (player.smokeActionCountDown === 0) {
          player.isSmokeAction = false;
          player.smokeActionFrame = 0;
          player.smokingCountDown = 60 * APP.FPS;
        }
      }

      // タバコを吸っている状態のアニメーションを管理
      if (player.smokingCountDown > 0) {
        player.smokingCountDown--;
        if (player.smokingCountDown % 6 === 0) player.smokingFrame++;
        if (player.smokingCountDown === 0) {
          player.isSmoking = false;
          player.smokingFrame = 0;
        }
      }
    });

    // 更新された状態をすべてのクライアントに送信
    emitState(players);
  }, 1000 / APP.FPS); // FPSに基づいて更新間隔を設定
};
