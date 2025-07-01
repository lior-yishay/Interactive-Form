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
window.windowResized = () =>
  callIfExsist(p5Functions[getCurrentScene()]?.windowResized);
window.preload = () => callIfExsist(p5Functions[getCurrentScene()]?.preload);
window.mouseDragged = () =>
  callIfExsist(p5Functions[getCurrentScene()]?.mouseDragged);
window.mouseReleased = () =>
  callIfExsist(p5Functions[getCurrentScene()]?.mouseReleased);
window.mouseWheel = (event) =>
  callIfExsist(p5Functions[getCurrentScene()]?.mouseWheel, event);
