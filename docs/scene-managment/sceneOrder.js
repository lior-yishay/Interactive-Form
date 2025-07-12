import {
  AI,
  BIG_THING,
  COUNTRY,
  END,
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
  THE_ANSWER,
  TOILET,
  UNREAL,
} from "../consts/scenes-names.js";
import { setupFooter } from "../footer/footer.js";
import { resetDrawingState } from "../utils/resetDrawingState.js";
import { p5Functions } from "./p5-scene-functions.js";

let currentScene = START;
export const getCurrentScene = () => currentScene;

export const nextScene = () => {
  const currentIndex = sceneList.indexOf(currentScene);
  const nextSceneName = sceneList[currentIndex + 1];
  if (!nextSceneName) return;
  changeToScene(nextSceneName);
};

const changeToScene = (sceneName) => {
  currentScene = sceneName;
  resetDrawingState();
  p5Functions[sceneName].setup();
};

export const restart = () => {
  changeToScene(sceneList[0]);
  setupFooter();
};

const sceneList = [
  START,
  NAME,
  GENDERS,
  THE_ANSWER,
  TOILET,
  BIG_THING,
  SMILE_LOADER,
  SMILE,
  SMILE_ENDING,
  POLITICS,
  ICE_CREAM_SANDWICH,
  UNREAL,
  AI,
  COUNTRY,
  I_BELIEVE_IN,
  FEEDBACK,
  END,
];
