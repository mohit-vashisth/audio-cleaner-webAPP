import { updateProgress, showProgressOverlay, hideProgressOverlay } from './progress.js';
import { showResults, updateWaveforms } from './results.js';

// Mock processing stages and messages
const processingStages = [
  { name: 'Initializing...', duration: 500 },
  { name: 'Analyzing audio levels...', duration: 1500 },
  { name: 'Identifying noise patterns...', duration: 1800 },
  { name: 'Reducing background noise...', duration: 3500 },
  { name: 'Balancing audio levels...', duration: 1800 },
  { name: 'Removing reverb...', duration: 1500 },
  { name: 'Enhancing clarity...', duration: 1200 },
  { name: 'Finalizing audio...', duration: 1000 }
];

let originalAudioUrl = null;
let cleanedAudioUrl = null;

export function startProcessing(audioFile) {
  // Show progress overlay
  showProgressOverlay();
  
  // Create URL for the original audio
  originalAudioUrl = URL.createObjectURL(audioFile);
  
  // Start mock processing
  processAudioStages(audioFile);
}

async function processAudioStages(audioFile) {
  let totalDuration = processingStages.reduce((sum, stage) => sum + stage.duration, 0);
  let elapsedTime = 0;
  
  // Process each stage
  for (let i = 0; i < processingStages.length; i++) {
    const stage = processingStages[i];
    updateProgress(stage.name, Math.round((elapsedTime / totalDuration) * 100));
    
    // Simulate processing time
    await sleep(stage.duration);
    elapsedTime += stage.duration;
  }
  
  // Complete processing
  updateProgress('Ready!', 100);
  
  // In a real app, you would actually process the audio
  // For this demo, we'll just use the original file as the "cleaned" version
  // but in reality, you would send the file to a backend for processing
  cleanedAudioUrl = originalAudioUrl;
  
  // Create audio context and decode audio for visualizing waveforms
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Process complete - show results after a short delay
    setTimeout(() => {
      hideProgressOverlay();
      showResults(originalAudioUrl, cleanedAudioUrl);
      updateWaveforms(audioBuffer);
    }, 1000);
  } catch (error) {
    console.error('Error decoding audio data:', error);
    alert('There was an error processing your audio. Please try a different file.');
    hideProgressOverlay();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download the processed audio
export function downloadCleanedAudio() {
  if (cleanedAudioUrl) {
    const a = document.createElement('a');
    a.href = cleanedAudioUrl;
    a.download = 'cleaned_audio.mp3'; // Default name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}