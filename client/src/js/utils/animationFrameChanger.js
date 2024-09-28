import { smoke } from "../models/gameObjects";
import { loop } from "../services/animationService";

/**
 * 喫煙アクションのフレームを変更する関数
 * @param {Object} player - プレイヤーオブジェクト
 */
function SmokeActionFrameChanger(player) {
  if (player.angle < 0) {
    if (player.smokeActionFrame <= 14) {
      player.frameY = player.height * 2;
    } else {
      player.frameY = player.height * 4;
    }
  } else if (player.angle > 0) {
    if (player.smokeActionFrame <= 14) {
      player.frameY = player.height * 3;
    } else {
      player.frameY = player.height * 5;
    }
  }

  switch (player.avatar) {
    case "masi":
      {
        const frames = [
          0, 1, 2, 3, 4, 5, 6, 7, 6, 7, 6, 7, 8, 9, 3, 3, 3, 3, 2, 1, 4, 5, 6,
          7,
        ];
        player.frameX = player.width * frames[player.smokeActionFrame];
        if (player.smokeActionFrame === 0) {
          smoke.Animated = false;
        }
      }
      break;
    case "tatu":
      {
        const frames = [
          0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 8, 9, 9, 9, 3, 3, 3, 2, 1, 4, 5, 6,
          7,
        ];
        player.frameX = player.width * frames[player.smokeActionFrame];
        if (player.smokeActionFrame === 0) {
          smoke.Animated = false;
        }
      }
      break;
  }
}

/**
 * 喫煙中のフレームを変更する関数
 * @param {Object} player - プレイヤーオブジェクト
 * @param {number} frame8_4fps - 8フレームごとに4回更新されるフレーム
 */
function SmokingFrameChanger(player, frame8_4fps) {
  player.frameY = player.height * (player.angle < 0 ? 4 : 5);

  if (player.isMove) {
    const frames = player.avatar === "masi" ? [0, 8, 0, 9] : [9, 8, 9, 10];
    player.frameX = player.width * frames[frame8_4fps % 4];
  } else {
    const frame = player.smokingFrame % 32;
    if (frame < 4) {
      player.frameX = player.width * frame;
    } else if (frame === 12) {
      player.frameX = 0;
      smoke.Animated = false;
    } else if (frame >= 13 && frame <= 16) {
      player.frameX = player.width * (frame - 9);
    } else if ([20, 21, 22, 23, 28, 29, 30, 31].includes(frame)) {
      player.frameX = player.width * ((frame % 4) + 4);
    } else {
      player.frameX = 0;
    }
  }
}

/**
 * アイドル状態のフレームを変更する関数
 * @param {Object} player - プレイヤーオブジェクト
 * @param {number} frame8_4fps - 8フレームごとに4回更新されるフレーム
 */
function IdleFrameChanger(player, frame8_4fps) {
  player.frameY = player.height;
  const baseFrame = player.angle < 0 ? 0 : 5;
  player.frameX =
    player.width * (baseFrame + (frame8_4fps < 4 ? 0 : frame8_4fps - 3));
}

const walkFrames = {
  masi: {
    left: [0, 1, 0, 2],
    right: [3, 4, 3, 5],
  },
  tatu: {
    left: [1, 0, 1, 2],
    right: [4, 3, 4, 5],
  },
};
/**
 * 歩行状態のフレームを変更する関数
 * @param {Object} player - プレイヤーオブジェクト
 * @param {number} frame8_4fps - 8フレームごとに4回更新されるフレーム
 */
function WalkFrameChanger(player, frame8_4fps) {
  const direction = player.angle < 0 ? "left" : "right";
  const frames = walkFrames[player.avatar][direction];
  player.frameY = 0;
  player.frameX = player.width * frames[frame8_4fps % 4];
}

/**
 * プレイヤーのフレームを変更する関数
 * @param {Object} player - プレイヤーオブジェクト
 */
export function PlayerFrameChanger(player) {
  const { frame8_4fps } = loop;

  if (player.isSmokeAction) {
    // 喫煙アクション
    SmokeActionFrameChanger(player);
  } else if (player.isSmoking) {
    // 喫煙アイドル状態
    SmokingFrameChanger(player, frame8_4fps);
  } else if (player.isMove) {
    // 歩行状態
    WalkFrameChanger(player, frame8_4fps);
  } else {
    // アイドル状態
    IdleFrameChanger(player, frame8_4fps);
  }
}
