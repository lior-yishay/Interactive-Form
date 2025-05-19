import { nextScene } from "../../scene-chain.js"
import { AGE } from "../../scenes-names.js"

export const getAgeCounts = async () => {
  return await get(AGE)
}

export const postAgePick = async (age) => {
  await post(AGE, {age})
  //nextScene()
}