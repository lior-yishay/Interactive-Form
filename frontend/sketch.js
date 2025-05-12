import { EMOTIONS, GENDER_BALLS } from "./scenes-names.js";
import { drawEmotionsScene, setupEmotionsScene } from "./scenes/emotions.js";
import { drawGenderBallsScene, mousePresseGenderBallsScene, setupGenderBallsScene } from "./scenes/gender-balls/gender-balls.js";

let currentScene = GENDER_BALLS;
export const setCurrentScene = (sceneName) => {
  currentScene = sceneName
}

const setup = () => {
  if (currentScene === GENDER_BALLS) setupGenderBallsScene();
  if (currentScene === EMOTIONS) setupEmotionsScene()
}

const draw = () => {
  if (currentScene === GENDER_BALLS) drawGenderBallsScene();
  if (currentScene === EMOTIONS) drawEmotionsScene();
}

const mousePressed = () => {
  if (currentScene === GENDER_BALLS) mousePresseGenderBallsScene();
  if (currentScene === EMOTIONS) undefined;
}

window.setup = setup
window.draw = draw
window.mousePressed = mousePressed
