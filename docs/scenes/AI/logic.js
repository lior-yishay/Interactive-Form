import { get, post } from "../../api/axios.js";
import { AI } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";
import { getSelectedAiPick } from "./scene.js";

export const getAiCounts = async () => {
  return await get(AI);
};

export const postAiPick = async () => {
  const ai = getSelectedAiPick();
  await post(AI, { ai });
  setSceneAnswer(AI, ai);
};
