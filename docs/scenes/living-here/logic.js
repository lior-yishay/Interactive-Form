import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { LIVING_HERE } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export const getLivingHereRecords = async () => {
  return await get(LIVING_HERE)
}

export const postLivingHerePick = async (x, y , pick) => {
  await post(LIVING_HERE, {x, y , pick})
  setSceneAnswer(LIVING_HERE, {x, y, pick})
  nextScene()
}