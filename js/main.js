// Import modules
import { setupUpload } from './upload.js';
import { setupProgress } from './progress.js';
import { setupResults } from './results.js';
import { setupScrollAnimation } from './animations.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  setupUpload();
  setupProgress();
  setupResults();
  setupScrollAnimation();
});