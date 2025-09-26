export function drawCenteredText(ctx, w, h, text, size, color, offsetY = 0) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.font = `bold ${size}px system-ui, -apple-system, 'Segoe UI', Arial, sans-serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(text, w / 2, h / 2 + offsetY);
  ctx.restore();
}

export function drawCloud(ctx, x, y, r) {
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.7, y + r * 0.3, r * 0.9, 0, Math.PI * 2);
  ctx.arc(x - r * 0.7, y + r * 0.3, r * 0.8, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawBird(ctx, b, colors) {
  if (!b || !b.x || !b.y) return;

  const colorBody = colors.warning || '#fbbf24';
  const colorBeak = colors.accent || '#fb923c';
  const colorEye = '#ffffff';
  const colorPupil = '#000000';

  const tilt = Math.max(-0.6, Math.min(0.6, b.vy / 600));
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(tilt);

  // body
  ctx.fillStyle = colorBody;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 0, b.r * 1.05, b.r * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // wing (flap)
  const flap = Math.sin(b.wingPhase) * 0.6;
  ctx.save();
  ctx.rotate(flap);
  ctx.beginPath();
  ctx.ellipse(-b.r * 0.2, 0, b.r * 0.8, b.r * 0.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fill();
  ctx.restore();

  // eye
  ctx.beginPath();
  ctx.fillStyle = colorEye;
  ctx.arc(b.r * 0.35, -b.r * 0.15, b.r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = colorPupil;
  ctx.arc(b.r * 0.42, -b.r * 0.15, b.r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = colorBeak;
  ctx.beginPath();
  ctx.moveTo(b.r * 0.85, 0);
  ctx.lineTo(b.r * 1.35, -b.r * 0.12);
  ctx.lineTo(b.r * 1.35, b.r * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}