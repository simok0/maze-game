export function drawTeacup(ctx, cx, cy, r){
  ctx.save();
  
  // 컵 몸체 (흰색, 찻잔 모양) - 크기 증가
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx-r*0.7, cy+r*0.5);
  ctx.quadraticCurveTo(cx-r*0.75, cy, cx-r*0.6, cy-r*0.5);
  ctx.lineTo(cx-r*0.55, cy-r*0.55);
  ctx.lineTo(cx+r*0.55, cy-r*0.55);
  ctx.lineTo(cx+r*0.6, cy-r*0.5);
  ctx.quadraticCurveTo(cx+r*0.75, cy, cx+r*0.7, cy+r*0.5);
  ctx.quadraticCurveTo(cx, cy+r*0.65, cx-r*0.7, cy+r*0.5);
  ctx.closePath();
  ctx.fill();
  
  // 컵 테두리
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 컵 윗면
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx-r*0.55, cy-r*0.55);
  ctx.lineTo(cx+r*0.55, cy-r*0.55);
  ctx.stroke();
  
  // 홍차 (타원형) - 크기 증가
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(cx, cy-r*0.5, r*0.5, r*0.12, 0, 0, Math.PI*2);
  ctx.fill();
  
  // 홍차 윗면 하이라이트
  ctx.fillStyle = '#CD853F';
  ctx.beginPath();
  ctx.ellipse(cx-r*0.15, cy-r*0.52, r*0.25, r*0.06, 0, 0, Math.PI*2);
  ctx.fill();
  
  // 손잡이 - 크기 증가
  ctx.beginPath();
  ctx.arc(cx+r*0.9, cy-r*0.05, r*0.25, Math.PI*0.4, Math.PI*1.6);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d0d0d0';
  ctx.stroke();
  
  ctx.restore();
}
