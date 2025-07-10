import { setupCustomLoader } from "./customLoader.js";
import {
  drawFooter,
  mouseOnNextBtn,
  mouseOnSoundBtn,
  preloadFooter,
  setupFooter,
} from "./footer/footer.js";
import { onNextBtnClick } from "./footer/nextBtnLogic.js";
import { p5Functions } from "./scene-managment/p5-scene-functions.js";
import { getCurrentScene } from "./scene-managment/sceneOrder.js";
import { toggleSound } from "./soundManager.js";
import { callIfExsist } from "./utils/callIfExsist.js";

window.preload = () => {
  preloadFooter();
  Object.values(p5Functions).forEach((scene) => scene.preload());
  Object.values(p5Functions).forEach((scene) => scene.preload());
  Object.values(p5Functions).forEach((scene) => scene.preload());
};

window.setup = () => {
  p5Functions[getCurrentScene()].setup();
  setupFooter();
};
window.draw = () => {
  push();
  p5Functions[getCurrentScene()].draw();
  pop();
  drawFooter();
};
window.mousePressed = () => {
  callIfExsist(p5Functions[getCurrentScene()]?.mousePressed);
  if (mouseOnNextBtn()) onNextBtnClick();
  if (mouseOnSoundBtn()) toggleSound();
};

const excluded = new Set(["draw", "setup", "mousePressed", "preload"]);
const allHandlers = Object.values(p5Functions)
  .flatMap(Object.keys)
  .filter((handler) => !excluded.has(handler));

[...new Set(allHandlers)].forEach(
  (event) =>
    (window[event] = (...args) =>
      callIfExsist(p5Functions[getCurrentScene()]?.[event], ...args))
);

setupCustomLoader();
