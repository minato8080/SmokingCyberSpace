const { ZERO_POSITION, MAX_POSITION } = require("../common/const");

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
  move(distance) {
    const oldX = this.x;

    this.x += distance;

    let collision = false;
    if (this.x < -ZERO_POSITION || this.x >= MAX_POSITION) {
      collision = true;
    }

    if (collision) {
      this.x = oldX;
    }
    return !collision;
  }
  intersect(obj) {
    return this.x <= obj.x + obj.width && this.x + this.width >= obj.x;
  }
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
