import { nextScene } from "./scene-chain.js";
import {
  AI,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  START,
  UNREAL,
} from "./scenes-names.js";
import { postGenderPick } from "./scenes/genders/logic.js";
import { getGendersUserPick } from "./scenes/genders/sketch.js";
import {
  isStrokesEmpty,
  postName,
  teardownNameScene,
} from "./scenes/name/logic.js";
import { postPoliticsPick } from "./scenes/politics/logic.js";
import { getPoliticsUserPick } from "./scenes/politics/scene.js";
import { getCurrentScene } from "./sketch.js";

export const onNextBtnClick = async () => {
  if (isNextBtnDisabled()) return;
  await postSceneUserPicks[getCurrentScene()]();
  nextScene();
};

export const isNextBtnDisabled = () => {
  return hasNoAnswer[getCurrentScene()]() ?? false;
};

const postSceneUserPicks = {
  [START]: () => undefined,
  [NAME]: () => {
    postName();
    teardownNameScene();
  },
  [GENDERS]: () => postGenderPick(),
  [POLITICS]: () => postPoliticsPick(),
  [ICE_CREAM_SANDWICH]: () => undefined,
  [SMILE]: () => undefined,
  [UNREAL]: () => undefined,
  [I_BELIEVE_IN]: () => undefined,
  [AI]: () => undefined,
};

const hasNoAnswer = {
  [START]: () => undefined,
  [NAME]: isStrokesEmpty,
  [GENDERS]: () => !getGendersUserPick(),
  [POLITICS]: () => !getPoliticsUserPick(),
  [ICE_CREAM_SANDWICH]: () => undefined,
  [SMILE]: () => undefined,
  [UNREAL]: () => undefined,
  [I_BELIEVE_IN]: () => undefined,
  [AI]: () => undefined,
};
