import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
    });
  } catch {
    // fallback if canvas not available
  }
};

export const triggerStars = () => {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['#fbbf24', '#f59e0b', '#6366f1'],
    });
  } catch {
    // fallback
  }
};
