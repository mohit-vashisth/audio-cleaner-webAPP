import { downloadCleanedAudio } from './audio-processor.js';

// Get DOM elements
const resultsSection = document.getElementById('results');
const originalAudio = document.getElementById('originalAudio');
const cleanedAudio = document.getElementById('cleanedAudio');
const downloadButton = document.getElementById('downloadButton');
const originalWaveform = document.getElementById('originalWaveform');
const cleanedWaveform = document.getElementById('cleanedWaveform');

export function setupResults() {
  // Set up download button
  downloadButton.addEventListener('click', downloadCleanedAudio);
}

export function showResults(originalUrl, cleanedUrl) {
  // Set audio sources
  originalAudio.src = originalUrl;
  cleanedAudio.src = cleanedUrl;
  
  // Load audio
  originalAudio.load();
  cleanedAudio.load();
  
  // Show results section
  resultsSection.style.display = 'block';
  
  // Scroll to results section
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }, 500);
}

export function updateWaveforms(audioBuffer) {
  // Create waveform visualizations for both original and cleaned audio
  // For demo purposes, we're using the same waveform for both
  drawWaveform(originalWaveform, audioBuffer);
  
  // For a real app, you would use the processed audio buffer
  // Here we're simulating a "cleaned" waveform with less noise
  drawCleanedWaveform(cleanedWaveform, audioBuffer);
}

function drawWaveform(container, audioBuffer) {
  // Clear container
  container.innerHTML = '';
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'waveform-canvas';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Get audio data
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.ceil(channelData.length / canvas.width);
  
  // Draw waveform
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00FFFF';
  ctx.beginPath();
  
  for (let i = 0; i < canvas.width; i++) {
    const index = Math.floor(i * step);
    let sum = 0;
    
    // Average the values
    for (let j = 0; j < step; j++) {
      sum += Math.abs(channelData[index + j] || 0);
    }
    const value = sum / step;
    
    const y = (0.5 - value * 0.5) * canvas.height;
    
    if (i === 0) {
      ctx.moveTo(i, y);
    } else {
      ctx.lineTo(i, y);
    }
  }
  
  ctx.stroke();
}

function drawCleanedWaveform(container, audioBuffer) {
  // Clear container
  container.innerHTML = '';
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'waveform-canvas';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Get audio data
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.ceil(channelData.length / canvas.width);
  
  // Draw waveform with simulated noise reduction
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FF00FF';
  ctx.beginPath();
  
  for (let i = 0; i < canvas.width; i++) {
    const index = Math.floor(i * step);
    let sum = 0;
    
    // Average the values and simulate noise reduction
    for (let j = 0; j < step; j++) {
      // Simulate noise reduction by reducing small amplitude values
      let value = Math.abs(channelData[index + j] || 0);
      // Threshold to simulate noise reduction
      if (value < 0.1) {
        value *= 0.3; // Reduce low amplitude signals
      }
      sum += value;
    }
    const value = sum / step;
    
    const y = (0.5 - value * 0.5) * canvas.height;
    
    if (i === 0) {
      ctx.moveTo(i, y);
    } else {
      ctx.lineTo(i, y);
    }
  }
  
  ctx.stroke();
}