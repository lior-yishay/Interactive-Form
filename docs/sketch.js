import { setupScene } from "./scene-setup.js";
import { GENDERS, NAME, SMILE } from "./scenes-names.js";
import { drawGendersScene, mousePresseGendersScene } from "./scenes/genders/sketch.js";
import { drawNameScene } from "./scenes/name/sketch.js";
import { drawSmileScene, smileWindowResized } from "./scenes/smile/sketch.js";

let currentScene = NAME;
export const setCurrentScene = (sceneName) => {
  currentScene = sceneName
}

export const getCurrentScene = () => currentScene

const setup = () => {
  setupScene(currentScene)
}

const draw = () => {
  if (currentScene === NAME) drawNameScene()
  if (currentScene === GENDERS) drawGendersScene();
  if (currentScene === SMILE) drawSmileScene();
}

const mousePressed = () => {
  if (currentScene === NAME) undefined
  if (currentScene === GENDERS) mousePresseGendersScene();
  if (currentScene === SMILE) undefined;
}

const windowResized = () => {
  if(currentScene === SMILE) smileWindowResized();
}

window.setup = setup
window.draw = draw
window.mousePressed = mousePressed
// window.windowResized = windowResized
