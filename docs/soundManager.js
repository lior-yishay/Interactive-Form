let soundEnabled = true;
let registeredSounds = [];

export const toggleSound = () => {
  soundEnabled = !soundEnabled;

  registeredSounds
    .filter(({ sound }) => sound.isLoaded())
    .forEach(({ sound, volume }) => sound.setVolume(soundEnabled ? volume : 0));
};

export const isSoundOn = () => soundEnabled;

export const playSound = (
  sound,
  { volume, withOverlapping } = { volume: 1, withOverlapping: true }
) => {
  if (!sound) return;
  addSoundAndSetVolume(sound, volume);

  if (
    soundEnabled &&
    sound.isLoaded() &&
    (withOverlapping || !sound.isPlaying())
  ) {
    sound.play();
  }
};

export const loopSound = (sound, { volume } = { volume: 1 }) => {
  addSoundAndSetVolume(sound, volume);

  if (soundEnabled && sound.isLoaded() && !sound.isPlaying()) {
    sound.loop();
  }
};

export const stopSound = (sound) => {
  if (!sound || !sound.isPlaying()) return;
  sound.stop();
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
    registeredSounds.push({ sound, volume });
  }

  sound.setVolume(soundEnabled ? volume : 0);
};
