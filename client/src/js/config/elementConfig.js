/** @type {HTMLCanvasElement} */
const canvas = $("#canvas-2d")[0];
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

/** @type {HTMLImageElement} */
const mapImage = $("#map-image")[0];
/** @type {HTMLImageElement} */
const mapImageZ1 = $("#map-image-z1")[0];
/** @type {HTMLImageElement} */
const smoky = $("#smoky")[0];

/** @type {HTMLImageElement} */
const chatboxTop = $("#top")[0];
/** @type {HTMLImageElement} */
const chatboxMiddle = $("#middle")[0];
/** @type {HTMLImageElement} */
const chatboxUnder = $("#under")[0];

/** @type {HTMLImageElement} */
const masi = $("#masi")[0];
/** @type {HTMLImageElement} */
const tatu = $("#tatu")[0];

/** @type {JQuery<HTMLElement>} */
const startScreen = $("#start-screen");
/** @type {JQuery<HTMLElement>} */
const gameStartButton = $("#game-start-button");
/** @type {JQuery<HTMLElement>} */
const Controler = $("#controler");
/** @type {JQuery<HTMLElement>} */
const youtubePlayer = $("#youtube");
/** @type {JQuery<HTMLElement>} */
const nicknameInput = $("#nickname");
/** @type {JQuery<HTMLElement>} */
const messageForm = $("#message_form");
/** @type {JQuery<HTMLElement>} */
const inputMsg = $("#input_msg");

/** @type {JQuery<HTMLElement>} */
const startButton = $("#start");
/** @type {JQuery<HTMLElement>} */
const selectButton = $("#select");
/** @type {JQuery<HTMLElement>} */
const sousinButton = $("#sousin");
/** @type {JQuery<HTMLElement>} */
const leftButton = $("#left");
/** @type {JQuery<HTMLElement>} */
const rightButton = $("#right");
/** @type {JQuery<HTMLElement>} */
const buttonA = $("#A");
/** @type {JQuery<HTMLElement>} */
const buttonB = $("#B");

/** @type {{ masi: HTMLImageElement, tatu: HTMLImageElement }} */
const Avatars = {
  masi,
  tatu,
};
/** @type {HTMLInputElement} */
const avatarInput = $("#avatar").avatar;

export {
  canvas,
  context,
  mapImage,
  mapImageZ1,
  Controler,
  smoky,
  chatboxTop,
  chatboxMiddle,
  chatboxUnder,
  nicknameInput,
  startButton,
  messageForm,
  inputMsg,
  sousinButton,
  startScreen,
  gameStartButton,
  selectButton,
  youtubePlayer,
  masi,
  tatu,
  Avatars,
  avatarInput,
  leftButton,
  rightButton,
  buttonA,
  buttonB,
};
