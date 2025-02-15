let backgroundSound: HTMLAudioElement | null = null;

export const playSound = async (soundType: 'start' | 'break' | 'complete', customSound?: string) => {
  try {
    const soundPath = customSound || {
      start: '/sounds/start.mp3',
      break: '/sounds/break.mp3',
      complete: '/sounds/complete.mp3',
    }[soundType];

    const sound = new Audio(soundPath);
    sound.volume = 0.5;
    await sound.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const playBackgroundSound = (playing: boolean) => {
  try {
    if (playing && !backgroundSound) {
      backgroundSound = new Audio('/sounds/brown-noise.mp3');
      backgroundSound.loop = true;
      backgroundSound.volume = 0.3; // Adjust volume as needed
      backgroundSound.play();
    } else if (!playing && backgroundSound) {
      backgroundSound.pause();
      backgroundSound = null;
    }
  } catch (error) {
    console.error('Error with background sound:', error);
  }
}; 