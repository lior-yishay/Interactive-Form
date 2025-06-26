import { p5Functions } from "./p5-scene-functions.js";
import {
  AI,
  COUNTRY,
  END,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  START,
  UNREAL,
} from "./scenes-names.js";
import { getCurrentScene, setCurrentScene } from "./sketch.js";

export const nextScene = () => {
  const nextSceneName = sceneChain[getCurrentScene()];
  changeToScene(nextSceneName);
};

const changeToScene = (sceneName) => {
  setCurrentScene(sceneName);
  p5Functions[sceneName].preload();
  p5Functions[sceneName].setup();
};

const sceneChain = {
  [START]: NAME,
  [NAME]: GENDERS,
  [GENDERS]: POLITICS,
  [POLITICS]: ICE_CREAM_SANDWICH,
  [ICE_CREAM_SANDWICH]: UNREAL,
  [UNREAL]: AI,
  [AI]: COUNTRY,
  [COUNTRY]: SMILE,
  [SMILE]: I_BELIEVE_IN,
  [I_BELIEVE_IN]: END,
};
