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

let currentScene = THE_ANSWER;
export const getCurrentScene = () => currentScene;

let lastSceneChangeTime = 0;
const cooldownDuration = 2000; // 2 seconds in milliseconds

export const nextScene = () => {
  const now = Date.now();

  if (now - lastSceneChangeTime < cooldownDuration) {
    // Cooldown active, ignore this call
    return;
  }

  lastSceneChangeTime = now;

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
