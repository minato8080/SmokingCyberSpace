/** @type {HTMLCanvasElement} */
const canvas = $("#canvas2d")[0];
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

/** @type {HTMLImageElement} */
const mapImage = $("#mapImage")[0];
/** @type {HTMLImageElement} */
const mapImageZ1 = $("#mapImageZ1")[0];
/** @type {HTMLImageElement} */
const smokyImage = $("#smokyImage")[0];

/** @type {HTMLImageElement} */
const chatboxTop = $("#chatboxTop")[0];
/** @type {HTMLImageElement} */
const chatboxMiddle = $("#chatboxMiddle")[0];
/** @type {HTMLImageElement} */
const chatboxUnder = $("#chatboxUnder")[0];

/** @type {HTMLImageElement} */
const masiImage = $("#masiImage")[0];
/** @type {HTMLImageElement} */
const tatuImage = $("#tatuImage")[0];

/** @type {JQuery<HTMLElement>} */
const startScreen = $("#startScreen");
/** @type {JQuery<HTMLElement>} */
const gameStartButton = $("#gameStartButton");
/** @type {JQuery<HTMLElement>} */
const controler = $("#controler");
/** @type {JQuery<HTMLElement>} */
const youtubePlayer = $("#youtubePlayer");
/** @type {JQuery<HTMLElement>} */
const nicknameInput = $("#nicknameInput");
/** @type {JQuery<HTMLElement>} */
const messageForm = $("#messageForm");
/** @type {JQuery<HTMLElement>} */
const inputMessage = $("#inputMessage");

/** @type {JQuery<HTMLElement>} */
const startButton = $("#startButton");
/** @type {JQuery<HTMLElement>} */
const selectButton = $("#selectButton");
/** @type {JQuery<HTMLElement>} */
const sendButton = $("#sendButton");
/** @type {JQuery<HTMLElement>} */
const leftButton = $("#leftButton");
/** @type {JQuery<HTMLElement>} */
const rightButton = $("#rightButton");
/** @type {JQuery<HTMLElement>} */
const buttonA = $("#buttonA");
/** @type {JQuery<HTMLElement>} */
const buttonB = $("#buttonB");

/** @type {{ masi: HTMLImageElement, tatu: HTMLImageElement }} */
const avatars = {
  masi: masiImage,
  tatu: tatuImage,
};
/** @type {HTMLInputElement} */
const avatarInput = $("#avatarArea").avatar;

export {
  canvas,
  context,
  mapImage,
  mapImageZ1,
  controler,
  smokyImage,
  chatboxTop,
  chatboxMiddle,
  chatboxUnder,
  nicknameInput,
  startButton,
  messageForm,
  inputMessage,
  sendButton,
  startScreen,
  gameStartButton,
  selectButton,
  youtubePlayer,
  masiImage,
  tatuImage,
  avatars,
  avatarInput,
  leftButton,
  rightButton,
  buttonA,
  buttonB,
};
