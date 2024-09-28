﻿"use strict";

import "../css/style.css";
import { initializeCanvas } from "./utils/canvasHelper.js";
import { initializeKeyboardControls } from "./controllers/keyboardController.js";
import { initializeUIController } from "./controllers/uiController.js";
import { initializeUI } from "./services/uiService.js";
import { initializeSocket } from "./services/socketService.js";
import { initializeMusic } from "./services/musicService.js";
import {
  initializeRendering,
  initializeAnimationLoop,
} from "./services/animationService.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = initializeSocket();
  const { canvas, context } = initializeCanvas();

  initializeUI(socket);
  initializeKeyboardControls(socket);
  initializeUIController();
  initializeMusic();
  initializeRendering(socket, canvas, context);
  initializeAnimationLoop();
});
