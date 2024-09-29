export default class Helios {
  constructor() {
    this.x = 0;
    this.y = 540;
    this.msg = "Welcome to\\nSmoking Cyber Space!";
  }
  heliosOK(myplayerpos) {
    if (-130 < myplayerpos && myplayerpos < 130) return true;
    else if (-425 === myplayerpos) {
      this.msg = "There is no\\nway.";
      return true;
    } else if (-420 === myplayerpos) {
      this.msg = "Welcome to\\nSmoking Cyber Space!";
      return false;
    } else return false;
  }
}
