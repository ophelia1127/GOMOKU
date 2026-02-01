import type { Player } from "./Board";

export function aiMove(grid: Player[][]): [number, number] {
  let best: [number, number] = [7, 7];
  let bestScore = -1;

  const dirs = [[1,0],[0,1],[1,1],[1,-1]];

  const score = (x:number,y:number,p:Player) => {
    let s = 0;
    for (const [dx,dy] of dirs) {
      let c = 1;
      for (const d of [1,-1]) {
        let nx=x+dx*d, ny=y+dy*d;
        while (grid[ny]?.[nx]===p) {
          c++; nx+=dx*d; ny+=dy*d;
        }
      }
      if (c>=5) s+=100000;
      else if (c===4) s+=10000;
      else if (c===3) s+=1000;
    }
    return s;
  };

  for (let y=0;y<15;y++)
    for (let x=0;x<15;x++) {
      if (grid[y][x]!==0) continue;
      const s = score(x,y,2)+score(x,y,1)*1.1;
      if (s>bestScore) {
        bestScore=s;
        best=[x,y];
      }
    }

  return best;
}
