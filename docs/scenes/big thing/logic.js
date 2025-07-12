import { get, post } from "../../api/axios.js";
import { BIG_THING } from "../../consts/scenes-names.js";
import { setSceneAnswer } from "../i-belive-in/logic.js";
import { getSelectedBigThingPickIndex } from "./scene.js";

const keys = [
  "israel palastine eurovision",
  "trump nobel prize",
  "nuclear strike europe",
];

export const getBigThingCounts = async () => {
  const counts = await get(BIG_THING);
  console.log("counts", counts);
  return keys.map((k) => counts[k]);
};

export const postBigThingPick = async () => {
  const pick = keys[getSelectedBigThingPickIndex()];
  await post(BIG_THING, { pick });
  setSceneAnswer(BIG_THING, pick);
};
