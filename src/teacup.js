export function drawTeacup(ctx, cx, cy, r){
  ctx.save();
  ctx.fillStyle = '#cfe7ff';
  // 컵 몸체
  ctx.beginPath();
  ctx.moveTo(cx-r*0.8, cy);
  ctx.quadraticCurveTo(cx, cy+r*0.9, cx+r*0.8, cy);
  ctx.lineTo(cx+r*0.8, cy-r*0.5);
  ctx.lineTo(cx-r*0.8, cy-r*0.5);
  ctx.closePath();
  ctx.fill();
  // 손잡이
  ctx.beginPath();
  ctx.arc(cx+r*0.95, cy-r*0.25, r*0.35, Math.PI*0.2, Math.PI*1.2);
  ctx.lineWidth = 2; ctx.strokeStyle = '#cfe7ff'; ctx.stroke();
  ctx.restore();
}
