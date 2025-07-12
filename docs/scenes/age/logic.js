import { AGE } from "../../scenes-names.js";
import { setSceneAnswer } from "../../scene-managment/answers.js";

export const getAgeCounts = async () => {
  return await get(AGE);
};

export const postAgePick = async (age) => {
  await post(AGE, { age });
  setSceneAnswer(AGE, { age });
};
