import { masi,tatu } from "./elementConfig";

const Avatars = {
  masi,
  tatu,
};

const movespeed = 3;

const DisplayTop = 0;
const DisplayCenter = 1750;

const textcolor = "rgb(118,114,80)";
const textfont = "40px misaki2";

const textMargin = 60;
const textOneline = 6.5;

const isSmartPhone = function () {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
};

export {
  Avatars,
  movespeed,
  DisplayTop,
  DisplayCenter,
  textcolor,
  textfont,
  textMargin,
  textOneline,
  isSmartPhone,
};
