export default class Radio {
  constructor() {
    this.x = 795;
    this.y = 650;
    this.msg = "Press B key";
    this.Pages = 1;
    this.playList = [];
    this.whoserequest = [];
    this.isPlaying = false;
    this.nextNumber = -1;
  }

  whatPlaying() {
    return {
      x: 805,
      y: 550,
      msg:
        "No." + (this.nextNumber + 1) + " requested by " + this.whoserequest[this.nextNumber],
    };
  }

  radioOK(myplayerpos) {
    if (680 < myplayerpos && myplayerpos < 910) return true;
    else return false;
  }

  radioPageUpdate() {
    if (this.Pages === 2)
      this.msg =
        "There are " +
        this.playList.length +
        "\\nrequests this week.Play with START key.";
  }

  radioMessenger() {
    const messages = [
      `${this.playList.length}件のリクエスト。STARTで再生。`,
      "SELECTで曲を変更。",
      "YouTubeのURLでリクエスト可能。",
      this.isPlaying ? "♪♪♪♪♪♪" : "",
    ];
    this.msg = messages[this.Pages - 1];
    this.Pages = (this.Pages % 4) + 1;
  }
}
