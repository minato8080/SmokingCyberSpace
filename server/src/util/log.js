const toDoubleDigits = function (num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
exports.toDoubleDigits = toDoubleDigits;

const LogWriter = function (player) {
  let date = new Date();
  let yyyy = date.getFullYear();
  let mm = toDoubleDigits(date.getMonth() + 1);
  let dd = toDoubleDigits(date.getDate());
  let hh = toDoubleDigits(date.getHours());
  let mi = toDoubleDigits(date.getMinutes());
  let ss = toDoubleDigits(date.getSeconds());
  let time = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
  // let log = player.msg + '\t'+time + ' id:' + player.id + ' name:' + player.nickname +   '\n';
  let log =
    time + "^ID:" + player.id.toString(32) + "@" + player.nickname + "<";
  return log;
};
exports.LogWriter = LogWriter;

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
