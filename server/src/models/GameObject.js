const { APP } = require("../common/const");

/**
 * ゲームオブジェクトの基底クラス
 */
class GameObject {
  constructor(obj = {}) {
    this.id = Math.floor(Math.random() * 100000000);
    this.x = obj.x;
    this.y = obj.y;
    this.width = obj.width;
    this.height = obj.height;
  }

  /**
   * オブジェクトを指定された距離だけ移動させる
   * @param {number} distance - 移動距離
   * @returns {boolean} 移動が成功したかどうか
   */
  move(distance) {
    const oldX = this.x;

    this.x += distance;

    let collision = false;
    if (this.x < -APP.ZERO_POSITION || this.x >= APP.MAX_POSITION) {
      collision = true;
    }

    if (collision) {
      this.x = oldX;
    }
    return !collision;
  }

  /**
   * 他のオブジェクトとの交差を判定する
   * @param {GameObject} obj - 判定対象のオブジェクト
   * @returns {boolean} 交差しているかどうか
   */
  intersect(obj) {
    return this.x <= obj.x + obj.width && this.x + this.width >= obj.x;
  }

  /**
   * オブジェクトの情報をJSON形式で返す
   * @returns {Object} オブジェクトの情報を含むJSONオブジェクト
   */
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
module.exports = GameObject;
