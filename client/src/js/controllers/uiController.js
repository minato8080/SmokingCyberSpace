import { movement, state, radio } from "../models/gameObjects";
import {
  emitSmoke,
  emitSmokeEnd,
  emitMovement,
} from "../services/socketService";

export function initializeUIController() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isSmartPhone = /iphone|ipod|ipad|android/.test(userAgent);
  const leftButton = document.getElementById("left");
  const rightButton = document.getElementById("right");
  const eventStart = isSmartPhone ? "touchstart" : "mousedown";
  const eventEnd = isSmartPhone ? "touchend" : "mouseup";
  const eventLeave = isSmartPhone ? "touchmove" : "mouseleave";
  //イベントハンドラ
  [leftButton, rightButton].forEach((button, index) => {
    const isLeft = index === 0;
    button.addEventListener(eventStart, (e) => {
      e.preventDefault();
      movement.right = !isLeft;
      movement.left = isLeft;
      state.isMove = true;
      emitMovement(movement, state.isMove);
    });
    [eventEnd, eventLeave].forEach((event) => {
      button.addEventListener(event, (e) => {
        e.preventDefault();
        const elem = isSmartPhone
          ? document.elementFromPoint(
              e.touches?.[0].clientX,
              e.touches?.[0].clientY
            )
          : button;
        if (event === eventEnd || !isSmartPhone || elem !== button) {
          movement.right = movement.left = false;
          state.isMove = false;
          emitMovement(movement, state.isMove);
        }
      });
    });
  });

  $("#A").click(function () {
    emitSmoke();
  });

  $("#B").click(function () {
    if (radio.radioOK(state.myPlayerPos)) {
      radio.radioMessenger();
    } else {
      emitSmokeEnd();
    }
  });
}
