import { onNextBtnClick } from "./nextBtnLogic.js";
import { p5Functions } from "./p5-scene-functions.js";
import {
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
} from "./scenes-names.js";
import {
  drawFooter,
  drawNavbar,
  drawNextButton,
  mouseOnNextBtn,
  setupBoarder,
} from "./scenesBorder.js";

let currentScene = ICE_CREAM_SANDWICH;
export const getCurrentScene = () => currentScene;

export const setCurrentScene = (sceneName) => {
  currentScene = sceneName;
};

const callIfExsist = (func, ...props) => (func ? func(...props) : undefined);

window.setup = () => {
  callIfExsist(p5Functions[currentScene]?.setup);
  setupBoarder();
};
window.draw = () => {
  callIfExsist(p5Functions[currentScene]?.draw);
  drawNavbar();
  drawFooter();
  drawNextButton();
};
window.mousePressed = () => {
  callIfExsist(p5Functions[currentScene]?.mousePressed);
  if (mouseOnNextBtn()) onNextBtnClick();
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
