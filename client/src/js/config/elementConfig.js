const canvas = $("#canvas-2d")[0];
const context = canvas.getContext("2d");

const mapImage = $("#map-image")[0];
const mapImageZ1 = $("#map-image-z1")[0];
const smoky = $("#smoky")[0];

const chatboxTop = $("#top")[0];
const chatboxMiddle = $("#middle")[0];
const chatboxUnder = $("#under")[0];

const startScreen = $("#start-screen");
const Controler = $("#controler")[0];
const youtubePlayer = $("#youtube");
const nicknameInput = $("#nickname");
const messageForm = $("#message_form");
const inputMsg = $("#input_msg");
const avatarInput = $("#avatar").avatar;

const startButton = $("#start");
const selectButton = $("#select");
const sousinButton = $("#sousin");

const masi = document.getElementById("masi");
const tatu = document.getElementById("tatu");

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
  avatarInput,
  selectButton,
  youtubePlayer,
  masi,
  tatu,
};
