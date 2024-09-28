const Avatars = {
  masi: $("#masi")[0],
  tatu: $("#tatu")[0],
};

const movespeed = 3;
const DisplayTop = 0;
const DisplayCenter = 1750;
const isSmartPhone = function () {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
};
const textcolor = "rgb(118,114,80)";
const textfont = "40px misaki2";
const margin = 60;
const oneline = 6.5;

export {
  Avatars,
  movespeed,
  DisplayTop,
  DisplayCenter,
  isSmartPhone,
  textcolor,
  textfont,
  margin,
  oneline,
};
