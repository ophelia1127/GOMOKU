export type Player = 0 | 1 | 2;
type Anim = { x: number; y: number; r: number };

export class Board {
  SIZE = 15;
  CELL = 40;
  OFFSET = 20;
  grid: Player[][] = Array.from({ length: 15 }, () => Array(15).fill(0));
  anims: Anim[] = [];

  reset() {
    this.grid = Array.from({ length: 15 }, () => Array(15).fill(0));
    this.anims = [];
  }

  place(x: number, y: number, p: Player) {
    if (this.grid[y]?.[x] !== 0) return false;
    this.grid[y][x] = p;
    this.anims.push({ x, y, r: 2 });
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, 640, 640);

    // 棋盘线
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(this.OFFSET, this.OFFSET + i * this.CELL);
      ctx.lineTo(this.OFFSET + 14 * this.CELL, this.OFFSET + i * this.CELL);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.OFFSET + i * this.CELL, this.OFFSET);
      ctx.lineTo(this.OFFSET + i * this.CELL, this.OFFSET + 14 * this.CELL);
      ctx.stroke();
    }

    // 已有棋子
    for (let y = 0; y < 15; y++)
      for (let x = 0; x < 15; x++)
        if (this.grid[y][x])
          this.drawStone(ctx, x, y, this.grid[y][x], 16, false);

    // 动画棋子
    for (let i = this.anims.length - 1; i >= 0; i--) {
      const a = this.anims[i];
      a.r += 2.5;
      this.drawStone(ctx, a.x, a.y, this.grid[a.y][a.x], a.r, true);
      if (a.r >= 16) this.anims.splice(i, 1);
    }
  }

  drawStone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    p: Player,
    r: number,
    shadow: boolean
  ) {
    ctx.beginPath();
    ctx.arc(
      this.OFFSET + x * this.CELL,
      this.OFFSET + y * this.CELL,
      r,
      0,
      Math.PI * 2
    );

    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
    }

    ctx.fillStyle = p === 1 ? "#111" : "#f9f9f9";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  checkWin(x: number, y: number, p: Player) {
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    for (const [dx, dy] of dirs) {
      let c = 1;
      for (const d of [1, -1]) {
        let nx = x + dx * d, ny = y + dy * d;
        while (this.grid[ny]?.[nx] === p) {
          c++; nx += dx * d; ny += dy * d;
        }
      }
      if (c >= 5) return true;
    }
    return false;
  }
}
