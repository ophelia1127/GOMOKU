import { Board } from "./Board";
import { aiMove } from "./AI";

const canvas = document.getElementById("board") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const status = document.getElementById("status")!;
const restartBtn = document.getElementById("restart")!;

let board = new Board();
let gameOver = false;

function loop() {
  board.draw(ctx);
  requestAnimationFrame(loop);
}
loop();

canvas.onclick = (e) => {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left - 20) / 40);
  const y = Math.round((e.clientY - rect.top - 20) / 40);

  if (!board.place(x, y, 1)) return;

  if (board.checkWin(x, y, 1)) {
    status.textContent = "🎉 你赢了！";
    gameOver = true;
    return;
  }

  const [ax, ay] = aiMove(board.grid);
  board.place(ax, ay, 2);

  if (board.checkWin(ax, ay, 2)) {
    status.textContent = "🤖 AI 赢了";
    gameOver = true;
  }
};

restartBtn.onclick = () => {
  board.reset();
  gameOver = false;
  status.textContent = "轮到你（黑棋）";
};
