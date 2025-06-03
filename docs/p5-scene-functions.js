import { GENDERS, I_BELIEVE_IN, NAME, POLITICS, SMILE } from "./scenes-names.js";
import { drawGendersScene, mousePressedGendersScene, preloadGendersScene, setupGendersScene, windowResizedGendersScene } from "./scenes/genders/sketch.js";
import { drawIBeliveInScene, mouseDraggedIBeliveInScene, mousePressedIBeliveInScene, preloadIBeliveInScene, setupIBeliveInScene, windowResizedIBeliveIn } from "./scenes/i-belive-in/scene.js";
import { drawNameScene, setupNameScene } from "./scenes/name/sketch.js";
import { drawPoliticsScene, mousePressedPoliticsScene, preloadPoliticsScene, setupPoliticsScene, windowResizedPoliticsScene } from "./scenes/politics/scene.js";
import { drawSmileScene, setupSmileScene, windowResizedSmileScene } from "./scenes/smile/scene.js";

export const p5Functions = {
    [NAME]: {
        setup: setupNameScene,
        draw: drawNameScene
    },
    [GENDERS]: {
        setup: setupGendersScene,
        draw: drawGendersScene,
        mousePressed: mousePressedGendersScene,
        windowResized: windowResizedGendersScene,
        preload: preloadGendersScene
    },
    [SMILE]: {
        setup: setupSmileScene,
        draw: drawSmileScene,
        windowResized: windowResizedSmileScene,
    },
    [I_BELIEVE_IN]: {
        setup: setupIBeliveInScene,
        draw: drawIBeliveInScene,
        preload: preloadIBeliveInScene,
        mousePressed: mousePressedIBeliveInScene,
        mouseDragged: mouseDraggedIBeliveInScene,
        windowResized: windowResizedIBeliveIn,
        mouseReleased: mouseDraggedIBeliveInScene
    },
    [POLITICS]: {
        setup: setupPoliticsScene,
        draw: drawPoliticsScene,
        preload: preloadPoliticsScene,
        mousePressed: mousePressedPoliticsScene,
        windowResized: windowResizedPoliticsScene,
    }
}