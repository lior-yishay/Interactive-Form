import { GENDERS, NAME, SMILE } from "./scenes-names.js";
import { drawGenderBallsScene, mousePresseGenderBallsScene, setupGenderBallsScene } from "./scenes/genders/sketch.js";
import { drawNameScene, setupNameScene } from "./scenes/name/sketch.js";
import { drawSmileScene, setupSmileScene, smileWindowResized } from "./scenes/smile/sketch.js";

let currentScene = SMILE;
export const setCurrentScene = (sceneName) => {
  currentScene = sceneName
}

export const getCurrentScene = () => currentScene

const setup = () => {
  if (currentScene === NAME) setupNameScene();
  if (currentScene === GENDERS) setupGenderBallsScene();
  if (currentScene === SMILE) setupSmileScene()
}

const draw = () => {
  if (currentScene === NAME) drawNameScene()
  if (currentScene === GENDERS) drawGenderBallsScene();
  if (currentScene === SMILE) drawSmileScene();
}

const mousePressed = () => {
  if (currentScene === NAME) undefined
  if (currentScene === GENDERS) mousePresseGenderBallsScene();
  if (currentScene === SMILE) undefined;
}

const windowResized = () => {
  if(currentScene === SMILE) smileWindowResized();
}

window.setup = setup
window.draw = draw
window.mousePressed = mousePressed
// window.windowResized = windowResized
