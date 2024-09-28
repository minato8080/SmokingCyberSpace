import { movement, state, radio } from "../models/gameObjects";
import {
  emitSmoke,
  emitSmokeEnd,
  emitMovement,
} from "../services/socketService";

export function initializeKeyboardControls(socket, gameObjects) {
  $(document).on("keydown keyup", (event) => {
    const INPUTS = ["INPUT", "TEXTAREA"];
    const KeyToCommand = {
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const command = KeyToCommand[event.key];
    if (command && INPUTS.indexOf(event.target.tagName) == -1) {
      if (event.type === "keydown") {
        movement[command] = true;
        isMove = true;
      } else {
        /* keyup */
        movement[command] = false;
        isMove = false;
      }
      emitMovement(movement, isMove);
    }
    if (
      event.key === "a" &&
      event.type === "keydown" &&
      INPUTS.indexOf(event.target.tagName) == -1
    ) {
      emitSmoke();
    }
    if (
      event.key === "b" &&
      event.type === "keydown" &&
      INPUTS.indexOf(event.target.tagName) == -1
    ) {
      if (radio.radioOK(state.myplayerpos)) {
        radio.radioMessenger();
      } else {
        emitSmokeEnd();
      }
    }
  });
}
