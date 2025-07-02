import { get, post } from "../../api/axios.js";
import { GENDERS } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getGendersUserPick } from "./scene.js";

export const getGenderCounts = async () => {
  return await get(GENDERS);
};

export const postGenderPick = async () => {
  const gender = getGendersUserPick();
  await post(GENDERS, { gender });
  setSceneAnswer(GENDERS, { gender });
};
