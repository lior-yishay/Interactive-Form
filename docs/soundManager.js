let soundEnabled = true;
let registeredSounds = [];

export const toggleSound = () => {
  soundEnabled = !soundEnabled;

  registeredSounds
    .filter((sound) => sound.isLoaded())
    .forEach((sound) => sound.setVolume(soundEnabled ? 1 : 0));
};

export const isSoundOn = () => soundEnabled;

export const playSound = (sound, volume = 1) => {
  addSoundAndSetVolume(sound, volume);

  if (soundEnabled && sound.isLoaded() && !sound.isPlaying()) {
    sound.play();
  }
};

export const loopSound = (sound, volume = 1) => {
  addSoundAndSetVolume(sound, volume);

  if (soundEnabled && sound.isLoaded() && !sound.isPlaying()) {
    sound.loop();
  }
};

export const resetRegisteredSounds = () => {
  registeredSounds
    .filter(({ sound }) => sound.isPlaying())
    .forEach(({ sound }) => sound.stop());
  registeredSounds = [];
};

const addSoundAndSetVolume = (sound, volume) => {
  if (!sound) return;

  if (!registeredSounds.map(({ sound }) => sound).includes(sound)) {
    registeredSounds.push(sound);
  }

  sound.setVolume(soundEnabled ? volume : 0);
};
