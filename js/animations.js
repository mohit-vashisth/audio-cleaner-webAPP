export function setupScrollAnimation() {
  // Animate elements when they come into view
  const animateOnScroll = () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (cardPosition < screenPosition) {
        card.classList.add('animate');
      }
    });
  };
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Trigger once on page load
  animateOnScroll();
}