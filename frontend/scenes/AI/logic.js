import { nextScene } from "../../scene-chain.js"
import { AI } from "../../scenes-names.js"

export const getAiCounts = async () => {
  return await get(AI)
}

export const postAgePick = async (ai) => {
  await post(AI, {ai})
  //nextScene()
}