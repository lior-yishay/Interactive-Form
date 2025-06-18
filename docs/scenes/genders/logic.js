import { get, post } from "../../api/axios.js";
import { GENDERS } from "../../scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getGendersUserPick } from "./sketch.js";

export const getGenderCounts = async () => {
  return await get(GENDERS);
};

export const postGenderPick = async () => {
  const gender = getGendersUserPick();
  await post(GENDERS, { gender });
  setSceneAnswer(GENDERS, { gender });
};
