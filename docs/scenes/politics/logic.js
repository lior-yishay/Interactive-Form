import { get, post } from "../../api/axios.js";
import { POLITICS } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { getPoliticsUserPick } from "./scene.js";

export const getPoliticsCounts = async () => {
  return await get(POLITICS);
};

export const postPoliticsPick = async () => {
  const side = getPoliticsUserPick();
  await post(POLITICS, { side });
  setSceneAnswer(POLITICS, side);
};
