import { GENDERS, I_BELIEVE_IN, NAME, POLITICS, SMILE } from "./scenes-names.js";
import { drawGendersScene, mousePressedGendersScene, preloadGendersScene, setupGendersScene, windowResizedGendersScene } from "./scenes/genders/sketch.js";
import { drawIBeliveInScene, mouseDraggedIBeliveInScene, mousePressedIBeliveInScene, preloadIBeliveInScene, setupIBeliveInScene, windowResizedIBeliveIn } from "./scenes/i-belive-in/scene.js";
import { drawNameScene, mousePressedNameScene, mouseReleasedNameScene, preloadNameScene, setupNameScene } from "./scenes/name/scene.js";
import { drawPoliticsScene, mousePressedPoliticsScene, setupPoliticsScene, windowResizedPoliticsScene } from "./scenes/politics/scene.js";
import { drawSmileScene, setupSmileScene, windowResizedSmileScene } from "./scenes/smile/scene.js";

export const p5Functions = {
    [NAME]: {
        preload: preloadNameScene,
        setup: setupNameScene,
        draw: drawNameScene,
        mousePressed: mousePressedNameScene,
        mouseReleased: mouseReleasedNameScene,
    },
    [GENDERS]: {
        preload: preloadGendersScene,
        setup: setupGendersScene,
        draw: drawGendersScene,
        mousePressed: mousePressedGendersScene,
        windowResized: windowResizedGendersScene,
    },
    [SMILE]: {
        preload: () => undefined,
        setup: setupSmileScene,
        draw: drawSmileScene,
        windowResized: windowResizedSmileScene,
    },
    [I_BELIEVE_IN]: {
        preload: preloadIBeliveInScene,
        setup: setupIBeliveInScene,
        draw: drawIBeliveInScene,
        preload: preloadIBeliveInScene,
        mousePressed: mousePressedIBeliveInScene,
        mouseDragged: mouseDraggedIBeliveInScene,
        windowResized: windowResizedIBeliveIn,
        mouseReleased: mouseDraggedIBeliveInScene,
    },
    [POLITICS]: {
        preload: () => undefined,
        setup: setupPoliticsScene,
        draw: drawPoliticsScene,
        mousePressed: mousePressedPoliticsScene,
        windowResized: windowResizedPoliticsScene,
    }
}