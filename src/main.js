import { fitCanvas, draw, newGame, tryMove, state, computeScore } from './game.js';

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');

function showResult(){
  const s = computeScore();
  const best = JSON.parse(localStorage.getItem('maze-fow-best') || '{}');
  const prev = best[state.diffKey]||0; if(s.total>prev){ best[state.diffKey]=s.total; localStorage.setItem('maze-fow-best', JSON.stringify(best)); }

  const body = document.getElementById('res-body');
  body.innerHTML = '';
  const rows = [
    ['난이도', {easy:'초급',normal:'중급',hard:'상급'}[state.diffKey] ],
    ['클리어 시간', `${state.time.toFixed(1)}s`],
    ['스텝 수 / 최단', `${state.steps} / ${state.shortest}`],
    ['코인', `${state.coinsGot}개 (x50)`],
    ['클리어 보너스', s.base],
    ['시간 보너스', s.timeBonus],
    ['경로 효율 보너스', s.pathBonus],
    ['수집 보너스', s.collect],
  ];
  for(const [k,v] of rows){ const tr=document.createElement('tr'); tr.innerHTML=`<td>${k}</td><td style="text-align:right">${v}</td>`; body.appendChild(tr); }
  document.getElementById('res-total').textContent = s.total;
  document.getElementById('res-title').textContent = '다시는 날 잊지 마';
  document.getElementById('result').style.display = 'grid';
}

function updateLoop(now){
  const dt = (updateLoop.lastTime ? (now-updateLoop.lastTime) : 0)/1000;
  updateLoop.lastTime = now;
  if(state.running && !state.over){
    state.time += dt;
    if(state.effects.booster>0){ state.effects.booster = Math.max(0, state.effects.booster-dt); }
    if(state.effects.minimap>0){ state.effects.minimap = Math.max(0, state.effects.minimap-dt); }
  } else if (state.over){
    // 한 번만 표시되도록
    if (!updateLoop.resultShown){
      updateLoop.resultShown = true;
      showResult();
    }
  }
  requestAnimationFrame(updateLoop);
}

window.addEventListener('resize', ()=>{ fitCanvas(cv, ctx); draw(cv, ctx); });

// Inputs
const keyMap = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0], w:[0,-1], a:[-1,0], s:[0,1], d:[1,0] };
window.addEventListener('keydown', e=>{ const k=e.key; if(keyMap[k]){ e.preventDefault(); const [dx,dy]=keyMap[k]; tryMove(dx,dy, cv, ctx); }});

// pad
document.getElementById('pad').addEventListener('click', e=>{
  const btn = e.target.closest('button'); if(!btn) return; const dir=btn.dataset.dir; const dm={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}; tryMove(...dm[dir], cv, ctx);
});

// swipe
let sx=0, sy=0; cv.addEventListener('touchstart', e=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; }, {passive:true});
cv.addEventListener('touchend', e=>{ const t=e.changedTouches[0]; const dx=t.clientX-sx, dy=t.clientY-sy; if(Math.hypot(dx,dy)<24) return; if(Math.abs(dx)>Math.abs(dy)) tryMove(Math.sign(dx),0, cv, ctx); else tryMove(0,Math.sign(dy), cv, ctx); });

// buttons
document.getElementById('btn-new').onclick = ()=>{
  updateLoop.resultShown = false;
  newGame(document.getElementById('difficulty').value, cv, ctx);
};
document.getElementById('btn-retry').onclick = ()=>{ document.getElementById('result').style.display='none'; updateLoop.resultShown = false; newGame(state.diffKey, cv, ctx); };
document.getElementById('btn-continue').onclick = ()=>{ document.getElementById('result').style.display='none'; updateLoop.resultShown = false; newGame(state.diffKey, cv, ctx); };

// init
newGame('normal', cv, ctx);
requestAnimationFrame(updateLoop);
