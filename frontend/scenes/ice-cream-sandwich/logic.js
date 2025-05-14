import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { ICE_CREAM_SANDWICH } from "../../scenes-names.js"

export const getIceCreamSandwichCounts = async () => {
  return await get(ICE_CREAM_SANDWICH)
}

export const postIceCreamSandwichPick = async (flavor) => {
  await post(ICE_CREAM_SANDWICH, {flavor})
  nextScene()
}