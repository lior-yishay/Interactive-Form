import { nextScene } from "../../scene-chain.js"
import { AI } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export const getAiCounts = async () => {
  return await get(AI)
}

export const postAiPick = async (ai) => {
  await post(AI, {ai})
  setSceneAnswer(AI, {ai})
  //nextScene()
}