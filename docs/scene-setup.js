import { AGE, AI, END, GENDERS, I_BELIEVE_IN, ICE_CREAM_SANDWICH, LIVING_HERE, NAME, POLITICS, SMILE, START, UNREAL } from "./scenes-names.js";
import { setupGendersScene } from "./scenes/genders/sketch.js";
import { setupNameScene } from "./scenes/name/sketch.js";
import { setupSmileScene } from "./scenes/smile/sketch.js";

export const setupScene = (sceneName) => {
    if (sceneName === START) undefined;
    if (sceneName === NAME) setupNameScene();
    if (sceneName === GENDERS) setupGendersScene();
    if (sceneName === AGE) undefined;
    if (sceneName === LIVING_HERE) undefined;
    if (sceneName === POLITICS) undefined; 
    if (sceneName === ICE_CREAM_SANDWICH) undefined;
    if (sceneName === SMILE) setupSmileScene();
    if (sceneName === UNREAL) undefined;
    if (sceneName === I_BELIEVE_IN) undefined;
    if (sceneName === AI) undefined;
    if (sceneName === END) undefined;
}