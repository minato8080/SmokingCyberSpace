import Radio from "./radio.js";
import Helios from "./Helios.js";
import Smoke from "./Smoke.js"

const state = {
  myplayerpos: 0,
  isMove: false,
  textfloater: 0,
};

const players = {};

const helios = new Helios();

const radio = new Radio();

const smoke = new Smoke();

const movement = {};

export { state, players, helios, radio, smoke, movement };
