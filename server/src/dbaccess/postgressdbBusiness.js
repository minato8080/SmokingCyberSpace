const { global } = require("../common/global");
const { getLogDate, weekhead, getLogTime, getLogDate } = require("../util/log");

/**
 * リクエストを取得する関数
 * 指定された期間内のリクエストをデータベースから取得し、グローバル変数に格納します。
 * @param {Pool} pool - PostgreSQLの接続プール
 * @returns {Promise<void>}
 */
const fetchRequests = async (pool) => {
  try {
    const res = await pool.query(
      "SELECT videoid,name FROM requestlist WHERE $1 <= date AND date <= $2",
      [weekhead(), getLogDate()]
    );
    // 取得したデータをグローバル変数に格納
    for (let i = 0; i < res.rows.length; i++) {
      global.requestlist.push(res.rows[i].videoid);
      global.whoserequest.push(res.rows[i].name);
    }
    console.log(global.requestlist);
  } catch (e) {
    console.error("fetchRequests error:", e.message);
    console.error(e.stack);
  }
};

/**
 * リクエストをデータベースに保存する関数
 * @param {Pool} pool - PostgreSQLの接続プール
 * @param {Player} player - リクエストを送信したプレイヤーオブジェクト
 * @param {string} videoId - 保存する動画ID
 * @returns {Promise<void>}
 */
const saveRequest = async (pool, player, videoId) => {
  try {
    const res = await pool.query(
      "INSERT INTO requestlist(date,ip,id,name,videoid) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [
        getLogDate(),
        player.IP,
        player.id.toString(32),
        player.nickname,
        videoId,
      ]
    );
    console.log(res.rows[0]);
  } catch (e) {
    console.error("saveRequest error:", e.message);
    console.error(e.stack);
  }
};

/**
 * チャットメッセージをデータベースに記録する関数
 * @param {Pool} pool - PostgreSQLの接続プール
 * @param {Player} player - チャットメッセージを送信したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logChat = async (pool, player) => {
  try {
    const res = await pool.query(
      "INSERT INTO chatlogs(time,ip,id,name,message) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [
        getLogTime(),
        player.IP,
        player.id.toString(32),
        player.nickname,
        player.msg,
      ]
    );
    console.log(res.rows[0]);
  } catch (e) {
    console.error("logChat error:", e.message);
    console.error(e.stack);
  }
};

/**
 * プレイヤーの入室をログに記録する関数
 * @param {Pool} pool - PostgreSQLの接続プール
 * @param {Player} player - 入室したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logRoomEntry = async (pool, player) => {
  try {
    const res = await pool.query(
      "INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [getLogTime(), player.IP, player.id.toString(32), player.nickname, "IN"]
    );
    console.log(res.rows[0]);
  } catch (e) {
    console.error("logRoomEntry error:", e.message);
    console.error(e.stack);
  }
};

/**
 * プレイヤーの退室をログに記録する関数
 * @param {Pool} pool - PostgreSQLの接続プール
 * @param {Player} player - 退室したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logRoomExit = async (pool, player) => {
  try {
    const res = await pool.query(
      "INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [getLogTime(), player.IP, player.id.toString(32), player.nickname, "OUT"]
    );
    console.log(res.rows[0]);
  } catch (e) {
    console.error("logRoomExit error:", e.message);
    console.error(e.stack);
  }
};

module.exports = {
  fetchRequests,
  saveRequest,
  logChat,
  logRoomEntry,
  logRoomExit,
};
