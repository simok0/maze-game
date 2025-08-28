import { clamp } from './util.js';
import { genMaze, shortestSteps, placeCoins, placeItems } from './maze.js';
import { drawTeacup } from './teacup.js';

export const DIFF = {
  easy:   { w: 21, h: 21, fog: 4, coins: 8, items: 3, timeLimit: 120, base: 300, B_time: 400, B_path: 400 },
  normal: { w: 29, h: 29, fog: 4, coins: 12, items: 4, timeLimit: 120, base: 700, B_time: 700, B_path: 800 },
  hard:   { w: 37, h: 37, fog: 3, coins: 16, items: 5, timeLimit: 110, base: 1500, B_time: 1200, B_path: 1400 },
};

export const state = {
  grid: [[]], W:0, H:0,
  start:[1,1], exit:[0,0],
  px:1, py:1,
  steps:0, coins:new Set(), coinsGot:0,
  items:new Map(),
  time:0, running:false, over:false,
  fogR:6, shortest:0,
  diffKey:'normal',
  effects: { booster:0, minimap:0 },
};

const LS_KEY = 'maze-fow-best';
export const best = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

export function fitCanvas(cv, ctx){
  const {W,H} = state; const tiles = Math.max(W,H);
  const pxPerTile = Math.floor( Math.min(cv.clientWidth, cv.clientHeight) / tiles );
  const ratio = window.devicePixelRatio || 1;
  cv.width  = Math.max(tiles*pxPerTile, 300) * ratio;
  cv.height = Math.max(tiles*pxPerTile, 300) * ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
}

export function draw(cv, ctx){
  const {grid,W,H, px,py, exit, coins, items} = state;
  const tiles = Math.max(W,H);
  const size = Math.floor( Math.min(cv.clientWidth, cv.clientHeight) / tiles );
  const padX = Math.max(0, (cv.clientWidth - size*W)/2);
  const padY = Math.max(0, (cv.clientHeight - size*H)/2);
  ctx.clearRect(0,0,cv.width,cv.height);
  ctx.save(); ctx.translate(padX, padY);

  const r = state.effects.minimap>0 ? 9999 : state.fogR;
  const vis = new Set();
  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      if (state.effects.minimap>0 || Math.hypot(x-px, y-py) <= r+0.01) vis.add(`${x},${y}`);
    }
  }

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const k = `${x},${y}`;
      if (!vis.has(k)) {
        ctx.fillStyle = '#06090d';
        ctx.fillRect(x*size,y*size,size,size);
        continue;
      }
      if(grid[y][x]===1){
        ctx.fillStyle = '#13202c';
        ctx.fillRect(x*size,y*size,size,size);
      } else {
        ctx.fillStyle = '#0d1520';
        ctx.fillRect(x*size,y*size,size,size);
        ctx.strokeStyle = '#0f1a27';
        ctx.lineWidth = 1; ctx.strokeRect(x*size+0.5,y*size+0.5,size-1,size-1);
      }
    }
  }

  // coins
  ctx.fillStyle = '#ffd76b';
  for(const k of coins){ const [x,y]=k.split(',').map(Number); if(vis.has(k)){
    ctx.beginPath(); ctx.arc(x*size+size/2, y*size+size/2, size*0.22, 0, Math.PI*2); ctx.fill();
  }}

  // items
  for(const [k,obj] of items){ const [x,y]=k.split(',').map(Number); if(vis.has(k)){
    drawTeacup(ctx, x*size+size/2, y*size+size/2, size*0.28);
  }}

  // exit
  if (vis.has(`${exit[0]},${exit[1]}`)){
    ctx.fillStyle = '#2bdc9a';
    ctx.fillRect(exit[0]*size+size*0.15, exit[1]*size+size*0.15, size*0.7, size*0.7);
  }

  // player
  ctx.fillStyle = '#79c0ff';
  ctx.beginPath(); ctx.arc(px*size+size/2, py*size+size/2, size*0.3, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

export function computeScore(){
  const d = DIFF[state.diffKey];
  const T_limit = d.timeLimit;
  const timeBonus = Math.max(0, (T_limit - state.time) / T_limit) * d.B_time;
  const efficiency = clamp(state.shortest / Math.max(1,state.steps), 0.5, 1.0);
  const pathBonus = efficiency * d.B_path;
  const collect = state.coinsGot * 50;
  const total = Math.round(d.base + timeBonus + pathBonus + collect);
  return {base:d.base, timeBonus:Math.round(timeBonus), pathBonus:Math.round(pathBonus), collect, total};
}

export function updateHUD(){
  document.getElementById('hud-time').textContent = state.time.toFixed(1);
  document.getElementById('hud-steps').textContent = state.steps;
  document.getElementById('hud-coins').textContent = state.coinsGot;
  document.getElementById('hud-score').textContent = computeScore().total;
  document.getElementById('hud-best').textContent = (JSON.parse(localStorage.getItem('maze-fow-best')||'{}'))[state.diffKey]||0;
  const eff = [];
  if(state.effects.booster>0) eff.push(`부스터 ${state.effects.booster.toFixed(1)}s`);
  if(state.effects.minimap>0) eff.push(`미니맵 ${state.effects.minimap.toFixed(1)}s`);
  const effEl = document.getElementById('hud-effects');
  if(eff.length){ effEl.style.display=''; effEl.textContent = eff.join(' · '); } else { effEl.style.display='none'; }
}

export function newGame(diffKey, cv, ctx){
  state.diffKey = diffKey;
  const d = DIFF[diffKey];
  const {grid,W,H} = genMaze(d.w, d.h);
  state.grid=grid; state.W=W; state.H=H;
  state.start=[1,1]; state.exit=[W-2,H-2];
  state.px=1; state.py=1; state.steps=0; state.coinsGot=0; state.time=0; state.running=true; state.over=false; state.effects.booster=0; state.effects.minimap=0;
  const avoid = new Set([`${state.start[0]},${state.start[1]}`, `${state.exit[0]},${state.exit[1]}`]);
  state.coins = placeCoins(grid, d.coins, avoid);
  for(const k of state.coins) avoid.add(k);
  state.items = placeItems(grid, d.items, avoid);
  state.shortest = shortestSteps(grid, state.start[0], state.start[1], state.exit[0], state.exit[1]);
  state.fogR = d.fog;
  fitCanvas(cv, ctx); draw(cv, ctx); updateHUD();
}

export function stepOnce(dx,dy, cv, ctx){
  const nx = state.px+dx, ny = state.py+dy;
  if(nx<0||ny<0||nx>=state.W||ny>=state.H) return false;
  if(state.grid[ny][nx]!==0) return false;
  state.px=nx; state.py=ny; state.steps++;
  // coin
  const k=`${nx},${ny}`; if(state.coins.has(k)){ state.coins.delete(k); state.coinsGot++; }
  // item
  if(state.items.has(k)){
    const kind = (Math.random()<0.5)?'booster':'minimap';
    state.items.delete(k);
    if(kind==='booster') state.effects.booster = 5.0; else state.effects.minimap = Math.max(state.effects.minimap, 2.0);
  }
  // exit
  if(nx===state.exit[0] && ny===state.exit[1]){ state.running=false; state.over=true; }
  return true;
}

export function tryMove(dx,dy, cv, ctx){
  if(!state.running || state.over) return;
  const boosted = state.effects.booster>0;
  const ok1 = stepOnce(dx,dy, cv, ctx); if(!ok1){ draw(cv, ctx); updateHUD(); return; }
  if(boosted) stepOnce(dx,dy, cv, ctx);
  draw(cv, ctx); updateHUD();
}
