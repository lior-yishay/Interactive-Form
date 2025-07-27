import { get, post } from "../../api/axios.js";
import { THE_ANSWER } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { nextScene } from "../../scene-managment/sceneOrder.js";
import { enterShowAll, getTheAnswerUserPick } from "./scene.js";

let functionIndex = 0;

export const advanceTheAnswerScene = async () =>
  await functionOrder[functionIndex++]();

const postTheAnswerPick = async () => {
  const pick = getTheAnswerUserPick();
  await post(THE_ANSWER, { pick });
  setSceneAnswer(THE_ANSWER, pick);
  nextScene();
};

export const getTheAnswerCounts = async () => {
  return get(THE_ANSWER);
};

const functionOrder = [enterShowAll, postTheAnswerPick];
