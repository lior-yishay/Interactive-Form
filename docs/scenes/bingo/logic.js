import { get, post } from "../../api/axios.js";
import { BINGO } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";

export const postTheAnswerPick = async () => {
  const picks = 1; //getTheAnswerUserPick();
  await post(BINGO, { picks });
  setSceneAnswer(BINGO, picks);
};

export const getTheAnswerCounts = async () => {
  return get(BINGO);
};
