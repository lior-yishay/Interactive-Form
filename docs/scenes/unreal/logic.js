import { UNREAL } from "../../scenes-names"
import { setSceneAnswer } from "../i-belive-in/logic"

export const getUnrealCounts = async () => {
  return await get(UNREAL)
}

export const postUnrealPicks = async (picks) => {
  await post(UNREAL, {picks})
  setSceneAnswer(UNREAL, {picks})
  //nextScene()
}