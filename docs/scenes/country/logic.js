import { get, post } from "../../api/axios.js";
import { COUNTRY } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
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
};

export const enableCountryNext = () =>
  (functionIndex === 0 && didUserScan()) ||
  (functionIndex === 1 && didUserFinishCountyScene());

const postCountyPick = async () => {
  const picks = getCountryUserPicks();
  await post(COUNTRY, { picks });
  setSceneAnswer(COUNTRY, picks);
};

export const preventSkipCountryScene = () =>
  functionIndex < functionOrder.length;

const functionOrder = [onDone, postCountyPick];
