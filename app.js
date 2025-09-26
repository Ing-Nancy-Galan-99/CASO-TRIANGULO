'use strict';

function getNumber(id) {
  const el = document.getElementById(id);
  const value = parseFloat(el.value);
  return Number.isFinite(value) ? value : NaN;
}

function classifyTriangle(p1, p2, p3) {
  const dx12 = p2.x - p1.x, dy12 = p2.y - p1.y;
  const dx23 = p3.x - p2.x, dy23 = p3.y - p2.y;
  const dx31 = p1.x - p3.x, dy31 = p1.y - p3.y;

  const a2 = dx12 * dx12 + dy12 * dy12;
  const b2 = dx23 * dx23 + dy23 * dy23;
  const c2 = dx31 * dx31 + dy31 * dy31;

  if (a2 === 0 || b2 === 0 || c2 === 0) return 'Puntos repetidos (no triángulo)';

  const area2 = dx12 * (p3.y - p1.y) - dy12 * (p3.x - p1.x);
  if (area2 === 0) return 'No es triángulo (colineales)';

  if (a2 === b2 && b2 === c2) return 'Equilátero (3 lados iguales)';
  if (a2 === b2 || b2 === c2 || a2 === c2) return 'Isósceles (2 lados iguales)';
  return 'Escaleno (todos lados diferentes)';
}

function drawTriangle(ctx, p1, p2, p3) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 40;
  const minX = Math.min(p1.x, p2.x, p3.x);
  const minY = Math.min(p1.y, p2.y, p3.y);
  const maxX = Math.max(p1.x, p2.x, p3.x);
  const maxY = Math.max(p1.y, p2.y, p3.y);

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  const scaleX = (canvas.width - 2 * padding) / spanX;
  const scaleY = (canvas.height - 2 * padding) / spanY;
  const scale = Math.min(scaleX, scaleY);

  function mapPoint(p) {
    const x = (p.x - minX) * scale + padding;
    const y = canvas.height - ((p.y - minY) * scale + padding);
    return { x, y };
  }

  const m1 = mapPoint(p1), m2 = mapPoint(p2), m3 = mapPoint(p3);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0f172a';
  ctx.fillStyle = 'rgba(14,165,233,0.15)';

  ctx.beginPath();
  ctx.moveTo(m1.x, m1.y);
  ctx.lineTo(m2.x, m2.y);
  ctx.lineTo(m3.x, m3.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const pts = [m1, m2, m3];
  ctx.fillStyle = '#0ea5e9';
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function setExample() {
  document.getElementById('x1').value = '1';
  document.getElementById('y1').value = '1';
  document.getElementById('x2').value = '2';
  document.getElementById('y2').value = '1';
  document.getElementById('x3').value = '1';
  document.getElementById('y3').value = '2';
}

function clearInputs() {
  for (const id of ['x1', 'y1', 'x2', 'y2', 'x3', 'y3']) {
    document.getElementById(id).value = '';
  }
}

//calculo de las instancias

function handleCalculate() {
  const p1 = { x: getNumber('x1'), y: getNumber('y1') };
  const p2 = { x: getNumber('x2'), y: getNumber('y2') };
  const p3 = { x: getNumber('x3'), y: getNumber('y3') };

  if ([p1.x, p1.y, p2.x, p2.y, p3.x, p3.y].some(Number.isNaN)) {
    document.getElementById('resultado').textContent = 'Completa todos los valores numéricos';
    const ctx = document.getElementById('lienzo').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return;
  }

  //llamar clasificador 

  const tipo = classifyTriangle(p1, p2, p3);
  document.getElementById('resultado').textContent = tipo;

  const canvas = document.getElementById('lienzo');
  const ctx = canvas.getContext('2d');
  drawTriangle(ctx, p1, p2, p3);
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-calcular').addEventListener('click', handleCalculate);
  document.getElementById('btn-ejemplo').addEventListener('click', () => { setExample(); handleCalculate(); });
  document.getElementById('btn-limpiar').addEventListener('click', () => {
    clearInputs();
    document.getElementById('resultado').textContent = '—';
    const ctx = document.getElementById('lienzo').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
}); 
