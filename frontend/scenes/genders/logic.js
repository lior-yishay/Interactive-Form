import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { GENDERS } from "../../scenes-names.js"

export const getGenderCounts = async () => {
  return await get(GENDERS)
}

export const postGenderPick = async (gender) => {
  await post(GENDERS, {gender})
  nextScene()
}