let soundEnabled = true;
let registeredSounds = [];

export const toggleSound = () => {
  soundEnabled = !soundEnabled;

  registeredSounds
    .filter((sound) => sound.isLoaded())
    .forEach((sound) => sound.setVolume(soundEnabled ? 1 : 0));
};

export const isSoundOn = () => soundEnabled;

export const playSound = (sound) => {
  if (sound && !registeredSounds.includes(sound)) {
    registeredSounds.push(sound);
    sound.setVolume(soundEnabled ? 1 : 0);
  }

  if (soundEnabled && sound?.isLoaded()) {
    sound.play();
  }
};

export const resetRegisteredSounds = () => {
  registeredSounds
    .filter((sound) => sound.isPlaying())
    .forEach((sound) => sound.stop());
  registeredSounds = [];
};
