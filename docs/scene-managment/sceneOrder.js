import {
  AI,
  COUNTRY,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  START,
  UNREAL,
} from "../consts/scenes-names.js";
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
  p5Functions[sceneName].preload();
  p5Functions[sceneName].setup();
};

const sceneList = [
  START,
  NAME,
  GENDERS,
  POLITICS,
  ICE_CREAM_SANDWICH,
  UNREAL,
  AI,
  COUNTRY,
  SMILE,
  I_BELIEVE_IN,
];
