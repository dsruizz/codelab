/**
 * Cuadrícula de puntos reactiva al cursor.
 * Cada punto guarda un "calor" (0 a 1): 0 = gris, 1 = verde.
 * El calor sube cerca del cursor y se enfría poco a poco al alejarse.
 */

const DEFAULTS = {
  gap: 24, // distancia entre puntos (px)
  radius: 1.2, // radio del punto (px)
  reach: 140, // alcance del cursor (px)
  base: [140, 150, 145, 0.25], // gris opaco  [r, g, b, alpha]
  active: [61, 255, 139, 0.6], // verde hacker [r, g, b, alpha]
  heatUp: 0.35, // velocidad al calentarse (0–1)
  coolDown: 0.06, // velocidad al enfriarse (0–1): más bajo = estela más larga
};

export function createDotGrid(canvas, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let heat = new Float32Array(0);
  const pointer = { x: 0, y: 0, active: false };
  let frameId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / o.gap);
    rows = Math.ceil(height / o.gap);
    heat = new Float32Array(cols * rows);
    draw();
  }

  // Actualiza el calor de cada punto. Devuelve true si algo sigue cambiando.
  function update() {
    const instant = reducedMotion.matches;
    let changing = false;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        let target = 0;

        if (pointer.active) {
          const dx = col * o.gap + o.gap / 2 - pointer.x;
          const dy = row * o.gap + o.gap / 2 - pointer.y;
          const t = 1 - Math.hypot(dx, dy) / o.reach;
          if (t > 0) target = t * t * (3 - 2 * t); // smoothstep: borde suave
        }

        if (instant) {
          heat[i] = target;
          continue;
        }

        const speed = target > heat[i] ? o.heatUp : o.coolDown;
        heat[i] += (target - heat[i]) * speed;
        if (Math.abs(target - heat[i]) > 0.002) changing = true;
        else heat[i] = target;
      }
    }

    return changing;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const [br, bg, bb, ba] = o.base;
    const [ar, ag, ab, aa] = o.active;

    // 1) Puntos fríos: un solo trazado, muy barato de pintar
    ctx.fillStyle = `rgb(${br} ${bg} ${bb} / ${ba})`;
    ctx.beginPath();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (heat[row * cols + col] > 0.01) continue;
        const x = col * o.gap + o.gap / 2;
        const y = row * o.gap + o.gap / 2;
        ctx.moveTo(x + o.radius, y);
        ctx.arc(x, y, o.radius, 0, Math.PI * 2);
      }
    }
    ctx.fill();

    // 2) Puntos calientes: color interpolado entre gris y verde
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const h = heat[row * cols + col];
        if (h <= 0.01) continue;
        const r = Math.round(br + (ar - br) * h);
        const g = Math.round(bg + (ag - bg) * h);
        const b = Math.round(bb + (ab - bb) * h);
        const a = ba + (aa - ba) * h;
        ctx.fillStyle = `rgb(${r} ${g} ${b} / ${a})`;
        ctx.beginPath();
        ctx.arc(col * o.gap + o.gap / 2, row * o.gap + o.gap / 2, o.radius * (1 + 0.4 * h), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Bucle de animación: solo corre mientras hay cambios
  function tick() {
    const changing = update();
    draw();
    frameId = changing ? requestAnimationFrame(tick) : 0;
  }

  function requestTick() {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(tick);
  }

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return; // en táctil no hay "hover"
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    requestTick();
  }

  function onPointerOut(event) {
    if (event.relatedTarget) return; // sigue dentro de la página
    pointer.active = false;
    requestTick();
  }

  function onVisibilityChange() {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerout', onPointerOut);
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Devuelve una función para limpiar todo (útil más adelante con React o al cambiar de página)
  return function destroy() {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerout', onPointerOut);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
