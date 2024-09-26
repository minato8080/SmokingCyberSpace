const GameObject = require("./GameObject");

/**
 * プレイヤークラス
 */
class Player extends GameObject {
  constructor(obj = {}) {
    super(obj);
    this.IP = obj.IP;
    this.socketId = obj.socketId;
    if (obj.nickname === "") this.nickname = "anonymous";
    else {
      this.nickname = obj.nickname;
    }
    this.avatar = obj.avatar;
    this.width = 480;
    this.height = 480;
    this.x = -70;
    this.y = 480;
    this.angle = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 5;
    this.isMove = false;
    this.movement = {};

    this.msg = "";
    this.msgCountDown = 0;

    this.isSmokeAction = false;
    this.smokeActionCountDown = 0;
    this.smokeActionFrame = 0;

    this.isSmoking = false;
    this.smokingCountDown = 0;
    this.smokingFrame = 0;
  }
  
  toJSON() {
    return Object.assign(super.toJSON(), {
      avatar: this.avatar,
      socketId: this.socketId,
      nickname: this.nickname,
      msg: this.msg,
      angle: this.angle,
      isMove: this.isMove,
      frameX: this.frameX,
      frameY: this.frameY,
      isSmoking: this.isSmoking,
      isSmokeAction: this.isSmokeAction,
      smokeActionFrame: this.smokeActionFrame,
      smokingFrame: this.smokingFrame,
    });
  }
}
module.exports = Player;
