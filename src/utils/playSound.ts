export const playSound = (soundName: string) => {
  const audio = new Audio(`/sounds/${soundName}`);
  audio.play().catch(error => {
    console.log('Audio playback failed:', error);
  });
}; 