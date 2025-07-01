import { get, post } from "../../api/axios.js";
import { AI } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getSelectedAiPick } from "./scene.js";

export const getAiCounts = async () => {
  return await get(AI);
};

export const postAiPick = async () => {
  const ai = getSelectedAiPick();
  await post(AI, { ai });
  setSceneAnswer(AI, { ai });
};

//teardown dom elements
let uiElements = [];

export const recordUiElement = (element) => uiElements.push(element);

export const teardownAiScene = () => {
  uiElements.forEach((el) => el.remove());
  uiElements = [];
};
