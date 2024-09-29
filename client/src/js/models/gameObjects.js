import Radio from "./radio.js";
import Helios from "./Helios.js";
import Smoke from "./Smoke.js";

const state = {
  myPlayerPos: 0,
  textFloater: 0,
  age: 0,
  frame4_1fps: 0,
  frame8_4fps: 0,
  isMove: false,
  isYtPlayerLoadVideoById: false,
};

const players = {};

const helios = new Helios();

const radio = new Radio();

const smoke = new Smoke();

const movement = {};

export { state, players, helios, radio, smoke, movement };
