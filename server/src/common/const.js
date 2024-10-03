const path = require("path");
const dotenv = require("dotenv");
const unicodeEscape = require('unicode-escape');
dotenv.config();

exports.APP = {
  // 画面のFPS
  FPS: 24,

  /**
   * 左端
   * (ディスプレイ幅 / 2 - 遊び) / 移動速度
   * (1750 - 480) / 3 = 423,
   */
  ZERO_POSITION: 425,

  /**
   * 右端
   * (元画像横幅 - ディスプレイ幅 / 2 - 遊び) / 移動速度
   * (6090 - 1750 - 480) / 3 = 1286
   */
  MAX_POSITION: 1285,
  // ファイルログを出力するかどうか
  IS_FS: false,
  ROOT: path.join(__dirname, "../../../"),
  mongoDBName: process.env.MONGODB_DB_NAME,
};

// ログメッセージ
exports.LOG_MSG = {
  ENTRY_ESC: unicodeEscape("さんが入室しました。"),
  EXIT_ESC: unicodeEscape("さんが退出しました。"),
  SUCCESS: "正常に出力されました",
};
