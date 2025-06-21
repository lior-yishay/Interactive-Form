import { get, post } from "../../api/axios.js";
import { COUNTRY } from "../../scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";

export const getCountryCounts = async () => {
  return await get(COUNTRY);
};

export const postCountryPick = async (pick) => {
  await post(COUNTRY, { pick });
  setSceneAnswer(COUNTRY, { pick });
};
