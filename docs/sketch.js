import { onNextBtnClick } from "./nextBtnLogic.js";
import { p5Functions } from "./p5-scene-functions.js";
import {
  AI,
  COUNTRY,
  GENDERS,
  ICE_CREAM_SANDWICH,
  NAME,
} from "./scenes-names.js";
import {
  drawFooter,
  drawNextButton,
  mouseOnNextBtn,
  mouseOnSoundBtn,
  setupFooter,
} from "./footer.js";
import { toggleSound } from "./soundManager.js";

let currentScene = ICE_CREAM_SANDWICH;
export const getCurrentScene = () => currentScene;

export const setCurrentScene = (sceneName) => {
  currentScene = sceneName;
};

const callIfExsist = (func, ...props) => (func ? func(...props) : undefined);

window.setup = () => {
  p5Functions[currentScene].setup();
  setupFooter();
};
window.draw = () => {
  p5Functions[currentScene].draw();
  drawFooter();
};
window.mousePressed = () => {
  callIfExsist(p5Functions[currentScene]?.mousePressed);
  if (mouseOnNextBtn()) onNextBtnClick();
  if (mouseOnSoundBtn()) toggleSound();
};
window.windowResized = () =>
  callIfExsist(p5Functions[currentScene]?.windowResized);
window.preload = () => callIfExsist(p5Functions[currentScene]?.preload);
window.mouseDragged = () =>
  callIfExsist(p5Functions[currentScene]?.mouseDragged);
window.mouseReleased = () =>
  callIfExsist(p5Functions[currentScene]?.mouseReleased);
window.mouseWheel = (event) =>
  callIfExsist(p5Functions[currentScene]?.mouseWheel, event);
