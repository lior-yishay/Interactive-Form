import { get, post } from "../../api/axios.js";
import { COUNTRY } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getCountryUserPicks } from "./scene.js";

export const getCountryCounts = async () => {
  return await get(COUNTRY);
};

export const postCountryPick = async () => {
  const picks = getCountryUserPicks();
  await post(COUNTRY, { picks });
  setSceneAnswer(COUNTRY, { picks });
};
