let canvas, ctx, W, H, particles = [], animId;
let state = { fisica: 3, mental: 3, humor: 3 };

function lerp(a, b, t) { return a + (b - a) * t; }

function getHumorColor(h) {
  const t = (h - 1) / 4;
  // Pesado (1) = azul profundo #5B7FA8 -> Leve (5) = âmbar quente #D4A24E
  const r = Math.round(lerp(91, 212, t));
  const g = Math.round(lerp(127, 162, t));
  const b = Math.round(lerp(168, 78, t));
  return { r, g, b };
}

function initParticles() {
  canvas = document.getElementById('energy-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);

  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push(createParticle());
  }
  draw();
}

function createParticle() {
  const cssW = canvas.width / (window.devicePixelRatio || 1);
  const cssH = canvas.height / (window.devicePixelRatio || 1);
  return {
    x: Math.random() * cssW,
    y: Math.random() * cssH,
    baseVx: (Math.random() - 0.5) * 0.4,
    baseVy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.6 + 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01
  };
}

function resize() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  W = canvas.width = rect.width * dpr;
  H = canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  if (!ctx) return;
  const cssW = W / (window.devicePixelRatio || 1);
  const cssH = H / (window.devicePixelRatio || 1);

  // Fade suave para rastro
  ctx.fillStyle = 'rgba(22, 28, 43, 0.25)';
  ctx.fillRect(0, 0, cssW, cssH);

  const { fisica, mental, humor } = state;
  const color = getHumorColor(humor);

  // Gravidade baseada na energia física
  // 1 = pesado (cai), 5 = leve (sobe)
  const gravity = lerp(0.08, -0.06, (fisica - 1) / 4);

  // Ordem baseada na energia mental
  // 1 = caótico (noise alto), 5 = ordenado (ondas suaves)
  const orderliness = (mental - 1) / 4; // 0 a 1

  const time = Date.now() * 0.001;

  particles.forEach((p, i) => {
    // Movimento base
    p.phase += p.speed;

    // Componente caótico vs ordenado
    const noiseX = Math.sin(p.phase * 3 + i) * 0.3 * (1 - orderliness);
    const noiseY = Math.cos(p.phase * 2.5 + i * 0.7) * 0.3 * (1 - orderliness);

    // Componente ordenado (ondas suaves)
    const waveX = Math.sin(time + i * 0.2) * 0.5 * orderliness;
    const waveY = Math.cos(time * 0.8 + i * 0.15) * 0.4 * orderliness;

    p.x += p.baseVx + noiseX + waveX;
    p.y += p.baseVy + gravity + noiseY + waveY;

    // Wrap around
    if (p.x < -5) p.x = cssW + 5;
    if (p.x > cssW + 5) p.x = -5;
    if (p.y < -5) p.y = cssH + 5;
    if (p.y > cssH + 5) p.y = -5;

    // Brilho baseado na energia (física + mental)
    const energy = (fisica + mental) / 2;
    const alpha = lerp(0.25, 0.85, (energy - 1) / 4) * (0.7 + 0.3 * Math.sin(p.phase));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * lerp(0.8, 1.4, (energy - 1) / 4), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.fill();
  });

  // Conexões entre partículas próximas (mais visíveis com mental alta)
  const maxDist = lerp(35, 70, orderliness);
  const connAlpha = lerp(0.03, 0.12, orderliness);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const a = connAlpha * (1 - d / maxDist);
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animId = requestAnimationFrame(draw);
}

export function updateState(fisica, mental, humor) {
  state = { fisica, mental, humor };
}

export function startParticles() {
  initParticles();
}

export function stopParticles() {
  if (animId) cancelAnimationFrame(animId);
}
