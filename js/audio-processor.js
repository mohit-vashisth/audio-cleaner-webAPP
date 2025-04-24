import { updateProgress, showProgressOverlay, hideProgressOverlay } from './progress.js';
import { showResults, updateWaveforms } from './results.js';

// Mock processing stages and messages
const processingStages = [
  { name: 'Uploading audio...', duration: 1000 },
  { name: 'Analyzing waveform...', duration: 1500 },
  { name: 'Detecting noise profile...', duration: 2000 },
  { name: 'Processing audio...', duration: 3000 },
  { name: 'Finalizing output...', duration: 1500 }
];

let originalAudioUrl = null;
let cleanedAudioUrl = null;

export function startProcessing(audioFile) {
  processAudioStages(audioFile);
  originalAudioUrl = URL.createObjectURL(audioFile);
}

async function processAudioStages(audioFile) {
  showProgressOverlay();
  let totalDuration = processingStages.reduce((sum, stage) => sum + stage.duration, 0);
  let elapsedTime = 0;
  
  for (let i = 0; i < processingStages.length; i++) {
    const stage = processingStages[i];
    updateProgress(stage.name, Math.round((elapsedTime / totalDuration) * 100));
    await sleep(stage.duration);
    elapsedTime += stage.duration;
  }
  
  // 👇 Step 1: Send audio file to FastAPI
  const formData = new FormData();
  formData.append('file', audioFile);
  
  let cleanedAudioBlob;
  try {
    const response = await fetch('/upload-audio', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cleaned audio');
    }

    updateProgress('Ready!', 100);

    cleanedAudioBlob = await response.blob();
    cleanedAudioUrl = URL.createObjectURL(cleanedAudioBlob);
    
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Backend error while cleaning audio. Try again later.');
    hideProgressOverlay();
    return;
  }

  // 👇 Step 2: Decode both original and cleaned audio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  try {
    const originalArrayBuffer = await audioFile.arrayBuffer();
    const originalBuffer = await audioContext.decodeAudioData(originalArrayBuffer);

    const cleanedArrayBuffer = await cleanedAudioBlob.arrayBuffer();
    const cleanedBuffer = await audioContext.decodeAudioData(cleanedArrayBuffer);

    setTimeout(() => {
      hideProgressOverlay();
      showResults(originalAudioUrl, cleanedAudioUrl);
      updateWaveforms(originalBuffer, cleanedBuffer); // ⬅️ Now both buffers
    }, 1000);
    
  } catch (error) {
    console.error('Decoding error:', error);
    alert('There was an error decoding audio.');
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
    // Ensure extension matches what backend returns
    a.download = 'cleaned_voice.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
