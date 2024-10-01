/**
 * プレイヤーのログ情報を生成する
 * @param {Object} player - プレイヤーオブジェクト
 * @returns {string} フォーマットされたログ文字列
 */
exports.createLog = (player) => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mi = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const time = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
  const log =
    time + "^ID:" + player.id.toString(32) + "@" + player.nickname + "<";
  return log;
};

/**
 * 現在の日本時間を文字列として返す
 * @returns {string} "YYYY/MM/DD HH:MM:SS"形式の時間文字列
 */
exports.getLogTime = () => {
  const date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + Number(process.env.ADJUST_TIME));
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mi = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const time = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
  return time;
};

/**
 * 現在の日本時間の日付を文字列として返す
 * @returns {string} "YYYYMMDD"形式の日付文字列
 */
exports.getLogDate = () => {
  const date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + Number(process.env.ADJUST_TIME));
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const day = yyyy + mm + dd;
  return day;
};

/**
 * 現在の週の開始日（月曜日）の日付を文字列として返す
 * @returns {string} "YYYYMMDD"形式の日付文字列
 */
exports.weekhead = () => {
  const date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + Number(process.env.ADJUST_TIME));
  const mondayAdjust = (date.getDay() + 6) % 7; // 月曜スタート
  date.setDate(date.getDate() - mondayAdjust); // 週の開始日をセット
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const day = yyyy + mm + dd;
  return day;
};