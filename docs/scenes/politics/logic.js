import { get, post } from "../../api/axios.js"
import { nextScene } from "../../scene-chain.js"
import { POLITICS } from "../../scenes-names.js"
import { setSceneAnswer } from "../i-belive-in/logic.js"

export const getGenderCounts = async () => {
  return await get(POLITICS)
}

export const postPoliticsLeft = async () => {
  await postPoliticsPick('left')
}

export const postPoliticsCenter = async () => {
  await postPoliticsPick('center')

}

export const postPoliticsRight = async () => {
  await postPoliticsPick('right')
}

const postPoliticsPick = async (side) => {
  await post(POLITICS, {side})
  setSceneAnswer(POLITICS, {side})
  nextScene()
}