import { rnd } from './util.js';

export function genMaze(W, H) {
  W = W|0; H = H|0; if (W%2===0) W++; if (H%2===0) H++;
  const grid = Array.from({length:H}, () => Array(W).fill(1)); // 1=벽, 0=길
  function carve(x,y){
    grid[y][x]=0;
    const dirs=[[2,0],[0,2],[-2,0],[0,-2]];
    for (let i=dirs.length-1;i>0;i--){
      const j=(rnd()* (i+1))|0; [dirs[i],dirs[j]]=[dirs[j],dirs[i]];
    }
    for(const [dx,dy] of dirs){
      const nx=x+dx, ny=y+dy;
      if(nx>0&&ny>0&&nx<W-1&&ny<H-1 && grid[ny][nx]===1){
        grid[(y+ny)/2|0][(x+nx)/2|0]=0;
        carve(nx,ny);
      }
    }
  }
  carve(1,1);
  grid[H-2][W-2]=0;
  return {grid,W,H};
}

export function shortestSteps(grid, sx, sy, tx, ty){
  const H=grid.length, W=grid[0].length;
  const q=[[sx,sy,0]]; const vis=new Set([sy*W+sx]);
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  while(q.length){
    const [x,y,d]=q.shift();
    if(x===tx&&y===ty) return d;
    for(const [dx,dy] of dirs){
      const nx=x+dx, ny=y+dy;
      if(nx>=0&&ny>=0&&nx<W&&ny<H && grid[ny][nx]===0){
        const k=ny*W+nx;
        if(!vis.has(k)){ vis.add(k); q.push([nx,ny,d+1]); }
      }
    }
  }
  return Infinity;
}

export function randomFloorSpots(grid){
  const H=grid.length, W=grid[0].length; const spots=[];
  for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++) if(grid[y][x]===0) spots.push([x,y]);
  return spots;
}

export function placeCoins(grid, count, avoid){
  const spots = randomFloorSpots(grid).filter(([x,y])=>!avoid.has(`${x},${y}`));
  const coins=new Set();
  for(let i=0;i<count && spots.length;i++){
    const idx=(rnd()*spots.length)|0; const [x,y]=spots.splice(idx,1)[0]; coins.add(`${x},${y}`);
  }
  return coins;
}

export function placeItems(grid, count, avoid){
  const spots = randomFloorSpots(grid).filter(([x,y])=>!avoid.has(`${x},${y}`));
  const items=new Map();
  for(let i=0;i<count && spots.length;i++){
    const idx=(rnd()*spots.length)|0; const [x,y]=spots.splice(idx,1)[0]; items.set(`${x},${y}`, {kind:'unknown'});
  }
  return items;
}
