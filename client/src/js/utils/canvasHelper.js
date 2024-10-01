import { canvas } from "../config/elementConfig";
import { BACKGROUND_COLOR } from "../config/gameConfig";

/**
 * キャンバスを初期化する関数
 * @returns {{canvas:HTMLCanvasElement,context:CanvasRenderingContext2D}}
 */
export function initializeCanvas() {
  const context = canvas.getContext("2d");

  // キャンバスの初期設定
  context.lineWidth = 10;
  context.fillStyle = BACKGROUND_COLOR;

  return { canvas, context };
}

/**
 * キャンバスをクリアする関数
 * @param {CanvasRenderingContext2D} context - キャンバスのコンテキスト
 * @param {HTMLCanvasElement} canvas - キャンバス要素
 */
export function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
