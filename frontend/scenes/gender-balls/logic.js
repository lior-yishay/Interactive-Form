import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { GENDER_BALLS } from "../../scenes-names.js"

export const getGenderCounts = async () => {
  return await get(GENDER_BALLS)
}

export const postGenderPick = async (gender) => {
  await post(GENDER_BALLS, {gender})
  nextScene()
}