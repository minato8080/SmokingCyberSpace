import { canvas } from "../services/uiService";

/**
 * キャンバスを初期化する関数
 * @returns {Object} キャンバスとコンテキストのオブジェクト
 */
export function initializeCanvas() {
  const context = canvas.getContext("2d");

  // キャンバスの初期設定
  context.lineWidth = 10;
  context.fillStyle = "rgb(62,12,15)";

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
