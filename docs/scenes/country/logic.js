import { get, post } from "../../api/axios.js";
import { COUNTRY } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { nextScene } from "../../scene-managment/sceneOrder.js";
import {
  didUserFinishCountyScene,
  didUserScan,
  getCountryUserPicks,
  onDone,
} from "./scene.js";

let functionIndex = 0;

export const getCountryCounts = async () => {
  return await get(COUNTRY);
};

export const advanceCountryScene = async () => {
  await functionOrder[functionIndex++]();
  functionIndex === functionOrder.length && nextScene();
};

export const enableCountryNext = () =>
  (functionIndex === 0 && didUserScan()) ||
  (functionIndex === 1 && didUserFinishCountyScene());

const postCountyPick = async () => {
  const picks = getCountryUserPicks();
  await post(COUNTRY, { picks });
  setSceneAnswer(COUNTRY, picks);
};

const functionOrder = [onDone, postCountyPick];
