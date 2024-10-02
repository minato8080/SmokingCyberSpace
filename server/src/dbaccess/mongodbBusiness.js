const { global } = require("../common/global");
const { APP } = require("../common/const");
const { getLogDate, weekhead, getLogTime } = require("../util/log");
/**
 * @typedef {import('mongodb').MongoClient} MongoClient
 * @typedef {import('@/server/src/models/types/Player').Player} Player
 */

/**
 * リクエストを取得する関数
 * 指定された期間内のリクエストをデータベースから取得し、グローバル変数に格納します。
 * @param {MongoClient} client - MongoDBクライアント
 * @returns {Promise<void>}
 */
const fetchRequests = async (client) => {
  try {
    await client.connect();
    const database = client.db(APP.mongoDBName);
    const collection = database.collection("requestlist");

    const requests = await collection
      .find({
        date: { $gte: weekhead(), $lte: getLogDate() },
      })
      ?.toArray();

    // 取得したデータをグローバル変数に格納
    requests?.forEach((request) => {
      global.requestlist.push(request.videoid);
      global.whoserequest.push(request.name);
    });
    console.log(global.requestlist);
  } catch (e) {
    // エラーハンドリング
    console.error("fetchRequests error:", e.message);
    console.error(e.stack);
  } finally {
    await client.close();
  }
};

/**
 * リクエストをデータベースに保存する関数
 * @param {MongoClient} client - MongoDBクライアント
 * @param {Player} player - リクエストを送信したプレイヤーオブジェクト
 * @param {string} videoId - 保存する動画ID
 * @returns {Promise<void>}
 */
const saveRequest = async (client, player, videoId) => {
  try {
    await client.connect();
    const database = client.db(APP.mongoDBName);
    const collection = database.collection("requestlist");

    const result = await collection.insertOne({
      date: getLogDate(),
      ip: player.IP,
      id: player.id.toString(32),
      name: player.nickname,
      videoid: videoId,
    });

    console.log(result.insertedId);
  } catch (e) {
    console.error("saveRequest error:", e.message);
    console.error(e.stack);
  } finally {
    await client.close();
  }
};

/**
 * チャットメッセージをデータベースに記録する関数
 * @param {MongoClient} client - MongoDBクライアント
 * @param {Player} player - チャットメッセージを送信したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logChat = async (client, player) => {
  try {
    await client.connect();
    const database = client.db(APP.mongoDBName);
    const collection = database.collection("chatlogs");

    const result = await collection.insertOne({
      time: getLogTime(),
      ip: player.IP,
      id: player.id.toString(32),
      name: player.nickname,
      message: player.msg,
    });

    console.log(result.insertedId);
  } catch (e) {
    console.error("logChat error:", e.message);
    console.error(e.stack);
  } finally {
    await client.close();
  }
};

/**
 * プレイヤーの入室をログに記録する関数
 * @param {MongoClient} client - MongoDBクライアント
 * @param {Player} player - 入室したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logRoomEntry = async (client, player) => {
  try {
    await client.connect();
    const database = client.db(APP.mongoDBName);
    const collection = database.collection("roomlogs");

    const result = await collection.insertOne({
      time: getLogTime(),
      ip: player.IP,
      id: player.id.toString(32),
      name: player.nickname,
      state: "IN",
    });

    console.log(result.insertedId);
  } catch (e) {
    console.error("logRoomEntry error:", e.message);
    console.error(e.stack);
  } finally {
    await client.close();
  }
};

/**
 * プレイヤーの退室をログに記録する関数
 * @param {MongoClient} client - MongoDBクライアント
 * @param {Player} player - 退室したプレイヤーオブジェクト
 * @returns {Promise<void>}
 */
const logRoomExit = async (client, player) => {
  try {
    await client.connect();
    const database = client.db(APP.mongoDBName);
    const collection = database.collection("roomlogs");

    const result = await collection.insertOne({
      time: getLogTime(),
      ip: player.IP,
      id: player.id.toString(32),
      name: player.nickname,
      state: "OUT",
    });

    console.log(result.insertedId);
  } catch (e) {
    console.error("logRoomExit error:", e.message);
    console.error(e.stack);
  } finally {
    await client.close();
  }
};

module.exports = {
  fetchRequests,
  saveRequest,
  logChat,
  logRoomEntry,
  logRoomExit,
};
