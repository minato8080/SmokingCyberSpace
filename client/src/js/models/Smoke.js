import { DisplayCenter, movespeed } from "../config/gameConfig";

export default class Smoke {
  constructor() {
    this.FrameY = 0;
    this.FrameX = 0;
    this.width = 110;
    this.height = 55;
    this.x = 0;
    this.y = 20;
    this.Animated = false;
  }
  SmokeDrawer(context, smoky, player, socket) {
    if (!this.Animated) {
      this.FrameY = player.frameY === player.height * 4 ? 0 : this.height;
      this.x = player.frameY === player.height * 4 ? 80 : 290;

      const frameIndex = player.frameX / player.width - 4;
      if (frameIndex >= 0 && frameIndex <= 3) {
        this.FrameX = this.width * frameIndex;
        this.Animated = frameIndex === 3;

        const num =
          player.socketId !== socket.id
            ? (player.x - state.myplayerpos) * movespeed
            : 0;
        context.drawImage(
          smoky,
          this.FrameX,
          this.FrameY,
          this.width,
          this.height,
          num + DisplayCenter - 240 + this.x,
          960 - player.height + this.y,
          this.width,
          this.height
        );
      }
    }
  }
}
