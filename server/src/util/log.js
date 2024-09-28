/**
 * 数字を2桁の文字列に変換する
 * @param {number} num - 変換する数字
 * @returns {string} 2桁の文字列
 */
const toDoubleDigits = function (num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
exports.toDoubleDigits = toDoubleDigits;

/**
 * プレイヤーのログ情報を生成する
 * @param {Object} player - プレイヤーオブジェクト
 * @returns {string} フォーマットされたログ文字列
 */
const LogWriter = function (player) {
  let date = new Date();
  let yyyy = date.getFullYear();
  let mm = toDoubleDigits(date.getMonth() + 1);
  let dd = toDoubleDigits(date.getDate());
  let hh = toDoubleDigits(date.getHours());
  let mi = toDoubleDigits(date.getMinutes());
  let ss = toDoubleDigits(date.getSeconds());
  let time = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
  let log =
    time + "^ID:" + player.id.toString(32) + "@" + player.nickname + "<";
  return log;
};
exports.LogWriter = LogWriter;

/**
 * 現在の日本時間を文字列として返す
 * @returns {string} "YYYY/MM/DD HH:MM:SS"形式の時間文字列
 */
const timelog = () => {
  let date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + 9);
  let yyyy = date.getFullYear();
  let mm = toDoubleDigits(date.getMonth() + 1);
  let dd = toDoubleDigits(date.getDate());
  let hh = toDoubleDigits(date.getHours());
  let mi = toDoubleDigits(date.getMinutes());
  let ss = toDoubleDigits(date.getSeconds());
  let time = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
  return time;
};
exports.timelog = timelog;

/**
 * 現在の日本時間の日付を文字列として返す
 * @returns {string} "YYYYMMDD"形式の日付文字列
 */
const datelog = () => {
  let date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + 9);
  let yyyy = date.getFullYear();
  let mm = toDoubleDigits(date.getMonth() + 1);
  let dd = toDoubleDigits(date.getDate());
  let day = yyyy + mm + dd;
  return day;
};
exports.datelog = datelog;

/**
 * 現在の週の開始日（月曜日）の日付を文字列として返す
 * @returns {string} "YYYYMMDD"形式の日付文字列
 */
const weekhead = () => {
  const date = new Date();
  // 日本時間に調整
  date.setHours(date.getHours() + 9);
  let nowDate = date.getDay(); // 曜日取得
  if (nowDate === 0) {
    nowDate = 6;
  } else {
    nowDate--;
  } // 月曜スタート
  date.setDate(date.getDate() - nowDate); // 週の開始日をセット
  let yyyy = date.getFullYear();
  let mm = toDoubleDigits(date.getMonth() + 1);
  let dd = toDoubleDigits(date.getDate());
  let day = yyyy + mm + dd;
  return day;
};
exports.weekhead = weekhead;
