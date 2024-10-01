const movespeed = 3;

const DisplayTop = 0;
const DisplayCenter = 1750;

const textcolor = "rgb(118,114,80)";
const textfont = "40px misaki2";
const BACKGROUND_COLOR = "rgb(62,12,15)";

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
  movespeed,
  DisplayTop,
  DisplayCenter,
  textcolor,
  textfont,
  BACKGROUND_COLOR,
  textMargin,
  textOneline,
  isSmartPhone,
};
