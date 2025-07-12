import { get, post } from "../../api/axios.js";
import { BINGO } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { getBingoUserPicks } from "./scene.js";

export const postBingoPicks = async () => {
  const picks = getBingoUserPicks();
  await post(BINGO, { picks });
  setSceneAnswer(BINGO, picks);
};

export const getTvShowsCounts = async () => {
  return get(BINGO);
};
