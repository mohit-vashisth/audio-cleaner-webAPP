import { setupUpload } from './upload.js';
import { setupProgress } from './progress.js';
import { setupResults } from './results.js';
import { setupScrollAnimation } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  setupUpload();
  setupProgress();
  setupResults();
  setupScrollAnimation();
});