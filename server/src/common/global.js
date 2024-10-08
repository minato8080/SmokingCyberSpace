/**
 * グローバル変数オブジェクト
 * @typedef {Object} Global
 * @property {Record<string, import('../models/Player').Player>} players - プレイヤーオブジェクトを格納するオブジェクト
 * @property {string[]} requestlist - リクエストされた動画IDのリスト
 * @property {string[]} whoserequest - リクエストしたプレイヤーの名前のリスト
 * @property {import('socket.io').Server|null} io - Socket.IOサーバーインスタンス
 */

/** @type {Global} */
exports.global = {
  players: {},
  requestlist: [],
  whoserequest: [],
  io: null,
};
