import {
  AI,
  COUNTRY,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  SMILE_ENDING,
  START,
  UNREAL,
} from "../consts/scenes-names.js";
import { getCurrentScene, nextScene } from "../scene-managment/sceneOrder.js";
import { postAiPick, teardownAiScene } from "../scenes/AI/logic.js";
import { getSelectedAiPick } from "../scenes/AI/scene.js";
import { postCountryPick } from "../scenes/country/logic.js";
import { didUserFinishCountyScene } from "../scenes/country/scene.js";
import { postGenderPick } from "../scenes/genders/logic.js";
import { getGendersUserPick } from "../scenes/genders/scene.js";
import { postIceCreamSandwichPick } from "../scenes/ice-cream-sandwich/logic.js";
import { getIceCreamSandwichUserPick } from "../scenes/ice-cream-sandwich/scene.js";
import {
  isStrokesEmpty,
  postName,
  teardownNameScene,
} from "../scenes/name/logic.js";
import { postPoliticsPick } from "../scenes/politics/logic.js";
import { getPoliticsUserPick } from "../scenes/politics/scene.js";
import { postSmile } from "../scenes/smile/logic.js";
import {
  getSmileDurationList,
  getSmileUserImage,
} from "../scenes/smile/scene.js";
import { stopFaceDetection, stopVideo } from "../scenes/smile/videoManager.js";
import { getUnrealPostedUserPicksFlag } from "../scenes/unreal/scene.js";
import { resetRegisteredSounds } from "../soundManager.js";
import { callIfExsist } from "../utils/callIfExsist.js";

export const onNextBtnClick = async () => {
  if (isNextBtnDisabled()) return;
  await postSceneUserPicks[getCurrentScene()]();
  resetRegisteredSounds();
  nextScene();
};

export const isNextBtnDisabled = () => {
  return callIfExsist(hasNoAnswer[getCurrentScene()]) ?? false;
};

const postSceneUserPicks = {
  [START]: () => undefined,
  [NAME]: () => {
    postName();
    teardownNameScene();
  },
  [GENDERS]: postGenderPick,
  [POLITICS]: postPoliticsPick,
  [ICE_CREAM_SANDWICH]: postIceCreamSandwichPick,
  [SMILE]: () => {
    postSmile();
    stopFaceDetection();
    stopVideo();
  },
  [SMILE_ENDING]: () => undefined,
  [UNREAL]: () => undefined,
  [I_BELIEVE_IN]: () => undefined,
  [AI]: () => {
    postAiPick();
    teardownAiScene();
  },
  [COUNTRY]: postCountryPick,
};

const hasNoAnswer = {
  [START]: () => undefined,
  [NAME]: isStrokesEmpty,
  [GENDERS]: () => !getGendersUserPick(),
  [POLITICS]: () => !getPoliticsUserPick(),
  [ICE_CREAM_SANDWICH]: () => !getIceCreamSandwichUserPick(),
  [SMILE]: () => !getSmileUserImage() || !getSmileDurationList().length,
  [UNREAL]: () => !getUnrealPostedUserPicksFlag(),
  [I_BELIEVE_IN]: () => undefined,
  [AI]: () => !getSelectedAiPick(),
  [COUNTRY]: () => !didUserFinishCountyScene(),
};
