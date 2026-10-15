import { createDotGrid } from './dot-grid.js';

console.log('[CodeLab] script.js cargado');

const canvas = document.querySelector('[data-dot-grid]');

if (canvas && canvas.getContext) {
  createDotGrid(canvas);
  document.documentElement.classList.add('has-dot-grid');
}
