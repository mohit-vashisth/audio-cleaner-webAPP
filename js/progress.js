// Get DOM elements
const progressOverlay = document.getElementById('progressOverlay');
const progressPercentage = document.getElementById('progressPercentage');
const progressStatus = document.getElementById('progressStatus');
const progressRingCircle = document.querySelector('.progress-ring-circle');

// Calculate the progress ring circumference
const radius = progressRingCircle.getAttribute('r');
const circumference = 2 * Math.PI * radius;

// Set initial dash offset
progressRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressRingCircle.style.strokeDashoffset = circumference;

export function setupProgress() {
  // Initial setup if needed
}

export function showProgressOverlay() {
  progressOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

export function hideProgressOverlay() {
  progressOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

export function updateProgress(status, percent) {
  // Update the percentage text
  progressPercentage.textContent = `${percent}%`;
  
  // Update the progress ring
  const offset = circumference - (percent / 100) * circumference;
  progressRingCircle.style.strokeDashoffset = offset;
  
  // Update the status text with typing animation
  progressStatus.textContent = '';
  progressStatus.classList.remove('typing');
  
  // Use setTimeout to trigger reflow and restart animation
  setTimeout(() => {
    progressStatus.textContent = status;
    progressStatus.classList.add('typing');
  }, 50);
}