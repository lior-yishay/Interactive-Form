import {
  AI,
  BIG_THING,
  BINGO,
  COUNTRY,
  FEEDBACK,
  GENDERS,
  I_BELIEVE_IN,
  ICE_CREAM_SANDWICH,
  NAME,
  POLITICS,
  SMILE,
  SMILE_ENDING,
  START,
  THE_ANSWER,
  TOILET,
  UNREAL,
} from "../consts/scenes-names.js";
import { clearDomElements } from "../scene-managment/domManager.js";
import { getCurrentScene, nextScene } from "../scene-managment/sceneOrder.js";
import { postAiPick } from "../scenes/AI/logic.js";
import { getSelectedAiPick } from "../scenes/AI/scene.js";
import { postBigThingPick } from "../scenes/big thing/logic.js";
import { getSelectedBigThingPickIndex } from "../scenes/big thing/scene.js";
import { postBingoPicks } from "../scenes/bingo/logic.js";
import { getBingoUserPicks } from "../scenes/bingo/scene.js";
import {
  advanceCountryScene,
  enableCountryNext,
} from "../scenes/country/logic.js";
import { didUserFinishCountyScene } from "../scenes/country/scene.js";
import { postFeedbackSticker } from "../scenes/feedback/logic.js";
import { getUserFeedbackSticker } from "../scenes/feedback/scene.js";
import { postGenderPick } from "../scenes/genders/logic.js";
import { getGendersUserPick } from "../scenes/genders/scene.js";
import { postMagnetPositions } from "../scenes/i-belive-in/logic.js";
import { postIceCreamSandwichPick } from "../scenes/ice-cream-sandwich/logic.js";
import { getIceCreamSandwichUserPick } from "../scenes/ice-cream-sandwich/scene.js";
import { isStrokesEmpty, postName } from "../scenes/name/logic.js";
import { postPoliticsPick } from "../scenes/politics/logic.js";
import { getPoliticsUserPick } from "../scenes/politics/scene.js";
import { postSmile } from "../scenes/smile/logic.js";
import {
  getSmileDurationList,
  getSmileUserImage,
} from "../scenes/smile/scene.js";
import { stopFaceDetection, stopVideo } from "../scenes/smile/videoManager.js";
import { advanceTheAnswerScene } from "../scenes/the answer/logic.js";
import { postToiletPick } from "../scenes/toilet/logic.js";
import { getUserToiletPaperSelection } from "../scenes/toilet/scene.js";
import { getUnrealPostedUserPicksFlag } from "../scenes/unreal/scene.js";
import { resetRegisteredSounds } from "../soundManager.js";
import { callIfExsist } from "../utils/callIfExsist.js";

let lastSceneChangeTime = 0;
const cooldownDuration = 2000; // 2 seconds in milliseconds

export const onNextBtnClick = async () => {
  if (isNextBtnDisabled()) return;

  const now = Date.now();

  if (now - lastSceneChangeTime < cooldownDuration) {
    // Cooldown active, ignore this call
    return;
  }

  lastSceneChangeTime = now;

  if (!preventSwitchingScenes.includes(getCurrentScene())) {
    resetRegisteredSounds();
    clearDomElements();
    nextScene();
  }
  await postSceneUserPicks[getCurrentScene()]();
};

export const isNextBtnDisabled = () => {
  return callIfExsist(hasNoAnswer[getCurrentScene()]) ?? false;
};

const postSceneUserPicks = {
  [START]: () => undefined,
  [NAME]: postName,
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
  [I_BELIEVE_IN]: postMagnetPositions,
  [AI]: postAiPick,
  [COUNTRY]: advanceCountryScene,
  [FEEDBACK]: postFeedbackSticker,
  [BIG_THING]: postBigThingPick,
  [TOILET]: postToiletPick,
  [THE_ANSWER]: advanceTheAnswerScene,
  [BINGO]: postBingoPicks,
};

const hasNoAnswer = {
  [START]: () => undefined,
  [NAME]: isStrokesEmpty,
  [GENDERS]: () => !getGendersUserPick(),
  [POLITICS]: () => !getPoliticsUserPick(),
  [ICE_CREAM_SANDWICH]: () => !getIceCreamSandwichUserPick(),
  [SMILE]: () => !getSmileUserImage() || !getSmileDurationList().length,
  [UNREAL]: () => !getUnrealPostedUserPicksFlag(),
  [AI]: () => !getSelectedAiPick(),
  [COUNTRY]: () => !enableCountryNext(),
  [FEEDBACK]: () => !getUserFeedbackSticker(),
  [BIG_THING]: () => getSelectedBigThingPickIndex() === undefined,
  [TOILET]: () => !getUserToiletPaperSelection(),
  [THE_ANSWER]: () => false,
  [BINGO]: () => !getBingoUserPicks().length,
};

const preventSwitchingScenes = [THE_ANSWER, COUNTRY];
