import { get, post } from "../../api/axios.js";
import { THE_ANSWER } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { getTheAnswerUserPick } from "./scene.js";

export const postTheAnswerPick = async () => {
  const pick = getTheAnswerUserPick();
  console.log(pick);
  await post(THE_ANSWER, { pick });
  setSceneAnswer(THE_ANSWER, pick);
};

export const getTheAnswerCounts = async () => {
  return get(THE_ANSWER);
};
