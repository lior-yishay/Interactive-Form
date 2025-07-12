import { get, post } from "../../api/axios.js";
import { TOILET } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getUserToiletPaperSelection } from "./scene.js";

export const getToiletCounts = async () => {
  return await get(TOILET);
};

export const postToiletPick = async () => {
  const pick = getUserToiletPaperSelection();
  await post(TOILET, { pick });
  setSceneAnswer(TOILET, pick);
};
