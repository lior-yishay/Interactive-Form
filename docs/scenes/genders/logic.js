import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { GENDERS } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export let genderCounts = []

export const getGenderCounts = async () => {
  genderCounts = await get(GENDERS)
  return genderCounts
}

export const postGenderPick = async (gender) => {
  await post(GENDERS, {gender})
  setSceneAnswer(GENDERS, {gender})
  //nextScene()
}