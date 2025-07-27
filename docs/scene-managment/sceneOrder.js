import {
  AI,
  BIG_THING,
  BINGO,
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
import { resetDrawingState } from "../utils/resetDrawingState.js";
import { p5Functions } from "./p5-scene-functions.js";

let currentScene = COUNTRY;
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
  location.reload();
};

const sceneList = [
  START,
  NAME,
  GENDERS,
  AI,
  POLITICS,
  ICE_CREAM_SANDWICH,
  BIG_THING,
  BINGO,
  THE_ANSWER,
  UNREAL,
  SMILE_LOADER,
  SMILE,
  SMILE_ENDING,
  COUNTRY,
  I_BELIEVE_IN,
  TOILET,
  FEEDBACK,
  END,
];
