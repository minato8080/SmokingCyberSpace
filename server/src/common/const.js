const path = require("path");
const dotenv = require("dotenv");
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
  /** "さんが入室しました。" */
  ENTRY_ESC: "\u3055\u3093\u304c\u5165\u5ba4\u3057\u307e\u3057\u305f\u3002",
  /** "さんが退出しました。" */
  EXIT_ESC: "\u3055\u3093\u304c\u9000\u51fa\u3057\u307e\u3057\u305f\u3002",
  SUCCESS: "正常に出力されました",
};
