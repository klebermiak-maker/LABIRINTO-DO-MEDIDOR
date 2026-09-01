import confetti from 'canvas-confetti';

/**
 * Fires celebration confetti and particle effects positioned directly over the GameBoard
 */
export function fireBoardConfetti(elementId: string = 'game-board-container', isThreeStars: boolean = true) {
  try {
    const el = document.getElementById(elementId);
    let originX = 0.5;
    let originY = 0.5;

    if (el) {
      const rect = el.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
      // Clamp within safe viewport range
      originX = Math.max(0.1, Math.min(0.9, originX));
      originY = Math.max(0.1, Math.min(0.9, originY));
    }

    // Colors: Gold, Cyan, Emerald, Amber, Violet
    const colors = isThreeStars
      ? ['#f59e0b', '#fbbf24', '#06b6d4', '#10b981', '#ec4899', '#8b5cf6', '#38bdf8']
      : ['#06b6d4', '#10b981', '#3b82f6', '#fbbf24'];

    // Burst 1: Star shapes + central burst
    confetti({
      particleCount: isThreeStars ? 80 : 45,
      spread: 80,
      origin: { x: originX, y: originY },
      colors,
      shapes: ['star', 'circle'],
      scalar: isThreeStars ? 1.2 : 1.0,
      ticks: 200,
      zIndex: 9999,
    });

    // Burst 2: Left cannon angling upward over the board
    setTimeout(() => {
      confetti({
        particleCount: isThreeStars ? 50 : 30,
        angle: 60,
        spread: 55,
        origin: { x: Math.max(0.05, originX - 0.18), y: Math.min(0.95, originY + 0.1) },
        colors,
        zIndex: 9999,
      });
    }, 150);

    // Burst 3: Right cannon angling upward over the board
    setTimeout(() => {
      confetti({
        particleCount: isThreeStars ? 50 : 30,
        angle: 120,
        spread: 55,
        origin: { x: Math.min(0.95, originX + 0.18), y: Math.min(0.95, originY + 0.1) },
        colors,
        zIndex: 9999,
      });
    }, 300);

    // If 3 stars (perfect optimization), trigger an extra golden shower finale!
    if (isThreeStars) {
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 120,
          origin: { x: originX, y: Math.max(0.1, originY - 0.1) },
          colors: ['#ffd700', '#f59e0b', '#ffffff', '#22d3ee'],
          shapes: ['star'],
          scalar: 1.4,
          drift: 0.1,
          zIndex: 9999,
        });
      }, 500);
    }
  } catch (err) {
    console.warn('Confetti animation error:', err);
  }
}
