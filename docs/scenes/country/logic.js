import { get, post } from "../../api/axios.js";
import { COUNTRY } from "../../scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getCountryUserPicks } from "./scene.js";

export const getCountryCounts = async () => {
  return await get(COUNTRY);
};

export const postCountryPick = async () => {
  const picks = getCountryUserPicks();
  console.log(picks);
  await post(COUNTRY, { picks });
  setSceneAnswer(COUNTRY, { picks });
};
