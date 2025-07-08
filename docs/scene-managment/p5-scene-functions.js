import {
  AI,
  COUNTRY,
  FEEDBACK,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  SMILE_ENDING,
  SMILE_LOADER,
  START,
  UNREAL,
} from "../consts/scenes-names.js";
import {
  drawAiScene,
  mousePressedAiScene,
  mouseWheelAiScene,
  preloadAiScene,
  setupAiScene,
  windowResizedAiScene,
} from "../scenes/AI/scene.js";
import {
  drawCountryScene,
  preloadCountryScene,
  setupCountryScene,
  windowResizedCountryScene,
} from "../scenes/country/scene.js";
import {
  drawFeedbackScene,
  mouseDraggedFeedbackScene,
  mouseMovedFeedbackScene,
  mousePressedFeedbackScene,
  mouseReleasedFeedbackScene,
  preloadFeedbackScene,
  setupFeedbackScene,
  windowResizedFeedbackScene,
} from "../scenes/feedback/scene.js";
// import {
//   drawCountryScene,
//   preloadCountryScene,
//   setupCountryScene,
//   windowResizedCountryScene,
// } from "./scenes/country/scene.js";
import {
  drawGendersScene,
  mousePressedGendersScene,
  preloadGendersScene,
  setupGendersScene,
  windowResizedGendersScene,
} from "../scenes/genders/scene.js";
import {
  drawIBeliveInScene,
  mouseDraggedIBeliveInScene,
  mousePressedIBeliveInScene,
  mouseReleasedIBeliveInScene,
  preloadIBeliveInScene,
  setupIBeliveInScene,
  windowResizedIBeliveInScene,
} from "../scenes/i-belive-in/scene.js";
import {
  drawIceCreamSandwichScene,
  mouseDraggedIceCreamSandwichScene,
  mousePressedIceCreamSandwichScene,
  mouseReleasedIceCreamSandwichScene,
  preloadIceCreamSandwichScene,
  setupIceCreamSandwichScene,
  windowResizedIceCreamSandwichScene,
} from "../scenes/ice-cream-sandwich/scene.js";
import {
  drawNameScene,
  mousePressedNameScene,
  mouseReleasedNameScene,
  preloadNameScene,
  setupNameScene,
} from "../scenes/name/scene.js";
import {
  drawPoliticsScene,
  mousePressedPoliticsScene,
  setupPoliticsScene,
  windowResizedPoliticsScene,
} from "../scenes/politics/scene.js";
import {
  drawSmileEndingScene,
  preloadSmileEndingScene,
  setupSmileEndingScene,
  windowResizedSmileEndingScene,
} from "../scenes/smile/endingScene.js";
import {
  drawSmileLoaderScene,
  mouseDraggedSmileLoaderScene,
  mousePressedSmileLoaderScene,
  mouseReleasedSmileLoaderScene,
  preloadSmileLoaderScene,
  setupSmileLoaderScene,
  windowResizedSmileLoaderScene,
} from "../scenes/smile/loaderScene.js";
import {
  drawSmileScene,
  preloadSmileScene,
  setupSmileScene,
  windowResizedSmileScene,
} from "../scenes/smile/scene.js";
import {
  drawStartScene,
  keyPressedStartScene,
  mouseMovedStartScene,
  mousePressedStartScene,
  preloadStartScene,
  setupStartScene,
  touchStartedStartScene,
  windowResizedStartScene,
} from "../scenes/start/scene.js";
import {
  drawUnrealScene,
  mousePressedUnrealScene,
  preloadUnrealScene,
  setupUnrealScene,
  windowResizedUnrealScene,
} from "../scenes/unreal/scene.js";

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
  [SMILE_LOADER]: {
    preload: preloadSmileLoaderScene,
    setup: setupSmileLoaderScene,
    draw: drawSmileLoaderScene,
    windowResized: windowResizedSmileLoaderScene,
    mousePerssed: mousePressedSmileLoaderScene,
    mouseDragged: mouseDraggedSmileLoaderScene,
    mouseReleased: mouseReleasedSmileLoaderScene,
  },
  [SMILE]: {
    preload: preloadSmileScene,
    setup: setupSmileScene,
    draw: drawSmileScene,
    windowResized: windowResizedSmileScene,
  },
  [SMILE_ENDING]: {
    preload: preloadSmileEndingScene,
    setup: setupSmileEndingScene,
    draw: drawSmileEndingScene,
    windowResized: windowResizedSmileEndingScene,
  },
  [I_BELIEVE_IN]: {
    preload: preloadIBeliveInScene,
    setup: setupIBeliveInScene,
    draw: drawIBeliveInScene,
    mousePressed: mousePressedIBeliveInScene,
    mouseDragged: mouseDraggedIBeliveInScene,
    windowResized: windowResizedIBeliveInScene,
    mouseReleased: mouseReleasedIBeliveInScene,
  },
  [POLITICS]: {
    preload: () => undefined,
    setup: setupPoliticsScene,
    draw: drawPoliticsScene,
    mousePressed: mousePressedPoliticsScene,
    windowResized: windowResizedPoliticsScene,
  },
  [ICE_CREAM_SANDWICH]: {
    preload: preloadIceCreamSandwichScene,
    setup: setupIceCreamSandwichScene,
    draw: drawIceCreamSandwichScene,
    windowResized: windowResizedIceCreamSandwichScene,
    mouseReleased: mouseReleasedIceCreamSandwichScene,
    mouseDragged: mouseDraggedIceCreamSandwichScene,
    mousePressed: mousePressedIceCreamSandwichScene,
  },
  [UNREAL]: {
    preload: preloadUnrealScene,
    setup: setupUnrealScene,
    draw: drawUnrealScene,
    windowResized: windowResizedUnrealScene,
    mousePressed: mousePressedUnrealScene,
  },
  [COUNTRY]: {
    preload: preloadCountryScene,
    setup: setupCountryScene,
    draw: drawCountryScene,
    windowResized: windowResizedCountryScene,
  },
  [AI]: {
    preload: preloadAiScene,
    setup: setupAiScene,
    draw: drawAiScene,
    windowResized: windowResizedAiScene,
    mousePressed: mousePressedAiScene,
    mouseWheel: mouseWheelAiScene,
  },
  [START]: {
    preload: preloadStartScene,
    setup: setupStartScene,
    draw: drawStartScene,
    windowResized: windowResizedStartScene,
    mousePressed: mousePressedStartScene,
    mouseMoved: mouseMovedStartScene,
    keyPressed: keyPressedStartScene,
    touchStarted: touchStartedStartScene,
  },
  [FEEDBACK]: {
    preload: preloadFeedbackScene,
    setup: setupFeedbackScene,
    draw: drawFeedbackScene,
    windowResized: windowResizedFeedbackScene,
    mousePressed: mousePressedFeedbackScene,
    mouseMoved: mouseMovedFeedbackScene,
    mouseDragged: mouseDraggedFeedbackScene,
    mouseReleased: mouseReleasedFeedbackScene,
  },
};
