export let isDone = false;
import { radio } from "../models/gameObjects";
import { isSmartPhone } from "../config/gameConfig";

let ytPlayer;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("youtube", {
    height: "0",
    width: "0",
    playsinline: 1,
    events: {
      onReady: onYouTubePlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
  console.log("iframe api ready");
}

function onYouTubePlayerReady(event) {
  console.log("player ready");
  //スマホでインライン再生は未解決
  /*if (isSmartPhone) {
        ytPlayer.playsinline = 0;
    }*/
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    radio.nextNumber += 1;
    if (radio.playList.length === radio.nextNumber) {
      radio.nextNumber = 0;
    }
    ytPlayer.loadVideoById({ videoId: radio.playList[radio.nextNumber] });
    ytPlayer.playVideo();
    radio.msg = "Next No." + radio.nextNumber + 1;
  }
  if (event.data == YT.PlayerState.BUFFERING) {
    radio.msg = "LOADING..";
  }
  if (event.data == YT.PlayerState.CUED) {
    radio.msg = "READY";
  }
  if (event.data == YT.PlayerState.PLAYING) {
    radio.msg = "♪♪♪♪♪♪";
    radio.isPlaying = true;
  }
  if (event.data == YT.PlayerState.PAUSED) {
    radio.msg = "PAUSED";
  }
}

export function createYouTubePlayer() {
  if (!YT.loaded) {
    console.log("YouTube Player API is still loading.  Retrying...");
    setInterval(createYouTubePlayer, 1000);
    return;
  }
  console.log("YouTube Player API is loaded.  Creating player instance now.");

  ytPlayer = new YT.Player("youtube", {
    height: "0",
    width: "0",
    playsinline: 1,
    origin: window.location.origin,
    enablejsapi: 1,
    events: {
      onReady: onYouTubePlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
  console.log("iframe api ready");
}

export function initializeMusic() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";

  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  createYouTubePlayer();

  $("#start").click(function () {
    if (radio.playList.length !== 0) {
      if (!isSmartPhone()) {
        //最初の一回
        if (!isDone) {
          radio.nextNumber += 1;
          if (radio.playList.length < radio.nextNumber) {
            radio.nextNumber = 0;
          }
          ytPlayer.loadVideoById({ videoId: radio.playList[radio.nextNumber] });
          isDone = true;
          return;
        } else if (radio.isPlaying) {
          ytPlayer.pauseVideo();
          return;
        } else {
          ytPlayer.playVideo();
          return;
        }
      } else {
        if (!isDone) {
          radio.nextNumber += 1;
          if (radio.playList.length < radio.nextNumber) {
            radio.nextNumber = 0;
          }
          ytPlayer.loadVideoById({ videoId: radio.playList[radio.nextNumber] });
          isDone = true;
          return;
        } else {
          ytPlayer.playVideo();
          return;
        }
      }
    }
  });

  $("#select").click(function () {
    if (radio.playList.length !== 0) {
      radio.nextNumber += 1;
      if (radio.playList.length < radio.nextNumber) radio.nextNumber = 0;
      ytPlayer.loadVideoById({ videoId: radio.playList[radio.nextNumber] });
      radio.msg = "Next No." + (radio.nextNumber + 1);
      return;
    }
  });
}