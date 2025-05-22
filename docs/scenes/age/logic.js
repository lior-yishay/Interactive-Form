import { nextScene } from "../../scene-chain.js"
import { AGE } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export const getAgeCounts = async () => {
  return await get(AGE)
}

export const postAgePick = async (age) => {
  await post(AGE, {age})
  setSceneAnswer(AGE, {age})
  //nextScene()
}