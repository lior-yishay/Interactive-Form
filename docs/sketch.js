import {
  drawFooter,
  mouseOnNextBtn,
  mouseOnSoundBtn,
  setupFooter,
} from "./footer/footer.js";
import { onNextBtnClick } from "./footer/nextBtnLogic.js";
import { p5Functions } from "./scene-managment/p5-scene-functions.js";
import { getCurrentScene } from "./scene-managment/sceneOrder.js";
import { toggleSound } from "./soundManager.js";
import { callIfExsist } from "./utils/callIfExsist.js";

window.setup = () => {
  p5Functions[getCurrentScene()].setup();
  setupFooter();
};
window.draw = () => {
  p5Functions[getCurrentScene()].draw();
  drawFooter();
};
window.mousePressed = () => {
  callIfExsist(p5Functions[getCurrentScene()]?.mousePressed);
  if (mouseOnNextBtn()) onNextBtnClick();
  if (mouseOnSoundBtn()) toggleSound();
};

const excluded = new Set(["draw", "setup", "mousePressed"]);
const allHandlers = Object.values(p5Functions)
  .flatMap(Object.keys)
  .filter((handler) => !excluded.has(handler));

[...new Set(allHandlers)].forEach(
  (event) =>
    (window[event] = (...args) =>
      callIfExsist(p5Functions[getCurrentScene()]?.[event], ...args))
);
