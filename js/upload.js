import { startProcessing } from './audio-processor.js';

export function setupUpload() {
  const uploadWidget = document.getElementById('uploadWidget');
  const audioFileInput = document.getElementById('audioFileInput');
  const uploadActions = document.getElementById('uploadActions');
  const fileInfo = document.getElementById('fileInfo');
  const sendButton = document.getElementById('sendButton');

  let selectedFile = null;

  // Initialize drag and drop functionality
  uploadWidget.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadWidget.classList.add('drag-over');
  });

  uploadWidget.addEventListener('dragleave', () => {
    uploadWidget.classList.remove('drag-over');
  });

  uploadWidget.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadWidget.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  // File input change event
  audioFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });

  // Click on widget also triggers file input
  uploadWidget.addEventListener('click', () => {
    audioFileInput.click();
  });

  // Handle file selection
  function handleFileUpload(file) {
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/aac', 'audio/mp4'];
    const fileType = file.type;
    
    if (!validTypes.includes(fileType) && 
        !(file.name.endsWith('.wav') || 
          file.name.endsWith('.mp3') || 
          file.name.endsWith('.flac') || 
          file.name.endsWith('.aac'))) {
      alert('Please select a valid audio file (WAV, MP3, FLAC, or AAC)');
      return;
    }
    
    selectedFile = file;
    
    // Update UI to show file information
    fileInfo.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <path d="M18 18h-6a3 3 0 0 1-3-3V7"></path>
        <path d="M15 9.7V5c-2.5 0-5 2.5-5 5v7c0 .6-.4 1-1 1s-1-.4-1-1v-7c0-1.7.7-3.3 1.8-4.4a5.8 5.8 0 0 1 8.2 0c1.2 1.1 1.8 2.5 1.8 4.2V19c0 .6-.4 1-1 1s-1-.4-1-1v-7c0-2-1.9-3.3-3-2.3"></path>
      </svg>
      <div>
        <div>${file.name}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${formatFileSize(file.size)}</div>
      </div>
    `;
    
    uploadActions.style.display = 'flex';
  }

  // Format file size to human-readable format
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Send button click event
  sendButton.addEventListener('click', () => {
    if (selectedFile) {
      startProcessing(selectedFile);
    }
  });
}