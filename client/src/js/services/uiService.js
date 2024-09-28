import { emitGameStart, emitMessage } from "./socketService";

export const canvas = $("#canvas-2d")[0];
export const context = canvas.getContext("2d");
export const mapImage = $("#map-image")[0];
export const mapImageZ1 = $("#map-image-z1")[0];
export const Controler = $("#controler")[0];
export const smoky = $("#smoky")[0];
export const chatboxTop = $("#top")[0];
export const chatboxMiddle = $("#middle")[0];
export const chatboxUnder = $("#under")[0];

function gameStart() {
  $.cookie("SCS_user_nickname", $("#nickname").val());
  emitGameStart(
    $("#nickname").val(),
    document.getElementById("avatar").avatar.value
  );
  $("#start-screen").hide();
}

export function initializeUI() {
  $(function () {
    if (
      $.cookie("SCS_user_nickname") !== "undefined" &&
      $.cookie("SCS_user_nickname") !== null
    )
      $("#nickname").val($.cookie("SCS_user_nickname"));
  });

  $("#start-button").on("click", gameStart);

  $("#message_form").submit(function () {
    emitMessage($("#input_msg").val());
    $("#input_msg").val("");
    return false;
  });

  $("#sousin").on("click", function () {
    emitMessage($("#input_msg").val());
    $("#input_msg").val("");
    return false;
  });
  
}
