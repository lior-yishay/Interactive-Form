import { p5Functions } from "./p5-scene-functions.js";
import { GENDERS, I_BELIEVE_IN, SMILE } from "./scenes-names.js";

let currentScene = I_BELIEVE_IN;
export const getCurrentScene = () => currentScene

export const setCurrentScene = (sceneName) => {
  currentScene = sceneName
}

const callIfExsist = (func) => func ? func() : undefined

window.setup = () => callIfExsist(p5Functions[currentScene]?.setup)
window.draw = () => callIfExsist(p5Functions[currentScene]?.draw)
window.mousePressed = () => callIfExsist(p5Functions[currentScene]?.mousePressed)
window.windowResized = () => callIfExsist(p5Functions[currentScene]?.windowResized)
window.preload = () => callIfExsist(p5Functions[currentScene]?.preload)
window.mouseDragged = () => callIfExsist(p5Functions[currentScene]?.mouseDragged)
window.mouseReleased = () => callIfExsist(p5Functions[currentScene]?.mouseReleased)


