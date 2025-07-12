import { get, post } from "../../api/axios.js";
import { UNREAL } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";

export const getUnrealCounts = async () => {
  return await get(UNREAL);
};

export const postUnrealPicks = async (picks) => {
  await post(UNREAL, { picks });
  setSceneAnswer(UNREAL, picks);
};
